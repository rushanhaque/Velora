"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Vertical parallax tied to the element's travel through the viewport.
 * Manual rAF-throttled scroll handler — reliable and reflow-free
 * (transform only), and skipped for reduced-motion visitors.
 */
export function Parallax({
  children,
  className,
  distance = 70,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const w = wrap.current;
    const el = inner.current;
    if (!w || !el) return;

    let raf = 0;
    let ticking = false;
    const update = () => {
      const r = w.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = r.top + r.height / 2;
      const p = (center - vh / 2) / (vh / 2); // ~ -1 (top) .. 1 (bottom)
      const y = Math.max(-1, Math.min(1, p)) * distance;
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [distance]);

  return (
    <div ref={wrap} className={cn("relative", className)}>
      <div ref={inner} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}

/** Top-of-page reading progress, a thin brass thread. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      el.style.transform = `scaleX(${p.toFixed(4)})`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brass-deep via-brass to-brass-gilt shadow-[0_0_12px_rgba(176,145,92,0.4),0_0_4px_rgba(176,145,92,0.6)]"
      style={{ transform: "scaleX(0)" }}
      aria-hidden="true"
    />
  );
}
