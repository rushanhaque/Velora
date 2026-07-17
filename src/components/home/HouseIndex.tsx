"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Section, Shell } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Atoms";
import { Specimen as SpecimenArt } from "@/components/visual/Specimen";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { COLLECTIONS, SPECIMENS, type Collection, type Specimen } from "@/lib/data";

const GLOW: Record<string, string> = {
  brass: "rgba(200,167,101,0.24)",
  copper: "rgba(207,126,82,0.22)",
  silver: "rgba(220,221,222,0.24)",
  bronze: "rgba(156,122,68,0.22)",
};

const NUM_WORD: Record<number, string> = { 4: "Four", 5: "Five", 6: "Six", 7: "Seven" };

type House = Collection & { art?: Specimen };

// Mobile carousel geometry (all in vw)
const C_VW = 82; // card width as % of viewport
const G_VW = 3; // gap between cards
const PK_VW = (100 - C_VW) / 2; // 9vw — peek amount on each side

export function HouseIndex({
  collections = COLLECTIONS,
  specimens = SPECIMENS,
}: {
  collections?: Collection[];
  specimens?: Specimen[];
}) {
  const [mCard, setMCard] = useState(0);
  const touchX = useRef(0);

  // Each house + its hero piece (for the SVG-art fallback when no cover photo).
  const HOUSES: House[] = useMemo(
    () => collections.map((c) => ({ ...c, art: specimens.find((s) => s.collection === c.slug) })),
    [collections, specimens],
  );
  const count = HOUSES.length;

  const goTo = useCallback(
    (i: number) => {
      setMCard(Math.max(0, Math.min(count - 1, i)));
    },
    [count],
  );

  return (
    <>
      {/* ── DESKTOP (lg+): THE CABINET ROW ─────────────────────────────
             A folded metal screen of lit collection plates joined by inlaid
             brass seams. Hover / keyboard-focus a plate and it widens and steps
             forward in real 3D while the other plates cool, blur and recede —
             pure CSS, no scroll-jacking, no JS per-frame work. ── */}
      <div className="hidden lg:block mt-[clamp(28px,4vw,60px)]">
        <Shell>
          <div className="flex items-end justify-between gap-6">
            <div>
              <Reveal>
                <Eyebrow>The collections</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="display mt-4 text-[clamp(2.3rem,3.6vw,3.4rem)] leading-[0.98] text-bitumen">
                  {NUM_WORD[count] ?? count} houses,{" "}
                  <span className="text-leaf">one maison.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={140}>
              <Link
                href="/collections"
                className="link-draw pb-1 text-[0.68rem] uppercase tracking-wide3 text-bitumen"
              >
                All collections →
              </Link>
            </Reveal>
          </div>

          <div className="crow mt-[clamp(26px,3vw,44px)] flex overflow-hidden rounded-[1.5rem] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_30px_66px_-34px_rgba(34,26,12,0.42)]">
            {HOUSES.map((h, i) => (
              <Link
                key={h.slug}
                href={`/collections?house=${h.slug}`}
                data-lit
                aria-label={`${h.name} — ${h.material}, ${h.count} pieces`}
                className="chouse relative block min-w-0 flex-1"
              >
                {/* inlaid brass seam — every plate but the last */}
                {i < count - 1 && <span aria-hidden className="chouse-seam" />}

                <div className="chouse-lift burnish relative h-full overflow-hidden">
                  {h.cover ? (
                    <Image
                      src={h.cover}
                      alt={`${h.name} — ${h.material}`}
                      fill
                      sizes="(min-width:1024px) 46vw, 20vw"
                      className="chouse-cover object-cover"
                    />
                  ) : (
                    h.art && (
                      <div aria-hidden className="absolute inset-0 grid place-items-center p-[14%]">
                        <SpecimenArt
                          shape={h.art.shape}
                          tone={h.art.tone}
                          seed={`cab-${h.slug}`}
                          className="chouse-cover h-full w-full opacity-90 drop-shadow-[0_20px_30px_rgba(34,26,12,0.32)]"
                        />
                      </div>
                    )
                  )}

                  {/* scrim keeps the name legible over any photo */}
                  <span aria-hidden className="chouse-scrim absolute inset-0" />

                  {/* the ONLY label — big uppercase, vertical at rest, swings horizontal on hover */}
                  <h3 className="chouse-name">{h.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </Shell>
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
            className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-[60vw] -translate-x-1/2 transition-opacity duration-700"
            style={{ background: `radial-gradient(ellipse at center, ${GLOW[collections[mCard]?.tone ?? "brass"]}, transparent 70%)`, opacity: 0.45 }}
          />

          <div
            className="flex"
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
            {collections.map((c, i) => {
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
                  <CollectionCard c={c} active={i === mCard} />
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
                disabled={mCard === collections.length - 1}
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
              {collections.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`View ${collections[i].name}`}
                  className="flex h-8 items-center"
                >
                  <span
                    style={{
                      display: "block",
                      width: mCard === i ? 28 : 8,
                      height: 2,
                      borderRadius: 1,
                      background: mCard === i ? "var(--brass-leaf)" : "rgba(176,145,92,0.3)",
                      transition: "width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.35s ease",
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Counter */}
            <div className="flex items-baseline gap-1 text-[0.58rem] uppercase tracking-wider2 text-ash">
              <span className="font-display text-[1.15rem] leading-none text-bitumen">
                {String(mCard + 1).padStart(2, "0")}
              </span>
              <span className="mx-0.5">/</span>
              <span>{String(collections.length).padStart(2, "0")}</span>
            </div>

          </div>
        </Shell>
      </Section>
    </>
  );
}
