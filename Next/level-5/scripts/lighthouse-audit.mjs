// Runs a production build, serves it locally with `next start`, then
// executes 10 independent Lighthouse runs to collect statistically
// meaningful performance data.
//
// Usage:  npm run audit
//
// Output: reports/<app>-run01-<ts>.html  ...  reports/<app>-run10-<ts>.html
//         reports/<app>-summary.json   (averages, std-dev, min, max)

import { spawn } from 'node:child_process';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const reportsDir = path.resolve(__dirname, '../reports');

const NUM_RUNS = 10;
const PAUSE_MS = 2500; // cool-down between runs for stable CPU measurements
const PORT = 4173;
const URL = `http://localhost:${PORT}`;

function catLabel(key) {
  return { performance: 'Perf', accessibility: 'A11y', 'best-practices': 'BP', seo: 'SEO' }[key] ?? key;
}

function hr(ch = '─', width = 64) {
  return ch.repeat(width);
}

// run a CLI command to completion (used for `next build`)
function runToCompletion(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: rootDir, stdio: 'inherit', shell: true });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited with code ${code}`))));
  });
}

// start a long-running server (`next start`) and resolve once it responds
function startServer(cmd, args, port) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: rootDir, stdio: 'pipe', shell: true });
    let settled = false;

    const tryConnect = async () => {
      try {
        const res = await fetch(`http://localhost:${port}`);
        if (res.ok || res.status < 500) {
          settled = true;
          resolve(child);
        }
      } catch {
        // not ready yet
      }
    };

    const poll = setInterval(() => {
      if (settled) return clearInterval(poll);
      tryConnect();
    }, 400);

    child.stdout?.on('data', (d) => process.stdout.write(`[next] ${d}`));
    child.stderr?.on('data', (d) => process.stderr.write(`[next] ${d}`));

    child.on('exit', (code) => {
      if (!settled) reject(new Error(`next start exited early with code ${code}`));
    });

    setTimeout(() => {
      if (!settled) {
        clearInterval(poll);
        reject(new Error('Timed out waiting for next start to become ready'));
      }
    }, 30000);
  });
}

async function run() {
  console.log(`\n[audit] Building "${pkg.name}" for production (next build)...`);
  await runToCompletion('npx', ['next', 'build']);

  console.log(`[audit] Starting local server (next start -p ${PORT})...`);
  const server = await startServer('npx', ['next', 'start', '-p', String(PORT)], PORT);
  console.log(`[audit] App live at ${URL}`);

  console.log('[audit] Launching headless Chrome...');
  const chrome = await launch({
    chromeFlags: ['--headless=new', '--disable-gpu', '--no-sandbox'],
  });

  mkdirSync(reportsDir, { recursive: true });

  const allScores = [];

  for (let i = 1; i <= NUM_RUNS; i++) {
    console.log(`\n[audit] ── Run ${i}/${NUM_RUNS} ──────────────────────────────`);

    const result = await lighthouse(URL, {
      port: chrome.port,
      output: 'html',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = `${pkg.name}-run${String(i).padStart(2, '0')}-${timestamp}.html`;
    const reportPath = path.join(reportsDir, reportFile);
    writeFileSync(reportPath, result.report);

    const runScores = {};
    for (const [key, cat] of Object.entries(result.lhr.categories)) {
      runScores[key] = Math.round(cat.score * 100);
    }
    allScores.push(runScores);

    const scoreStr = Object.entries(runScores)
      .map(([k, v]) => `${catLabel(k)}: ${String(v).padStart(3)}`)
      .join('  |  ');
    console.log(`  ${scoreStr}`);
    console.log(`  → ${reportFile}`);

    if (i < NUM_RUNS) {
      process.stdout.write(`  [Cooling down ${PAUSE_MS / 1000}s...]`);
      await new Promise((r) => setTimeout(r, PAUSE_MS));
      process.stdout.write(' ready\n');
    }
  }

  await chrome.kill();
  server.kill();

  // ── Summary ───────────────────────────────────────────────────────────────
  const cats = Object.keys(allScores[0]);
  const COL = 10;

  const tableHeader = `  Run  │ ${cats.map((c) => catLabel(c).padEnd(COL)).join(' │ ')}`;
  const divider = `──────┼─${cats.map(() => '─'.repeat(COL + 1)).join('┼─')}`;

  console.log(`\n[audit] ${hr('═')}`);
  console.log(`[audit]  ${pkg.name}  —  Lighthouse Summary  (${NUM_RUNS} independent runs)`);
  console.log(`[audit] ${hr('═')}`);
  console.log(`[audit] ${tableHeader}`);
  console.log(`[audit] ${divider}`);

  allScores.forEach((scores, idx) => {
    const cells = cats.map((c) => String(scores[c]).padEnd(COL)).join(' │ ');
    console.log(`[audit]   ${String(idx + 1).padStart(2)}   │ ${cells}`);
  });

  console.log(`[audit] ${divider}`);

  // Stats
  const stats = {};
  for (const cat of cats) {
    const vals = allScores.map((s) => s[cat]);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((s, v) => s + (v - avg) ** 2, 0) / vals.length;
    stats[cat] = {
      avg: +avg.toFixed(1),
      sd: +Math.sqrt(variance).toFixed(1),
      min: Math.min(...vals),
      max: Math.max(...vals),
    };
  }

  const row = (label, fn) =>
    `[audit]  ${label.padEnd(5)} │ ${cats.map((c) => fn(stats[c]).padEnd(COL)).join(' │ ')}`;

  console.log(row('AVG', (s) => String(s.avg)));
  console.log(row('SD', (s) => `±${s.sd}`));
  console.log(row('MIN', (s) => String(s.min)));
  console.log(row('MAX', (s) => String(s.max)));
  console.log(`[audit] ${hr('═')}\n`);

  // Save JSON summary
  const summaryPath = path.join(reportsDir, `${pkg.name}-summary.json`);
  writeFileSync(
    summaryPath,
    JSON.stringify({ app: pkg.name, numRuns: NUM_RUNS, runs: allScores, stats }, null, 2)
  );

  console.log(`[audit] HTML reports  → ${reportsDir}`);
  console.log(`[audit] JSON summary  → ${summaryPath}\n`);

  process.exit(0);
}

run().catch((err) => {
  console.error('[audit] Audit failed:', err);
  process.exit(1);
});
