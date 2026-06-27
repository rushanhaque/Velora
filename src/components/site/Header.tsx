"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo, Mark } from "@/components/brand/Logo";
import { HeroBrand } from "@/components/home/HeroBrand";
import { NAV, BRAND } from "@/lib/data";
import { useEnquiry, cartPanel } from "@/lib/enquiry";
import { cn } from "@/lib/utils";
import { SILK } from "@/lib/motion";

const NAV_LEFT = NAV.slice(0, 2);
const NAV_RIGHT = NAV.slice(2);

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [dockP, setDockP] = useState(0);
  const [open, setOpen] = useState(false);
  const cartCount = useEnquiry().length;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const s = y > 28;
      setScrolled(s);
      const vh =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.querySelector("section")?.getBoundingClientRect().height ||
        800;
      const dock = Math.max(vh * 0.85, 500);
      setDockP(Math.min(1, Math.max(0, y / dock)));
      document.documentElement.style.setProperty("--header-h", s ? "62px" : "80px");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.documentElement.dataset.menu = open ? "open" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.documentElement.dataset.menu = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const chrome = isHome ? dockP : 1;
  const solid = isHome ? dockP : scrolled ? 1 : 0;
  const sideStyle = (o: number) => ({
    opacity: o,
    pointerEvents: o < 0.05 ? ("none" as const) : ("auto" as const),
  });

  const navLink = (n: { label: string; href: string }) => {
    const active = pathname.startsWith(n.href);
    return (
      <Link
        key={n.href}
        href={n.href}
        className={cn(
          "nav-link relative text-[0.78rem] uppercase tracking-wide3 transition-colors",
          active ? "nav-link-active text-brass-deep" : "text-stone hover:text-bitumen",
        )}
      >
        <span className="link-draw">{n.label}</span>
        {/* v3.0 — active indicator dot */}
        <span className="nav-indicator" />
      </Link>
    );
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* v3.0 — glass pill that separates from edge on scroll */}
      <div
        className={cn(
          "transition-all duration-700 ease-silk",
          scrolled ? "mx-3 mt-2 rounded-full sm:mx-4" : "",
        )}
        style={{
          backgroundColor: `rgba(247,244,238,${(0.75 * solid).toFixed(3)})`,
          // Consistent longhand border props (no border/borderBottom shorthand mix):
          // all four sides when floating as a pill, bottom-only when docked to the edge.
          borderStyle: "solid",
          borderColor: scrolled
            ? `rgba(227,220,205,${(solid * 0.6).toFixed(3)})`
            : `rgba(227,220,205,${solid.toFixed(3)})`,
          borderWidth: scrolled ? "1px" : "0 0 1px",
          backdropFilter: solid > 0.04 ? `blur(20px) saturate(1.8)` : "none",
          WebkitBackdropFilter: solid > 0.04 ? `blur(20px) saturate(1.8)` : "none",
          boxShadow: scrolled
            ? `0 8px 32px rgba(34,26,12,${(0.08 * solid).toFixed(3)}), 0 0 0 0.5px rgba(227,220,205,${(0.3 * solid).toFixed(3)})`
            : "none",
        }}
      >
        <div
          className={cn(
            "shell grid grid-cols-[1fr_auto_1fr] items-center transition-[padding] duration-500 ease-silk",
            scrolled ? "py-3" : "py-5",
          )}
        >
          {/* Left — mobile menu button + desktop nav */}
          <div className="flex items-center" style={sideStyle(chrome)}>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative z-50 -ml-1 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span
                className={cn(
                  "h-px w-6 bg-current transition-all duration-300 ease-silk",
                  open ? "translate-y-[3px] rotate-45 text-parchment-pale" : "text-bitumen",
                )}
              />
              <span
                className={cn(
                  "h-px w-6 bg-current transition-all duration-300 ease-silk",
                  open ? "-translate-y-[3px] -rotate-45 text-parchment-pale" : "text-bitumen",
                )}
              />
            </button>
            <nav className="hidden items-center gap-8 lg:flex">{NAV_LEFT.map(navLink)}</nav>
          </div>

          {/* Center — the designed logo */}
          <Link
            href="/"
            aria-label="Velora International — home"
            data-header-logo
            className={cn(
              "justify-self-center transition-opacity duration-500",
              isHome && "pointer-events-none opacity-0",
            )}
          >
            <Logo />
          </Link>

          {/* Right — desktop nav + mobile balancer (matches hamburger width for optical centre) */}
          <div className="flex items-center justify-end gap-6" style={sideStyle(chrome)}>
            <div className="h-10 w-10 shrink-0 lg:hidden" aria-hidden="true" />
            <nav className="hidden items-center gap-8 lg:flex">{NAV_RIGHT.map(navLink)}</nav>
          </div>
        </div>
      </div>

      {/* Hero brand — rendered AFTER the glass pill so it paints above the backdrop-filter */}
      {isHome && <HeroBrand />}

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: SILK }}
            className="vignette fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bitumen px-7 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(5.5rem,calc(env(safe-area-inset-top)+5rem))] lg:hidden"
          >
            {/* Ambient warm glow, top-right */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-[-10%] top-[-6%] h-[320px] w-[320px] rounded-full opacity-25 blur-[90px]"
              style={{ background: "radial-gradient(circle, rgba(200,167,101,0.4), transparent 70%)" }}
            />

            {/* Brand lockup */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6, ease: SILK }}
              className="relative flex items-center gap-3 text-parchment-pale"
            >
              <Mark className="h-7 w-7 text-brass-leaf" />
              <span className="font-display text-[1.15rem] tracking-[0.34em]">VELORA</span>
            </motion.div>

            {/* Primary nav — centred in the available space */}
            <nav className="relative flex flex-1 flex-col justify-center py-8">
              {NAV.map((n, i) => {
                const active = pathname.startsWith(n.href);
                return (
                  <motion.div
                    key={n.href}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.18 + i * 0.07, duration: 0.7, ease: SILK }}
                  >
                    <Link
                      href={n.href}
                      className="group flex items-center justify-between border-b border-brass-leaf/15 py-4"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="ref text-brass-deep">0{i + 1}</span>
                        <span
                          className={cn(
                            "font-display text-[clamp(2.2rem,11vw,3.2rem)] leading-[1.05] transition-colors duration-300",
                            active ? "text-brass-gilt" : "text-parchment-pale group-hover:text-brass-gilt",
                          )}
                        >
                          {n.label}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="translate-x-[-6px] text-brass-deep opacity-0 transition-all duration-500 ease-silk group-hover:translate-x-0 group-hover:opacity-100"
                      >
                        →
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Cart + trade desk */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="relative"
            >
              <button
                type="button"
                onClick={() => { setOpen(false); cartPanel.open(); }}
                className="group flex w-full items-center justify-between rounded-full border border-brass-leaf/25 px-5 py-3.5 text-parchment-pale transition-colors duration-500 hover:border-brass-leaf/60"
              >
                <span className="flex items-center gap-3 text-[0.78rem] uppercase tracking-wide3">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Your cart
                </span>
                <span className="text-[0.78rem] tracking-wide3 text-brass-leaf">
                  {cartCount === 0 ? "Empty" : `${cartCount} ${cartCount === 1 ? "piece" : "pieces"}`}
                </span>
              </button>

              <div className="mt-7 text-haze">
                <p className="eyebrow text-brass-leaf">The trade desk</p>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="mt-3 block font-display text-2xl text-parchment-pale"
                >
                  {BRAND.email}
                </a>
                <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="mt-1 block text-sm">
                  {BRAND.phone}
                </a>
                <p className="mt-4 text-xs uppercase tracking-wider2">
                  {BRAND.city} · {BRAND.region}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
