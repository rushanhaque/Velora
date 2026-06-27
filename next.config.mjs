/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Design-craft project: keep production builds resilient to lint noise.
  eslint: { ignoreDuringBuilds: true },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};

export default nextConfig;
