import {MetadataRoute} from 'next'
import {getDynamicFetchOptions, sanityFetchMetadata} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'
import {headers} from 'next/headers'
import {CURATED_ARTICLES} from '@/app/data/curated-articles'

/**
 * This file creates a sitemap (sitemap.xml) for the application. Learn more about sitemaps in Next.js here: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 * Be sure to update the `changeFrequency` and `priority` values to match your application's content.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {perspective} = await getDynamicFetchOptions()
  const allPostsAndPages = await sanityFetchMetadata({
    query: sitemapData,
    perspective,
  })
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const proto = headersList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  const baseUrl = `${proto}://${host}`

  const sitemap: MetadataRoute.Sitemap = []
  sitemap.push({
    url: baseUrl,
    lastModified: new Date(),
    priority: 1,
    changeFrequency: 'weekly',
  })
  sitemap.push({
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    priority: 0.9,
    changeFrequency: 'daily',
  })

  // If Sanity is empty, index curated articles
  if (!allPostsAndPages?.data || allPostsAndPages.data.length === 0) {
    for (const ca of CURATED_ARTICLES) {
      sitemap.push({
        url: `${baseUrl}/blog/${ca.slug}`,
        lastModified: new Date(ca.date),
        priority: 0.8,
        changeFrequency: 'weekly',
      })
    }
  }

  if (allPostsAndPages != null && allPostsAndPages.data.length != 0) {
    let priority: number
    let changeFrequency:
      | 'monthly'
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'yearly'
      | 'never'
      | undefined
    let url: string

    for (const p of allPostsAndPages.data) {
      switch (p._type) {
        case 'page':
          priority = 0.8
          changeFrequency = 'monthly'
          url = `${baseUrl}/${p.slug}`
          break
        case 'post':
          priority = 0.7
          changeFrequency = 'weekly'
          url = `${baseUrl}/posts/${p.slug}`
          break
      }
      sitemap.push({
        lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
        priority,
        changeFrequency,
        url,
      })
    }
  }

  return sitemap
}
