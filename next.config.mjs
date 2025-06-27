import path from "path"

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // NEW: make `@/` alias work for Webpack/Vercel build
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname)
    return config
  },
}

export default nextConfig
