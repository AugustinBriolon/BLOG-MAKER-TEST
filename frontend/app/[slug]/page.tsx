import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'

import PageBuilderPage from '@/app/components/PageBuilder'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {getPageQuery, pagesSlugs} from '@/sanity/lib/queries'
import {GetPageQueryResult} from '@/sanity.types'
import {PageOnboarding} from '@/app/components/Onboarding'

/**
 * Generate the static params for the page.
 */
export async function generateStaticParams() {
  const {data} = await sanityFetchStaticParams({
    query: pagesSlugs,
  })
  if (!data || data.length === 0) {
    return [{slug: '_initialization'}]
  }
  return data
}

/**
 * Generate metadata for the page.
 */
export async function generateMetadata(props: PageProps<'/[slug]'>): Promise<Metadata> {
  const [{slug}, {perspective}] = await Promise.all([props.params, getDynamicFetchOptions()])
  const {data: page} = await sanityFetchMetadata({
    query: getPageQuery,
    params: {slug},
    perspective,
  })

  return {
    title: page?.name,
    description: page?.heading,
  } satisfies Metadata
}

// Layer 1: Page component (draftMode branch)
export default async function Page({params}: PageProps<'/[slug]'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<PageFallback />}>
        <DynamicPage params={params} />
      </Suspense>
    )
  }
  const {slug} = await params
  return <CachedPage slug={slug} perspective="published" stega={false} />
}

// Layer 2: Dynamic component
async function DynamicPage({params}: Pick<PageProps<'/[slug]'>, 'params'>) {
  const [{slug}, {perspective, stega}] = await Promise.all([params, getDynamicFetchOptions()])
  return <CachedPage slug={slug} perspective={perspective} stega={stega} />
}

// Layer 3: Cached component
async function CachedPage({
  slug,
  perspective,
  stega,
}: {slug: string} & DynamicFetchOptions) {
  'use cache'
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params: {slug},
    perspective,
    stega,
  })

  if (!page?._id) {
    return (
      <div className="py-40 bg-black">
        <PageOnboarding />
      </div>
    )
  }

  return (
    <div className="my-12 lg:my-24 bg-black text-zinc-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="pb-8 border-b border-white/[0.08] mb-12">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase block">
              [ PAGE // {page.name || 'ARCHIVE'} ]
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight">
              {page.heading}
            </h1>
            {page.subheading && (
              <p className="mt-4 text-base lg:text-lg leading-relaxed text-zinc-400 font-light">
                {page.subheading}
              </p>
            )}
          </div>
        </div>
      </div>
      <PageBuilderPage page={page as GetPageQueryResult} />
    </div>
  )
}

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center font-mono text-xs text-zinc-500 bg-black">
      CHARGEMENT DE LA PAGE...
    </div>
  )
}
