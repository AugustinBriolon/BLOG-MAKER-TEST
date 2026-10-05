import type {Metadata, ResolvingMetadata} from 'next'
import {draftMode} from 'next/headers'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'

import Avatar from '@/app/components/Avatar'
import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

/**
 * Generate the static params for the page.
 */
export async function generateStaticParams() {
  const {data} = await sanityFetchStaticParams({
    query: postPagesSlugs,
  })
  if (!data || data.length === 0) {
    return [{slug: '_initialization'}]
  }
  return data
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
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)

  return {
    authors:
      post?.author?.firstName && post?.author?.lastName
        ? [{name: `${post.author.firstName} ${post.author.lastName}`}]
        : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

// Layer 1: Page component (draftMode branch)
export default async function PostPage({params}: PageProps<'/posts/[slug]'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<PostFallback />}>
        <DynamicPostPage params={params} />
      </Suspense>
    )
  }
  const {slug} = await params
  return <CachedPostPage slug={slug} perspective="published" stega={false} />
}

// Layer 2: Dynamic component
async function DynamicPostPage({params}: Pick<PageProps<'/posts/[slug]'>, 'params'>) {
  const [{slug}, {perspective, stega}] = await Promise.all([params, getDynamicFetchOptions()])
  return <CachedPostPage slug={slug} perspective={perspective} stega={stega} />
}

// Layer 3: Cached component
async function CachedPostPage({
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

  return (
    <article className="min-h-screen py-12 lg:py-20 text-zinc-200 bg-black">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Back navigation */}
        <div className="mb-10">
          <Link
            href="/#articles"
            className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
          >
            <span>← RETOUR AUX DOSSIERS</span>
          </Link>
        </div>

        {/* Header HUD */}
        <header className="space-y-6 pb-10 border-b border-white/[0.08] mb-10">
          <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest block">
            [ DOSSIER // YAMAHA XSR 900 ]
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs font-mono text-zinc-500">
            {post.author && post.author.firstName && post.author.lastName && (
              <div className="flex items-center gap-3">
                <Avatar person={post.author} date={post.date} />
              </div>
            )}
            {post.date && (
              <time className="text-zinc-500">
                PUBLIÉ LE {new Date(post.date).toLocaleDateString('fr-FR')}
              </time>
            )}
          </div>
        </header>

        {/* Cover image */}
        {post?.coverImage && (
          <div className="mb-12 rounded-2xl overflow-hidden border border-white/[0.08] bg-zinc-950">
            <Image
              id={post.coverImage.asset?._ref || ''}
              alt={post.coverImage.alt || ''}
              className="w-full object-cover max-h-[550px]"
              width={1200}
              height={630}
              mode="cover"
              hotspot={post.coverImage.hotspot}
              crop={post.coverImage.crop}
            />
          </div>
        )}

        {/* Body content */}
        <div className="prose prose-invert prose-zinc prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-a:text-white hover:prose-a:underline prose-p:text-zinc-300 prose-p:font-light prose-p:leading-relaxed">
          {post.content?.length ? (
            <PortableText
              className="space-y-6"
              value={post.content as PortableTextBlock[]}
            />
          ) : null}
        </div>

        {/* Bottom CTA / Studio prompt */}
        <div className="mt-20 pt-10 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            href="/#articles"
            className="font-mono text-xs text-zinc-400 hover:text-white transition-colors"
          >
            ← LIRE D&apos;AUTRES GUIDES
          </Link>
          <span className="font-mono text-xs text-zinc-600">
            FASTER SONS // CHRONIQUE YAMAHA XSR 900
          </span>
        </div>
      </div>
    </article>
  )
}

function PostFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center font-mono text-xs text-zinc-500">
      CHARGEMENT DU DOSSIER...
    </div>
  )
}
