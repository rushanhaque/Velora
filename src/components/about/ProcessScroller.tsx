"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Step = { n: string; title: string; body: string; image?: string };

/**
 * The process section. On desktop the photograph is pinned on the left and
 * crossfades to the active step as the text column scrolls past it — only the
 * text moves, the picture switches. On mobile (no room to pin) each step keeps
 * its own inline photo instead.
 *
 * "Active" step = whichever one is crossing a thin band at the vertical centre
 * of the viewport, found with a single IntersectionObserver (no scroll math).
 */
export function ProcessScroller({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hits = entries
          .filter((e) => e.isIntersecting)
          .map((e) => Number((e.target as HTMLElement).dataset.idx))
          .sort((a, b) => a - b);
        if (hits.length) setActive(hits[0]);
      },
      // Shrink the root to a ~12%-tall band at centre: the step in that band is active.
      { rootMargin: "-44% 0px -44% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
      {/* ── Left: pinned photo that switches with the active step (desktop) ── */}
      <div className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
        <div className="plate relative aspect-square overflow-hidden rounded-xl2">
          {steps.map((s, i) =>
            s.image ? (
              <Image
                key={s.n}
                src={s.image}
                alt={`${s.title} — step ${s.n} of the metalworking process`}
                fill
                sizes="(max-width: 1024px) 90vw, 36vw"
                priority={i === 0}
                className={cn(
                  "object-cover transition-opacity duration-700 ease-silk",
                  active === i ? "opacity-100" : "opacity-0",
                )}
              />
            ) : null,
          )}
        </div>
        <p className="mt-5 text-center text-[0.66rem] uppercase tracking-wider2 text-ash">
          <span className="text-brass-deep">{steps[active]?.n}</span>
          <span className="mx-2 text-brass/50">·</span>
          {steps[active]?.title}
        </p>
      </div>

      {/* ── Right: the steps — text scrolls; the pinned photo answers it ── */}
      <ol>
        {steps.map((s, i) => {
          const on = active === i;
          return (
            <li
              key={s.n}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-idx={i}
              className={cn(
                // On desktop each step holds a tall slice of scroll (≈68vh) and
                // centres its text, so the pinned photo only switches after a
                // deliberate amount of scrolling — never in a quick flicker.
                "group border-t py-9 transition-colors duration-500 last:border-b lg:flex lg:min-h-[68vh] lg:flex-col lg:justify-center lg:py-14",
                on ? "border-t-brass/40" : "border-line",
              )}
            >
              <div className="grid grid-cols-[auto_1fr] gap-8">
                <span
                  className={cn(
                    "numeral text-[clamp(2.4rem,4vw,3.4rem)] transition-colors duration-500",
                    on ? "text-brass-deep" : "text-brass/35",
                  )}
                >
                  {s.n}
                </span>
                <div>
                  <h3
                    className={cn(
                      "font-display text-[1.7rem] transition-colors duration-500",
                      on ? "text-bitumen" : "text-bitumen/70 lg:text-bitumen/55",
                    )}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-stone">{s.body}</p>
                </div>
              </div>

              {/* Inline photo — mobile only (no pinned column there) */}
              {s.image && (
                <div className="mt-6 overflow-hidden rounded-lg lg:hidden">
                  <Image
                    src={s.image}
                    alt={`${s.title} — step ${s.n} of the metalworking process`}
                    width={1024}
                    height={1024}
                    className="h-auto w-full object-cover"
                    sizes="90vw"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
