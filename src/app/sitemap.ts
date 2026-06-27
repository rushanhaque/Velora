import type { MetadataRoute } from "next";
import { SPECIMENS } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://velora.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/collections",
    "/craft",
    "/maison",
    "/connect",
    "/faq",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const specimenRoutes = SPECIMENS.map((s) => ({
    url: `${BASE}/collections/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...specimenRoutes];
}
