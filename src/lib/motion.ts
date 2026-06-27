import type { Variants } from "framer-motion";

/** Velora's house easing — a slow, confident settle (cubic-bezier). */
export const SILK = [0.16, 1, 0.3, 1] as [number, number, number, number];
export const EASE2 = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** A line of display text rising from a clip-mask. */
export const maskLine: Variants = {
  hidden: { y: "115%" },
  show: (i: number = 0) => ({
    y: "0%",
    transition: { duration: 1, ease: SILK, delay: 0.08 * i },
  }),
};

/** Soft rise-and-fade for blocks. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: SILK, delay: 0.07 * i },
  }),
};

/** Stagger container. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/** Blur-to-sharp emergence, like metal coming into focus. */
export const focusIn: Variants = {
  hidden: { opacity: 0, filter: "blur(14px)", scale: 1.04 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 1.2, ease: SILK },
  },
};

/** Scale-in for media within a frame. */
export const scaleIn: Variants = {
  hidden: { scale: 1.16 },
  show: { scale: 1, transition: { duration: 1.4, ease: SILK } },
};

export const viewportOnce = { once: true, amount: 0.35 } as const;
