<script>
  let modal = null;

  const levelBadgeText = `Level 1 — Basic CSS Transitions`;
  const levelBadgeBg = `#16a34a`;
  const levelTagText = `⚙ Level 1: Basic CSS transitions · Minimal GPU usage · Simple keyframe animations`;
  const levelTagBg = `#f0fdf4`;
  const levelTagColor = `#16a34a`;
  const levelTagBorder = `#bbf7d0`;

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

  function openResearchModal() { modal = researchInfo; }
  function openLearnMoreModal() { modal = learnMore; }
  function closeModal() { modal = null; }

  function handleKey(e) {
    if (e.key === 'Escape') closeModal();
  }
</script>

<svelte:window on:keydown={handleKey} />

<div class="page">
  <!-- Modal -->
  {#if modal}
  <div class="modal-overlay" on:click={closeModal} role="presentation">
    <div class="modal-box" role="dialog" aria-modal="true" on:click|stopPropagation>
      <div class="modal-header">
        <h2>{modal.title}</h2>
        <button class="modal-close" on:click={closeModal} aria-label="Close modal">&#x2715;</button>
      </div>
      <div class="modal-body">
        {#each modal.content as item}
        <div class="modal-item">
          <span class="modal-dot">&#9656;</span><p>{item}</p>
        </div>
        {/each}
      </div>
    </div>
  </div>
  {/if}

  <!-- Navbar -->
  <nav class="navbar">
    <div class="brand"><span class="brand-dot"></span>AnimBench</div>
    <div class="level-badge" style="background:{levelBadgeBg};color:white;padding:6px 18px;border-radius:20px;font-size:0.85rem;font-weight:700;">
      {levelBadgeText}
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-left">
      <p class="badge">🔬 Research Project — SUSL</p>
      <h1>Animation <span class="highlight">Performance</span> Benchmark</h1>
      <p class="level-tag" style="background:{levelTagBg};color:{levelTagColor};border:1px solid {levelTagBorder};padding:6px 14px;border-radius:20px;font-size:0.83rem;font-weight:600;margin-bottom:18px;">
        {levelTagText}
      </p>
      <p class="hero-sub">A controlled experimental study comparing animation rendering performance across React, Vue.js, Svelte and Angular frameworks.</p>
      <div class="hero-buttons">
        <button class="btn-primary" on:click={openResearchModal}>View Research</button>
        <button class="btn-secondary" on:click={openLearnMoreModal}>Learn More</button>
      </div>
      <div class="hero-stats">
        <div class="stat"><span class="stat-number">4</span><span class="stat-label">Frameworks</span></div>
        <div class="stat"><span class="stat-number">7</span><span class="stat-label">Metrics</span></div>
        <div class="stat"><span class="stat-number">30+</span><span class="stat-label">Test Runs</span></div>
      </div>
    </div>
    <div class="hero-right">
      <div class="logo-wrapper">
        <div class="ring ring-1"></div><div class="ring ring-2"></div><div class="ring ring-3"></div>
        <div class="animated-logo"></div>
      </div>
      <p class="logo-label">⚡ Animated Test Element</p>
    </div>
  </section>

  <!-- Footer -->
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
/* ─── Level 1 — Basic CSS Transitions ────────────────────────────────────── */

/* Layout */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
}
.hero-left {
  flex: 1;
  max-width: 560px;
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
  background: #4f46e5;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}
.btn-primary:hover {
  background: #4338ca;
  transform: translateY(-2px);
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
  transition: all 0.3s;
}
.btn-secondary:hover {
  background: #4f46e5;
  color: white;
}

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
}
.stat-label {
  font-size: 0.85rem;
  color: #777;
  font-weight: 500;
}

/* Logo / animated element */
.hero-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
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
.footer .brand-dot {
  background: #4f46e5;
}
.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 12px;
}
.footer p {
  color: #aaa;
  font-size: 0.88rem;
}
.footer-copy {
  margin-top: 16px;
  color: #666;
  font-size: 0.8rem;
}

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
  animation: modalIn 0.3s ease;
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
.modal-close:hover {
  background: #e2e8f0;
}
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

/* ─── Level 1 Keyframe Animations ─────────────────────────────────────────── */
@keyframes dotPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.4); opacity: 0.7; }
}
@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.2; }
  50%       { transform: scale(1.05); opacity: 0.4; }
}
@keyframes logoPulse {
  0%   { transform: rotate(0deg) scale(1); opacity: 1; }
  50%  { transform: rotate(180deg) scale(1.3); opacity: 0.6; }
  100% { transform: rotate(360deg) scale(1); opacity: 1; }
}
@keyframes modalIn {
  from { transform: scale(0.9); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.brand-dot        { animation: dotPulse 2s ease-in-out infinite; }
.ring-1           { animation: ringPulse 3s ease-in-out infinite 0s; }
.ring-2           { animation: ringPulse 3s ease-in-out infinite 0.5s; }
.ring-3           { animation: ringPulse 3s ease-in-out infinite 1s; }
.animated-logo    { animation: logoPulse 2s ease-in-out infinite; }

/* ─── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .navbar {
    padding: 14px 24px;
  }
  .hero {
    flex-direction: column;
    padding: 50px 24px;
    min-height: auto;
  }
  .hero-left {
    max-width: 100%;
  }
  .hero-left h1 {
    font-size: 2.2rem;
  }
  .hero-stats {
    gap: 24px;
  }
  .hero-buttons {
    flex-direction: column;
    gap: 12px;
  }
  .footer {
    padding: 36px 24px;
  }
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
