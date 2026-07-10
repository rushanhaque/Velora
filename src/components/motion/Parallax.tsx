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

/** Top-of-page reading progress — a gilded thread drawn across the
 *  page with a molten tip at its leading edge. Translated (not scaled)
 *  so the tip stays crisp at every progress value. */
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
      el.style.transform = `translate3d(${(-100 + p * 100).toFixed(3)}%, 0, 0)`;
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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] overflow-hidden" aria-hidden="true">
      <div
        ref={ref}
        className="relative h-full w-full bg-gradient-to-r from-transparent via-brass/70 to-brass-gilt"
        style={{ transform: "translate3d(-100%, 0, 0)", willChange: "transform" }}
      >
        {/* molten tip */}
        <span className="absolute right-0 top-1/2 h-[3px] w-10 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,transparent,#fff7e0)] shadow-[0_0_14px_rgba(234,222,179,0.9),0_0_36px_rgba(200,167,101,0.5)]" />
      </div>
    </div>
  );
}
