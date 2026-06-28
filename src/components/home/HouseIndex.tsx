"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Section, Shell } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Atoms";
import { Specimen as SpecimenArt } from "@/components/visual/Specimen";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { COLLECTIONS, specimensByCollection } from "@/lib/data";
import { cn } from "@/lib/utils";

const GLOW: Record<string, string> = {
  brass: "rgba(200,167,101,0.24)",
  copper: "rgba(207,126,82,0.22)",
  silver: "rgba(220,221,222,0.24)",
  bronze: "rgba(156,122,68,0.22)",
};

const HOUSES = COLLECTIONS.map((c) => ({ ...c, art: specimensByCollection(c.slug)[0] }));

// Scroll breakpoints: cumulative fraction of scrollable height at which each
// collection hands off to the next. Lighting holds longer; Bespoke shorter.
// Must be ascending and end at 1.0. [Lighting→Decor, Decor→Kitchenware, …, end]
const SCROLL_BREAKS = [0.24, 0.44, 0.64, 0.84, 1.0];

// Centered vertical stack: the active card sits straight at the front; up to two
// upcoming cards peek above it and two past cards peek below.
const STACK_OFFSET = 52; // px each step away from the front shifts vertically
const STACK_SCALE  = 0.075;
const STACK_TILT   = 4;  // deg — back cards tilt (fan out); the front stays straight

// A single LANDSCAPE listing card — inset photo (own rounded corners) over a
// price-style headline, address line, spec row and a heart button.
function DeckCard({ h }: { h: (typeof HOUSES)[number] }) {
  return (
    <Link
      href={`/collections?house=${h.slug}`}
      className="group flex h-full w-full flex-col rounded-2xl bg-white p-3 shadow-[0_34px_64px_-26px_rgba(34,26,12,0.5),0_12px_26px_-18px_rgba(34,26,12,0.42)]"
    >
      {/* inset photo */}
      <div
        className="relative flex-[3] overflow-hidden rounded-xl"
        style={{
          background: `radial-gradient(120% 95% at 50% 8%, ${GLOW[h.tone]}, transparent 60%), linear-gradient(180deg,#fcfbf7,#efeae0)`,
        }}
      >
        <span className="numeral pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] leading-none text-brass/[0.07]">
          {h.index}
        </span>
        {h.art && (
          <div className="absolute inset-0 grid place-items-center p-[8%]">
            <SpecimenArt
              shape={h.art.shape}
              tone={h.art.tone}
              seed={`deck-${h.slug}`}
              className="h-full w-full drop-shadow-[0_20px_28px_rgba(34,26,12,0.26)]"
            />
          </div>
        )}
        {/* corner tag, echoing the reference's "FOR SALE" chip */}
        <span className="absolute left-3 top-3 rounded-md bg-white/85 px-2 py-1 text-[0.5rem] font-medium uppercase tracking-wider2 text-stone backdrop-blur-sm">
          House {h.index}
        </span>
      </div>

      {/* listing info */}
      <div className="relative flex flex-[1.35] flex-col justify-center px-2">
        <h3 className="font-display text-[1.4rem] leading-none text-bitumen">{h.name}</h3>
        <p className="mt-1.5 text-[0.78rem] leading-tight text-stone">
          {h.tagline},&nbsp;<span className="tracking-wide text-brass-deep">Moradabad</span>
        </p>
        <div className="mt-2 flex items-center gap-2 text-[0.58rem] uppercase tracking-wider2 text-ash">
          <span>{h.count} pcs</span>
          <span className="text-stone/25">|</span>
          <span>{h.material}</span>
          <span className="text-stone/25">|</span>
          <span>Made to order</span>
        </div>
        {/* heart button */}
        <span className="absolute bottom-1 right-2 grid h-9 w-9 place-items-center rounded-full bg-parchment-deep/50 text-stone transition-colors duration-300 group-hover:bg-brass/15 group-hover:text-brass-deep">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function HouseIndex() {
  const [active, setActive] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const cur = HOUSES[active];

  // Scroll-driven collection switching: outer div is tall; inner section sticks to top.
  // As the user scrolls through the outer div, active index advances before the page moves on.
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = outer.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        if (scrollable > 0) {
          const p = Math.max(0, Math.min(1, -rect.top / scrollable));
          const next = SCROLL_BREAKS.findIndex((b) => p < b);
          setActive(next === -1 ? HOUSES.length - 1 : next);
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── DESKTOP: tall scroll-space + sticky panel ── */}
      <div
        ref={outerRef}
        className="hidden lg:block mt-[clamp(24px,4vw,56px)]"
        style={{ height: `calc(${HOUSES.length} * 100svh)` }}
      >
        <div className="sticky top-0 relative flex h-[100svh] items-center overflow-hidden py-[clamp(40px,5vh,80px)]">
          {/* index — left side */}
          <Shell>
            <div className="max-w-[clamp(300px,40vw,500px)]">
              <Reveal>
                <Eyebrow className="mb-5">The collections</Eyebrow>
              </Reveal>
              <ul className="flex flex-col">
                {HOUSES.map((h, i) => {
                  const on = active === i;
                  return (
                    <li key={h.slug}>
                      <Link
                        href={`/collections?house=${h.slug}`}
                        className="group/row block py-3"
                      >
                        <div className="flex items-baseline gap-4">
                          <span
                            className={cn(
                              "numeral w-6 shrink-0 text-[0.82rem] transition-colors duration-500",
                              on ? "text-brass-deep" : "text-haze",
                            )}
                          >
                            {h.index}
                          </span>
                          <h3
                            className={cn(
                              "font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[1] transition-all duration-500 ease-silk",
                              on
                                ? "translate-x-2 text-bitumen"
                                : "text-stone/50 group-hover/row:translate-x-1 group-hover/row:text-bitumen/80",
                            )}
                          >
                            {h.name}
                          </h3>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Shell>

          {/* vitrine — centered vertical stack pinned to the right edge */}
          <div className="absolute right-[clamp(0px,1.4vw,20px)] top-[53%] w-[clamp(386px,39.5vw,552px)] -translate-y-1/2 [perspective:1900px]">
            {/* ambient glow behind the stack */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -m-12 rounded-full blur-[80px] transition-all duration-1000"
              style={{
                background: `radial-gradient(circle, ${GLOW[cur.tone]}, transparent 70%)`,
                opacity: 0.5,
              }}
            />
            <div className="relative aspect-[7/5] w-full">
              {HOUSES.map((h, i) => {
                // Cyclic offset so the selected card is always centered with two
                // cards above and two below (wraps around the 5 houses).
                const len  = HOUSES.length;
                const half = Math.floor(len / 2);
                let rel = i - active;
                if (rel >  half) rel -= len;
                if (rel < -half) rel += len;
                const a = Math.abs(rel);
                return (
                  <div
                    key={h.slug}
                    className="absolute inset-0 will-change-transform"
                    style={{
                      zIndex: 50 - a,
                      pointerEvents: rel === 0 ? "auto" : "none",
                      opacity: a === 0 ? 1 : a === 1 ? 0.96 : 0.55,
                      filter: `brightness(${1 - a * 0.08})`,
                      transform: `translateY(${-rel * STACK_OFFSET}px) rotate(${rel * STACK_TILT}deg) scale(${1 - a * STACK_SCALE})`,
                      transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease, filter 0.4s ease",
                    }}
                  >
                    <DeckCard h={h} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE / TABLET: editorial header + cards ── */}
      <Section pad="xl" className="overflow-hidden lg:hidden">
        <Shell>
          <div className="flex items-end justify-between gap-4">
            <div>
              <Reveal>
                <Eyebrow>The collections</Eyebrow>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="display mt-5 text-[clamp(2rem,9vw,2.8rem)] leading-[0.98] text-bitumen">
                  Five houses
                  <br />
                  <span className="text-leaf">of metal.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={120}>
              <Link
                href="/collections"
                className="link-draw shrink-0 pb-1 text-[0.66rem] uppercase tracking-wide3 text-bitumen"
              >
                All →
              </Link>
            </Reveal>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {COLLECTIONS.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60} className="h-full">
                <CollectionCard c={c} />
              </Reveal>
            ))}
          </div>
        </Shell>
      </Section>
    </>
  );
}
