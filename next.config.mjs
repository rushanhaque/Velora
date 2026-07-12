/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  },
  experimental: {
    // Tree-shake heavy libs so only the used pieces ship to the client.
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
