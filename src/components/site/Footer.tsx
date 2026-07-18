import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Mark } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { ContactDeveloper } from "@/components/site/ContactDeveloper";
import { BRAND } from "@/lib/data";

const COLLECTIONS_LINKS = [
  { label: "Lighting", href: "/collections?house=lighting" },
  { label: "Decor", href: "/collections?house=decor" },
  { label: "Kitchenware", href: "/collections?house=kitchenware" },
  { label: "Accessories", href: "/collections?house=accessories" },
];
const PAGE_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export function Footer() {
  return (
    <footer className="vignette relative overflow-hidden border-t border-brass/25 bg-bitumen text-haze">
      {/* v3.0 — ambient warm glow behind brand column */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[10%] top-[30%] h-[400px] w-[400px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(200,167,101,0.32), transparent 70%)" }}
      />

      {/* Full footer — tablet & desktop only */}
      <div className="hidden sm:block">
      <div className="shell relative pt-[clamp(60px,9vw,120px)] pb-[clamp(16px,2.5vw,32px)]">
        <div className="relative grid gap-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
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

          {/* Pages */}
          <Reveal delay={140}>
            <p className="eyebrow text-brass-leaf">Pages</p>
            <ul className="mt-6 space-y-3">
              {PAGE_LINKS.map((l) => (
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
            <p className="mt-5 break-all font-display text-xl text-parchment-pale sm:text-2xl">
              {BRAND.email}
            </p>
            <p className="mt-2 text-sm">{BRAND.phone}</p>
            <p className="mt-1 text-sm">{BRAND.hours}</p>
            <div className="mt-6">
              <Button href="/contact" variant="brass" arrow className="!py-3 !text-[0.7rem]">
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
      </div>

      {/* Compact footer — phones. The extra bottom padding reserves the band
          the absolutely-positioned "Contact developer" chip sits in (bottom-5,
          ~30px tall), so it never overlaps the address / © line. */}
      <div className="shell pt-10 pb-[72px] sm:hidden">
        <div className="flex items-center gap-2.5">
          <Mark className="h-6 w-6" />
          <span className="font-display text-xl tracking-[0.3em] text-parchment-pale">VELORA</span>
        </div>
        <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5 text-[0.72rem] uppercase tracking-wider2 text-haze">
          {PAGE_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-parchment-pale">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 space-y-1">
          <a href={`mailto:${BRAND.email}`} className="block break-all text-sm text-parchment-pale">
            {BRAND.email}
          </a>
          <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="block text-sm text-haze">
            {BRAND.phone}
          </a>
        </div>
        <p className="mt-6 text-[0.58rem] uppercase tracking-wider2 text-ash">
          © Velora International · {BRAND.city}
        </p>
      </div>

      {/* Bottom-right developer credit */}
      <ContactDeveloper />
    </footer>
  );
}
