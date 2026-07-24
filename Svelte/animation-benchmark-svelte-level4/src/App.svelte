<script>
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';

  const SCRAMBLE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=';

  let modal = null;
  let stat1 = 0, stat2 = 0, stat3 = 0, countDone = false;
  let rafId, gsapCtx;
  const scrambleIds = [];

  const levelBadgeText = `Level 4 — Interactive Premium`;
  const levelBadgeBg = `linear-gradient(135deg,#f472b6,#7c3aed)`;
  const levelTagText = `🚀 Level 4: Spring physics · Bounce · Elastic motion · GSAP scramble`;
  const levelTagBg = `#fdf2f8`;
  const levelTagColor = `#be185d`;
  const levelTagBorder = `#fbcfe8`;

  const headingWords = [
    { word: 'Animation', chars: 'Animation'.split('') },
    { word: 'Performance', chars: 'Performance'.split('') },
    { word: 'Benchmark', chars: 'Benchmark'.split('') },
  ];

  const researchInfo = {
    title: 'About This Research',
    content: [
      'This study experimentally compares animation rendering performance across React, Vue.js, Svelte, and Angular frameworks.',
      'A single animated UI element is used under identical controlled conditions to isolate framework-level rendering differences.',
      'Performance metrics are collected using Chrome DevTools including FPS, dropped frames, paint time, compositing cost, CPU usage, and bundle size.',
      'The study aims to provide empirical evidence to guide developers in selecting frameworks for animation-heavy landing pages.',
    ]
  };
  const learnMore = {
    title: 'Research Methodology',
    content: [
      'Independent Variable: JavaScript Framework (React, Vue.js, Svelte, Angular)',
      'Dependent Variables: Average FPS, Dropped Frames, Paint Time, Compositing Time, CPU Usage, Bundle Size',
      'Controlled Variables: Same CSS animation, same browser (Chrome), same hardware, same animation duration and easing',
      'Data Collection: Chrome DevTools Performance Panel — minimum 30 recordings per framework',
      'Analysis: Statistical comparison using averages, standard deviation and cross-framework performance ranking',
    ]
  };

  let ring1El, ring2El, ring3El, logoEl, headingEl, tiltLeft, tiltRight;

  function openResearchModal() { modal = researchInfo; }
  function openLearnMoreModal() { modal = learnMore; }
  function closeModal() { modal = null; }
  function handleKey(e) { if (e.key === 'Escape') closeModal(); }

  function onMagneticMove(e) {
    const btn = e.currentTarget;
    const r = btn.getBoundingClientRect();
    gsap.to(btn, { x: (e.clientX-r.left-r.width/2)*0.25, y: (e.clientY-r.top-r.height/2)*0.25, duration: 0.3, ease: 'power2.out' });
  }
  function onMagneticLeave(e) {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
  }
  function onTiltMove(e, el) {
    const r = el.getBoundingClientRect();
    gsap.to(el, { rotateY: ((e.clientX-r.left)/r.width-0.5)*6, rotateX: -((e.clientY-r.top)/r.height-0.5)*6, duration: 0.3, ease: 'power2.out', transformPerspective: 800 });
  }
  function onTiltLeave(el) {
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
  }
  function onLogoEnter() {
    gsap.to(logoEl, { scale: 1.3, rotate: 25, duration: 0.4, ease: 'power2.out' });
  }
  function onLogoLeave() {
    gsap.to(logoEl, { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
  }

  onMount(() => {
    // Count-up
    setTimeout(() => {
      const targets = [4, 7, 30]; const duration = 1100;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now-start)/duration, 1);
        const ease = 1 - Math.pow(1-p, 3);
        stat1 = Math.round(ease*targets[0]);
        stat2 = Math.round(ease*targets[1]);
        stat3 = Math.round(ease*targets[2]);
        if (p < 1) rafId = requestAnimationFrame(tick); else countDone = true;
      };
      rafId = requestAnimationFrame(tick);
    }, 1650);

    // GSAP
    gsapCtx = gsap.context(() => {
      gsap.to(ring1El, { rotation: 360,  duration: 20, repeat: -1, ease: 'none' });
      gsap.to(ring2El, { rotation: -360, duration: 16, repeat: -1, ease: 'none' });
      gsap.to(ring3El, { rotation: 360,  duration: 12, repeat: -1, ease: 'none' });
      gsap.to(logoEl, { scale: 1.15, duration: 1.3, repeat: -1, yoyo: true, ease: 'elastic.out(1,0.45)', delay: 0.5 });
      gsap.to(logoEl, { boxShadow: '0 0 55px rgba(124,58,237,0.8)', duration: 1.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });

      const letters = headingEl.querySelectorAll('.letter');
      const originals = Array.from(letters).map(el => el.textContent);
      letters.forEach((el, i) => {
        if (originals[i] === ' ') return;
        let ticks = 0; const maxTicks = 8 + (i % 4);
        const id = setInterval(() => {
          ticks++;
          el.textContent = ticks >= maxTicks ? originals[i] : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
          if (ticks >= maxTicks) clearInterval(id);
        }, 45);
        scrambleIds.push(id);
      });

      gsap.fromTo(letters,
        { opacity: 0, y: 36, rotateX: -85, transformPerspective: 500 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.65, ease: 'back.out(1.6)', stagger: 0.035, delay: 0.5,
          onComplete: () => {
            gsap.to(letters, { y: -5, duration: 1.4, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: { each: 0.08 } });
          }
        }
      );
    });
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);
    scrambleIds.forEach(clearInterval);
    if (gsapCtx) gsapCtx.revert();
  });
</script>

<svelte:window on:keydown={handleKey} />

<div class="page">
  {#if modal}
  <div class="modal-overlay" on:click={closeModal} role="presentation">
    <div class="modal-box" role="dialog" aria-modal="true" on:click|stopPropagation>
      <div class="modal-header">
        <h2>{modal.title}</h2>
        <button class="modal-close" on:click={closeModal}>&#x2715;</button>
      </div>
      <div class="modal-body">
        {#each modal.content as item}
        <div class="modal-item"><span class="modal-dot">&#9656;</span><p>{item}</p></div>
        {/each}
      </div>
    </div>
  </div>
  {/if}

  <nav class="navbar">
    <div class="brand"><span class="brand-dot"></span>AnimBench</div>
    <div class="level-badge" style="background:{levelBadgeBg};color:white;padding:6px 18px;border-radius:20px;font-size:0.85rem;font-weight:700;box-shadow:0 2px 14px rgba(124,58,237,0.4);">{levelBadgeText}</div>
  </nav>

  <section class="hero">
    <div class="aurora" aria-hidden="true"><span></span><span></span><span></span></div>

    <div class="hero-left tilt-card" bind:this={tiltLeft}
         on:mousemove={(e) => onTiltMove(e, tiltLeft)}
         on:mouseleave={() => onTiltLeave(tiltLeft)}>
      <p class="badge">🔬 Research Project — SUSL</p>
      <h1 bind:this={headingEl} style="perspective:600px">
        {#each headingWords as wobj, wi}
        <span class="word" class:highlight={wi===1}>
          {#each wobj.chars as ch}
          <span class="letter">{ch}</span>
          {/each}
        </span>
        {/each}
      </h1>
      <p class="level-tag" style="background:{levelTagBg};color:{levelTagColor};border:1px solid {levelTagBorder};padding:6px 14px;border-radius:20px;font-size:0.83rem;font-weight:600;margin-bottom:18px;">{levelTagText}</p>
      <p class="hero-sub">A controlled experimental study comparing animation rendering performance across React, Vue.js, Svelte and Angular frameworks.</p>
      <div class="hero-buttons">
        <button class="btn-primary magnetic-btn" on:mousemove={onMagneticMove} on:mouseleave={onMagneticLeave} on:click={openResearchModal}>View Research</button>
        <button class="btn-secondary magnetic-btn" on:mousemove={onMagneticMove} on:mouseleave={onMagneticLeave} on:click={openLearnMoreModal}>Learn More</button>
      </div>
      <div class="hero-stats">
        <div class="stat"><span class="stat-number elastic-stretch" class:glow-done={countDone}>{stat1}</span><span class="stat-label">Frameworks</span></div>
        <div class="stat"><span class="stat-number elastic-stretch" class:glow-done={countDone}>{stat2}</span><span class="stat-label">Metrics</span></div>
        <div class="stat"><span class="stat-number elastic-stretch" class:glow-done={countDone}>{stat3}+</span><span class="stat-label">Test Runs</span></div>
      </div>
    </div>

    <div class="hero-right tilt-card" bind:this={tiltRight}
         on:mousemove={(e) => onTiltMove(e, tiltRight)}
         on:mouseleave={() => onTiltLeave(tiltRight)}>
      <div class="logo-wrapper">
        <div class="ring ring-1" bind:this={ring1El}></div>
        <div class="ring ring-2" bind:this={ring2El}></div>
        <div class="ring ring-3" bind:this={ring3El}></div>
        <div class="animated-logo" bind:this={logoEl}
             on:mouseenter={onLogoEnter} on:mouseleave={onLogoLeave}></div>
      </div>
      <p class="logo-label">⚡ Animated Test Element</p>
    </div>
  </section>

  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand"><span class="brand-dot"></span>AnimBench</div>
      <p>IS 8101 Research Project in Information Systems</p>
      <p>Department of Computing &amp; Information Systems</p>
      <p>Sabaragamuwa University of Sri Lanka</p>
      <p class="footer-copy">&copy; 2025 S. Niluxshan &mdash; 20APC4681</p>
    </div>
  </footer>
</div>

<style>
/* ─── Level 4 — Interactive Premium ─────────────────────────────────────── */

/* Layout */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0f0f1a;
  padding: 18px 60px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 1px;
}
.brand-dot {
  width: 12px;
  height: 12px;
  background: #4f46e5;
  border-radius: 50%;
  display: inline-block;
}
.level-badge {
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  color: white;
}

/* Hero */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 60px;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  min-height: 90vh;
  gap: 40px;
  position: relative;
  overflow: hidden;
  isolation: isolate;
}
.hero-left {
  flex: 1;
  max-width: 560px;
  position: relative;
  z-index: 2;
}
.badge {
  display: inline-block;
  background: #eef2ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 24px;
}
.level-tag {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.83rem;
  font-weight: 600;
  margin-bottom: 18px;
  border: 1px solid;
}
.hero-left h1 {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.2;
  color: #0f0f1a;
  margin-bottom: 20px;
}
.highlight {
  color: #4f46e5;
  display: inline-block;
}
.hero-sub {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.7;
  margin-bottom: 32px;
}

/* Buttons */
.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
}
.btn-primary {
  background: linear-gradient(120deg, #4f46e5, #7c3aed, #ec4899, #4f46e5);
  background-size: 300% 300%;
  animation: gradientMove4 5s ease infinite;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(124, 58, 237, 0.4);
}
.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -60%;
  width: 40%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  transform: skewX(-20deg);
  transition: left 600ms ease;
}
.btn-primary:hover::before { left: 130%; }
@keyframes gradientMove4 {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}

.btn-secondary {
  background: transparent;
  color: #4f46e5;
  border: 2px solid #4f46e5;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.btn-secondary::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 10px;
  padding: 2px;
  background: linear-gradient(120deg, #4f46e5, #ec4899, #7c3aed);
  background-size: 300% 300%;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 300ms ease;
  animation: gradientMove4 5s ease infinite;
}
.btn-secondary:hover::after { opacity: 1; }

/* Stats */
.hero-stats {
  display: flex;
  gap: 40px;
}
.stat {
  display: flex;
  flex-direction: column;
}
.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #4f46e5;
  display: inline-block;
  transform-origin: center bottom;
}
.stat-number.glow-done {
  text-shadow: 0 0 16px rgba(79, 70, 229, 0.6);
}
.stat-label {
  font-size: 0.85rem;
  color: #777;
  font-weight: 500;
}

/* Logo */
.hero-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  position: relative;
  z-index: 2;
}
.logo-wrapper {
  position: relative;
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid #4f46e5;
  opacity: 0.2;
  will-change: transform;
}
.ring-1 { width: 280px; height: 280px; }
.ring-2 { width: 220px; height: 220px; }
.ring-3 { width: 160px; height: 160px; }
.animated-logo {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(79, 70, 229, 0.4);
  position: relative;
  z-index: 2;
  will-change: transform, filter;
}
.logo-wrapper::before,
.logo-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid rgba(124, 58, 237, 0.45);
  animation: ripple4 3s ease-out infinite;
}
.logo-wrapper::after { animation-delay: 1.5s; }
@keyframes ripple4 {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.3); opacity: 0; }
}
.logo-label {
  font-size: 0.9rem;
  color: #4f46e5;
  font-weight: 600;
  background: #eef2ff;
  padding: 8px 20px;
  border-radius: 20px;
  border: 1px solid #c7d2fe;
}

/* Footer */
.footer {
  background-color: #0f0f1a;
  color: white;
  text-align: center;
  padding: 48px 60px;
}
.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.footer .brand-dot { background: #4f46e5; }
.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 12px;
}
.footer p { color: #aaa; font-size: 0.88rem; }
.footer-copy { margin-top: 16px; color: #666; font-size: 0.8rem; }

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}
.modal-box {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  border-bottom: 2px solid #eef2ff;
  padding-bottom: 16px;
}
.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f0f1a;
  margin: 0;
}
.modal-close {
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  color: #555;
  transition: background 0.2s;
}
.modal-close:hover { background: #e2e8f0; }
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.modal-dot {
  color: #4f46e5;
  font-size: 1.1rem;
  margin-top: 2px;
  flex-shrink: 0;
}
.modal-item p {
  font-size: 0.95rem;
  color: #444;
  line-height: 1.7;
  margin: 0;
}

/* Error fallback */
.error-fallback {
  padding: 60px;
  text-align: center;
  color: #555;
  font-size: 1rem;
}

/* ─── Aurora background (L4) ─────────────────────────────────────────────── */
.aurora {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.aurora span {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.35;
  mix-blend-mode: multiply;
  animation: auroraMove 16s ease-in-out infinite;
}
.aurora span:nth-child(1) {
  width: 420px;
  height: 420px;
  background: #a5b4fc;
  top: -140px;
  left: -100px;
}
.aurora span:nth-child(2) {
  width: 360px;
  height: 360px;
  background: #f0abfc;
  top: 40%;
  right: -120px;
  animation-delay: -5s;
}
.aurora span:nth-child(3) {
  width: 300px;
  height: 300px;
  background: #93c5fd;
  bottom: -120px;
  left: 30%;
  animation-delay: -10s;
}
@keyframes auroraMove {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(50px, -40px) scale(1.15); }
  66%       { transform: translate(-40px, 30px) scale(0.9); }
}

/* ─── Tilt card ──────────────────────────────────────────────────────────── */
.tilt-card {
  perspective: 800px;
  transform-style: preserve-3d;
}

/* ─── L5 typography added: GSAP letter scramble — per-letter 3D entrance ── */
.hero-left h1 .word {
  display: inline-block;
  margin-right: 0.28em;
}
.hero-left h1 .letter {
  display: inline-block;
  will-change: transform, opacity;
}
.hero-left h1 .word.highlight .letter {
  color: #4f46e5;
}

/* ─── Elastic Stretch (count-up, from L4) ────────────────────────────────── */
@keyframes elasticStretch {
  0%   { transform: scaleY(1.55) scaleX(0.72); }
  40%  { transform: scaleY(1.04) scaleX(1.01); }
  70%  { transform: scaleY(0.97) scaleX(1); }
  100% { transform: scaleY(1) scaleX(1); }
}
.elastic-stretch {
  display: inline-block;
  transform-origin: center bottom;
  animation: elasticStretch 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ─── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .navbar { padding: 14px 24px; }
  .hero {
    flex-direction: column;
    padding: 50px 24px;
    min-height: auto;
  }
  .hero-left { max-width: 100%; }
  .hero-left h1 { font-size: 2.2rem; }
  .hero-stats { gap: 24px; }
  .hero-buttons { flex-direction: column; gap: 12px; }
  .footer { padding: 36px 24px; }
}

/* ─── Reduced motion ──────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

</style>
