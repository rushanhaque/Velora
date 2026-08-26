/**
 * The catalogue refresh chain, extracted so it can be tested without a browser
 * or a running server. This is the precedence rule the storefront and the CMS
 * both follow when deciding which catalogue to believe.
 */

export const BUNDLED_SNAPSHOT = {
  collections: [],
  specimens: [{ slug: "bundled" }],
  updatedAt: undefined,
};

export const STATIC_FALLBACK = {
  collections: [],
  specimens: [{ slug: "static" }],
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function isCatalogue(x) {
  return (
    !!x &&
    typeof x === "object" &&
    Array.isArray(x.collections) &&
    Array.isArray(x.specimens)
  );
}

/**
 * Resolve which catalogue to use.
 *
 * Order of preference: the live endpoint, then the static build-time copy, then
 * the compiled snapshot. The one exception is `current` — a catalogue already
 * loaded in this session. A payload that is *older* than what is already held
 * is refused outright, because an in-flight response from before the last
 * publish must never be allowed to land on top of a fresher one.
 */
export async function resolveCatalogue({
  fetchImpl,
  staticCopy = null,
  current = null,
  url = "/api/catalog",
} = {}) {
  let live = null;
  try {
    const res = await fetchImpl(url);
    if (res && res.ok && isCatalogue(res.body)) live = res.body;
  } catch {
    live = null;
  }

  if (live) {
    if (current && current.updatedAt && live.updatedAt) {
      // Strictly newer wins; equal or older keeps what is already displayed.
      if (new Date(live.updatedAt) <= new Date(current.updatedAt)) {
        return { source: "current", catalogue: current };
      }
    }
    return { source: "live", catalogue: live };
  }

  if (current) return { source: "current", catalogue: current };
  if (isCatalogue(staticCopy)) return { source: "static", catalogue: staticCopy };
  return { source: "bundled", catalogue: BUNDLED_SNAPSHOT };
}
