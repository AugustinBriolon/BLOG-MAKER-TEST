import type {MetadataRoute} from 'next'

function resolveBaseUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

  if (fromEnv) {
    try {
      const u = new URL(fromEnv)
      return `${u.protocol}//${u.host}`
    } catch {
      // fall through
    }
  }

  return 'https://yamaha-xsr900.vercel.app'
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = resolveBaseUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/studio/', '/api', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
