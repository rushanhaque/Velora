import "server-only";
import { createHmac, createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Admin gate for the CMS.
 *
 * ── Why there is no default password ────────────────────────────────────────
 * This previously defaulted to a literal password committed to the repository,
 * which is public. That put the live CMS behind a credential anyone could read
 * on GitHub. There is now no fallback: in production ADMIN_PASSWORD must be set
 * or the CMS refuses every login and says so. A locked-out admin is recoverable
 * in a minute; a publicly-known one is not.
 *
 * The password itself is never stored in the cookie — the cookie holds an HMAC
 * derived from it, so it cannot be forged without knowing the password, and
 * rotating ADMIN_PASSWORD invalidates every existing session for free.
 */
const COOKIE = "velora_admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
/** Dev convenience only — never reachable in a deployed build. */
const DEV_FALLBACK = process.env.NODE_ENV === "production" ? "" : "velora-dev";

function secret(): string {
  return ADMIN_PASSWORD || DEV_FALLBACK;
}

export function adminConfigured(): boolean {
  return secret().length > 0;
}

function sessionToken(): string {
  return createHmac("sha256", secret()).update("velora-admin-session-v1").digest("hex");
}

export function checkPassword(input: string): boolean {
  const expected = secret();
  if (!expected) return false;
  // Compare fixed-width digests rather than the raw strings. A direct
  // timingSafeEqual on the inputs has to bail out early when the lengths
  // differ, which leaks the password's length to anyone timing the endpoint.
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export const SESSION_COOKIE = COOKIE;
export function sessionValue(): string {
  return sessionToken();
}

export function isAuthed(): boolean {
  if (!adminConfigured()) return false;
  const value = cookies().get(COOKIE)?.value;
  if (!value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(sessionToken());
  return a.length === b.length && timingSafeEqual(a, b);
}
