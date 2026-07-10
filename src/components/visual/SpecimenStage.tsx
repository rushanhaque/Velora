import type { Shape, Tone } from "@/lib/data";
import { Specimen } from "./Specimen";
import { cn } from "@/lib/utils";

/**
 * A staged presentation of a single piece — spotlight ground, a slowly
 * turning brass orbit, and the floating object. Reused across the site.
 */
export function SpecimenStage({
  shape,
  tone,
  seed,
  className,
  ring = true,
  float = true,
  glow = "rgba(176,145,92,0.20)",
}: {
  shape: Shape;
  tone: Tone;
  seed: string;
  className?: string;
  ring?: boolean;
  float?: boolean;
  glow?: string;
}) {
  return (
    <div className={cn("relative aspect-square", className)}>
      {/* spotlight */}
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${glow}, transparent 62%)`,
        }}
        aria-hidden="true"
      />

      {/* orbiting ring */}
      {ring && (
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full animate-spinSlow"
          aria-hidden="true"
        >
          <circle
            cx="200"
            cy="200"
            r="172"
            fill="none"
            stroke="rgba(167,126,54,0.32)"
            strokeWidth="1"
            strokeDasharray="2 10"
          />
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="rgba(167,126,54,0.14)"
            strokeWidth="1"
          />
        </svg>
      )}

      {/* the object */}
      <div className={cn("absolute inset-0 grid place-items-center p-[14%]", float && "animate-floaty")}>
        <Specimen
          shape={shape}
          tone={tone}
          seed={seed}
          className="h-full w-full drop-shadow-[0_40px_50px_rgba(34,26,12,0.30)]"
        />
      </div>
    </div>
  );
}
