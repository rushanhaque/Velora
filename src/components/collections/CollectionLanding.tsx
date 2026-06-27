"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { COLLECTIONS, specimensByCollection } from "@/lib/data";
import { Specimen as SpecimenArt } from "@/components/visual/Specimen";

// ── tone palette ──────────────────────────────────────────────────────────────
const GLOW: Record<string, string> = {
  brass:  "rgba(200,167,101,0.32)",
  copper: "rgba(207,126,82,0.28)",
  silver: "rgba(214,215,218,0.30)",
  bronze: "rgba(156,122,68,0.28)",
};
const HUE: Record<string, string> = {
  brass:  "#c8a765",
  copper: "#cf7e52",
  silver: "#9fa0a1",
  bronze: "#9c7a44",
};

const HOUSES = COLLECTIONS.map((c) => ({
  ...c,
  art: specimensByCollection(c.slug)[0],
}));
const LAST = HOUSES.length - 1;

// ── stack geometry ─────────────────────────────────────────────────────────────
// Front card sits at the bottom; the rest fan DOWN so the deck peeks beneath it.
const OFFSET     = 34;   // px each back card drops — bigger = more visible stack
const SCALE_STEP = 0.05;
const DIM_STEP   = 0.12;
// Gentle, slightly slow spring so a switch glides rather than snaps.
const SPRING     = { type: "spring" as const, stiffness: 110, damping: 23 };

type Lenis = { start: () => void; stop: () => void };
const getLenis = () =>
  (window as unknown as { __lenis?: Lenis }).__lenis;

// ── Root ──────────────────────────────────────────────────────────────────────
export function CollectionLanding() {
  const [currentIdx, setIdx] = useState(0);

  const idxRef        = useRef(0); // mirror of currentIdx for the wheel closure
  const accumRef      = useRef(0);
  const lastSwitchRef = useRef(0); // timestamp gate (self-clearing, no timer)

  const moveTo = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(next, LAST));
    if (clamped === idxRef.current) return;
    idxRef.current = clamped;       // keep the wheel-closure mirror in sync at once
    setIdx(clamped);
  }, []);

  // Lock the page (via Lenis) while cards remain; release on the last card so the
  // page can scroll on past the hero. Driven by which card is in front.
  useEffect(() => {
    let cancelled = false;
    const atLast = currentIdx >= LAST;
    const apply = () => {
      if (cancelled) return;
      const lenis = getLenis();
      if (!lenis) { requestAnimationFrame(apply); return; } // wait for Lenis to mount
      atLast ? lenis.start() : lenis.stop();
    };
    apply();
    return () => { cancelled = true; };
  }, [currentIdx]);

  // Own the wheel at the top of the section: scrolling down advances, up rewinds.
  // Only a downward scroll on the LAST card is released to the page.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const down = e.deltaY > 0;
      const i    = idxRef.current;

      // Once the page has scrolled below the hero, behave normally until we're
      // back at the very top — avoids hijacking scroll while reading the footer.
      if (window.scrollY > 2) return;

      // Last card + scrolling down → hold a beat so the final card settles,
      // then release on the next downward scroll so the page moves on just
      // *after* the last card rather than on it.
      if (down && i >= LAST) {
        if (performance.now() - lastSwitchRef.current < 700) {
          e.preventDefault();
          e.stopImmediatePropagation();
          getLenis()?.stop();
          return;
        }
        getLenis()?.start();
        return;
      }
      // Already at the first card and scrolling up → nothing to rewind.
      if (!down && i <= 0) return;

      // We own this gesture: block the page entirely and cycle a card.
      e.preventDefault();
      e.stopImmediatePropagation();
      getLenis()?.stop();

      const now = performance.now();
      if (now - lastSwitchRef.current < 650) return;
      accumRef.current += e.deltaY;
      if (Math.abs(accumRef.current) < 22) return;
      const dir = accumRef.current > 0 ? 1 : -1;
      accumRef.current      = 0;
      lastSwitchRef.current = now;
      moveTo(idxRef.current + dir);
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, { capture: true } as EventListenerOptions);
  }, [moveTo]);

  // Safety: always hand scrolling back to Lenis when leaving the page.
  useEffect(() => () => { getLenis()?.start(); }, []);

  const activeTone = HOUSES[currentIdx]?.tone ?? "brass";
  const visible    = HOUSES.slice(currentIdx); // depleting deck: passed cards leave
  const PEEK_SPACE = LAST * OFFSET;             // constant, so the front card never jumps

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[calc(100svh-80px)] min-h-[540px] select-none overflow-hidden">
      {/* Progress pills */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {HOUSES.map((_, i) => (
          <div
            key={i}
            className="h-[3px] rounded-full transition-all duration-500"
            style={{
              width:      i === currentIdx ? "2rem" : "6px",
              background: i === currentIdx ? HUE[activeTone] : "rgba(34,26,12,0.14)",
            }}
          />
        ))}
      </div>

      {/* Stack wrapper — 50% wider, landscape; marginBottom reserves peek space */}
      <div
        className="relative"
        style={{ width: "min(880px, 94vw)", marginBottom: `${PEEK_SPACE}px` }}
      >
        <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
          <ul className="absolute inset-0 m-0 p-0" style={{ overflow: "visible" }}>
            <AnimatePresence>
              {visible.map((h, i) => {
                const isFront    = i === 0;
                const brightness = Math.max(0.4, 1 - i * DIM_STEP);

                return (
                  <motion.li
                    key={h.slug}
                    className="absolute w-full h-full list-none overflow-hidden rounded-[20px] border border-stone/15"
                    style={{
                      background: `radial-gradient(110% 80% at 50% 105%, ${GLOW[h.tone]}, transparent 55%),
                                   linear-gradient(180deg,#faf9f5 0%,#ece8df 100%)`,
                      boxShadow: isFront
                        ? "0 36px 72px rgba(34,26,12,0.26),0 8px 20px rgba(34,26,12,0.10)"
                        : "0 14px 28px rgba(34,26,12,0.12)",
                    }}
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{
                      bottom: `${i * -OFFSET}px`,
                      scale:  1 - i * SCALE_STEP,
                      filter: `brightness(${brightness})`,
                      zIndex: visible.length - i,
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -110,
                      scale: 0.95,
                      transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
                    }}
                    transition={SPRING}
                  >
                    {/* Ghost numeral */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display leading-none"
                      style={{ fontSize: "min(26vw,168px)", color: HUE[h.tone], opacity: 0.065 }}
                    >
                      {h.index}
                    </span>

                    {/* Art — centred, room left for bottom text */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-20 pb-16 pt-8">
                      {h.art && (
                        <SpecimenArt
                          shape={h.art.shape}
                          tone={h.art.tone}
                          seed={`cstack-${h.slug}`}
                          className="h-full w-auto drop-shadow-[0_20px_36px_rgba(34,26,12,0.24)]"
                        />
                      )}
                    </div>

                    {/* Grain texture */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        opacity:      0.011,
                        mixBlendMode: "multiply" as const,
                      }}
                    />

                    {/* Top row */}
                    <div className="absolute inset-x-7 top-5 flex items-center justify-between z-10">
                      <span
                        className="font-display text-[0.58rem] tracking-[0.22em]"
                        style={{ color: HUE[h.tone] }}
                      >
                        {h.index}
                      </span>
                      <span className="text-[0.46rem] uppercase tracking-wider2" style={{ color: "#a89d82" }}>
                        {h.count}&thinsp;pcs
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute inset-x-0 bottom-0 p-7 z-10">
                      <h2
                        className="font-display leading-[0.95] text-bitumen"
                        style={{ fontSize: "clamp(1.7rem,3.5vw,2.4rem)" }}
                      >
                        {h.name}
                      </h2>
                      <p
                        className="mt-1 text-[0.5rem] uppercase tracking-wider2"
                        style={{ color: HUE[h.tone] }}
                      >
                        {h.material} · {h.tagline}
                      </p>
                      <Link
                        href={`/collections?house=${h.slug}`}
                        className="mt-4 inline-flex items-center gap-2 text-[0.56rem] uppercase tracking-wide3 text-bitumen transition-opacity duration-300 hover:opacity-60"
                      >
                        <span style={{ borderBottom: `1px solid ${HUE[h.tone]}`, paddingBottom: "1px" }}>
                          Enter the house
                        </span>
                        <span style={{ color: HUE[h.tone] }}>→</span>
                      </Link>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      </div>

      {/* Hint — fades out on the last card */}
      <p
        className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.5rem] uppercase tracking-wider2 text-stone/40 transition-opacity duration-500"
        style={{ opacity: currentIdx >= LAST ? 0 : 1 }}
      >
        Scroll to explore · {currentIdx + 1} / {HOUSES.length}
      </p>
    </div>
  );
}
