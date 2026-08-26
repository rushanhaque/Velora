import { NextResponse, type NextRequest } from "next/server";

const NO_STORE = "no-store, no-cache, must-revalidate, max-age=0";
/** Browsers must ask the origin every time before rendering a document. */
const HTML_BROWSER_CACHE = "public, max-age=0, must-revalidate";
/** ...while the CDN may still answer from the edge for a minute. */
const HTML_EDGE_CACHE = "public, s-maxage=60, stale-while-revalidate=300";

/**
 * Cache policy that nothing downstream can override.
 *
 * Two things make this necessary rather than merely tidy:
 *
 *  1. **The CMS.** As a prerendered page /admin was served from the edge with
 *     `X-Vercel-Cache: PRERENDER`, so an admin could open the panel and be
 *     handed a snapshot from before their own last publish.
 *
 *  2. **ISR overwrites `Cache-Control`.** Giving a page `export const
 *     revalidate` makes Next emit `s-maxage=60, stale-while-revalidate` with no
 *     `max-age`, which leaves browsers free to cache the document heuristically
 *     — a device can then render an old page without ever asking the origin.
 *     Declaring headers in next.config.mjs does not win against this; setting
 *     them here, after the response is produced, does.
 *
 * The split below keeps both properties: `Cache-Control` governs the browser
 * (always revalidate), `Vercel-CDN-Cache-Control` governs the edge (serve fast),
 * so pages stay quick without any device getting stuck on an old one.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    res.headers.set("Cache-Control", NO_STORE);
    res.headers.set("CDN-Cache-Control", NO_STORE);
    res.headers.set("Vercel-CDN-Cache-Control", NO_STORE);
    res.headers.set("Pragma", "no-cache");
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  // Everything the matcher lets through is a document: it already excludes
  // Next's static output, the image optimiser, API routes and any path with a
  // file extension. Deliberately not keyed off the Accept header — a client
  // that omits it would otherwise fall through to the ISR policy and be free to
  // cache the page, which is the exact hole this closes.
  res.headers.set("Cache-Control", HTML_BROWSER_CACHE);
  res.headers.set("CDN-Cache-Control", HTML_EDGE_CACHE);
  res.headers.set("Vercel-CDN-Cache-Control", HTML_EDGE_CACHE);

  return res;
}

export const config = {
  matcher: [
    /**
     * Everything except Next's own static output, the image optimiser, API
     * routes (which set their own policy) and anything with a file extension.
     */
    "/((?!_next/static|_next/image|api/|favicon.ico|.*\\.[\\w]+$).*)",
  ],
};
