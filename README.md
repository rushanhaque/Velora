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
| `/` | Home — hero, press, collections, signature pieces, the craft, stats, trade, catalogue request |
| `/collections` | The Catalogue — deep-linkable `?house=`, per-collection filters |
| `/collections/[slug]` | Specimen detail — spec sheet, add-to-enquiry, related pieces |
| `/about` | About the maison — heritage, process, metals |
| `/contact` | Contact & trade enquiry |
| `/faq` | Trade FAQ |
| `/admin` | **Velora CMS** — manage products, collections and photos (password-protected) |
| `*` | A bespoke 404 |

API routes: `/api/catalog` (live catalogue, read + publish), `/api/catalog/upload`
(product photos), `/api/admin/login` (session), `/api/health` (diagnostics),
`/version.json` (build ID for the freshness check).

Plus `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, a generated Open-Graph
image, and an SVG favicon.

## The CMS, and how content reaches the live site

The catalogue is **not** rebuilt into the site. It lives in Vercel Blob and is
read through `/api/catalog` on every request, so pressing **Save & publish**
shows up on the storefront within seconds — no redeploy.

```
CMS  ──photos──▶  Vercel Blob (direct from the browser)
     ──catalogue─▶  /api/catalog  ──▶  Blob  ──▶  storefront
```

**Two environment variables are required in production.** Without them nothing
the CMS saves can persist, and the site silently serves the compiled seed from
`src/lib/data.ts` instead:

| Variable | Why |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Injected by Vercel once a Blob store is **connected to the project**. Creating the store alone is not enough. |
| `ADMIN_PASSWORD` | The CMS login. There is no default — an unset value locks the CMS rather than falling back to a password committed in a public repo. |

Photos are uploaded **directly from the browser to Blob storage**, not through
the API. Vercel caps a serverless function's request body at 4.5 MB, which is
smaller than a typical phone photo; routing uploads through the function silently
killed them. Each photo is named by a SHA-256 hash of its own bytes, so the same
photo uploaded twice is stored once, and the URL can be cached forever.

## Staying fresh on every device

- Every HTML document is served `max-age=0, must-revalidate`, so no browser
  renders a page without asking the origin first (the CDN still caches it).
- `/admin` is `no-store` everywhere and never prerendered.
- The build ID is baked into the bundle and served, uncached, from
  `/version.json`. Each page compares the two on load, on focus, on
  `visibilitychange` and on bfcache restore, and reloads once if they differ —
  guarded against reload loops, and suppressed while the CMS holds unpublished
  edits.

## Diagnostics

```bash
npm run check:live        # is the deploy current? is storage working? are cache headers right?
npm run check:config      # validate vercel.json before it silently rejects a deploy
npm test                  # unit tests for the refresh chain, photo filing and publish endpoint
```

`check:live` is the first thing to run when the site looks wrong. It reports
which build is serving, whether every API route exists, whether the catalogue is
a real published one or the fallback seed, and whether each cache header is
correct. Target another environment with
`npm run check:live -- https://staging.example.com`.

`check:config` also runs automatically as `prebuild`. Vercel sets
`additionalProperties: false` on its config schema, so one unknown key — a `"//"`
comment key being the classic — rejects the whole deploy with no error surfaced
anywhere. That failure looks exactly like "the site just never updates".

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

## Adding product images & video

Product photos are normally added through the CMS at `/admin`, which files them
in Blob storage automatically. To ship an image with the repository instead, drop
it in `public/media/…` and point to it from `src/lib/data.ts`. Precedence per
piece is **video → image → SVG**, with automatic fallback if a file is missing.
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
2. Set `ADMIN_PASSWORD`. **Required** — the CMS is locked without it.
3. Create a Vercel Blob store and **connect it to the project**, so
   `BLOB_READ_WRITE_TOKEN` is injected. **Required** — publishing cannot persist
   without it.
4. Connect the repo to Vercel for zero-config builds.
5. Run `npm run check:live` afterwards to confirm the deploy is actually serving
   your latest commit and that storage is wired up.

> All names, figures, addresses and contact details are illustrative demo content.
