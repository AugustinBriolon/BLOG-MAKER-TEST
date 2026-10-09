import {describe, it, expect, vi, beforeEach} from 'vitest'
import {NextRequest} from 'next/server'
import {GET, POST} from './route'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next-sanity/webhook', () => ({
  parseBody: vi.fn(),
}))

import {revalidatePath} from 'next/cache'

describe('ISR Revalidation Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.SANITY_REVALIDATE_SECRET
  })

  it('revalidates paths on GET without secret requirement when env not set', async () => {
    const req = new NextRequest('http://localhost:3000/api/revalidate?slug=test-article')
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.revalidated).toBe(true)
    expect(json.slug).toBe('test-article')
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(revalidatePath).toHaveBeenCalledWith('/blog')
    expect(revalidatePath).toHaveBeenCalledWith('/sitemap.xml')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/test-article')
    expect(revalidatePath).toHaveBeenCalledWith('/posts/test-article')
  })

  it('rejects GET when secret is set and missing', async () => {
    process.env.SANITY_REVALIDATE_SECRET = 'secret123'
    const req = new NextRequest('http://localhost:3000/api/revalidate')
    const res = await GET(req)

    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.message).toBe('Invalid secret')
  })

  it('accepts GET when correct secret is provided', async () => {
    process.env.SANITY_REVALIDATE_SECRET = 'secret123'
    const req = new NextRequest('http://localhost:3000/api/revalidate?secret=secret123')
    const res = await GET(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.revalidated).toBe(true)
  })

  it('revalidates paths on POST with JSON body containing slug', async () => {
    const req = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({
        _type: 'blogPost',
        slug: {current: 'mon-nouvel-article'},
      }),
      headers: {
        'content-type': 'application/json',
      },
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.revalidated).toBe(true)
    expect(json.slug).toBe('mon-nouvel-article')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/mon-nouvel-article')
  })
})
