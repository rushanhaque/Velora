"use client";

import Image from "@/components/ui/SiteImage";
import { mediaUrl } from "@/lib/media-url";
import { useEffect, useState } from "react";
import type { Specimen } from "@/lib/data";
import { Specimen as SpecimenArt } from "./Specimen";
import { cn } from "@/lib/utils";

/**
 * Renders a piece's imagery with graceful degradation:
 *   video → image → hand-built SVG art.
 * Product photos/video are added manually (see /public/media/README.md);
 * until then the SVG renders so the grid is never empty or broken.
 */
export function SpecimenMedia({
  s,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  rounded = false,
}: {
  s: Specimen;
  className?: string;
  sizes?: string;
  priority?: boolean;
  rounded?: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const [vidFailed, setVidFailed] = useState(false);

  useEffect(() => { setImgFailed(false); setVidFailed(false); }, [s.image, s.video]);

  const radius = rounded ? "rounded-card" : "";

  if (s.video && !vidFailed) {
    return (
      <video
        className={cn("absolute inset-0 h-full w-full object-cover", radius, className)}
        src={mediaUrl(s.video)}
        autoPlay
        muted
        loop
        playsInline
        poster={s.poster || s.image ? mediaUrl((s.poster ?? s.image)!) : undefined}
        aria-label={`${s.name} — ${s.material}`}
        onError={() => setVidFailed(true)}
      />
    );
  }

  if (s.image && !imgFailed) {
    return (
      <Image
        src={s.image}
        alt={`${s.name} — ${s.material}`}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setImgFailed(true)}
        className={cn("object-cover", radius, className)}
      />
    );
  }

  // Fallback — the bespoke SVG specimen, centred on the studio ground.
  return (
    <div className="absolute inset-0 grid place-items-center p-8">
      <SpecimenArt
        shape={s.shape}
        tone={s.tone}
        seed={s.slug}
        className="h-full w-full drop-shadow-[0_24px_30px_rgba(34,26,12,0.22)]"
      />
    </div>
  );
}
