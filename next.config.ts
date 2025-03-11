import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "i.ytimg.com",
        protocol: "https",
      },
      {
        hostname: "yt3.ggpht.com",
        protocol: "https",
      },
      {
        hostname: "acoustic-orca-473.convex.cloud",
        protocol: "https",
      },
    ],
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /@schematichq\/schematic-components/,
      parser: {
        commonjs: false,
      },
    });
    return config;
  },
};

export default nextConfig;
