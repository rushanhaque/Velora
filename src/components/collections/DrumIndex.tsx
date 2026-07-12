"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { COLLECTIONS, type Collection } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ── instrument geometry ─────────────────────────────────────────────────────
   27° between engravings — a touch steeper so the off-centre houses lean back
   more. Perspective foreshortening scales anything at translateZ(R) by
   P/(P−R) — with P=1000, R=300 that is ×1.43.                                */
const STEP = 27;
const RADIUS = 300;
const PERSPECTIVE = 1000;
const REST = 0.85;

const ROMAN_NUM = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const roman = (i: number) => ROMAN_NUM[i] ?? String(i + 1);

const detent = (t: number) => {
  const i = Math.floor(t);
  const f = t - i;
  return i + f - (Math.sin(2 * Math.PI * f) * 0.35) / (2 * Math.PI);
};

/** The collections landing. Data comes from the CMS-backed catalog (passed by
 *  the server page); falls back to the compiled seed if rendered bare. */
export function DrumIndex({ collections = COLLECTIONS }: { collections?: Collection[] }) {
  const N = collections.length;
  const [active, setActive] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [announced, setAnnounced] = useState("");

  const outerRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeRef = useRef(0);
  const entranceRef = useRef(true);
  const geom = useRef({ top: 0, scrollable: 1 });

  /* mobile panels — one-shot cinematic reveal as each enters the viewport */
  useEffect(() => {
    const els = panelRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.on = "true";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.22 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* geometry: measured once + on resize */
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const measure = () => {
      const r = outer.getBoundingClientRect();
      geom.current = {
        top: r.top + window.scrollY,
        scrollable: Math.max(1, r.height - window.innerHeight),
      };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /* ONE rAF writer: drum angle + per-label falloff as direct style writes */
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let ticking = false;

    const paint = (fi: number) => {
      const fd = detent(fi);
      drumRef.current?.style.setProperty("transform", `rotateX(${(fd * STEP).toFixed(3)}deg)`);
      labelRefs.current.forEach((el, i) => {
        if (!el) return;
        const a = Math.abs((i - fd) * STEP);
        el.style.opacity = String(Math.max(0.04, Math.min(1, 1 - a / 54)).toFixed(3));
      });
    };

    const update = () => {
      ticking = false;
      if (entranceRef.current) return;
      const { top, scrollable } = geom.current;
      const p = Math.max(0, Math.min(1, (window.scrollY - top) / scrollable));
      const fi = Math.min(p / REST, 1) * (N - 1);
      paint(fi);
      const cur = activeRef.current;
      if (Math.abs(fi - cur) > 0.56) {
        const next = Math.max(0, Math.min(N - 1, Math.round(fi)));
        if (next !== cur) {
          activeRef.current = next;
          setActive(next);
        }
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };

    /* entrance — drum rolls in from below */
    const t0 = performance.now();
    const spin = (now: number) => {
      const t = Math.min(1, (now - t0) / 900);
      const eased = 1 - Math.pow(1 - t, 3);
      paint((eased - 1) * (18 / STEP));
      if (t < 1) {
        raf = requestAnimationFrame(spin);
      } else {
        entranceRef.current = false;
        update();
      }
    };
    raf = requestAnimationFrame(spin);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduce, N]);

  useEffect(() => {
    const t = setTimeout(
      () => setAnnounced(`Collection ${roman(active)} — ${collections[active]?.name ?? ""}.`),
      600,
    );
    return () => clearTimeout(t);
  }, [active, collections]);

  const goTo = useCallback((i: number) => {
    const { top, scrollable } = geom.current;
    const target = top + ((REST * i) / (N - 1)) * scrollable + 2;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(target, { duration: Math.min(0.95, 0.5 + 0.12 * Math.abs(i - activeRef.current)) });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  }, [N]);

  return (
    <>
      {/* ═══ DESKTOP — full-bleed cover + centered drum ═══ */}
      <div ref={outerRef} className="hidden lg:block" style={{ height: `${N * 88}svh` }}>
        <div className="sticky top-0 h-svh overflow-hidden bg-bitumen">
          <span aria-live="polite" className="sr-only">{announced}</span>

          {/* Dark base — sits BEHIND the covers so the crossfade dissolves
             through darkness (never the light page background) */}
          <div className="absolute inset-0 bg-bitumen" />

          {/* Full-bleed cover images — React-state crossfade */}
          {collections.map((c, i) =>
            c.cover ? (
              <div
                key={c.slug}
                className="absolute inset-0 transition-opacity duration-[800ms] ease-in-out"
                style={{ opacity: active === i ? 1 : 0 }}
              >
                <Image
                  src={c.cover}
                  alt=""
                  aria-hidden="true"
                  fill
                  priority={i === 0}
                  quality={80}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ) : null
          )}

          {/* Legibility scrim — deepest at the centre where the drum text sits,
             easing out toward the edges so the cover photo still reads */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(78% 62% at 50% 50%, rgba(10,9,7,0.72) 0%, rgba(10,9,7,0.54) 52%, rgba(10,9,7,0.40) 100%)",
            }}
          />

          {/* Warm brass ambient behind active label */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[30vw] w-[50vw] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(184,145,88,0.18), transparent 70%)" }}
          />

          {/* Centred drum */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center">
            {reduce ? (
              /* reduced-motion: static list */
              <div className="flex flex-col items-center gap-5" aria-hidden="true">
                {collections.map((c, i) => (
                  <Link
                    key={c.slug}
                    href={`/collections?house=${c.slug}`}
                    className={cn(
                      "font-display uppercase tracking-[0.08em] leading-none transition-all duration-500",
                      active === i
                        ? "text-[clamp(3.2rem,6vw,6.5rem)] text-parchment-pale"
                        : "text-[clamp(1.8rem,3vw,3rem)] text-parchment-pale/25",
                    )}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            ) : (
              /* the spinning drum */
              <div
                className="relative h-[min(60svh,560px)] w-full overflow-hidden"
                aria-hidden="true"
                style={{
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 24%, black 76%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 24%, black 76%, transparent 100%)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{ perspective: `${PERSPECTIVE}px` }}
                >
                  <div
                    ref={drumRef}
                    className="absolute inset-0"
                    style={{ transformStyle: "preserve-3d", willChange: "transform" }}
                  >
                    {collections.map((c, i) => (
                      <div
                        key={c.slug}
                        ref={(el) => { labelRefs.current[i] = el; }}
                        className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-baseline justify-center px-8"
                        style={{
                          transform: `translateY(-50%) rotateX(${-i * STEP}deg) translateZ(${RADIUS}px)`,
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <Link
                          href={`/collections?house=${c.slug}`}
                          tabIndex={active === i ? 0 : -1}
                          className="font-display text-[clamp(3.2rem,6.2vw,7rem)] uppercase tracking-[0.06em] leading-none text-parchment-pale transition-colors duration-500 ease-silk hover:text-brass"
                          style={{
                            textShadow:
                              active === i
                                ? "0 0 2px rgba(10,9,7,0.65), 0 2px 20px rgba(10,9,7,0.85), 0 0 60px rgba(200,165,92,0.5)"
                                : "0 0 2px rgba(10,9,7,0.6), 0 2px 20px rgba(10,9,7,0.8)",
                          }}
                        >
                          {c.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Dot nav — horizontal row below the drum */}
            <div className="mt-10 flex items-center gap-5">
              {collections.map((c, i) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={active === i ? "true" : undefined}
                  className="group relative flex h-8 w-8 items-center justify-center"
                >
                  <span
                    className={cn(
                      "block rounded-full transition-all duration-500 ease-silk",
                      active === i
                        ? "h-2.5 w-2.5 bg-brass shadow-[0_0_8px_rgba(184,145,88,0.7)]"
                        : "h-1.5 w-1.5 bg-parchment-pale/35 group-hover:bg-parchment-pale/65",
                    )}
                  />
                  <span className="sr-only">{`Collection ${roman(i)} — ${c.name}`}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MOBILE / TABLET — full-bleed panels, each staging its own
             reveal as it scrolls in: the cover settles from a gentle zoom,
             the numeral and name rise, the arrow slides into place. ═══ */}
      <div className="lg:hidden bg-bitumen">
        {collections.map((c, i) => (
          <Link
            key={c.slug}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            href={`/collections?house=${c.slug}`}
            className="mob-panel group relative block overflow-hidden"
            style={{ height: "58svh" }}
          >
            {c.cover && (
              <Image
                src={c.cover}
                alt={c.name}
                fill
                priority={i === 0}
                quality={80}
                sizes="100vw"
                className="mp-cover object-cover"
              />
            )}
            {/* gradient — deep at bottom for name */}
            <div className="absolute inset-0 bg-gradient-to-t from-bitumen/85 via-bitumen/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-7">
              <span className="mp-roman block text-[0.65rem] uppercase tracking-wider2 text-parchment-pale/50">
                {roman(i)}
              </span>
              <div className="overflow-hidden pb-[0.16em]">
                <h2 className="mp-name mt-2 font-display text-[clamp(2rem,8vw,3rem)] leading-none text-parchment-pale">
                  {c.name}
                </h2>
              </div>
            </div>

            <span
              aria-hidden="true"
              className="mp-arrow absolute bottom-7 right-7 text-parchment-pale/40 transition-all duration-500 ease-silk group-hover:translate-x-1 group-hover:text-brass"
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
