import type { Metadata, Viewport } from "next";
import { display, sans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/Parallax";
import { LightBench } from "@/components/motion/LightBench";
import { CartFloat } from "@/components/ui/CartFloat";
import { CartPanel } from "@/components/ui/CartPanel";
import { BRAND } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://velora.example"),
  title: {
    default: "Velora International — Métaux d'Art · Hand-raised metalware since 1972",
    template: "%s — Velora International",
  },
  description:
    "Velora International is a trade atelier in Moradabad, India, raising heirloom objects in brass, bronze, copper and silver entirely by hand since 1972. Made to order for the world's finest interiors.",
  keywords: [
    "metal handicraft",
    "brass",
    "bronze",
    "silver",
    "Moradabad",
    "hand-raised metalware",
    "trade atelier",
    "luxury homeware",
    "bespoke metalwork",
  ],
  authors: [{ name: BRAND.name }],
  openGraph: {
    title: "Velora International — Métaux d'Art",
    description:
      "Heirloom objects in brass, bronze & silver — hand-raised in Moradabad since 1972.",
    type: "website",
    locale: "en_GB",
    siteName: BRAND.name,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F0EBE1" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0907" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(display.variable, sans.variable)}>
      <body className="font-sans antialiased">
        <noscript>
          <style>{`[data-reveal],.clip-reveal,.mask-inner{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}`}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <ScrollProgress />
        <LightBench />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CartFloat />
        <CartPanel />
        {/* Film grain — cinematic warmth over everything, inert */}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
