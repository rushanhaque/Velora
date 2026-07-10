"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
// collection hands off to the next. One entry per collection; last is 1.0.
const SCROLL_BREAKS = [0.18, 0.34, 0.5, 0.66, 0.82, 1.0];

const STACK_OFFSET = 36;
const STACK_SCALE  = 0.075;
const STACK_TILT   = 4;

// Mobile carousel geometry (all in vw)
const C_VW  = 82;                    // card width as % of viewport
const G_VW  = 3;                     // gap between cards
const PK_VW = (100 - C_VW) / 2;     // 9vw — peek amount on each side

function DeckCard({ h }: { h: (typeof HOUSES)[number] }) {
  return (
    <Link
      href={`/collections?house=${h.slug}`}
      data-lit
      className="group flex h-full w-full flex-col rounded-2xl bg-white p-3 shadow-[0_34px_64px_-26px_rgba(34,26,12,0.42),0_12px_26px_-18px_rgba(34,26,12,0.34)]"
    >
      <div
        className="relative flex-1 overflow-hidden rounded-xl"
        style={{
          background: `radial-gradient(120% 95% at 50% 10%, ${GLOW[h.tone]}, transparent 62%), linear-gradient(180deg,#fcfbf7,#efeae0)`,
        }}
      >
        {h.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={h.cover}
            alt={`${h.name} — ${h.material}`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-silk will-change-transform group-hover:scale-[1.05]"
          />
        ) : (
          h.art && (
            <div className="absolute inset-0 grid place-items-center p-[9%] transition-transform duration-[850ms] ease-silk will-change-transform group-hover:-translate-y-[10px]">
              <SpecimenArt
                shape={h.art.shape}
                tone={h.art.tone}
                seed={`deck-${h.slug}`}
                className="h-full w-full drop-shadow-[0_22px_30px_rgba(34,26,12,0.22)] transition-[filter] duration-[850ms] ease-silk group-hover:drop-shadow-[0_44px_54px_rgba(34,26,12,0.36)]"
              />
            </div>
          )
        )}
        {/* brass light-catch draws along the lower edge on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 bottom-0 h-px origin-center scale-x-0 transition-transform duration-[700ms] ease-silk group-hover:scale-x-100"
          style={{ background: "linear-gradient(90deg, transparent, rgba(200,167,101,0.9), transparent)" }}
        />
      </div>
    </Link>
  );
}

export function HouseIndex() {
  const [active, setActive] = useState(0);
  const [mCard, setMCard] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const touchX = useRef(0);
  const cur = HOUSES[active];

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

  const goTo = useCallback((i: number) => {
    setMCard(Math.max(0, Math.min(COLLECTIONS.length - 1, i)));
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
          <Shell>
            <div className="max-w-[clamp(300px,40vw,500px)] mt-10">
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
                        data-active={on}
                        className="house-row group/row block py-3"
                      >
                        <div className="flex items-baseline gap-4">
                          <span className={cn("numeral w-6 shrink-0 text-[0.82rem] transition-colors duration-500", on ? "text-brass-deep" : "text-haze")}>
                            {h.index}
                          </span>
                          <h3 className={cn("font-display text-[clamp(1.76rem,3.2vw,2.88rem)] leading-[1] transition-all duration-500 ease-silk", on ? "translate-x-2 text-bitumen" : "text-stone/50 group-hover/row:translate-x-1 group-hover/row:text-bitumen/80")}>
                            {h.name}
                          </h3>
                        </div>
                        {/* engraved rule — draws in beneath the active house */}
                        <span
                          aria-hidden="true"
                          className="house-rule ml-10 mt-2.5 block h-px w-[min(280px,60%)] bg-gradient-to-r from-brass via-brass/40 to-transparent"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Shell>

          <div className="absolute right-[clamp(0px,1.4vw,20px)] top-[53%] w-[clamp(463px,47.4vw,662px)] -translate-y-1/2 [perspective:1900px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -m-12 rounded-full blur-[80px] transition-all duration-1000"
              style={{ background: `radial-gradient(circle, ${GLOW[cur.tone]}, transparent 70%)`, opacity: 0.5 }}
            />
            <div className="relative aspect-[7/4.6] w-full">
              {HOUSES.map((h, i) => {
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

      {/* ── MOBILE / TABLET: premium horizontal carousel ── */}
      <Section pad="xl" className="lg:hidden">
        {/* Section header */}
        <Shell>
          <div className="flex items-end justify-between gap-4">
            <div>
              <Reveal>
                <Eyebrow>The collections</Eyebrow>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="display mt-5 text-[clamp(2rem,9vw,2.8rem)] leading-[0.98] text-bitumen">
                  Six collections
                  <br />
                  <span className="text-leaf">to live with.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={120}>
              <Link href="/collections" className="link-draw shrink-0 pb-1 text-[0.66rem] uppercase tracking-wide3 text-bitumen">
                All →
              </Link>
            </Reveal>
          </div>
        </Shell>

        {/* Carousel rail — full bleed beyond Shell */}
        <div className="relative mt-10 [overflow-x:clip]">
          {/* Subtle ambient glow that tracks the active card tone */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-[60vw] -translate-x-1/2 blur-[60px] transition-all duration-700"
            style={{ background: `radial-gradient(ellipse at center, ${GLOW[COLLECTIONS[mCard]?.tone ?? "brass"]}, transparent 70%)`, opacity: 0.45 }}
          />

          <div
            className="flex will-change-transform"
            style={{
              transform: `translateX(-${mCard * (C_VW + G_VW)}vw)`,
              paddingLeft: `${PK_VW}vw`,
              gap: `${G_VW}vw`,
              transition: "transform 0.75s cubic-bezier(0.16,1,0.3,1)",
            }}
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              const dx = touchX.current - e.changedTouches[0].clientX;
              if (Math.abs(dx) > 50) dx > 0 ? goTo(mCard + 1) : goTo(mCard - 1);
            }}
          >
            {COLLECTIONS.map((c, i) => {
              const dist = Math.abs(i - mCard);
              return (
                <div
                  key={c.slug}
                  className="shrink-0"
                  style={{
                    width: `${C_VW}vw`,
                    transform: `scale(${dist === 0 ? 1 : dist === 1 ? 0.965 : 0.925})`,
                    opacity: dist === 0 ? 1 : dist === 1 ? 0.72 : 0.38,
                    transition: "transform 0.75s cubic-bezier(0.16,1,0.3,1), opacity 0.55s ease",
                  }}
                >
                  <CollectionCard c={c} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation — arrows · pill indicators · counter */}
        <Shell>
          <div className="mt-8 flex items-center justify-between">

            {/* Prev / Next */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => goTo(mCard - 1)}
                disabled={mCard === 0}
                aria-label="Previous collection"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone/20 bg-parchment-pale text-stone/60 transition-all duration-300 hover:border-brass/35 hover:bg-parchment hover:text-bitumen disabled:pointer-events-none disabled:opacity-25"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => goTo(mCard + 1)}
                disabled={mCard === COLLECTIONS.length - 1}
                aria-label="Next collection"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone/20 bg-parchment-pale text-stone/60 transition-all duration-300 hover:border-brass/35 hover:bg-parchment hover:text-bitumen disabled:pointer-events-none disabled:opacity-25"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* Pill progress indicators */}
            <div className="flex items-center gap-[5px]">
              {COLLECTIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`View ${COLLECTIONS[i].name}`}
                  style={{
                    display: "block",
                    width: mCard === i ? 28 : 8,
                    height: 2,
                    borderRadius: 1,
                    background: mCard === i ? "var(--brass-leaf)" : "rgba(176,145,92,0.3)",
                    transition: "width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.35s ease",
                  }}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="flex items-baseline gap-1 text-[0.58rem] uppercase tracking-wider2 text-ash">
              <span className="font-display text-[1.15rem] leading-none text-bitumen">
                {String(mCard + 1).padStart(2, "0")}
              </span>
              <span className="mx-0.5">/</span>
              <span>{String(COLLECTIONS.length).padStart(2, "0")}</span>
            </div>

          </div>
        </Shell>
      </Section>
    </>
  );
}
