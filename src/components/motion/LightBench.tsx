"use client";

import { useEffect } from "react";

/**
 * v4.0 — The bench light.
 * One delegated pointer listener for the whole site: any element
 * carrying `data-lit` gets `--lx`/`--ly` custom properties set to the
 * pointer's position over it, which the CSS layer turns into a warm
 * specular bloom + edge glint (see globals.css).
 *
 * rAF-throttled, fine-pointer only, reduced-motion aware. Renders nothing.
 */
export function LightBench() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    let raf = 0;
    let target: HTMLElement | null = null;
    let x = 0;
    let y = 0;

    const apply = () => {
      raf = 0;
      if (!target) return;
      const r = target.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      target.style.setProperty("--lx", `${(((x - r.left) / r.width) * 100).toFixed(2)}%`);
      target.style.setProperty("--ly", `${(((y - r.top) / r.height) * 100).toFixed(2)}%`);
    };

    const onMove = (e: PointerEvent) => {
      const t = (e.target as Element | null)?.closest?.("[data-lit]");
      target = (t as HTMLElement) ?? null;
      if (!target) return;
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
