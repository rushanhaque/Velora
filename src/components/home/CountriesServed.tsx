"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/ui/Section";
import { mediaUrl } from "@/lib/media-url";

const COUNTRIES = [
  { code: "it", name: "Italy", region: "Europe" },
  { code: "ke", name: "Kenya", region: "East Africa" },
  { code: "ae", name: "United Arab Emirates", region: "Middle East" },
  { code: "tr", name: "Türkiye", region: "Europe · Asia" },
  { code: "ch", name: "Switzerland", region: "Europe" },
  { code: "sg", name: "Singapore", region: "Southeast Asia" },
  { code: "es", name: "Spain", region: "Europe" },
  { code: "gb", name: "United Kingdom", region: "Europe" },
  { code: "us", name: "United States", region: "North America" },
];

export function CountriesServed() {
  const track = useRef<HTMLUListElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update(); media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    if (panel.current) observer.observe(panel.current);
    return () => { media.removeEventListener("change", update); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (interacting || !visible || reduceMotion) return;
    const el = track.current;
    if (!el) return;
    let frame = 0;
    let previous = 0;
    let position = el.scrollLeft;
    const animate = (time: number) => {
      const first = el.children[0] as HTMLElement | undefined;
      const repeat = el.children[COUNTRIES.length] as HTMLElement | undefined;
      const width = first && repeat ? repeat.offsetLeft - first.offsetLeft : 0;
      if (previous && width > 0 && document.visibilityState === "visible") {
        position = (position + Math.min(time - previous, 50) * 0.028) % width;
        el.scrollLeft = position;
      }
      previous = time;
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [interacting, visible, reduceMotion]);

  return (
    <section id="countries-served" aria-labelledby="countries-heading" className="countries-section">
      <Shell>
        <div ref={panel} className="countries-panel" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
          <div className="countries-header">
            <div className="countries-title-lockup">
              <span className="countries-globe" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="16" cy="16" r="12"/><ellipse cx="16" cy="16" rx="5.5" ry="12"/><path d="M4 16h24M7 8.5c6 4 12 4 18 0M7 23.5c6-4 12-4 18 0"/></svg>
              </span>
              <div>
                <p className="text-[0.58rem] uppercase tracking-wider2 text-brass-deep">From Moradabad, with care</p>
                <h2 id="countries-heading" className="mt-1 font-display text-[clamp(1.9rem,3vw,2.6rem)] text-bitumen">Countries served</h2>
              </div>
            </div>
          </div>
          <ul ref={track} className="countries-track" tabIndex={0} aria-label="Countries served; scroll to explore" onTouchStart={() => setInteracting(true)} onTouchEnd={() => setInteracting(false)} onTouchCancel={() => setInteracting(false)}>
            {(reduceMotion ? COUNTRIES : [...COUNTRIES, ...COUNTRIES]).map((country, index) => (
              <li key={`${country.code}-${index}`} className="country-card" aria-hidden={index >= COUNTRIES.length ? true : undefined}>
                <div className="country-flag-frame">
                  {/* Local SVGs preserve flag detail on every platform, unlike emoji. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(`/media/flags/${country.code}.svg`)} alt="" width={96} height={72} loading="lazy" className="country-flag" />
                </div>
                <p className="mt-4 text-[0.79rem] font-medium text-bitumen">{country.name}</p>
                <p className="mt-1 text-[0.58rem] uppercase tracking-[0.16em] text-ash">{country.region}</p>
              </li>
            ))}
          </ul>
          <div className="countries-footer">
            <p>Crafted in India. At home around the world.</p>
            <Link href="/contact">Enquire about your destination <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </Shell>
    </section>
  );
}
