import clsx, { type ClassValue } from "clsx";

/** Tiny class combiner. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Map a value from one range to another, clamped. */
export function mapRange(
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  const t = (v - inMin) / (inMax - inMin);
  const c = Math.min(1, Math.max(0, t));
  return outMin + c * (outMax - outMin);
}
