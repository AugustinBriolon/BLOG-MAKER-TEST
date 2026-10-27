import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'
import HeroXsr from '@/app/components/HeroXsr'
import BentoSpecs from '@/app/components/BentoSpecs'
import ArticlesSection from '@/app/components/ArticlesSection'
import {Showroom3DSection, SoundEngineSection} from '@/app/components/ClientShowroomSection'
import {buildHomeJsonLd} from '@/app/structuredData'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {allPostsQuery, settingsQuery} from '@/sanity/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const {perspective} = await getDynamicFetchOptions()
  const {data: settings} = await sanityFetchMetadata({
    query: settingsQuery,
    perspective,
  })

  const title = settings?.title || 'Yamaha XSR 900 — Guides, Moteur CP3 & Essais'
  const description =
    'Le guide complet et l’actualité de la Yamaha XSR 900 : essais complets, moteur CP3, accessoires, prépas café racer et conseils d’entretien.'

  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: '/',
    },
  }
}

// Layer 1: Page component (draftMode branch)
export default async function Page() {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<PageFallback />}>
        <DynamicPage />
      </Suspense>
    )
  }
  return <CachedPage perspective="published" stega={false} />
}

// Layer 2: Dynamic component (resolves dynamic fetch options outside 'use cache')
async function DynamicPage() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedPage perspective={perspective} stega={stega} />
}

// Layer 3: Cached component (has 'use cache', receives plain serializable props)
async function CachedPage({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const {data: posts} = await sanityFetch({
    query: allPostsQuery,
    perspective,
    stega,
  })

  const jsonLd = buildHomeJsonLd()

  return (
    <div className="relative overflow-hidden bg-black text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      {/* 1. Hero Section */}
      <HeroXsr />

      {/* 2. Interactive 3D WebGL Showroom Section */}
      <Showroom3DSection />

      {/* 3. Bento Grid Specs Section */}
      <BentoSpecs />

      {/* 4. Interactive Engine Rev & Sound Section */}
      <SoundEngineSection />

      {/* 5. Articles Section */}
      <ArticlesSection sanityPosts={posts || []} />
    </div>
  )
}

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center font-mono text-xs text-zinc-500">
      CHARGEMENT DU HUB XSR 900...
    </div>
  )
}
