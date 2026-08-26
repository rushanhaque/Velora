import type { Metadata } from "next";
import { AdminClient } from "@/components/admin/AdminClient";

export const metadata: Metadata = {
  title: "Velora CMS",
  description: "Manage the Velora catalogue — products, collections & subcategories.",
  robots: { index: false, follow: false },
};

/**
 * Never prerender the CMS. As a static page it was served with
 * `X-Vercel-Cache: PRERENDER`, so an admin could open the panel and be handed
 * an edge snapshot from before their own last publish. Paired with the
 * no-store headers in middleware.ts and next.config.mjs.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminPage() {
  return <AdminClient />;
}
