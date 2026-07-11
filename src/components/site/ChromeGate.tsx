"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Renders the storefront chrome (header, footer, smooth-scroll, floats)
 * everywhere EXCEPT the /admin CMS, which owns its own full-screen shell.
 */
export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
