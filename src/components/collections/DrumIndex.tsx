"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { COLLECTIONS, specimensByCollection, type Specimen } from "@/lib/data";
import { Specimen as SpecimenArt } from "@/components/visual/Specimen";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/* ── the instrument's geometry ─────────────────────────────────────────────
   24° between engravings. Perspective foreshortening scales anything at
   translateZ(R) by P/(P−R) — with P=1600, R=300 that is ×1.23, so label
   font sizes below are chosen for their RENDERED size, not their CSS size.
   Label pitch = 2·R·tan(12°) ≈ 127px CSS ≈ 156px rendered.               */
const STEP = 24;
const RADIUS = 300;
const PERSPECTIVE = 1600;
const N = COLLECTIONS.length;
/* House V reaches its detent at 85% of the scroll, then rests. */
const REST = 0.85;

const PEDESTAL: Record<string, string> = {
  brass: "rgba(184,155,106,0.28)",
  copper: "rgba(184,115,85,0.26)",
  silver: "rgba(168,173,181,0.30)",
  bronze: "rgba(140,110,79,0.26)",
};

const ROMAN = ["I", "II", "III", "IV", "V"];

type House = (typeof COLLECTIONS)[number] & {
  hero: Specimen | undefined;
  fan: { s: Specimen; seed: string }[];
};

const HOUSES: House[] = COLLECTIONS.map((c) => {
  const pieces = specimensByCollection(c.slug);
  const hero = pieces.find((p) => p.featured) ?? pieces[0];
  const rest = pieces.filter((p) => p !== hero);
  // Always deal a full hand of three — sparse houses fan variations
  // of their hero (the procedural art varies with the seed).
  const fan = Array.from({ length: 3 }, (_, i) => {
    const s = rest[i] ?? hero;
    return s ? { s, seed: rest[i] ? `fan-${s.slug}` : `fan-var-${c.slug}-${i}` } : null;
  }).filter(Boolean) as { s: Specimen; seed: string }[];
  return { ...c, hero, fan };
});

/* Detent curve — the drum dwells on each house and rolls briskly
   between them, like a ball-detent indexing head. Pure math on the
   scroll position: fully reversible, no snap, no hijack. */
const detent = (t: number) => {
  const i = Math.floor(t);
  const f = t - i;
  return i + f - (Math.sin(2 * Math.PI * f) * 0.35) / (2 * Math.PI);
};

export function DrumIndex() {
  const [active, setActive] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [announced, setAnnounced] = useState("");

  const outerRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);
  const entranceRef = useRef(true);
  const geom = useRef({ top: 0, scrollable: 1 });

  /* geometry: measured once + on resize, never inside the scroll handler */
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

  /* ONE rAF writer: drum angle + per-label falloff as direct style
     writes; React state changes only when the active house changes. */
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
        el.style.opacity = String(Math.max(0.05, Math.min(1, 1 - a / 70)).toFixed(3));
      });
    };

    const update = () => {
      ticking = false;
      if (entranceRef.current) return;
      const { top, scrollable } = geom.current;
      const p = Math.max(0, Math.min(1, (window.scrollY - top) / scrollable));
      const fi = Math.min(p / REST, 1) * (N - 1);
      paint(fi);
      // hysteresis so the stage doesn't flicker at detent boundaries
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

    /* entrance — the drum rolls up from -18° once, teaching that it turns */
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
  }, [reduce]);

  /* debounced announcement for screen readers — one line per settled house */
  useEffect(() => {
    const h = HOUSES[active];
    const t = setTimeout(
      () => setAnnounced(`House ${ROMAN[active]} — ${h.name}. ${h.material}, ${h.count} pieces.`),
      600,
    );
    return () => clearTimeout(t);
  }, [active]);

  /* pip click — roll the drum there through every intermediate house */
  const goTo = useCallback((i: number) => {
    const { top, scrollable } = geom.current;
    const target = top + ((REST * i) / (N - 1)) * scrollable + 2;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(target, { duration: Math.min(0.95, 0.5 + 0.12 * Math.abs(i - activeRef.current)) });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  }, []);

  return (
    <>
      {/* ═══ DESKTOP — the indexing drum ═══ */}
      <div ref={outerRef} className="hidden lg:block" style={{ height: `${N * 88}svh` }}>
        <div className="sticky top-0 flex h-svh items-center overflow-hidden">
          <span aria-live="polite" className="sr-only">
            {announced}
          </span>

          <div className="shell grid w-full grid-cols-12 items-center gap-[clamp(24px,4vw,64px)]">
            {/* ── The drum (cols 1–5) ── */}
            <div className="relative col-span-5 flex items-center gap-10">
              {/* index rail — five quiet marks; the active one is a longer brass tick */}
              <div className="relative flex h-[min(58svh,520px)] flex-col items-center justify-between py-2">
                {HOUSES.map((h, i) => (
                  <button
                    key={h.slug}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={active === i ? "true" : undefined}
                    className="group/pip relative z-10 flex h-9 w-9 items-center justify-center"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block h-px transition-all duration-500 ease-silk",
                        active === i
                          ? "w-8 bg-brass"
                          : "w-3.5 bg-line group-hover/pip:w-6 group-hover/pip:bg-brass/50",
                      )}
                    />
                    <span className="sr-only">{`House ${ROMAN[i]} — ${h.name}`}</span>
                  </button>
                ))}
              </div>

              {/* the cylinder — mask-free 3D (Safari-safe): caps painted over it */}
              {reduce ? (
                <div className="flex flex-col gap-6" aria-hidden="true">
                  {HOUSES.map((h, i) => (
                    <span
                      key={h.slug}
                      className={cn(
                        "font-display text-[clamp(27px,2.6vw,42px)] uppercase tracking-[0.16em] leading-none",
                        active === i ? "text-brass-deep" : "drum-label",
                      )}
                    >
                      {h.name}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="relative h-[min(58svh,520px)] flex-1 overflow-hidden" aria-hidden="true">
                  {/* ambient occlusion at the roll-off */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(34,26,12,0.05) 0%, transparent 20% 80%, rgba(34,26,12,0.06) 100%)",
                    }}
                  />
                  <div className="absolute inset-0" style={{ perspective: `${PERSPECTIVE}px` }}>
                    <div
                      ref={drumRef}
                      className="absolute inset-0"
                      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
                    >
                      {HOUSES.map((h, i) => (
                        <div
                          key={h.slug}
                          ref={(el) => {
                            labelRefs.current[i] = el;
                          }}
                          className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-baseline gap-4 pl-[11%] pr-[12%]"
                          style={{
                            transform: `translateY(-50%) rotateX(${-i * STEP}deg) translateZ(${RADIUS}px)`,
                            backfaceVisibility: "hidden",
                          }}
                        >
                          <span
                            className={cn(
                              "drum-label whitespace-nowrap font-display text-[clamp(22px,2.1vw,34px)] uppercase tracking-[0.16em] leading-none",
                              active === i && "is-read",
                            )}
                          >
                            {h.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* curvature caps — OVER the drum, never a mask on a 3D ancestor */}
                  <div className="drum-cap drum-cap--top" />
                  <div className="drum-cap drum-cap--bottom" />

                  {/* the reading line — one quiet static brass tick at the active row */}
                  <div
                    className="pointer-events-none absolute left-0 top-1/2 z-20 -translate-y-1/2"
                    aria-hidden="true"
                  >
                    <span className="block h-px w-4 bg-brass/60" />
                  </div>
                </div>
              )}
            </div>

            {/* ── The stage (cols 6–12) ── */}
            <div className="relative col-span-7 h-[min(80svh,700px)]">
              {HOUSES.map((h, i) => {
                const on = active === i;
                return (
                  <div
                    key={h.slug}
                    data-on={on}
                    aria-hidden={!on}
                    className="stage-layer absolute inset-0 flex flex-col justify-center"
                  >
                    {/* the piece on its pedestal */}
                    <div className="relative h-[clamp(150px,26svh,300px)]">
                      <div
                        className="st-glow absolute inset-x-[12%] bottom-0 h-[60%]"
                        style={{
                          background: `radial-gradient(50% 60% at 50% 100%, ${PEDESTAL[h.tone]}, transparent 70%)`,
                        }}
                      />
                      {h.hero && (
                        <div className="st st-art absolute inset-0 grid place-items-center">
                          <div className={cn("h-full", !reduce && "levitate")}>
                            <SpecimenArt
                              shape={h.hero.shape}
                              tone={h.hero.tone}
                              seed={`drum-${h.slug}`}
                              className="h-full w-auto drop-shadow-[0_18px_26px_rgba(34,26,12,0.22)]"
                            />
                          </div>
                          <span
                            aria-hidden="true"
                            className={cn(
                              "lev-shadow absolute bottom-[6%] left-1/2 h-2.5 w-[38%] -translate-x-1/2 rounded-[50%] bg-bitumen/20 blur-[6px]",
                              reduce && "[animation:none]",
                            )}
                          />
                        </div>
                      )}
                    </div>

                    {/* the plate copy */}
                    <div className="relative z-10 mt-[clamp(12px,2.5svh,26px)] max-w-[560px]">
                      <h2 className="st st-name font-display text-[clamp(2.2rem,3.8vw,3.5rem)] leading-[1.02] tracking-[-0.01em] text-bitumen">
                        {h.name}
                      </h2>
                      <p className="st st-meta mt-2 whitespace-nowrap text-[0.7rem] uppercase tracking-[0.18em] text-stone">
                        {h.material} <span className="text-brass">·</span> {h.tagline}{" "}
                        <span className="text-brass">·</span> {h.count} pieces
                      </p>
                      <p className="st st-blurb mt-5 max-w-[46ch] text-[0.92rem] leading-[1.55] text-stone">
                        {h.blurb}
                      </p>
                      <div className="st st-cta mt-6">
                        <Button
                          href={`/collections?house=${h.slug}`}
                          variant="outline"
                          arrow
                          tabIndex={on ? undefined : -1}
                        >
                          Enter the house
                        </Button>
                      </div>
                    </div>

                    {/* the fan — a hand of three pieces, spreads under the visitor's hand */}
                    <div className="st relative z-10 mt-[clamp(16px,3svh,36px)] flex h-[clamp(96px,17svh,128px)] justify-center pt-2 lg:justify-start lg:pl-[52px]">
                      {h.fan.map(({ s, seed }, fi) => (
                        <div
                          key={seed}
                          className={cn(
                            "fan-card absolute h-[clamp(84px,15svh,112px)] w-[clamp(66px,11.8svh,88px)]",
                            fi === 0 && "fan-card--l",
                            fi === 2 && "fan-card--r",
                          )}
                          style={{ zIndex: fi === 1 ? 2 : 1 }}
                        >
                          <Link
                            href={`/collections/${s.slug}`}
                            data-lit
                            tabIndex={on ? undefined : -1}
                            aria-label={s.name}
                            className="plate relative h-full w-full overflow-hidden rounded-xl p-2"
                          >
                            <SpecimenArt
                              shape={s.shape}
                              tone={s.tone}
                              seed={seed}
                              className="h-full w-full drop-shadow-[0_8px_10px_rgba(34,26,12,0.18)]"
                            />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ═══ MOBILE / TABLET — engraved plaques, fans pre-spread ═══ */}
      <div className="lg:hidden">
        <div className="shell pt-10">
          <span className="eyebrow eyebrow-settle inline-flex items-center gap-3 text-brass-deep">
            <span className="h-px w-7 bg-current opacity-40" aria-hidden="true" />
            The collections
          </span>
        </div>
        <div className="mt-8 flex flex-col gap-10 pb-16">
          {HOUSES.map((h, i) => (
            <div key={h.slug} className="shell">
              <Reveal y={40}>
                <MobilePlaque h={h} i={i} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function MobilePlaque({ h, i }: { h: House; i: number }) {
  return (
    <div className="plate relative overflow-hidden rounded-xl2 p-6 sm:p-8">
      <div className="flex items-baseline justify-between">
        <span className="ref text-[0.62rem] text-brass-deep/60">{ROMAN[i]}</span>
        <span className="ref text-[0.58rem] text-ash">{h.count} pcs</span>
      </div>

      <div className="relative mt-4 h-[190px]">
        <div
          aria-hidden="true"
          className="absolute inset-x-[10%] bottom-0 h-[62%]"
          style={{
            background: `radial-gradient(50% 60% at 50% 100%, ${PEDESTAL[h.tone]}, transparent 70%)`,
          }}
        />
        {h.hero && (
          <div className="absolute inset-0 grid place-items-center">
            <SpecimenArt
              shape={h.hero.shape}
              tone={h.hero.tone}
              seed={`drum-${h.slug}`}
              className="h-full w-auto drop-shadow-[0_14px_20px_rgba(34,26,12,0.2)]"
            />
          </div>
        )}
      </div>

      <h2 className="mt-5 font-display text-[2rem] leading-none text-bitumen">{h.name}</h2>
      <p className="mt-2 text-[0.62rem] uppercase tracking-wider2 text-stone">
        {h.material} <span className="text-brass">·</span> {h.tagline}
      </p>
      <p className="mt-3 text-[0.9rem] leading-relaxed text-stone">{h.blurb}</p>

      {/* pre-spread hand */}
      <div className="relative mx-auto mt-6 flex h-[96px] w-full max-w-[260px] justify-center">
        {h.fan.map(({ s, seed }, fi) => (
          <div
            key={seed}
            className="absolute h-[88px] w-[70px]"
            style={{
              transform: `translateX(${(fi - 1) * 58}px) rotate(${(fi - 1) * 12}deg)`,
              transformOrigin: "50% 100%",
              zIndex: fi === 1 ? 2 : 1,
            }}
          >
            <Link
              href={`/collections/${s.slug}`}
              aria-label={s.name}
              className="plate block h-full w-full overflow-hidden rounded-lg p-1.5"
            >
              <SpecimenArt shape={s.shape} tone={s.tone} seed={seed} className="h-full w-full" />
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button href={`/collections?house=${h.slug}`} variant="outline" arrow>
          Enter the house
        </Button>
      </div>
    </div>
  );
}
