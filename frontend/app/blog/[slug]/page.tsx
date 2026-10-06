import type {Metadata, ResolvingMetadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

import DedicatedArticleView from '@/app/components/DedicatedArticleView'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {morePostsQuery, postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

/**
 * Generate static params for the page.
 */
export async function generateStaticParams() {
  const {data} = await sanityFetchStaticParams({
    query: postPagesSlugs,
  })

  const sanitySlugs = data?.filter((p) => Boolean(p.slug)) || []
  if (sanitySlugs.length === 0) {
    return [{slug: '_initialization'}]
  }
  return sanitySlugs
}

/**
 * Generate metadata for the page.
 */
export async function generateMetadata(
  props: PageProps<'/blog/[slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [{slug}, {perspective}] = await Promise.all([props.params, getDynamicFetchOptions()])
  const {data: post} = await sanityFetchMetadata({
    query: postQuery,
    params: {slug},
    perspective,
  })

  if (post?._id) {
    const previousImages = (await parent).openGraph?.images || []
    const ogImage = resolveOpenGraphImage(post?.coverImage)

    return {
      authors:
        post?.author?.firstName && post?.author?.lastName
          ? [{name: `${post.author.firstName} ${post.author.lastName}`}]
          : [],
      title: post?.title,
      description: post?.excerpt || undefined,
      alternates: {
        canonical: `/blog/${slug}`,
      },
      openGraph: {
        title: `${post?.title} | Blog Yamaha XSR 900`,
        description: post?.excerpt || undefined,
        type: 'article',
        publishedTime: post?.date || undefined,
        images: ogImage ? [ogImage, ...previousImages] : previousImages,
      },
    } satisfies Metadata
  }

  return {
    title: 'Dossier Introuvable | Yamaha XSR 900',
  } satisfies Metadata
}

// Layer 1: Page component (draftMode branch)
export default async function BlogSlugPage({params}: PageProps<'/blog/[slug]'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<BlogSlugFallback />}>
        <DynamicBlogSlugPage params={params} />
      </Suspense>
    )
  }
  const {slug} = await params
  return <CachedBlogSlugPage slug={slug} perspective="published" stega={false} />
}

// Layer 2: Dynamic component
async function DynamicBlogSlugPage({params}: Pick<PageProps<'/blog/[slug]'>, 'params'>) {
  const [{slug}, {perspective, stega}] = await Promise.all([params, getDynamicFetchOptions()])
  return <CachedBlogSlugPage slug={slug} perspective={perspective} stega={stega} />
}

// Layer 3: Cached component
async function CachedBlogSlugPage({
  slug,
  perspective,
  stega,
}: {slug: string} & DynamicFetchOptions) {
  'use cache'
  const {data: post} = await sanityFetch({
    query: postQuery,
    params: {slug},
    perspective,
    stega,
  })

  if (!post?._id) {
    return notFound()
  }

  // Fetch related articles from Sanity
  let related: {
    slug: string
    title: string
    category: string
    readTime: string
    excerpt: string
  }[] = []

  const {data: more} = await sanityFetch({
    query: morePostsQuery,
    params: {skip: post._id, limit: 3},
    perspective,
    stega,
  })
  if (more && more.length > 0) {
    related = more.map((m) => ({
      slug: m.slug || '',
      title: m.title || 'Dossier XSR 900',
      category: 'BLOG ARTICLE',
      readTime: '5 min de lecture',
      excerpt: m.excerpt || '',
    }))
  }

  return (
    <DedicatedArticleView
      sanityPost={post}
      relatedArticles={related}
    />
  )
}

function BlogSlugFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center font-mono text-xs text-zinc-500 bg-black">
      CHARGEMENT DU DOSSIER BLOG...
    </div>
  )
}
