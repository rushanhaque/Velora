"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

export function SignatureScroll() {
  const [active, setActive] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const nameRef  = useRef<HTMLHeadingElement>(null);

  // Scroll-driven switching: tall outer block, sticky full-screen inner panel.
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = outer.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        if (scrollable > 0) {
          // Count progress only once the panel is pinned (rect.top reaches 0),
          // so the first piece stays put until the screen actually locks.
          const p = Math.max(0, Math.min(1, -rect.top / scrollable));
          setActive(Math.min(SLIDES.length - 1, Math.floor(p * SLIDES.length)));
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const cur = SLIDES[active];

  return (
    <>
      {/* ── DESKTOP: full-screen scroll switcher ── */}
      <div
        ref={outerRef}
        className="hidden lg:block"
        style={{ height: `calc(${SLIDES.length} * 92svh)` }}
      >
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          {/* full-bleed image stack */}
          {SLIDES.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                opacity: active === i ? 1 : 0,
                transform: `scale(${active === i ? 1 : 1.04})`,
                transition: `opacity 1s ${EASE_CSS}, transform 1s ${EASE_CSS}`,
              }}
            >
              {/* slow cinematic push-in while the slide holds the screen */}
              <div className={cn("relative h-full w-full", active === i && "slow-drift")}>
                <SlideMedia slide={s} index={i} />
              </div>
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
                  <span className="text-parchment-pale/40"> / {String(SLIDES.length).padStart(2, "0")}</span>
                </span>
                <div className="flex flex-col gap-1.5">
                  {SLIDES.map((_, i) => (
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

      {/* ── MOBILE / TABLET: stacked full-width images ── */}
      <div className="lg:hidden">
        <div className="px-[clamp(20px,6vw,40px)] pt-[clamp(40px,12vw,80px)]">
          <span className="inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-wide3 text-brass-deep">
            <span className="h-px w-7 bg-current opacity-60" />
            Signature pieces
          </span>
        </div>
        <div className="mt-7 flex flex-col">
          {SLIDES.map((s, i) => (
            <div key={i} className="relative h-[78svh] w-full overflow-hidden">
              <SlideMedia slide={s} index={i} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/55 to-transparent" />
              <h2 className="absolute bottom-7 left-6 font-display text-[clamp(2rem,9vw,3rem)] leading-[0.95] text-parchment-pale">
                {s.name}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/** Full-bleed photo when `src` is set, otherwise a placeholder fill. */
function SlideMedia({ slide, index }: { slide: Slide; index: number }) {
  if (slide.src) {
    return (
      <Image
        src={slide.src}
        alt={slide.name}
        fill
        quality={80}
        sizes="100vw"
        className="object-cover"
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
