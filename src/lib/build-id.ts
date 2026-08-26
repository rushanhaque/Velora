/**
 * Build identity — the single value every browser compares itself against.
 *
 * `NEXT_PUBLIC_BUILD_ID` is baked into the client bundle at build time by
 * next.config.mjs (git SHA on Vercel, wall-clock locally). `/version.json`
 * serves the *server's* current value with `no-store`; when a browser sees a
 * value that differs from the one compiled into its own JavaScript, it is
 * running code from a previous deploy and reloads exactly once.
 *
 * Importable from both server and client — it is a plain inlined string.
 */
export const BUILD_ID: string = process.env.NEXT_PUBLIC_BUILD_ID ?? "dev";

/** sessionStorage key guarding against a reload loop (see VersionWatch). */
export const RELOAD_GUARD_KEY = "velora:reloaded-for";

/** localStorage flag the CMS raises while it holds unpublished edits. */
export const ADMIN_DIRTY_KEY = "velora:admin-dirty";
