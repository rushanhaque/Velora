"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { prefersLite } from "@/lib/perf";

/**
 * Signature pieces — full-screen, scroll-triggered photo switcher.
 * The image fills the viewport; the section heading and the current piece's
 * name sit on top of the photo and change as you scroll.
 *
 * ▸ Add your own photos: drop them in /public (e.g. /media/signature/atlas.jpg)
 *   and set each slide's `src`. While `src` is empty a placeholder frame shows.
 */
type Slide = { src: string; name: string };

const SLIDES: Slide[] = [
  { src: "", name: "Atlas Candelabra" },
  { src: "", name: "Surya Footed Bowl" },
  { src: "", name: "Noor Temple Ewer" },
  { src: "", name: "Selene Ewer" },
];

const EASE_CSS = "cubic-bezier(0.4,0,0.2,1)";

export function SignatureScroll({ slides }: { slides?: Slide[] }) {
  const [active, setActive] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const nameRef  = useRef<HTMLHeadingElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dividerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);
  // Use real pieces (with photos) when the page provides them, so images
  // actually switch; otherwise fall back to the curated placeholder names.
  const view = slides && slides.length ? slides : SLIDES;
  const count = view.length;

  // Scroll-driven reveal: as you scroll through the tall pinned section each
  // piece is uncovered RIGHT→LEFT, with a lit brass divider that slides along
  // the reveal edge. Driven directly by scroll position (no timed transition),
  // so it tracks your scroll exactly and reverses when you scroll back up.
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    // Low-end / reduced-motion: skip the per-frame clip-path reveal entirely.
    // Collapse the tall scroll-space to a single screen and leave the first
    // piece shown (its initial state) — cheap and calm where it matters most.
    if (prefersLite()) {
      outer.style.height = "100svh";
      return;
    }
    let ticking = false;
    const paint = () => {
      ticking = false;
      const rect = outer.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.max(0, Math.min(1, -rect.top / scrollable));
      const fp = p * Math.max(1, count - 1); // 0 .. count-1
      for (let i = 0; i < count; i++) {
        // slide 0 is the base; slide i is revealed across scroll segment [i-1, i]
        const frac = i === 0 ? 1 : Math.max(0, Math.min(1, fp - (i - 1)));
        // reveal edge: 100% (hidden on the right) → 0% (fully shown)
        const edge = ((1 - frac) * 100).toFixed(2);
        const clip = slideRefs.current[i];
        if (clip) {
          clip.style.clipPath = `inset(0 0 0 ${edge}%)`;
          (clip.style as unknown as { webkitClipPath: string }).webkitClipPath = `inset(0 0 0 ${edge}%)`;
        }
        const div = dividerRefs.current[i];
        if (div) {
          div.style.left = `${edge}%`;
          div.style.opacity = i > 0 && frac > 0.003 && frac < 0.997 ? "1" : "0";
        }
      }
      const na = Math.min(count - 1, Math.max(0, Math.round(fp)));
      if (na !== activeRef.current) {
        activeRef.current = na;
        setActive(na);
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(paint);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", paint);
    paint();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", paint);
    };
  }, [count]);

  // Rise-in animation on piece name change
  useEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = "translateY(40%)";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `opacity 0.6s ${EASE_CSS}, transform 0.6s ${EASE_CSS}`;
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    });
  }, [active]);

  const cur = view[active];

  return (
    <>
      {/* ── Full-screen scroll switcher (all widths) — images crossfade as
             you scroll through the tall pinned section, on mobile and desktop ── */}
      <div
        ref={outerRef}
        className="block"
        style={{ height: `calc(${view.length} * 92svh)` }}
      >
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          {/* full-bleed image stack */}
          {view.map((s, i) => (
            <div key={i} className="absolute inset-0" style={{ zIndex: i + 1 }}>
              {/* the piece is uncovered RIGHT→LEFT — clip is driven by scroll */}
              <div
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{
                  clipPath: i === 0 ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
                  WebkitClipPath: i === 0 ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
                }}
              >
                {/* slow cinematic push-in while the slide holds the screen */}
                <div className={cn("relative h-full w-full", active === i && "slow-drift")}>
                  <SlideMedia slide={s} index={i} priority={i === 0} />
                </div>
              </div>

              {/* sliding divider — a lit brass rule that travels right→left along the
                  reveal edge; its position is driven by scroll, not a timed animation */}
              <div
                ref={(el) => {
                  dividerRefs.current[i] = el;
                }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-brass-leaf to-transparent"
                style={{
                  left: i === 0 ? "0%" : "100%",
                  opacity: 0,
                  boxShadow: "0 0 20px rgba(212,185,134,0.85), 0 0 46px rgba(200,167,101,0.45)",
                }}
              />
            </div>
          ))}

          {/* legibility scrims */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/45 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/55 to-transparent" />

          {/* overlay content */}
          <div className="relative z-10 flex h-full flex-col justify-between px-[clamp(28px,5vw,80px)] pb-[clamp(28px,5vh,64px)] pt-[clamp(112px,13vh,170px)]">
            {/* heading */}
            <span className="inline-flex items-center gap-3 text-[0.72rem] uppercase tracking-wide3 text-parchment-pale/85">
              <span className="h-px w-8 bg-brass-leaf" />
              Signature pieces
            </span>

            {/* piece name + counter */}
            <div className="flex items-end justify-between gap-6">
              <div className="overflow-hidden">
                <h2
                  ref={nameRef}
                  className="font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] text-parchment-pale"
                >
                  {cur.name}
                </h2>
              </div>

              <div className="hidden shrink-0 items-center gap-4 sm:flex">
                <span className="numeral text-[0.95rem] text-parchment-pale/80">
                  {String(active + 1).padStart(2, "0")}
                  <span className="text-parchment-pale/40"> / {String(view.length).padStart(2, "0")}</span>
                </span>
                <div className="flex flex-col gap-1.5">
                  {view.map((_, i) => (
                    <span
                      key={i}
                      className="h-[3px] rounded-full transition-all duration-500"
                      style={{
                        width: i === active ? "2rem" : "0.9rem",
                        background: i === active ? "var(--brass-leaf,#c8a765)" : "rgba(247,244,238,0.35)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

/** Full-bleed photo when `src` is set, otherwise a placeholder fill. */
function SlideMedia({
  slide,
  index,
  priority = false,
}: {
  slide: Slide;
  index: number;
  /** The first slide is preloaded so it's ready the moment the section is reached. */
  priority?: boolean;
}) {
  if (slide.src) {
    return (
      <Image
        src={slide.src}
        alt={slide.name}
        fill
        quality={72}
        priority={priority}
        sizes="100vw"
        className="object-cover"
        // A dark base shows instantly while the photo streams in — no blank flash.
        style={{ backgroundColor: "#0b1928" }}
        draggable={false}
      />
    );
  }
  return (
    <div
      className={cn(
        "grid h-full w-full place-items-center",
        "bg-[linear-gradient(135deg,#17293c,#0b1928)]",
      )}
    >
      <div className="text-center text-parchment-pale/25">
        <svg viewBox="0 0 24 24" className="mx-auto h-12 w-12 opacity-60" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.6" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <p className="mt-3 text-[0.62rem] uppercase tracking-wider2">
          Image {String(index + 1).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
