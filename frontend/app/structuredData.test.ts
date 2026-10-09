import {describe, expect, it} from 'vitest'
import {buildArticleJsonLd, buildBlogHubJsonLd, buildHomeJsonLd} from '@/app/structuredData'

const PRODUCT_TYPES = ['Product', 'Vehicle', 'Motorcycle', 'Car']
const PRODUCT_REQUIRED_ONE_OF = ['offers', 'review', 'aggregateRating']

describe('buildHomeJsonLd', () => {
  const jsonLd = buildHomeJsonLd()
  const nodes: Array<Record<string, unknown>> = jsonLd['@graph']

  it('uses the schema.org context', () => {
    expect(jsonLd['@context']).toBe('https://schema.org')
  })

  it('never emits a Product-like node missing offers, review or aggregateRating', () => {
    const invalidProducts = nodes.filter(
      (node) =>
        PRODUCT_TYPES.includes(node['@type'] as string) &&
        !PRODUCT_REQUIRED_ONE_OF.some((field) => field in node),
    )
    expect(invalidProducts).toEqual([])
  })

  it('describes the motorcycle as the subject of the home page', () => {
    const webPage = nodes.find((node) => node['@type'] === 'WebPage')
    expect(webPage?.about).toMatchObject({'@type': 'Thing', 'name': 'Yamaha XSR 900'})
  })

  it('declares the French website', () => {
    const website = nodes.find((node) => node['@type'] === 'WebSite')
    expect(website).toMatchObject({name: 'Yamaha XSR 900 Hub', inLanguage: 'fr-FR'})
  })
})

describe('buildBlogHubJsonLd', () => {
  const jsonLd = buildBlogHubJsonLd('https://yamaha-xsr900.vercel.app')
  const nodes: Array<Record<string, unknown>> = jsonLd['@graph']

  it('emits Blog and BreadcrumbList schemas', () => {
    const blog = nodes.find((n) => n['@type'] === 'Blog')
    const breadcrumb = nodes.find((n) => n['@type'] === 'BreadcrumbList')

    expect(blog).toBeDefined()
    expect(blog?.name).toContain('Le Blog XSR 900')
    expect(breadcrumb).toBeDefined()

    const items = breadcrumb?.itemListElement as Array<{
      position: number
      name: string
      item: string
    }>
    expect(items).toHaveLength(2)
    expect(items[0].name).toBe('Accueil')
    expect(items[1].name).toBe('Blog')
  })
})

describe('buildArticleJsonLd', () => {
  const jsonLd = buildArticleJsonLd({
    title: 'Essai complet Yamaha XSR 900 2025',
    description: 'Notre avis approfondi sur le roadster néo-rétro japonais.',
    slug: 'essai-yamaha-xsr-900-2025',
    date: '2026-10-06T12:00:00.000Z',
    updatedAt: '2026-10-09T14:00:00.000Z',
    imageUrl: 'https://cdn.sanity.io/images/1bl9u0y1/production/cover.jpg',
    authorName: 'Augustin Briolon',
    authorRole: 'Chroniqueur technique & Pilote',
    authorBio: 'Spécialiste du moteur CP3',
    baseUrl: 'https://yamaha-xsr900.vercel.app',
  })
  const nodes: Array<Record<string, unknown>> = jsonLd['@graph']

  it('emits a valid BlogPosting node', () => {
    const post = nodes.find((n) => n['@type'] === 'BlogPosting')
    expect(post).toBeDefined()
    expect(post?.headline).toBe('Essai complet Yamaha XSR 900 2025')
    expect(post?.url).toBe('https://yamaha-xsr900.vercel.app/blog/essai-yamaha-xsr-900-2025')
    expect(post?.datePublished).toBe('2026-10-06T12:00:00.000Z')
    expect(post?.dateModified).toBe('2026-10-09T14:00:00.000Z')
    expect(post?.inLanguage).toBe('fr-FR')
    expect(post?.image).toEqual(['https://cdn.sanity.io/images/1bl9u0y1/production/cover.jpg'])
    expect(post?.author).toMatchObject({
      '@type': 'Person',
      'name': 'Augustin Briolon',
      'jobTitle': 'Chroniqueur technique & Pilote',
    })
    expect(post?.publisher).toMatchObject({
      '@type': 'Organization',
      'name': 'Yamaha XSR 900 Hub',
    })
  })

  it('emits a BreadcrumbList matching the 3-level site hierarchy', () => {
    const breadcrumb = nodes.find((n) => n['@type'] === 'BreadcrumbList')
    expect(breadcrumb).toBeDefined()

    const items = breadcrumb?.itemListElement as Array<{
      position: number
      name: string
      item: string
    }>
    expect(items).toHaveLength(3)
    expect(items[0]).toMatchObject({
      position: 1,
      name: 'Accueil',
      item: 'https://yamaha-xsr900.vercel.app/',
    })
    expect(items[1]).toMatchObject({
      position: 2,
      name: 'Blog',
      item: 'https://yamaha-xsr900.vercel.app/blog',
    })
    expect(items[2]).toMatchObject({
      position: 3,
      name: 'Essai complet Yamaha XSR 900 2025',
      item: 'https://yamaha-xsr900.vercel.app/blog/essai-yamaha-xsr-900-2025',
    })
  })
})
