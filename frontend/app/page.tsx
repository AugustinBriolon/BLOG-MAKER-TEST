import {Suspense} from 'react'
import HeroXsr from '@/app/components/HeroXsr'
import BentoSpecs from '@/app/components/BentoSpecs'
import TachometerSound from '@/app/components/TachometerSound'
import ArticlesSection from '@/app/components/ArticlesSection'
import {sanityFetch} from '@/sanity/lib/live'
import {allPostsQuery} from '@/sanity/lib/queries'

export default async function Page() {
  const {data: posts} = await sanityFetch({
    query: allPostsQuery,
  })

  return (
    <div className="relative overflow-hidden">
      {/* 1. Hero Section */}
      <HeroXsr />

      {/* 2. Bento Grid Specs Section */}
      <BentoSpecs />

      {/* 3. Interactive Engine Rev & Sound Section */}
      <section id="engine-sound" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider block mb-2">
              // ACOUSTIQUE & COMPTE-TOURS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              LE HURLEMENT DU 3-CYLINDRES
            </h2>
            <p className="mt-3 text-zinc-400 text-sm sm:text-base font-light">
              Faites monter l&apos;aiguille du compte-tours dans les tours pour entendre la signature sonore caractéristique du vilebrequin calé à 120°.
            </p>
          </div>

          <TachometerSound />
        </div>
      </section>

      {/* 4. Articles Section */}
      <Suspense
        fallback={
          <div className="py-24 text-center text-zinc-500 font-mono text-xs">
            CHARGEMENT DES DOSSIERS...
          </div>
        }
      >
        <ArticlesSection sanityPosts={posts || []} />
      </Suspense>
    </div>
  )
}
