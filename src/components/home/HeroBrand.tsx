"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/brand/Logo";

/**
 * v3.0 — The Velora wordmark as a single morphing element with a breathing
 * glow halo. At the top it sits large and centred; as the visitor scrolls
 * it shrinks and docks into the header. Blur-to-sharp entrance on load.
 */
export function HeroBrand() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let big = 4.4;
    let y0 = 0;
    let y1 = 0;
    let dock = 600;
    // Scale at full dock — base font is now 1.6rem so docked scale is smaller
    const docked = 1.15;

    const measure = () => {
      el.style.transform = "translateX(-50%) scale(1)";
      const r = el.getBoundingClientRect();
      const w0 = r.width || 240;
      const h0 = r.height || 28;
      let vw = window.innerWidth || document.documentElement.clientWidth;
      let vh = window.innerHeight || document.documentElement.clientHeight;
      if (!vw || !vh) {
        const host = el.closest("section") ?? document.body;
        const hr = host.getBoundingClientRect();
        vw = vw || hr.width || 1280;
        vh = vh || hr.height || 800;
      }
      // Header pill (mt-2 + py-3) + logo incl. "INTERNATIONAL" subtitle ≈ 37px centre
      // h0 only measures the VELORA line; account for subtitle height (~15px) below it
      const headerCenter = 37 - (15 * docked) / 2;
      const fit = (vw * (vw < 640 ? 0.94 : 0.86)) / w0;
      big = Math.max(1.25, Math.min(vw < 640 ? 4.8 : 7.2, fit));
      y1 = headerCenter - (h0 * docked) / 2;
      y0 = vh * 0.5 - (h0 * big) / 2;
      dock = Math.max(vh * 0.85, 500);
      apply();
      el.style.opacity = "1";
    };

    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const apply = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / dock));
      const e = ease(p);
      const s = big + (docked - big) * e;
      const y = y0 + (y1 - y0) * e;
      el.style.transform = `translateX(-50%) translateY(${y}px) scale(${s})`;
      document.documentElement.style.setProperty("--brand-dock", e.toFixed(4));
      // v3.0 — fade the scroll cue as we dock
      document.documentElement.style.setProperty("--scroll-cue-o", (1 - Math.min(1, p * 3)).toFixed(3));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply();
        ticking = false;
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      document.documentElement.style.removeProperty("--brand-dock");
      document.documentElement.style.removeProperty("--scroll-cue-o");
    };
  }, []);

  return (
    <div
      data-hero-brand
      className="pointer-events-none fixed inset-x-0 top-0"
    >
      <Link
        ref={ref}
        href="/"
        aria-label="Velora International — home"
        className="pointer-events-auto absolute left-1/2 top-0 inline-flex will-change-transform"
        style={{ transformOrigin: "center top", opacity: 0, transition: "opacity .8s var(--ease-silk)" }}
      >
        <Logo
          animated
          subtitleStyle={{
            opacity: "var(--brand-dock, 0)",
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
          }}
        />
      </Link>
    </div>
  );
}
