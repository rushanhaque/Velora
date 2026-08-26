/**
 * Build identity. On Vercel every deploy has a distinct commit SHA; locally the
 * wall clock stands in. This value is inlined into the client bundle and also
 * served (uncached) from /version.json, so a browser can tell whether the code
 * it is running is the code currently deployed. See src/lib/build-id.ts.
 */
const BUILD_ID =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ??
  process.env.NEXT_PUBLIC_BUILD_ID ??
  String(Date.now());

/** The CMS must never be cached anywhere, by anyone, ever. */
const NO_STORE = "no-store, no-cache, must-revalidate, max-age=0";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No X-Powered-By: Next.js header on every response.
  poweredByHeader: false,
  // Design-craft project: keep production builds resilient to lint noise.
  eslint: { ignoreDuringBuilds: true },

  env: { NEXT_PUBLIC_BUILD_ID: BUILD_ID },

  // Tie Next's own asset hashing to the deploy, so a new deploy can never serve
  // a half-old / half-new mix of chunks to a browser holding cached HTML.
  generateBuildId: async () => BUILD_ID,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    // CMS-uploaded product photos are served from Vercel Blob.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    // Serve modern formats; smaller payloads on every device.
    formats: ["image/avif", "image/webp"],
    // Cap the largest variant at 2048 (drop the default 3840). Full-screen
    // backgrounds and product shots never need 4K here, and a 3840px AVIF is
    // slow to encode + download — this is what made the signature photos lag.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Cache optimized images for 31 days (default is 60s, which forces the
    // optimizer to re-encode AVIF/WebP for every photo on repeat visits).
    minimumCacheTTL: 2678400,
  },
  experimental: {
    // Tree-shake heavy libs so only the used pieces ship to the client.
    optimizePackageImports: ["framer-motion"],
  },

  async headers() {
    return [
      // ── The CMS: never cached, never indexed ─────────────────────────────
      // Without this /admin is a prerendered static page and Vercel serves it
      // from the edge (X-Vercel-Cache: PRERENDER), so an admin can open the
      // panel and be handed a snapshot from before their own last publish.
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: NO_STORE },
          { key: "CDN-Cache-Control", value: NO_STORE },
          { key: "Vercel-CDN-Cache-Control", value: NO_STORE },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      // NOTE: /version.json sets its own no-store headers in its route handler;
      // declaring them here too just emits every header twice.
      // ── Content-addressed product photos ─────────────────────────────────
      // The filename is a hash of the bytes, so the content behind a given URL
      // can never change. Safe to cache forever.
      {
        source: "/product-photos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Long-lived caching for directly-served /media assets. Not `immutable`
      // because media is managed by hand and may be replaced in place — stale-
      // while-revalidate keeps repeat loads instant while picking up changes.
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=2592000",
          },
        ],
      },
      // NOTE: HTML documents are handled in src/middleware.ts, not here. A page
      // with `export const revalidate` gets its Cache-Control from ISR, which
      // wins over anything declared in this file — middleware runs later and is
      // the only place that reliably overrides it.
    ];
  },
};

export default nextConfig;
