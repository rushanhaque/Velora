import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Minimal admin gate for the CMS. The password is `Hammad@123` by default; set
 * an ADMIN_PASSWORD env var (Vercel → Settings → Environment Variables) to
 * override it and keep it out of the repository. The password itself is never
 * stored in the cookie — the cookie holds an HMAC derived from it, so it can't
 * be forged without knowing the password.
 */
const COOKIE = "velora_admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Hammad@123";

export function adminConfigured(): boolean {
  // There is always a password (env override or the built-in default).
  return true;
}

function sessionToken(): string {
  return createHmac("sha256", ADMIN_PASSWORD).update("velora-admin-session-v1").digest("hex");
}

export function checkPassword(input: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(ADMIN_PASSWORD);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const SESSION_COOKIE = COOKIE;
export function sessionValue(): string {
  return sessionToken();
}

export function isAuthed(): boolean {
  const value = cookies().get(COOKIE)?.value;
  return Boolean(value) && value === sessionToken();
}
