"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * The tall collection hero. The photograph sits in an oversized layer and
 * drifts slowly against the scroll (a true parallax), so the cover feels like
 * a deep window rather than a flat banner. Reduced-motion users get a still.
 */
export function CollectionCover({
  src,
  name,
  material,
  index,
}: {
  src: string;
  name: string;
  material: string;
  index: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 0 → 1 as the hero travels from top-aligned to fully scrolled past the top.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The image is kept over-scanned (scale ≥ 1.12) so this drift never bares an edge.
  const y = useTransform(scrollYProgress, [0, 1], ["-2%", "5%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1.22]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-xl2 shadow-plate h-[clamp(300px,50vw,660px)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={src}
        alt={`${name} — ${material}`}
        style={reduce ? { scale: 1.12 } : { y, scale }}
        className="absolute inset-0 h-full w-full origin-center object-cover will-change-transform"
      />

      {/* legibility wash — deepest at the base so the chip and page title breathe */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,9,7,0.14), transparent 34%, rgba(10,9,7,0.10) 70%, rgba(10,9,7,0.44))",
        }}
      />

      <span className="absolute left-6 top-6 rounded-full border border-parchment-pale/30 bg-bitumen/20 px-4 py-1.5 text-[0.6rem] uppercase tracking-wider2 text-parchment-pale backdrop-blur">
        Collection {index}
      </span>
    </div>
  );
}
