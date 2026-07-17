"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Specimen, Collection } from "@/lib/data";
import { FINISHES, hasMedia } from "@/lib/data";
import { SpecimenStage } from "@/components/visual/SpecimenStage";
import { SpecimenMedia } from "@/components/visual/SpecimenMedia";
import { Button } from "@/components/ui/Button";
import { Mark } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { MaskText } from "@/components/motion/MaskText";
import { SILK } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { enquiry, useInEnquiry, cartPanel } from "@/lib/enquiry";

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
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
      {/* Stage */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <motion.div
          initial={{ opacity: 0, scale: 1.06, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: SILK }}
          data-lit
          className="plate group/stage group overflow-hidden rounded-xl2 transition-shadow duration-700 hover:shadow-glow-warm lg:mx-auto lg:w-fit"
        >
          <div
            className={cn("relative transition-transform duration-[1.2s] ease-silk group-hover/stage:scale-[1.04]", hasMedia(s) && "aspect-[4/5] lg:h-[min(72svh,600px)] lg:w-auto")}
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
            {finish && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                <span className="rounded-full border border-line bg-parchment-pale/70 px-4 py-1.5 text-[0.6rem] uppercase tracking-wider2 text-stone backdrop-blur">
                  {finish}
                </span>
              </div>
            )}
            {/* maker's hallmark — stamps in on hover */}
            <span aria-hidden="true" className="hallmark absolute bottom-5 right-5 text-brass-deep">
              <Mark className="h-6 w-6" />
            </span>
          </div>
        </motion.div>

        {/* Optional gallery — extra stills the user dropped in */}
        {s.gallery && s.gallery.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {s.gallery.slice(0, 3).map((src, i) => (
              <div
                key={i}
                className="plate relative aspect-[4/5] overflow-hidden rounded-card"
              >
                <Image
                  src={src}
                  alt={`${s.name} — view ${i + 2}`}
                  fill
                  sizes="(max-width: 1024px) 33vw, 16vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Details */}
      <div>
        <Reveal>
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.62rem] uppercase tracking-wider2 text-ash">
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
          className="display mt-4 text-[clamp(2rem,4.4vw,3.3rem)] text-bitumen"
          lines={[s.name]}
        />

        <Reveal delay={160}>
          <p className="mt-5 max-w-prose2 leading-relaxed text-stone">{s.story}</p>
        </Reveal>

        {/* Finish selector — only for pieces with a metal finish */}
        {s.finish && (
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
                    "group flex items-center gap-2.5 rounded-full border py-2 pl-1.5 pr-4 transition-all duration-500 ease-silk",
                    finish === f.name
                      ? "border-brass"
                      : "border-line hover:border-brass/50",
                  )}
                >
                  <span
                    className="h-6 w-6 rounded-full ring-1 ring-bitumen/10 transition-transform duration-500 ease-silk group-hover:scale-110"
                    style={{ background: f.swatch }}
                  />
                  <span className="text-[0.72rem] tracking-wide text-stone">{f.name}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        )}

        {/* Spec table */}
        <Reveal delay={240}>
          <dl className="mt-7 grid grid-cols-1 gap-y-0 border-t border-line pt-2 sm:grid-cols-2 sm:gap-x-8">
            {([
              ["Material", s.material],
              ["Collection", collection?.name],
              ["Category", s.subcategory],
              ["Finish", s.finish],
              ["Reference", s.ref],
              ["Craft", "Handmade to order"],
            ].filter((row): row is [string, string] => Boolean(row[1]))).map(([k, v], i) => (
              <Reveal key={k} delay={i * 40}>
                <div className="group/spec py-3 border-b border-line/50 transition-colors duration-500 hover:border-brass/40">
                  <dt className="text-[0.58rem] uppercase tracking-wider2 text-ash transition-colors duration-500 group-hover/spec:text-brass-deep">
                    {k}
                  </dt>
                  <dd
                    className={cn(
                      "mt-1.5 text-bitumen",
                      k === "Craft"
                        ? "font-sans text-[0.9rem] font-light tracking-wide"
                        : "font-display text-lg",
                    )}
                  >
                    {v}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Reveal>

        {/* CTA */}
        <Reveal delay={280}>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Button
              variant={added ? "outline" : "solid"}
              arrow={!added}
              onClick={() => enquiry.toggle(s.slug)}
            >
              {added ? "Added to cart ✓" : "Add to cart"}
            </Button>
            {added && (
              <Button variant="link" arrow onClick={() => cartPanel.open()}>
                View cart
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
