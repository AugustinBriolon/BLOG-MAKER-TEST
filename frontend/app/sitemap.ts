import {MetadataRoute} from 'next'
import {getDynamicFetchOptions, sanityFetchMetadata} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'
import {headers} from 'next/headers'

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
  const proto =
    headersList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
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

  if (allPostsAndPages != null && allPostsAndPages.data.length != 0) {
    for (const p of allPostsAndPages.data) {
      let priority = 0.7
      let changeFrequency:
        | 'monthly'
        | 'always'
        | 'hourly'
        | 'daily'
        | 'weekly'
        | 'yearly'
        | 'never'
        | undefined = 'weekly'
      let url = `${baseUrl}/blog/${p.slug}`

      switch (p._type) {
        case 'page':
          priority = 0.8
          changeFrequency = 'monthly'
          url = `${baseUrl}/${p.slug}`
          break
        case 'blogPost':
          priority = 0.8
          changeFrequency = 'weekly'
          url = `${baseUrl}/blog/${p.slug}`
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
