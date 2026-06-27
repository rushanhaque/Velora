"use client";

import { useSyncExternalStore } from "react";

/**
 * In-memory trade-enquiry basket. Intentionally NOT persisted —
 * the basket resets on every page load/refresh.
 */
let items: string[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const enquiry = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  get(): string[] {
    return items;
  },
  has(slug: string) {
    return items.includes(slug);
  },
  add(slug: string) {
    if (!items.includes(slug)) {
      items = [...items, slug];
      emit();
    }
  },
  remove(slug: string) {
    if (items.includes(slug)) {
      items = items.filter((s) => s !== slug);
      emit();
    }
  },
  toggle(slug: string) {
    items.includes(slug) ? enquiry.remove(slug) : enquiry.add(slug);
  },
  clear() {
    items = [];
    emit();
  },
};

const EMPTY: string[] = [];

/** Subscribe a component to the whole list. */
export function useEnquiry(): string[] {
  return useSyncExternalStore(
    enquiry.subscribe,
    () => items,
    () => EMPTY,
  );
}

/** Subscribe to a single slug's membership. */
export function useInEnquiry(slug: string): boolean {
  return useSyncExternalStore(
    enquiry.subscribe,
    () => items.includes(slug),
    () => false,
  );
}

/* ── Cart panel open/close store ── */
let panelOpen = false;
const panelListeners = new Set<() => void>();
function emitPanel() { panelListeners.forEach((l) => l()); }

export const cartPanel = {
  subscribe(cb: () => void) {
    panelListeners.add(cb);
    return () => panelListeners.delete(cb);
  },
  get() { return panelOpen; },
  open() { panelOpen = true; emitPanel(); },
  close() { panelOpen = false; emitPanel(); },
  toggle() { panelOpen = !panelOpen; emitPanel(); },
};

export function useCartPanel(): boolean {
  return useSyncExternalStore(cartPanel.subscribe, () => panelOpen, () => false);
}
