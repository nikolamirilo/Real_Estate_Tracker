import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'resizer2.4zida.rs',
      },
    ],
  },
};

export default nextConfig;
