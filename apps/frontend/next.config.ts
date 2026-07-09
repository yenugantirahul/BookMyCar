import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config) => {
    // In a pnpm monorepo, vendor chunks for packages like @clerk/nextjs are
    // stored in the root node_modules via pnpm's virtual store. Adding the
    // monorepo root to Webpack's module resolution paths fixes the
    // "Cannot find module './vendor-chunks/@clerk+nextjs...'" error.
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, "../../node_modules"),
    ];
    return config;
  },
};

export default nextConfig;
