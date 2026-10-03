/** A deployment identity shared by server, browser and mutable media URLs. */
const BUILD_ID =
  process.env.VERCEL_DEPLOYMENT_ID ??
  process.env.NEXT_PUBLIC_BUILD_ID ??
  `${process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local"}-${Date.now()}`;

/** The CMS must never be cached anywhere, by anyone, ever. */
const NO_STORE = "no-store, no-cache, must-revalidate, max-age=0";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow isolated production checks while the local dev server is running.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  reactStrictMode: true,
  // No X-Powered-By: Next.js header on every response.
  poweredByHeader: false,
  // Design-craft project: keep production builds resilient to lint noise.
  eslint: { ignoreDuringBuilds: true },

  env: { NEXT_PUBLIC_BUILD_ID: BUILD_ID },

  // Next also emits content-hashed JS/CSS; keep those immutable.
  generateBuildId: async () => BUILD_ID,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    // Keep existing legacy image URLs working; new uploads are committed to GitHub.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    // Serve modern formats; smaller payloads on every device.
    formats: ["image/avif", "image/webp"],
    // Cap the largest variant at 2048 (drop the default 3840). Full-screen
    // backgrounds and product shots never need 4K here, and a 3840px AVIF is
    // slow to encode + download — this is what made the signature photos lag.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Mutable media URLs include the build ID; uploads are content addressed.
    minimumCacheTTL: 60,
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
      // Mutable repository media must revalidate; rendered URLs are versioned.
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      // Dynamic layouts disable the Full Route Cache; middleware disables CDN caching.
    ];
  },
};

export default nextConfig;
