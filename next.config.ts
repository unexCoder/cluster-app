import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // toggle off dev indicators
  devIndicators: false,
  // declare remote image site patterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
    ],
    qualities: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
  // enable cache components
  cacheComponents: true,
};

export default nextConfig;
