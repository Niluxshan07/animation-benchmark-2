'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function AnimationBenchmark() {
  const [modal, setModal] = useState<{ title: string; content: string[] } | null>(null);
  const [count, setCount] = useState({ frameworks: 0, metrics: 0, runs: 0 });
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; alpha: number }>>([]);

  // Entrance stagger
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Counter animation
  useEffect(() => {
    const targets = { frameworks: 4, metrics: 7, runs: 30 };
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount({
        frameworks: Math.round(targets.frameworks * ease),
        metrics: Math.round(targets.metrics * ease),
        runs: Math.round(targets.runs * ease),
      });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,70,229,${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
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
        @keyframes dotPulseCinematic {
          0%, 100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 0px #4f46e5); }
          50% { transform: scale(1.6); opacity: 0.5; filter: drop-shadow(0 0 20px #4f46e5); }
        }
        @keyframes ringPulseCinematic {
          0%, 100% { transform: scale(1); opacity: 0.2; filter: blur(0px); }
          50% { transform: scale(1.15); opacity: 0.6; filter: blur(1px); }
        }
        @keyframes logoPulseCinematic {
          0%   { transform: rotate(0deg) scale(1); }
          25%  { transform: rotate(90deg) scale(1.2); }
          50%  { transform: rotate(180deg) scale(1.5); }
          75%  { transform: rotate(270deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes modalCinematic {
          0% { transform: scale(0.7) rotate(-5deg); opacity: 0; filter: blur(5px); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
        }
        @keyframes fadeSlideUp {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .brand-dot { animation: dotPulseCinematic 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }
        .ring-1 { animation: ringPulseCinematic 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite 0s; }
        .ring-2 { animation: ringPulseCinematic 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite 0.5s; }
        .ring-3 { animation: ringPulseCinematic 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite 1s; }
        .animated-logo {
          animation: logoPulseCinematic 2s ease-in-out infinite;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animated-logo:hover {
          transform: scale(1.1) rotate(5deg);
          filter: drop-shadow(0 0 30px rgba(79,70,229,0.8));
        }
        .modal-box { animation: modalCinematic 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .card { transition: transform 0.3s, box-shadow 0.3s; }
        .card:hover { transform: translateY(-12px) scale(1.05); }
        .hero-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 0;
        }
        .hero { position: relative; overflow: hidden; }
        .hero-left, .hero-right { position: relative; z-index: 1; }
        .hero-left.visible .badge { animation: fadeSlideUp 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.05s both; }
        .hero-left.visible h1 { animation: fadeSlideUp 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.15s both; }
        .hero-left.visible .hero-sub { animation: fadeSlideUp 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.28s both; }
        .hero-left.visible .hero-buttons { animation: fadeSlideUp 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.4s both; }
        .hero-left.visible .hero-stats { animation: fadeSlideUp 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.52s both; }
        .hero-right.visible { animation: fadeSlideUp 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
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
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className={`hero-left${visible ? ' visible' : ''}`}>
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
        <div className={`hero-right${visible ? ' visible' : ''}`}>
          <div className="logo-wrapper">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
            <div className="animated-logo"></div>
          </div>
          <p className="logo-label">⚡ Animated Test Element — Level 5</p>
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
      <div className="level-indicator">Animation Level 5</div>
    </div>
  );
}
