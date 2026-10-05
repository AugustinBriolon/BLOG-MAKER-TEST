import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'

import Avatar from '@/app/components/Avatar'
import {MorePosts} from '@/app/components/Posts'
import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import {sanityFetch} from '@/sanity/lib/live'
import {postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: postPagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(
  props: PageProps<'/posts/[slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params
  const {data: post} = await sanityFetch({
    query: postQuery,
    params,
    // Metadata should never contain stega
    stega: false,
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

export default async function PostPage(props: PageProps<'/posts/[slug]'>) {
  const params = await props.params
  const [{data: post}] = await Promise.all([sanityFetch({query: postQuery, params})])

  if (!post?._id) {
    return notFound()
  }

  return (
    <article className="min-h-screen py-12 lg:py-20 text-zinc-200">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back navigation */}
        <div className="mb-10">
          <a
            href="/#articles"
            className="inline-flex items-center gap-2 font-mono text-xs text-amber-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            <span>← RETOUR AUX DOSSIERS</span>
          </a>
        </div>

        {/* Header HUD */}
        <header className="space-y-6 pb-10 border-b border-white/10 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 font-mono text-xs text-amber-400">
            DOSSIER SPÉCIAL // YAMAHA XSR 900
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg sm:text-xl text-zinc-400 font-light leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs font-mono text-zinc-400">
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
          <div className="mb-12 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
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
        <div className="prose prose-invert prose-amber prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-amber-400 hover:prose-a:underline">
          {post.content?.length ? (
            <PortableText
              className="space-y-6"
              value={post.content as PortableTextBlock[]}
            />
          ) : null}
        </div>

        {/* Bottom CTA / Studio prompt */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <a
            href="/#articles"
            className="font-mono text-xs text-amber-400 hover:text-white transition-colors"
          >
            ← LIRE D&apos;AUTRES GUIDES
          </a>
          <span className="font-mono text-xs text-zinc-500">
            FASTER SONS // CHRONIQUE YAMAHA XSR 900
          </span>
        </div>
      </div>
    </article>
  )
}
