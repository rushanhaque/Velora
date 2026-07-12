import Link from "next/link";
import type { Specimen } from "@/lib/data";
import { SpecimenMedia } from "@/components/visual/SpecimenMedia";
import { TiltCard } from "@/components/motion/TiltCard";
import { EnquiryToggle } from "@/components/ui/EnquiryToggle";
import { Mark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const TONE_DOT: Record<string, string> = {
  brass: "bg-[#c8a765]",
  copper: "bg-[#cf7e52]",
  silver: "bg-[#d9dadb]",
  bronze: "bg-[#9c7a44]",
};

export function SpecimenCard({
  s,
  index = 0,
  className,
  showCaption = false,
}: {
  s: Specimen;
  index?: number;
  className?: string;
  /** Show a static name/material caption below the frame (shopping grids). */
  showCaption?: boolean;
}) {
  return (
    <TiltCard className={cn("h-full", className)} max={5}>
      <Link
        href={`/collections/${s.slug}`}
        data-cursor="link"
        data-lit
        className="plate depth-card group flex h-full flex-col overflow-hidden rounded-card"
      >
        {/* Studio frame */}
        <div className="burnish relative aspect-[4/5] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 18%, #fcfbf7 0%, #f7f4ee 46%, #e6e0d3 100%)",
            }}
          />
          {/* floor shadow line */}
          <div className="absolute inset-x-8 bottom-[20%] h-px bg-bitumen/5" />
          <div className="absolute inset-0">
            <SpecimenMedia
              s={s}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>

          {/* ref tag */}
          <span className="ref absolute left-4 top-4 text-stone/70">{s.ref}</span>

          {/* add-to-enquiry */}
          <EnquiryToggle slug={s.slug} name={s.name} className="absolute right-3.5 top-3.5" />

          {/* maker's hallmark — stamps in on hover, like a die striking */}
          <span aria-hidden="true" className="hallmark absolute bottom-3.5 right-3.5 text-brass-deep">
            <Mark className="h-5 w-5" />
          </span>


        </div>

        {showCaption && (
          <div className="flex flex-1 flex-col px-3 pb-3.5 pt-3 sm:px-5 sm:pb-5 sm:pt-3.5">
            <h3 className="font-display text-[0.98rem] leading-tight text-bitumen sm:text-xl">
              {s.name}
            </h3>
            <p className="mt-1 text-[0.6rem] uppercase tracking-wider2 text-ash sm:text-[0.62rem]">
              {s.material}
            </p>
          </div>
        )}
      </Link>
    </TiltCard>
  );
}
