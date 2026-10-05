'use client'

import {Activity, Cpu, Compass, Wrench, Smartphone} from 'lucide-react'

const SPECS = [
  {
    index: '01',
    tag: 'MOTORISATION EU5+',
    title: 'Moteur CP3 890 cm³ : 120° Crossplane',
    description:
      'Trois cylindres en ligne calés à 120°. Grâce à son ordre d’allumage asynchrone et sa boîte à air acoustique, le CP3 élimine l’inertie parasite et délivre un couple ravageur de 93 Nm dès 7 000 tr/min.',
    icon: Activity,
    highlight: '119 CH // 93 NM',
    cols: 'md:col-span-8',
  },
  {
    index: '02',
    tag: 'CHÂSSIS GP HERITAGE',
    title: 'Deltabox Aluminium CF Die-Cast',
    description:
      'Structure coulée sous pression à parois fines de 1,7 mm. Bras oscillant allongé de 55 mm assurant une stabilité chirurgicale et une motricité absolue en forte relance.',
    icon: Compass,
    highlight: '193 KG TOUS PLEINS FAITS',
    cols: 'md:col-span-4',
  },
  {
    index: '03',
    tag: 'ÉLECTRONIQUE R1 RACE',
    title: 'Centrale Inertielle IMU 6 Axes & Cruise Control',
    description:
      'Dérivée directement de la superbike R1. Capteurs mesurant roulis, tangage et lacet 125 fois/sec pour réguler TCS, SCS, LIF (anti-wheeling) et régulateur de vitesse de série.',
    icon: Cpu,
    highlight: '4 MODES D-MODE + IMU',
    cols: 'md:col-span-4',
  },
  {
    index: '04',
    tag: 'COCKPIT CONNECTÉ 2025',
    title: 'Écran Couleur TFT 5" & Connectivité MyRide',
    description:
      'Nouvelle interface TFT couleur 5 pouces avec thèmes d’affichage rétro, connectivité smartphone MyRide et navigation virage par virage Garmin StreetCross intégrée.',
    icon: Smartphone,
    highlight: 'TFT 5" + GARMIN NAV',
    cols: 'md:col-span-4',
  },
  {
    index: '05',
    tag: 'COMPOSANTS HAUTE PRÉCISION',
    title: 'Freinage Radial Brembo & Shifter QSS 3e Génération',
    description:
      'Maître-cylindre radial Brembo à piston de 16 mm, double disque 298 mm, et Quickshifter bidirectionnel permettant des passages de vitesse ultra-rapides sans toucher à l’embrayage.',
    icon: Wrench,
    highlight: 'BREMBO RADIAL + QSS',
    cols: 'md:col-span-4',
  },
]

export default function BentoSpecs() {
  return (
    <section id="specs" className="py-24 relative border-b border-white/[0.08]">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase block">
              [ 02 // INGÉNIERIE & ARCHITECTURE ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              ANATOMIE D’UNE ICÔNE
            </h2>
          </div>
          <p className="text-zinc-400 max-w-md font-light text-sm sm:text-base leading-relaxed">
            Chaque composant est conçu avec la rigueur des prototypes de compétition et le dépouillement esthétique des années d’or.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {SPECS.map((spec) => {
            const Icon = spec.icon
            return (
              <div
                key={spec.title}
                className={`${spec.cols} rounded-2xl border border-white/[0.08] bg-zinc-950 p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300`}
              >
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                    <span className="text-zinc-500">{spec.index}</span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-zinc-300 tracking-wider font-semibold">
                      {spec.tag}
                    </span>
                  </div>
                  <div className="h-8 w-8 rounded-lg border border-white/[0.08] bg-black flex items-center justify-center text-zinc-400">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                    {spec.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-light">
                    {spec.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                  <span className="text-zinc-500 text-[11px]">SPÉCIFICATION</span>
                  <span className="font-semibold text-white tracking-wider border border-white/[0.08] bg-black px-2.5 py-1 rounded">
                    {spec.highlight}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
