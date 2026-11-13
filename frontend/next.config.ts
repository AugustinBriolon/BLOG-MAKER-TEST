import type {NextConfig} from 'next'
import {sanity} from 'next-sanity/live/cache-life'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {default: sanity},
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      new URL('https://cdn.sanity.io/**'),
      new URL('https://cdn2.yamaha-motor.eu/**'),
    ],
  },
  async redirects() {
    return [
      {
        source: '/posts/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      // Slug typé (tape) — doublon title vs version « etape-par-etape »
      {
        source: '/blog/comment-effectuer-l-entretien-du-moteur-cp3-tape-par-tape',
        destination: '/blog/comment-effectuer-l-entretien-du-moteur-cp3-etape-par-etape',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
