import type { Metadata } from "next";
import { AdminClient } from "@/components/admin/AdminClient";

export const metadata: Metadata = {
  title: "Velora CMS",
  description: "Manage the Velora catalogue — products, collections & subcategories.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
