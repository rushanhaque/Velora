import Link from "next/link";
import type { Collection } from "@/lib/data";
import { specimensByCollection } from "@/lib/data";
import { Specimen as SpecimenArt } from "@/components/visual/Specimen";
import { TiltCard } from "@/components/motion/TiltCard";
import { cn } from "@/lib/utils";

const GLOW: Record<string, string> = {
  brass: "rgba(200,167,101,0.22)",
  copper: "rgba(207,126,82,0.20)",
  silver: "rgba(220,221,222,0.22)",
  bronze: "rgba(156,122,68,0.20)",
};

export function CollectionCard({
  c,
  className,
}: {
  c: Collection;
  className?: string;
}) {
  const hero = specimensByCollection(c.slug)[0];

  return (
    <TiltCard max={4} className={cn("h-full", className)}>
      <Link
        href={`/collections?house=${c.slug}`}
        data-cursor="link"
        className="plate depth-card group relative flex h-full flex-col overflow-hidden rounded-xl2"
      >
        {/* index numeral */}
        <span className="numeral pointer-events-none absolute right-6 top-4 z-10 text-[clamp(3rem,7vw,5.5rem)] text-brass/12 transition-colors duration-700 group-hover:text-brass/25">
          {c.index}
        </span>

        {/* v3.0 — decorative corner accent */}
        <div aria-hidden="true" className="absolute right-4 top-4 z-20 h-8 w-8 text-brass-leaf opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M32 0H0v1h31v31h1V0z" strokeDasharray="64" strokeDashoffset="64" className="group-hover:animate-draw-in" />
          </svg>
        </div>

        <div className="burnish relative aspect-[16/8] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 100% at 50% 12%, ${GLOW[c.tone]}, transparent 60%), linear-gradient(180deg,#fcfbf7,#efeae0)`,
            }}
          />
          {c.cover ? (
            <div className="absolute inset-0 transition-transform duration-[1.1s] ease-silk group-hover:scale-[1.06]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.cover}
                alt={`${c.name} — ${c.material}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ) : (
            hero && (
              <div className="absolute inset-0 grid place-items-center p-6 transition-transform duration-[1.1s] ease-silk group-hover:scale-[1.08]">
                <SpecimenArt
                  shape={hero.shape}
                  tone={hero.tone}
                  seed={`col-${hero.slug}`}
                  className="h-full w-full drop-shadow-[0_22px_28px_rgba(34,26,12,0.22)]"
                />
              </div>
            )
          )}
        </div>

        <div className="flex flex-1 flex-col px-7 py-7">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-[2rem] leading-none text-bitumen">{c.name}</h3>
            <span className="ref text-ash">{c.count} pcs</span>
          </div>
          <p className="mt-1 text-[0.7rem] uppercase tracking-wider2 text-brass-deep">
            {c.material} · {c.tagline}
          </p>
          <p className="mt-4 text-[0.92rem] leading-relaxed text-stone">{c.blurb}</p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-[0.72rem] uppercase tracking-wide3 text-bitumen">
            <span className="link-draw">View the house</span>
            <span
              aria-hidden="true"
              className="relative ml-1 inline-block h-[1em] w-[1.1em] overflow-hidden align-middle text-brass-deep"
            >
              <span className="absolute inset-0 flex items-center transition-transform duration-500 ease-silk group-hover:translate-x-[1.4em]">
                →
              </span>
              <span className="absolute inset-0 flex -translate-x-[1.4em] items-center transition-transform duration-500 ease-silk group-hover:translate-x-0">
                →
              </span>
            </span>
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
