import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Mark } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { MaskText } from "@/components/motion/MaskText";
import { BRAND } from "@/lib/data";

const COLLECTIONS_LINKS = [
  { label: "Lighting", href: "/collections?house=lighting" },
  { label: "Decor", href: "/collections?house=decor" },
  { label: "Kitchenware", href: "/collections?house=kitchenware" },
  { label: "Accessories", href: "/collections?house=accessories" },
];
const MAISON_LINKS = [
  { label: "The Craft", href: "/craft" },
  { label: "The Maison", href: "/maison" },
  { label: "FAQ", href: "/faq" },
  { label: "Connect", href: "/connect" },
];

export function Footer() {
  return (
    <footer className="vignette relative overflow-hidden border-t border-brass/25 bg-bitumen text-haze">
      {/* v3.0 — ambient warm glow behind brand column */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[10%] top-[30%] h-[400px] w-[400px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(200,167,101,0.32), transparent 70%)" }}
      />

      <div className="shell relative pt-[clamp(60px,9vw,120px)] pb-[clamp(16px,2.5vw,32px)]">
        <div className="relative grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <Reveal>
            <div className="flex items-center gap-3">
              <Mark className="h-8 w-8" />
              <span className="font-display text-2xl tracking-[0.3em] text-parchment-pale transition-all duration-700 hover:text-brass-leaf hover:[text-shadow:0_0_24px_rgba(201,174,124,0.6),0_0_48px_rgba(201,174,124,0.25)]">
                VELORA
              </span>
            </div>
            <p className="mt-6 text-[0.62rem] uppercase tracking-wider2 text-ash">
              {BRAND.city} · {BRAND.region.split(",")[0]} · India
            </p>
          </Reveal>

          {/* Collections */}
          <Reveal delay={80}>
            <p className="eyebrow text-brass-leaf">Collections</p>
            <ul className="mt-6 space-y-3">
              {COLLECTIONS_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="footer-link text-sm text-haze transition-colors hover:text-parchment-pale"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Maison */}
          <Reveal delay={140}>
            <p className="eyebrow text-brass-leaf">Maison</p>
            <ul className="mt-6 space-y-3">
              {MAISON_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="footer-link text-sm text-haze transition-colors hover:text-parchment-pale"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Trade desk */}
          <Reveal delay={200}>
            <p className="eyebrow text-brass-leaf">The Trade Desk</p>
            <MaskText
              as="p"
              lines={[BRAND.email]}
              className="mt-5 font-display text-2xl text-parchment-pale"
            />
            <p className="mt-2 text-sm">{BRAND.phone}</p>
            <p className="mt-1 text-sm">{BRAND.hours}</p>
            <div className="mt-6">
              <Button href="/connect" variant="brass" arrow magnetic className="!py-3 !text-[0.7rem]">
                Get in touch
              </Button>
            </div>
          </Reveal>
        </div>

      </div>

      {/* VELORA — slides up when scrolled into view, ignites slowly on hover */}
      <div
        className="footer-brand group grid select-none place-items-center pt-2 pb-[clamp(20px,4vw,56px)]"
        aria-hidden="true"
      >
        <Reveal y={90} amount={0.3}>
          <span className="vel-stack font-display text-[clamp(4.5rem,17vw,15rem)] leading-[0.8] tracking-[0.03em] [margin-inline-end:-0.03em]" style={{ transform: "translateX(-1.2vw)" }}>
            <span className="vel-outline">VELORA</span>
            <span className="vel-fill" aria-hidden="true">VELORA</span>
          </span>
        </Reveal>
      </div>

    </footer>
  );
}
