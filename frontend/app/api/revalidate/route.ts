import {revalidatePath} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

export const runtime = 'nodejs'

interface WebhookPayload {
  _id?: string
  _type?: string
  slug?: {current?: string} | string
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET

    const hasSignatureHeader = Boolean(req.headers.get('sanity-webhook-signature'))
    const authHeader = req.headers.get('authorization')
    const secretQuery = req.nextUrl.searchParams.get('secret')

    let body: WebhookPayload | null = null

    if (secret && hasSignatureHeader) {
      const parsed = await parseBody<WebhookPayload>(req, secret, false)
      if (parsed.isValidSignature === false) {
        return NextResponse.json({message: 'Invalid signature'}, {status: 401})
      }
      body = parsed.body
    } else if (secret) {
      const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null
      const providedSecret = bearerToken || secretQuery
      if (providedSecret !== secret.trim()) {
        return NextResponse.json({message: 'Invalid secret'}, {status: 401})
      }
      try {
        body = (await req.json()) as WebhookPayload
      } catch {
        body = null
      }
    } else {
      try {
        body = (await req.json()) as WebhookPayload
      } catch {
        body = null
      }
    }

    const slug =
      typeof body?.slug === 'string'
        ? body.slug
        : typeof body?.slug?.current === 'string'
          ? body.slug.current
          : null

    const revalidatedPaths: string[] = ['/', '/blog', '/sitemap.xml']

    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath('/sitemap.xml')

    if (slug) {
      revalidatePath(`/blog/${slug}`)
      revalidatePath(`/posts/${slug}`)
      revalidatedPaths.push(`/blog/${slug}`, `/posts/${slug}`)
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      paths: revalidatedPaths,
      slug,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error during revalidation'
    console.error('Revalidation error:', err)
    return NextResponse.json({revalidated: false, error: message}, {status: 500})
  }
}

export async function GET(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (secret) {
    const provided = req.nextUrl.searchParams.get('secret')
    if (provided !== secret.trim()) {
      return NextResponse.json({message: 'Invalid secret'}, {status: 401})
    }
  }

  const slug = req.nextUrl.searchParams.get('slug')
  const paths = ['/', '/blog', '/sitemap.xml']

  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/sitemap.xml')

  if (slug) {
    revalidatePath(`/blog/${slug}`)
    revalidatePath(`/posts/${slug}`)
    paths.push(`/blog/${slug}`, `/posts/${slug}`)
  }

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    paths,
    slug,
  })
}
