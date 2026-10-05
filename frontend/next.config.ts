import type { NextConfig } from 'next';
import { sanity } from 'next-sanity/live/cache-life';

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: { default: sanity },
  images: {
    remotePatterns: [
      new URL('https://cdn.sanity.io/**'),
      new URL('https://cdn2.yamaha-motor.eu/**'),
    ],
  },
  // Proxy /studio to the Sanity Studio dev server running on port 3333
  async rewrites() {
    return [
      {
        source: '/studio',
        destination: 'http://localhost:3333/studio',
      },
      {
        source: '/studio/:path*',
        destination: 'http://localhost:3333/studio/:path*',
      },
    ];
  },
};

export default nextConfig;

