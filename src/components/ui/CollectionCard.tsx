import Link from "next/link";
import Image from "next/image";
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
  active = false,
}: {
  c: Collection;
  className?: string;
  /** Centre card of the mobile carousel — phones never hover, so the active
   *  card carries the hover treatment (glow, light-catch, brighter numeral). */
  active?: boolean;
}) {
  const hero = specimensByCollection(c.slug)[0];

  return (
    <TiltCard max={4} className={cn("h-full", className)}>
      <Link
        href={`/collections?house=${c.slug}`}
        data-cursor="link"
        data-lit
        className="plate depth-card group relative flex h-full flex-col overflow-hidden rounded-xl2"
      >
        {/* index numeral */}
        <span
          className={cn(
            "numeral pointer-events-none absolute right-6 top-4 z-10 text-[clamp(3rem,7vw,5.5rem)] transition-colors duration-700 group-hover:text-brass/25",
            active ? "text-brass/25" : "text-brass/12",
          )}
        >
          {c.index}
        </span>

        {/* v3.0 — decorative corner accent */}
        <div aria-hidden="true" className="absolute right-4 top-4 z-20 h-8 w-8 text-brass-leaf opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M32 0H0v1h31v31h1V0z" strokeDasharray="64" strokeDashoffset="64" className="group-hover:animate-draw-in" />
          </svg>
        </div>

        <div className="burnish relative aspect-[16/8] overflow-hidden">
          {/* base ground */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 100% at 50% 12%, ${GLOW[c.tone]}, transparent 60%), linear-gradient(180deg,#fcfbf7,#efeae0)`,
            }}
          />
          {/* underglow blooms beneath the piece as it lifts */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 transition-opacity duration-[800ms] ease-silk group-hover:opacity-100",
              active ? "opacity-100" : "opacity-0",
            )}
            style={{ background: `radial-gradient(80% 66% at 50% 46%, ${GLOW[c.tone]}, transparent 66%)` }}
          />
          {c.cover ? (
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={c.cover}
                alt={`${c.name} — ${c.material}`}
                fill
                sizes="(max-width: 1024px) 84vw, 33vw"
                className={cn(
                  "object-cover transition-[filter,transform] duration-[800ms] ease-silk group-hover:brightness-[1.05]",
                  active ? "scale-[1.03] brightness-[1.05]" : "scale-100",
                )}
              />
            </div>
          ) : (
            hero && (
              // Parallax levitation: the piece floats up out of its vitrine, casting a deeper shadow
              <div className="absolute inset-0 grid place-items-center p-6 transition-transform duration-[850ms] ease-silk will-change-transform group-hover:-translate-y-[14px]">
                <SpecimenArt
                  shape={hero.shape}
                  tone={hero.tone}
                  seed={`col-${hero.slug}`}
                  className="h-full w-full drop-shadow-[0_22px_28px_rgba(34,26,12,0.22)] transition-[filter] duration-[850ms] ease-silk group-hover:drop-shadow-[0_46px_56px_rgba(34,26,12,0.42)]"
                />
              </div>
            )
          )}
          {/* brass light-catch draws along the lower edge */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-6 bottom-0 h-px origin-center transition-transform duration-[700ms] ease-silk group-hover:scale-x-100",
              active ? "scale-x-100" : "scale-x-0",
            )}
            style={{ background: "linear-gradient(90deg, transparent, rgba(200,167,101,0.9), transparent)" }}
          />
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
