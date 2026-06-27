import type { ReactNode } from "react";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Atoms";
import { Shell } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  titleLines,
  intro,
  aside,
  align = "left",
  className,
}: {
  eyebrow: string;
  titleLines: ReactNode[];
  intro?: ReactNode;
  aside?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden pb-[clamp(48px,7vw,84px)] pt-[clamp(150px,18vw,230px)]",
        className,
      )}
    >
      {/* v3.0 — layered ambient gradient backgrounds */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 60% at 78% 8%, #fcfbf7 0%, rgba(250,246,238,0) 58%), radial-gradient(50% 50% at 20% 80%, rgba(239,234,224,0.5) 0%, transparent 60%)",
        }}
      />

      {/* v3.0 — decorative engraved guideline */}
      <div
        aria-hidden="true"
        className="absolute right-[10%] top-1/2 -z-10 hidden h-[130%] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-brass/10 to-transparent lg:block"
      />

      {/* v3.0 — large faint ornamental mark */}
      <div aria-hidden="true" className="ornamental-mark -z-10 right-[5%] top-1/2 -translate-y-1/2 hidden lg:block">
        <svg viewBox="0 0 200 200" className="h-[320px] w-[320px]" fill="none" stroke="rgba(176,145,92,0.08)" strokeWidth="0.8">
          <rect x="100" y="8" width="130" height="130" transform="rotate(45 100 8)" rx="2" />
          <rect x="100" y="28" width="100" height="100" transform="rotate(45 100 28)" rx="2" />
          <circle cx="100" cy="100" r="50" />
          <circle cx="100" cy="100" r="30" strokeDasharray="2 6" />
        </svg>
      </div>

      <Shell>
        <div
          className={cn(
            "grid gap-10",
            aside ? "lg:grid-cols-[1.3fr_0.7fr] lg:items-end" : "",
            align === "center" && "text-center",
          )}
        >
          <div className={cn(align === "center" && "mx-auto max-w-4xl")}>
            <Reveal variant="blur">
              <Eyebrow className={cn(align === "center" && "justify-center")}>
                {eyebrow}
              </Eyebrow>
            </Reveal>
            <MaskText
              as="h1"
              className="display mt-7 text-[clamp(2.7rem,7vw,6rem)] text-bitumen"
              lines={titleLines}
            />
            {intro && (
              <Reveal delay={150}>
                <p
                  className={cn(
                    "mt-8 max-w-xl text-lg leading-relaxed text-stone",
                    align === "center" && "mx-auto",
                  )}
                >
                  {intro}
                </p>
              </Reveal>
            )}
          </div>
          {aside && (
            <Reveal delay={220} className="lg:pb-2">
              {aside}
            </Reveal>
          )}
        </div>
      </Shell>

      {/* v3.0 — bottom gradient blend */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-parchment/50 to-transparent"
      />
    </header>
  );
}
