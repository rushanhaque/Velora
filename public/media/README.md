# Adding product images & video (manual)

The site ships with hand-built **SVG specimen art** so nothing is ever empty.
To replace any piece with a real photo or video, drop a file here and point to
it from the data file. No image processing or config is required.

## 1. Drop your files

```
public/media/
├── specimens/      ← per-piece photos & video   (surya-footed-bowl.jpg, .mp4)
├── collections/    ← house cover images          (aurelia.jpg)
└── hero/           ← optional homepage hero media (hero.jpg, hero.mp4)
```

Recommended: **JPG/WebP/AVIF** for stills, **MP4 (H.264)** for video.
Portrait-ish crops (~4:5) suit the specimen cards; landscape (~16:10) suit
collection covers.

## 2. Point to them in `src/lib/data.ts`

### A single piece (in the `SPECIMENS` array)

```ts
{
  ref: "V—2207",
  slug: "surya-footed-bowl",
  // …existing fields…
  image: "/media/specimens/surya-footed-bowl.jpg",   // still photo
  video: "/media/specimens/surya-footed-bowl.mp4",   // optional, muted + looping
  poster: "/media/specimens/surya-footed-bowl.jpg",  // optional video frame
  gallery: [                                          // optional extra stills (detail page)
    "/media/specimens/surya-2.jpg",
    "/media/specimens/surya-3.jpg",
  ],
}
```

Precedence per piece: **video → image → SVG art**. Remove a field to fall back.

### A collection cover (in the `COLLECTIONS` array)

```ts
{ slug: "aurelia", /* … */ cover: "/media/collections/aurelia.jpg" }
```

### The homepage hero (in `HERO_MEDIA`)

```ts
export const HERO_MEDIA = {
  image: "/media/hero/hero.jpg",
  video: "/media/hero/hero.mp4",
};
```

## Notes

- Paths are web paths from `/public`, so they **start with `/media/...`** (no `public`).
- `alt` text is generated from each piece's name + material — no extra step.
- If a file is missing or fails to load, the site automatically falls back to
  the SVG art, so a typo never breaks the page.
- Stills use Next.js `<Image>` (lazy, responsive) where possible.
