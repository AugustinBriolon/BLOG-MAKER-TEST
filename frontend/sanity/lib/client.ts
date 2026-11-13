import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, studioUrl} from '@/sanity/lib/api'
import {token} from '@/sanity/lib/token'

/** Tokenless CDN client — safe for public published reads (sitemap, etc.). */
export const publicClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  ...(token ? {token} : {}),
  stega: {studioUrl},
})
