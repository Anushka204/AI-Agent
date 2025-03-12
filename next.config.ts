import withTM from 'next-transpile-modules';

const nextConfig = withTM(['@schematichq/schematic-components'])({
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
});

export default nextConfig;
