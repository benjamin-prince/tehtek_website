import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.tehtek.com",
      },
      {
        protocol: "https",
        hostname: "api2.tehtek.com",
      },
    ],
  },
};

export default nextConfig;
