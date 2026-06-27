import Link from "next/link";
import type { Specimen } from "@/lib/data";
import { SpecimenMedia } from "@/components/visual/SpecimenMedia";
import { TiltCard } from "@/components/motion/TiltCard";
import { EnquiryToggle } from "@/components/ui/EnquiryToggle";
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
        className="plate depth-card group flex h-full flex-col overflow-hidden rounded-card"
      >
        {/* Studio frame */}
        <div className="burnish relative aspect-[8/9] overflow-hidden">
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
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          {/* ref tag */}
          <span className="ref absolute left-4 top-4 text-stone/70">{s.ref}</span>

          {/* add-to-enquiry */}
          <EnquiryToggle slug={s.slug} name={s.name} className="absolute right-3.5 top-3.5" />


        </div>

        {showCaption && (
          <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5">
            <h3 className="font-display text-[1.15rem] leading-tight text-bitumen sm:text-xl">
              {s.name}
            </h3>
            <p className="mt-1 text-[0.62rem] uppercase tracking-wider2 text-ash">
              {s.material}
            </p>
          </div>
        )}
      </Link>
    </TiltCard>
  );
}
