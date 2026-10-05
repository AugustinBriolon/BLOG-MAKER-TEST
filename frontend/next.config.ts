import type {NextConfig} from 'next'
import {sanity} from 'next-sanity/live/cache-life'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {default: sanity},
  images: {
    remotePatterns: [
      new URL('https://cdn.sanity.io/**'),
      new URL('https://cdn2.yamaha-motor.eu/**'),
    ],
  },
}

export default nextConfig
