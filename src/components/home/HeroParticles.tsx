"use client";

import { useEffect, useRef } from "react";

/**
 * v3.0 — Golden-hour particles. A canvas of floating brass dust motes
 * with gentle drift and varied depths. Pauses when off-screen.
 */
export function HeroParticles({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvas.current;
    if (!cvs) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let active = true;

    interface Mote {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      o: number;
      oTarget: number;
      depth: number;
    }

    const motes: Mote[] = [];
    const COUNT = 45;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = cvs.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      cvs.width = w * dpr;
      cvs.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    const init = () => {
      resize();
      motes.length = 0;
      for (let i = 0; i < COUNT; i++) {
        const depth = 0.3 + Math.random() * 0.7;
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1 + Math.random() * 2.5 * depth,
          vx: (Math.random() - 0.5) * 0.3 * depth,
          vy: -0.15 - Math.random() * 0.35 * depth,
          o: 0,
          oTarget: 0.15 + Math.random() * 0.45 * depth,
          depth,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        // Drift
        m.x += m.vx;
        m.y += m.vy;

        // Fade in gently
        m.o += (m.oTarget - m.o) * 0.01;

        // Gentle oscillation
        m.x += Math.sin(Date.now() * 0.0005 + m.depth * 10) * 0.15;

        // Wrap around
        if (m.y < -10) { m.y = h + 10; m.x = Math.random() * w; }
        if (m.x < -10) m.x = w + 10;
        if (m.x > w + 10) m.x = -10;

        // Draw with warm brass tones
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
        grad.addColorStop(0, `rgba(255, 240, 214, ${m.o})`);
        grad.addColorStop(0.5, `rgba(212, 185, 134, ${m.o * 0.6})`);
        grad.addColorStop(1, `rgba(176, 145, 92, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (active) draw();
      raf = requestAnimationFrame(loop);
    };

    // Pause when off-screen
    const io = new IntersectionObserver(
      ([entry]) => { active = entry.isIntersecting; },
      { threshold: 0 },
    );
    io.observe(cvs);

    init();
    loop();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      className={className}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
