import {MetadataRoute} from 'next'
import {publicClient} from '@/sanity/lib/client'
import {sitemapData} from '@/sanity/lib/queries'

/**
 * Publishes /sitemap.xml for crawlers. Uses the public CDN client (no Live token)
 * so a missing/revoked SANITY_API_READ_TOKEN cannot take the sitemap down.
 */
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = resolveBaseUrl()

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: 'weekly',
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: 'daily',
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: 'monthly',
    },
  ]

  try {
    const pages = await publicClient.fetch(sitemapData)
    if (!pages?.length) {
      return entries
    }

    for (const p of pages) {
      if (!p?.slug) continue

      let priority = 0.7
      let changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly'
      let url = `${baseUrl}/blog/${p.slug}`

      switch (p._type) {
        case 'page':
          priority = 0.8
          changeFrequency = 'monthly'
          url = `${baseUrl}/${p.slug}`
          break
        case 'blogPost':
        case 'post':
          priority = 0.8
          changeFrequency = 'weekly'
          url = `${baseUrl}/blog/${p.slug}`
          break
      }

      entries.push({
        lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
        priority,
        changeFrequency,
        url,
      })
    }
  } catch (error) {
    console.error('[sitemap] Sanity fetch failed; returning static routes only', error)
  }

  return entries
}
