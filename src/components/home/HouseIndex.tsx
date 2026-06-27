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
          const perCollection = scrollable / HOUSES.length;
          const scrolled = -rect.top + perCollection;
          const p = Math.max(0, Math.min(1, scrolled / scrollable));
          setActive(Math.min(HOUSES.length - 1, Math.floor(p * HOUSES.length)));
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
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden py-[clamp(40px,5vh,80px)]">
          <Shell>
            <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr]">
              {/* index — eyebrow sits just above Lighting */}
              <div className="mt-16 flex flex-col self-center gap-1">
                <Reveal>
                  <Eyebrow className="mb-5">The collections</Eyebrow>
                </Reveal>
                <ul className="flex flex-col gap-1">
                  {HOUSES.map((h, i) => {
                    const on = active === i;
                    return (
                      <li key={h.slug}>
                        <Link
                          href={`/collections?house=${h.slug}`}
                          onMouseEnter={() => setActive(i)}
                          onFocus={() => setActive(i)}
                          className="group/row block py-5"
                        >
                          <div className="flex items-baseline gap-5">
                            <span
                              className={cn(
                                "numeral w-8 shrink-0 text-[1.05rem] transition-colors duration-500",
                                on ? "text-brass-deep" : "text-haze",
                              )}
                            >
                              {h.index}
                            </span>
                            <h3
                              className={cn(
                                "font-display text-[clamp(2.1rem,4.6vw,3.7rem)] leading-[0.95] transition-all duration-500 ease-silk",
                                on
                                  ? "translate-x-2 text-bitumen"
                                  : "text-stone/50 group-hover/row:translate-x-1 group-hover/row:text-bitumen/80",
                              )}
                            >
                              {h.name}
                            </h3>
                            <span
                              className={cn(
                                "ml-auto shrink-0 self-center text-[0.6rem] uppercase tracking-wider2 transition-colors duration-500",
                                on ? "text-brass-deep" : "text-ash/50",
                              )}
                            >
                              {h.count} pcs
                            </span>
                          </div>
                          <p
                            className={cn(
                              "mt-2 pl-[3.25rem] text-[0.66rem] uppercase tracking-wider2 transition-colors duration-500",
                              on ? "text-brass-deep" : "text-ash/50",
                            )}
                          >
                            {h.material} · {h.tagline}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* vitrine */}
              <div className="mt-16 self-start">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-8 rounded-full blur-[60px] transition-all duration-1000"
                  style={{
                    background: `radial-gradient(circle, ${GLOW[cur.tone]}, transparent 70%)`,
                    opacity: 0.5,
                  }}
                />
                <div className="plate depth-card relative aspect-square overflow-hidden rounded-xl3">
                  <div aria-hidden="true">
                    {HOUSES.map((h, i) => (
                      <div
                        key={h.slug}
                        data-active={active === i}
                        className="vitrine-layer absolute inset-0"
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(120% 90% at 50% 12%, ${GLOW[h.tone]}, transparent 60%), linear-gradient(180deg,#fcfbf7,#efeae0)`,
                          }}
                        />
                        <span className="numeral pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[16rem] leading-none text-brass/[0.06]">
                          {h.index}
                        </span>
                        {h.art && (
                          <div className="absolute inset-0 grid place-items-center p-[17%]">
                            <SpecimenArt
                              shape={h.art.shape}
                              tone={h.art.tone}
                              seed={`house-${h.slug}`}
                              className="h-full w-full drop-shadow-[0_34px_44px_rgba(34,26,12,0.30)]"
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* museum placard */}
                    <div
                      key={cur.slug}
                      className="meta-in plate absolute bottom-6 left-1/2 w-[min(78%,22rem)] -translate-x-1/2 rounded-card px-6 py-4 text-center"
                    >
                      <h3 className="font-display text-2xl text-bitumen">{cur.name}</h3>
                      <p className="mt-1 text-[0.64rem] uppercase tracking-wider2 text-ash">
                        {cur.material} · {cur.count} pieces
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Shell>
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
                  Four houses
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
