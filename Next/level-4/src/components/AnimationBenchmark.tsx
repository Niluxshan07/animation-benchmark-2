'use client';
import { useState, useEffect, useRef } from 'react';

export default function AnimationBenchmark() {
  const [modal, setModal] = useState<{ title: string; content: string[] } | null>(null);
  const [count, setCount] = useState({ frameworks: 0, metrics: 0, runs: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const targets = { frameworks: 4, metrics: 7, runs: 30 };
    const duration = 1500;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount({
        frameworks: Math.round(targets.frameworks * ease),
        metrics: Math.round(targets.metrics * ease),
        runs: Math.round(targets.runs * ease),
      });
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const researchInfo = {
    title: "About This Research",
    content: [
      "This study experimentally compares animation rendering performance across React, Vue.js, Svelte, and Angular frameworks.",
      "A single animated UI element is used under identical controlled conditions to isolate framework-level rendering differences.",
      "Performance metrics are collected using Chrome DevTools including FPS, dropped frames, paint time, compositing cost, CPU usage, and bundle size.",
      "The study aims to provide empirical evidence to guide developers in selecting frameworks for animation-heavy landing pages.",
    ],
  };

  const learnMore = {
    title: "Research Methodology",
    content: [
      "Independent Variable: JavaScript Framework (React, Vue.js, Svelte, Angular)",
      "Dependent Variables: Average FPS, Dropped Frames, Paint Time, Compositing Time, CPU Usage, Bundle Size",
      "Controlled Variables: Same CSS animation, same browser (Chrome), same hardware, same animation duration and easing",
      "Data Collection: Chrome DevTools Performance Panel — minimum 30 recordings per framework",
      "Analysis: Statistical comparison using averages, standard deviation and cross-framework performance ranking",
    ],
  };

  return (
    <div className="page">
      <style>{`
        @keyframes dotPulseSpring {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.6; }
        }
        @keyframes ringPulseSpring {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.12); opacity: 0.5; }
        }
        @keyframes logoPulseSpring {
          0%   { transform: rotate(0deg) scale(1) translateY(0); }
          25%  { transform: rotate(90deg) scale(1.2) translateY(-10px); }
          50%  { transform: rotate(180deg) scale(1.4) translateY(0); }
          75%  { transform: rotate(270deg) scale(1.2) translateY(10px); }
          100% { transform: rotate(360deg) scale(1) translateY(0); }
        }
        @keyframes modalSpring {
          0% { transform: scale(0.8) translateY(-50px); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .brand-dot { animation: dotPulseSpring 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite; }
        .ring-1 { animation: ringPulseSpring 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite 0s; }
        .ring-2 { animation: ringPulseSpring 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite 0.5s; }
        .ring-3 { animation: ringPulseSpring 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite 1s; }
        .animated-logo { animation: logoPulseSpring 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }
        .modal-box { animation: modalSpring 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .card { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s; }
        .card:hover { transform: translateY(-10px) scale(1.03); }
        .stat-number { transition: none; }
      `}</style>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal.title}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              {modal.content.map((item, i) => (
                <div className="modal-item" key={i}>
                  <span className="modal-dot">▸</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="navbar">
        <div className="brand"><span className="brand-dot"></span>AnimBench</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <section className="hero" id="home">
        <div className="hero-left">
          <p className="badge">🔬 Research Project — SUSL</p>
          <h1>Animation <span className="highlight">Performance</span> Benchmark</h1>
          <p className="hero-sub">A controlled experimental study comparing animation rendering performance across React, Vue.js, Svelte and Angular frameworks.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => setModal(researchInfo)}>View Research</button>
            <button className="btn-secondary" onClick={() => setModal(learnMore)}>Learn More</button>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-number">{count.frameworks}</span><span className="stat-label">Frameworks</span></div>
            <div className="stat"><span className="stat-number">{count.metrics}</span><span className="stat-label">Metrics</span></div>
            <div className="stat"><span className="stat-number">{count.runs}+</span><span className="stat-label">Test Runs</span></div>
          </div>
        </div>
        <div className="hero-right">
          <div className="logo-wrapper">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
            <div className="animated-logo"></div>
          </div>
          <p className="logo-label">⚡ Animated Test Element — Level 4</p>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-inner">
          <div className="footer-brand"><span className="brand-dot"></span>AnimBench</div>
          <p>IS 8101 Research Project in Information Systems</p>
          <p>Department of Computing &amp; Information Systems</p>
          <p>Sabaragamuwa University of Sri Lanka</p>
          <p className="footer-copy">© 2025 S. Niluxshan — 20APC4681</p>
        </div>
      </footer>
      <div className="level-indicator">Animation Level 4</div>
    </div>
  );
}
