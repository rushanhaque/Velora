"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { COLLECTIONS, specimensByCollection } from "@/lib/data";
import { Specimen as SpecimenArt } from "@/components/visual/Specimen";
import { Shell } from "@/components/ui/Section";

// ── tone palette ──────────────────────────────────────────────────────────────
const GLOW: Record<string, string> = {
  brass:  "rgba(200,167,101,0.30)",
  copper: "rgba(207,126,82,0.26)",
  silver: "rgba(214,215,218,0.28)",
  bronze: "rgba(156,122,68,0.26)",
};
const HUE: Record<string, string> = {
  brass:  "#c8a765",
  copper: "#cf7e52",
  silver: "#9fa0a1",
  bronze: "#9c7a44",
};

const EASE = "cubic-bezier(0.7,0,0.2,1)";
const DUR  = "720ms";

const HOUSES = COLLECTIONS.map((c) => ({
  ...c,
  art: specimensByCollection(c.slug)[0],
}));

// ── Root ──────────────────────────────────────────────────────────────────────
export function CollectionLanding() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      {/* Desktop — full-height horizontal accordion */}
      <div
        className="hidden h-[calc(100svh-80px)] min-h-[540px] w-full lg:flex"
        onMouseLeave={() => setActive(null)}
      >
        {HOUSES.map((h, i) => (
          <Strip
            key={h.slug}
            h={h}
            i={i}
            active={active}
            onEnter={() => setActive(i)}
          />
        ))}
      </div>

      {/* Mobile / tablet — immersive vertical houses */}
      <div className="lg:hidden">
        <Shell>
          {/* Editorial header */}
          <div className="pt-5 pb-9">
            <span className="eyebrow inline-flex items-center gap-3 text-brass-deep">
              <span className="h-px w-7 bg-current opacity-50" aria-hidden="true" />
              The Collections
            </span>
            <h1 className="display mt-5 text-[clamp(2.4rem,11vw,3.6rem)] leading-[0.98] text-bitumen">
              Four houses
              <br />
              <span className="text-leaf">of metal.</span>
            </h1>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-stone">
              Lighting, decor, kitchenware and accessories — each piece raised by hand
              in Moradabad, made to order for the world&apos;s finest interiors.
            </p>
          </div>

          {/* House panels */}
          <div className="grid gap-5 pb-[clamp(48px,14vw,90px)] sm:grid-cols-2">
            {HOUSES.map((h, i) => (
              <MobileHouse key={h.slug} h={h} i={i} />
            ))}
          </div>
        </Shell>
      </div>
    </>
  );
}

// ── Mobile house panel ──────────────────────────────────────────────────────────
function MobileHouse({ h, i }: { h: (typeof HOUSES)[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/collections?house=${h.slug}`}
        className="group relative flex min-h-[56svh] flex-col justify-end overflow-hidden rounded-xl2 border border-stone/10 p-7 sm:min-h-[420px] active:scale-[0.99] transition-transform duration-300"
        style={{
          background: `radial-gradient(125% 80% at 50% 0%, ${GLOW[h.tone]}, transparent 55%),
                       linear-gradient(180deg, #faf9f5 0%, #ece8df 100%)`,
        }}
      >
        {/* Ghost numeral */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 font-display leading-none"
          style={{ fontSize: "min(46vw,260px)", color: HUE[h.tone], opacity: 0.07 }}
        >
          {h.index}
        </span>

        {/* Specimen art */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[62%] items-center justify-center p-10">
          {h.art && (
            <SpecimenArt
              shape={h.art.shape}
              tone={h.art.tone}
              seed={`clm-${h.slug}`}
              className="h-full w-full drop-shadow-[0_22px_38px_rgba(34,26,12,0.20)] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          )}
        </div>

        {/* Grain */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.015,
            mixBlendMode: "multiply",
          }}
        />

        {/* Top label row */}
        <div className="absolute inset-x-7 top-6 flex items-center justify-between">
          <span className="font-display text-[0.62rem] tracking-[0.24em]" style={{ color: HUE[h.tone] }}>
            {h.index}
          </span>
          <span className="text-[0.5rem] uppercase tracking-wider2 text-ash">
            {h.count}&thinsp;pcs
          </span>
        </div>

        {/* Bottom content */}
        <div className="relative z-10">
          <h2 className="font-display text-[clamp(1.9rem,7vw,2.5rem)] leading-[0.95] text-bitumen">
            {h.name}
          </h2>
          <p className="mt-2 text-[0.56rem] uppercase tracking-wider2" style={{ color: HUE[h.tone] }}>
            {h.material} · {h.tagline}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-wide3 text-bitumen">
            <span style={{ borderBottom: `1px solid ${HUE[h.tone]}`, paddingBottom: "1px" }}>
              Enter the house
            </span>
            <span className="transition-transform duration-500 group-hover:translate-x-1" style={{ color: HUE[h.tone] }}>
              →
            </span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Strip ─────────────────────────────────────────────────────────────────────
function Strip({
  h, i, active, onEnter,
}: {
  h: (typeof HOUSES)[0];
  i: number;
  active: number | null;
  onEnter: () => void;
}) {
  const isActive = active === i;
  const isOther  = active !== null && !isActive;

  const [cx, setCx] = useState(50);
  const [cy, setCy] = useState(40);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: i * 0.09, ease: [0.7, 0, 0.2, 1] }}
      className="relative h-full"
      style={{
        flex:       isActive ? "0 0 54%" : isOther ? "0 0 15.33%" : "0 0 25%",
        transition: `flex ${DUR} ${EASE}`,
      }}
    >
      <Link
        href={`/collections?house=${h.slug}`}
        onMouseEnter={onEnter}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setCx(((e.clientX - r.left) / r.width)  * 100);
          setCy(((e.clientY - r.top)  / r.height) * 100);
        }}
        className="group relative flex h-full flex-col justify-between overflow-hidden border-r border-stone/10 last:border-r-0"
      >
        {/* Ground */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(130% 90% at 50% 0%, ${GLOW[h.tone]}, transparent 55%),
                         linear-gradient(180deg, #faf9f5 0%, #ece8df 100%)`,
          }}
        />

        {/* Cursor halo */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: `radial-gradient(320px at ${cx}% ${cy}%, ${GLOW[h.tone]}, transparent 68%)`,
            opacity:    isActive ? 1 : 0,
            transition: "opacity 600ms",
          }}
        />

        {/* Top ignite line */}
        <div
          className="absolute inset-x-0 top-0 z-20 h-px origin-center"
          style={{
            background: `linear-gradient(90deg, transparent, ${HUE[h.tone]} 35%, ${HUE[h.tone]} 65%, transparent)`,
            transform:  isActive ? "scaleX(1)" : "scaleX(0)",
            opacity:    isActive ? 0.9 : 0,
            transition: `transform ${DUR} ${EASE}, opacity 400ms`,
          }}
        />

        {/* Ghost numeral */}
        <div
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
          aria-hidden="true"
        >
          <span
            className="font-display leading-none"
            style={{
              fontSize:   isActive ? "min(24vw,300px)" : isOther ? "min(7vw,80px)" : "min(11vw,136px)",
              color:      HUE[h.tone],
              opacity:    isActive ? 0.042 : isOther ? 0.035 : 0.085,
              transition: `font-size ${DUR} ${EASE}, opacity 500ms`,
            }}
          >
            {h.index}
          </span>
        </div>

        {/* Art piece — subtle parallax tilt on active */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            padding:    isActive ? "10% 12%" : isOther ? "20% 32%" : "14% 22%",
            opacity:    isOther ? 0.2 : 1,
            transition: `padding ${DUR} ${EASE}, opacity 500ms`,
          }}
        >
          <div
            className="h-full w-full"
            style={{
              transform:  isActive
                ? `perspective(900px) rotateX(${(cy - 50) * -0.045}deg) rotateY(${(cx - 50) * 0.065}deg)`
                : "none",
              transition: isActive ? "transform 90ms linear" : `transform 800ms ${EASE}`,
            }}
          >
            {h.art && (
              <SpecimenArt
                shape={h.art.shape}
                tone={h.art.tone}
                seed={`cl-${h.slug}`}
                className="h-full w-full drop-shadow-[0_28px_44px_rgba(34,26,12,0.22)]"
              />
            )}
          </div>
        </div>

        {/* Noise grain — metallic surface feel */}
        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity:         isActive ? 0.016 : 0.011,
            transition:      "opacity 700ms",
            mixBlendMode:    "multiply" as const,
          }}
        />

        {/* Top label row */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-8 sm:pt-8">
          <span
            className="font-display text-[0.58rem] tracking-[0.22em]"
            style={{ color: isActive ? HUE[h.tone] : "#b4a88a", transition: "color 500ms" }}
          >
            {h.index}
          </span>
          <span
            className="text-[0.48rem] uppercase tracking-wider2"
            style={{
              color:      "#a89d82",
              opacity:    isOther ? 0 : isActive ? 1 : 0.75,
              transition: "opacity 400ms",
            }}
          >
            {h.count}&thinsp;pcs
          </span>
        </div>

        {/* Bottom content */}
        <div className="relative z-10 px-6 pb-8 sm:px-8">

          {/* Collapsed: name visible when idle, vertical text when other */}
          <div
            style={{
              overflow:   "hidden",
              maxHeight:  isActive ? "0px" : "200px",
              opacity:    isActive ? 0 : 1,
              transition: `max-height 600ms ${EASE}, opacity 300ms`,
            }}
          >
            <h3
              className="font-display text-bitumen"
              style={{
                fontSize:     isOther ? "0.68rem" : "clamp(1.1rem, 2.2vw, 1.7rem)",
                lineHeight:   1,
                writingMode:  isOther ? "vertical-rl" : "horizontal-tb",
                transform:    isOther ? "rotate(180deg)" : "none",
                letterSpacing: "0.02em",
              }}
            >
              {h.name}
            </h3>
            <p
              className="mt-2 text-[0.52rem] uppercase tracking-wider2"
              style={{
                color:      HUE[h.tone],
                opacity:    isOther ? 0 : 1,
                transition: "opacity 300ms",
              }}
            >
              {h.material}
            </p>
          </div>

          {/* Expanded: full info */}
          <div
            style={{
              overflow:   "hidden",
              maxHeight:  isActive ? "300px" : "0px",
              opacity:    isActive ? 1 : 0,
              transition: `max-height 700ms ${EASE}, opacity 500ms ${isActive ? "160ms" : "0ms"}`,
            }}
          >
            <h3
              className="font-display leading-[0.92] text-bitumen"
              style={{ fontSize: "clamp(1.9rem, 3.1vw, 2.7rem)" }}
            >
              {h.name}
            </h3>
            <p
              className="mt-2 text-[0.54rem] uppercase tracking-wider2"
              style={{ color: HUE[h.tone] }}
            >
              {h.material} · {h.tagline}
            </p>
            <p className="mt-3.5 text-[0.74rem] leading-relaxed text-stone [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
              {h.blurb}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-[0.58rem] uppercase tracking-wide3 text-bitumen">
              <span style={{ borderBottom: `1px solid ${HUE[h.tone]}`, paddingBottom: "1px" }}>
                Enter the house
              </span>
              <span
                className="transition-transform duration-500 group-hover:translate-x-1"
                style={{ color: HUE[h.tone] }}
              >
                →
              </span>
            </span>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
