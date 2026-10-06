import {describe, expect, it} from 'vitest'
import {buildHomeJsonLd} from '@/app/structuredData'

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
    expect(website).toMatchObject({'name': 'Yamaha XSR 900 Hub', 'inLanguage': 'fr-FR'})
  })
})
