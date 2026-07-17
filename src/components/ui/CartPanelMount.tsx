"use client";

import dynamic from "next/dynamic";

/**
 * Defers the cart modal off the first paint. CartPanel renders nothing until
 * it's opened, yet it pulls in framer-motion + the SVG specimen art + media
 * components. Loading it dynamically (client-only) keeps that graph out of the
 * initial bundle; it fetches after hydration / on the first cart open.
 */
export const CartPanelMount = dynamic(
  () => import("./CartPanel").then((m) => m.CartPanel),
  { ssr: false },
);
