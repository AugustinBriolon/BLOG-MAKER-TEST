import type { NextConfig } from 'next';
import { sanity } from 'next-sanity/live/cache-life';

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: { default: sanity },
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/**')],
  },
  // Proxy /studio/* to the Sanity Studio dev server running on port 3334
  async rewrites() {
    return [
      {
        source: '/studio/:path*',
        destination: 'http://localhost:3334/:path*',
      },
    ];
  },
};

export default nextConfig;

