"use client";

import { useEffect } from "react";

/**
 * Buttery momentum scroll — desktop, capable machines only.
 *
 * Lenis re-drives every scroll through JS (a rAF loop + per-frame scroll
 * events), which feels silken on a good GPU and laggy on a weak one. So it is
 * gated off for:
 *   · touch / coarse-pointer devices (native momentum scroll is better there)
 *   · low-core machines (≤ 4 threads) and low-memory devices
 *   · reduced-motion visitors
 * Everyone else gets native scrolling — instant and cheap.
 *
 * The library itself is imported DYNAMICALLY, and only after the gate passes,
 * so the touch / low-core majority (who bail out) never download or parse it —
 * it stays out of the initial bundle.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.hardwareConcurrency ?? 8) <= 4) return;
    if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return;

    let cancelled = false;
    let raf = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any = null;
    let onClick: ((e: MouseEvent) => void) | null = null;

    (async () => {
      const Lenis = (await import("lenis")).default;
      if (cancelled) return; // unmounted before the chunk resolved

      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });

      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      (window as any).__lenis = lenis;

      // Let in-page anchor links use Lenis
      onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as
          | HTMLAnchorElement
          | null;
        if (!a) return;
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -90 });
        }
      };
      document.addEventListener("click", onClick);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (onClick) document.removeEventListener("click", onClick);
      lenis?.destroy();
      (window as any).__lenis = undefined;
    };
  }, []);

  return null;
}
