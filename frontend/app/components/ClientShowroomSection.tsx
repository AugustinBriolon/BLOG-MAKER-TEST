'use client'

import dynamic from 'next/dynamic'

const MotorcycleViewer3D = dynamic(() => import('@/app/components/MotorcycleViewer3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-2xl bg-zinc-950 border border-white/[0.08] flex items-center justify-center font-mono text-xs text-zinc-500">
      CHARGEMENT DU STUDIO 3D...
    </div>
  ),
})

const TachometerSound = dynamic(() => import('@/app/components/TachometerSound'), {
  ssr: false,
})

export function Showroom3DSection() {
  return (
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
  )
}

export function SoundEngineSection() {
  return (
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
            Faites monter l&apos;aiguille du compte-tours pour écouter la signature acoustique brute
            du vilebrequin calé à 120°.
          </p>
        </div>

        <TachometerSound />
      </div>
    </section>
  )
}
