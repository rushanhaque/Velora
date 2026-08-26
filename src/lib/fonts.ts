import { Cormorant_Garamond, Jost } from "next/font/google";

/**
 * Typography, declared as narrowly as the design actually uses it.
 *
 * next/font fetches one file per weight *per style*, so four weights across
 * roman and italic produced eight Cormorant files — thirteen woff2 in total
 * (336 KB). Auditing what the rendered page actually resolves showed most of
 * them were dead weight: italic was declared at four weights to serve one, Jost
 * 600 was never used at all, and Cormorant 600 was used by a single text node.
 *
 * It also showed a real bug. `.numeral` asks for weight 300, which was not
 * declared, so fourteen elements had been silently rendering at 400. That
 * weight is now loaded.
 *
 * Splitting italic into its own instance is what lets it be requested at one
 * weight — a single call applies its weight list to every style it declares.
 *
 * `display: "swap"` paints text in the fallback immediately rather than holding
 * first paint hostage to a font download; `adjustFontFallback` matches the
 * fallback's metrics so that swap does not visibly reflow the page.
 */

/** Display face — Cormorant Garamond, roman. 300 .numeral · 400 body · 500 .display · 700 wordmark. */
const displayRoman = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
  style: ["normal"],
  variable: "--font-display",
  adjustFontFallback: true,
});

/** Display face, italic — one weight, because every italic rule asks at 400. */
const displayItalic = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["italic"],
  variable: "--font-display-italic",
  adjustFontFallback: true,
});

/** Working face — Jost. Geometric grotesque for labels, nav and spec text. */
export const sans = Jost({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-sans",
  adjustFontFallback: true,
});

/**
 * Exposed as one object so `layout.tsx` keeps applying a single class.
 *
 * next/font gives each instance its own generated family name, so the italic
 * face is NOT reachable through `var(--font-display)` — asking for
 * `font-style: italic` there makes the browser synthesise a slanted roman
 * instead of using the real italic cut. Anything italic must therefore name
 * `var(--font-display-italic)`; the `.serif-italic` class in globals.css is the
 * single place that does, and every italic usage goes through it.
 */
export const display = {
  variable: `${displayRoman.variable} ${displayItalic.variable}`,
  className: displayRoman.className,
  style: displayRoman.style,
};
