# Velora International — _Métaux d'Art_

A high-end marketing & catalogue site for **Velora International** — a (fictional,
demo) trade atelier of hand-raised heirloom metalware in Moradabad, India: brass,
bronze, copper and silver, made to order since 1972.

Built as a showcase of **foreign-standard, agency-grade** web design: a bespoke
**light** palette, a unified scroll-triggered motion language, self-contained SVG
product art (with a drop-in slot for your own photos/video), a working trade-enquiry
basket — all WCAG-AA, fast, and deployment-ready.

---

## Stack

| | |
|---|---|
| Framework | **Next.js 14.2** (App Router, TypeScript, RSC) |
| Styling | **Tailwind CSS 3.4** + a bespoke token layer in `globals.css` |
| Motion | **Framer Motion 11** + custom IntersectionObserver reveals (reliable everywhere) |
| Smooth scroll | **Lenis** (momentum scroll, reduced-motion aware) |
| Fonts | **Cormorant Garamond** (display) + **Jost** (UI) via `next/font` |
| Imagery | hand-built **SVG** by default; optional **photo/video** drop-in (see below) |

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (44 routes, mostly static)
npm run start    # serve the production build
```

> On Windows, don't run `next dev` and `next start` against the same `.next`
> folder at once — it corrupts the shared cache. Stop one before the other.

## Pages

| Route | Page |
|---|---|
| `/` | Home — hero, press, specimen spotlight, the maison, four houses, the craft, stats, lookbook, trade, catalogue request |
| `/collections` | The Catalogue — live filter (house + metal), **sort**, deep-linkable `?house=`, per-card "add to enquiry" |
| `/collections/[slug]` | Specimen detail — 21 pieces, finish selector, spec sheet, add-to-enquiry, related |
| `/journal` + `/journal/[slug]` | The Journal — 4 editorial pieces from the atelier |
| `/craft` | The Craft — process, pull-quote, the five stages, the metals |
| `/maison` | The Maison — heritage, five-chapter timeline, principles, ateliers |
| `/bespoke` | Bespoke & Private Label — services, commission steps, finishes, enquiry form |
| `/trade` | Trade Enquiry — trade desk, contact, open-account form |
| `/faq` | Trade FAQ — minimums, pricing, shipping, care (accessible accordions) |
| `/enquiry` | Your trade-enquiry basket (localStorage), with a single submit |
| `*` | A bespoke 404 |

Plus `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, a generated Open-Graph
image, and an SVG favicon.

## Design system

- **Palette** (`tailwind.config.ts`): airy **porcelain** grounds, a warm **bitumen**
  ink (footer / accents), a refined **champagne-gold** accent, and a **verdigris**
  grace note. Every functional text colour meets **WCAG 2.1 AA** on its ground.
- **Motion** (`src/components/motion/`): mask-up heading reveals, IntersectionObserver
  block reveals, burnish/specular sweeps, magnetic buttons, 3D tilt cards, parallax,
  count-ups, seamless marquees, film grain, route transitions, scroll-progress thread.
- **Specimen art** (`src/components/visual/Specimen.tsx`): a procedural SVG renderer
  turning each piece's `shape` + `tone` into a turned-metal studio illustration,
  with deterministic per-piece variation so no two pieces look identical.

## Adding product images & video (manual)

The site ships with SVG art so nothing is ever empty. To use real media, drop files
in `public/media/…` and point to them from `src/lib/data.ts`. Precedence per piece is
**video → image → SVG**, with automatic fallback if a file is missing.
Full guide: [`public/media/README.md`](public/media/README.md).

## Accessibility & performance

- `prefers-reduced-motion` honoured globally (CSS + JS guards); skip link;
  semantic landmarks; labelled forms; ARIA radiogroups; live success regions;
  Escape-to-close menu; visible AA focus rings (lighter on dark grounds).
- Transform/opacity-only animations, rAF-throttled scroll handlers, lazy reveals,
  `next/image` for photos; ~87 kB shared JS. No-JS fallback reveals all content.

## Deploy

1. Set `NEXT_PUBLIC_SITE_URL` to your domain (see `.env.example`) — used by the
   sitemap, robots and OG/canonical URLs.
2. Deploy to any Next.js host (Vercel recommended): `npm run build` then `npm run start`,
   or connect the repo to Vercel for zero-config builds.

> All names, figures, addresses and contact details are illustrative demo content.
