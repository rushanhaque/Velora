/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No X-Powered-By: Next.js header on every response.
  poweredByHeader: false,
  // Design-craft project: keep production builds resilient to lint noise.
  eslint: { ignoreDuringBuilds: true },
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
  // Long-lived caching for directly-served /media assets. Not `immutable`
  // because media is managed by hand and may be replaced in place — stale-
  // while-revalidate keeps repeat loads instant while picking up changes.
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=2592000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
