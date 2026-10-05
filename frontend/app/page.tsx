import {draftMode} from 'next/headers'
import {Suspense} from 'react'
import HeroXsr from '@/app/components/HeroXsr'
import MotorcycleViewer3D from '@/app/components/MotorcycleViewer3D'
import BentoSpecs from '@/app/components/BentoSpecs'
import TachometerSound from '@/app/components/TachometerSound'
import ArticlesSection from '@/app/components/ArticlesSection'
import {getDynamicFetchOptions, sanityFetch, type DynamicFetchOptions} from '@/sanity/lib/live'
import {allPostsQuery} from '@/sanity/lib/queries'

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        'name': 'Yamaha XSR 900 Hub',
        'description': 'Guide technique, essais et archives du roadster Yamaha XSR 900 CP3.',
        'inLanguage': 'fr-FR',
      },
      {
        '@type': 'Product',
        'name': 'Yamaha XSR 900',
        'brand': {
          '@type': 'Brand',
          'name': 'Yamaha',
        },
        'category': 'Motorcycle',
        'description':
          'Roadster néo-rétro propulsé par le 3-cylindres Crossplane CP3 de 890 cm³ et cadre Deltabox.',
      },
    ],
  }

  return (
    <div className="relative overflow-hidden bg-black text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      {/* 1. Hero Section */}
      <HeroXsr />

      {/* 2. Interactive 3D WebGL Showroom Section */}
      <section
        id="showroom-3d"
        className="py-16 md:py-24 relative border-b border-white/[0.08] overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <span className="font-mono text-xs text-amber-400 uppercase tracking-widest block font-bold">
                [ 02 // STUDIO 3D TEMPS RÉEL ]
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                INSPECTION 3D HAUTE PRÉCISION
              </h2>
            </div>
            <p className="text-zinc-400 text-sm sm:text-base font-light max-w-md">
              Faites pivoter la machine à 360°, zoomez sur les détails mécaniques et observez la
              rotation cinématique asservie au scroll.
            </p>
          </div>

          <MotorcycleViewer3D />
        </div>
      </section>

      {/* 3. Bento Grid Specs Section */}
      <BentoSpecs />

      {/* 3. Interactive Engine Rev & Sound Section */}
      <section id="engine-sound" className="py-24 relative border-b border-white/[0.08]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block">
              [ 03 // ACOUSTIQUE & DYNAMIQUE ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              LE HURLEMENT DU 3-CYLINDRES
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
              Faites monter l&apos;aiguille du compte-tours pour écouter la signature acoustique
              brute du vilebrequin calé à 120°.
            </p>
          </div>

          <TachometerSound />
        </div>
      </section>

      {/* 4. Articles Section */}
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
