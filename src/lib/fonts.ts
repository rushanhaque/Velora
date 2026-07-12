import { Cormorant_Garamond, Jost } from "next/font/google";

/**
 * Display face — Cormorant Garamond. High-contrast garalde serif,
 * used for the maison's voice. Loaded across weights for fine control.
 */
export const display = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  // Trimmed to the weights actually used (dropped unused 300) — fewer font
  // files to download on slow connections.
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

/**
 * Working face — Jost. A geometric grotesque for eyebrows, labels,
 * navigation and specification text. Lends the "spec-sheet" precision.
 */
export const sans = Jost({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});
