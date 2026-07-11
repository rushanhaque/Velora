import type { MetadataRoute } from "next";
import { readCatalog } from "@/lib/catalog-store";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://velora.example";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const { specimens } = await readCatalog();

  const staticRoutes = [
    "",
    "/collections",
    "/craft",
    "/maison",
    "/contact",
    "/faq",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const specimenRoutes = specimens.map((s) => ({
    url: `${BASE}/collections/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...specimenRoutes];
}
