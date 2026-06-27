"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Specimen, Collection } from "@/lib/data";
import { FINISHES, hasMedia } from "@/lib/data";
import { SpecimenStage } from "@/components/visual/SpecimenStage";
import { SpecimenMedia } from "@/components/visual/SpecimenMedia";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { MaskText } from "@/components/motion/MaskText";
import { SILK } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { enquiry, useInEnquiry } from "@/lib/enquiry";

const TONE_GLOW: Record<string, string> = {
  brass: "rgba(200,167,101,0.24)",
  copper: "rgba(207,126,82,0.22)",
  silver: "rgba(220,221,222,0.24)",
  bronze: "rgba(156,122,68,0.22)",
};

export function SpecimenDetail({
  s,
  collection,
}: {
  s: Specimen;
  collection?: Collection;
}) {
  const [finish, setFinish] = useState(s.finish);
  const added = useInEnquiry(s.slug);

  const finishOptions = FINISHES.filter(
    (f) => f.name === s.finish || ["Mirror-burnished", "Satin", "Antiqued"].includes(f.name),
  );

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      {/* Stage */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <motion.div
          initial={{ opacity: 0, scale: 1.06, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: SILK }}
          className="plate group/stage overflow-hidden rounded-xl2 transition-shadow duration-700 hover:shadow-glow-warm"
        >
          <div
            className={cn("relative transition-transform duration-[1.2s] ease-silk group-hover/stage:scale-[1.04]", hasMedia(s) && "aspect-[4/5]")}
            style={{
              background:
                "radial-gradient(110% 80% at 50% 16%, #fcfbf7, #efeae0)",
            }}
          >
            {hasMedia(s) ? (
              <SpecimenMedia s={s} priority sizes="(max-width: 1024px) 100vw, 50vw" />
            ) : (
              <SpecimenStage
                shape={s.shape}
                tone={s.tone}
                seed={`detail-${s.slug}`}
                glow={TONE_GLOW[s.tone]}
                className="mx-auto max-w-[30rem] p-6"
              />
            )}
            <span className="ref absolute left-5 top-5 text-stone/70">{s.ref}</span>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
              <span className="rounded-full border border-line bg-parchment-pale/70 px-4 py-1.5 text-[0.6rem] uppercase tracking-wider2 text-stone backdrop-blur">
                {finish}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Optional gallery — extra stills the user dropped in */}
        {s.gallery && s.gallery.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {s.gallery.slice(0, 3).map((src, i) => (
              <div
                key={i}
                className="plate relative aspect-square overflow-hidden rounded-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${s.name} — view ${i + 2}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-3">
          {["Hand-raised", "One maker", "Made to order"].map((t) => (
            <span
              key={t}
              className="rounded-card border border-line bg-parchment-pale px-3 py-3 text-center text-[0.6rem] uppercase tracking-wider2 text-stone"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Details */}
      <div>
        <Reveal>
          <nav className="flex items-center gap-2 text-[0.62rem] uppercase tracking-wider2 text-ash">
            <Link href="/collections" className="link-draw hover:text-bitumen">
              Collections
            </Link>
            <span>/</span>
            {collection && (
              <>
                <Link
                  href={`/collections?house=${collection.slug}`}
                  className="link-draw hover:text-bitumen"
                >
                  {collection.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-brass-deep">{s.name}</span>
          </nav>
        </Reveal>

        <MaskText
          as="h1"
          className="display mt-6 text-[clamp(2.4rem,5.5vw,4rem)] text-bitumen"
          lines={[s.name]}
        />

        <Reveal delay={120}>
          <p className="mt-3 text-sm uppercase tracking-wide3 text-brass-deep">
            {s.material} · {s.price}
          </p>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-7 max-w-prose2 leading-relaxed text-stone">{s.story}</p>
        </Reveal>

        {/* Finish selector */}
        <Reveal delay={200}>
          <div className="mt-9">
            <p className="text-[0.6rem] uppercase tracking-wider2 text-ash">Finish</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {finishOptions.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setFinish(f.name)}
                  data-cursor="link"
                  className={cn(
                    "group flex items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 transition-all duration-500 ease-silk",
                    finish === f.name
                      ? "border-brass"
                      : "border-line hover:border-brass/50",
                  )}
                >
                  <span
                    className="h-6 w-6 rounded-full ring-1 ring-bitumen/10"
                    style={{ background: f.swatch }}
                  />
                  <span className="text-[0.72rem] tracking-wide text-stone">{f.name}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Spec table */}
        <Reveal delay={240}>
          <dl className="mt-10 grid grid-cols-1 gap-y-0 border-t border-line pt-2 sm:grid-cols-2 sm:gap-x-8">
            {[
              ["Material", s.material],
              ["Dimensions", s.dims],
              ["Lead time", s.leadTime],
              ["Edition", s.edition],
              ["Made by", s.maker],
              ["Introduced", String(s.year)],
            ].map(([k, v], i) => (
              <Reveal key={k} delay={i * 40}>
                <div className="py-4 border-b border-line/50">
                  <dt className="text-[0.58rem] uppercase tracking-wider2 text-ash">{k}</dt>
                  <dd className="mt-1.5 font-display text-lg text-bitumen">{v}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Reveal>

        {/* CTA */}
        <Reveal delay={280}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              variant={added ? "outline" : "solid"}
              arrow={!added}
              magnetic
              onClick={() => enquiry.toggle(s.slug)}
            >
              {added ? "Added to cart ✓" : "Add to cart"}
            </Button>
            <Button href={added ? "/cart" : "/connect"} variant="link" arrow>
              {added ? "View cart" : "Enquire"}
            </Button>
          </div>
          <p className="mt-6 text-[0.66rem] uppercase tracking-wider2 text-ash">
            MOQ 6 pieces · Trade price on application · Spec sheet (PDF) on request
          </p>
        </Reveal>
      </div>
    </div>
  );
}
