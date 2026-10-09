import type {Metadata, ResolvingMetadata} from 'next'
import {permanentRedirect} from 'next/navigation'

import {
  getDynamicFetchOptions,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from '@/sanity/lib/live'
import {postPagesSlugs, postQuery} from '@/sanity/lib/queries'
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
  props: PageProps<'/posts/[slug]'>,
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
      title: post?.metaTitle || post?.title,
      description: post?.metaDescription || post?.excerpt || undefined,
      alternates: {
        canonical: `/blog/${slug}`,
      },
      openGraph: {
        title: `${post?.title} | Dossier Yamaha XSR 900`,
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

export default async function PostPage({params}: PageProps<'/posts/[slug]'>) {
  const {slug} = await params
  permanentRedirect(`/blog/${slug}`)
}
