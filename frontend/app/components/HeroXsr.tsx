'use client'

import {useState} from 'react'
import {ArrowRight, Disc, Rotate3d} from 'lucide-react'
import Link from 'next/link'

const COLORWAYS = [
  {
    id: 'legend-blue',
    name: 'Legend Blue',
    sub: 'Sonauto 80s GP',
    accent: '#2563EB',
    tag: 'HERITAGE GP',
    desc: 'Hommage aux victoires légendaires de Christian Sarron en Grand Prix.',
  },
  {
    id: 'midnight-black',
    name: 'Midnight Black',
    sub: 'SpinForged Gold',
    accent: '#D97706',
    tag: 'STEALTH',
    desc: 'Noir profond rehaussé de jantes forgées SpinForged dorées.',
  },
  {
    id: 'historic-white',
    name: 'Historic White',
    sub: 'Red Speedblock',
    accent: '#DC2626',
    tag: 'RACING',
    desc: 'La célèbre livrée officielle de compétition à damiers rouges.',
  },
]

export default function HeroXsr() {
  const [selectedColor, setSelectedColor] = useState(0)

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-between pt-6 pb-16 overflow-hidden border-b border-white/[0.08]">
      {/* Precision hairline grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Top Telemetry Strip */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4 font-mono text-[11px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="text-zinc-300">INDEX // ARCHIVE CP3</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-500">HOMOLOGATION EURO 5+</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">CHÂSSIS DELTABOX CF</span>
            <span className="text-zinc-400">RN80 SPECIFICATION</span>
          </div>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 my-auto py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Minimal Typography & Manifesto */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase block">
                [ ROADSTER NÉO-RÉTRO / 890 CM³ ]
              </span>
              <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9]">
                YAMAHA <br />
                <span className="text-zinc-400">XSR 900</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-zinc-400 max-w-xl font-light leading-relaxed">
              L’harmonie brute entre le 3-cylindres Crossplane <strong className="text-white font-normal">CP3</strong> et la précision chirurgicale du cadre Deltabox. Chroniques d&apos;essais, atelier mécanique et culture Grand Prix.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#showroom-3d"
                className="group inline-flex items-center gap-2 rounded-lg bg-amber-400 text-black hover:bg-amber-300 px-6 py-3.5 font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-amber-400/20"
              >
                <Rotate3d className="h-3.5 w-3.5" />
                <span>MODÈLE 3D INTERACTIF</span>
              </a>

              <a
                href="#articles"
                className="group inline-flex items-center gap-2 rounded-lg bg-white text-black hover:bg-zinc-200 px-6 py-3.5 font-mono text-xs font-semibold tracking-wider uppercase transition-all"
              >
                <span>CONSULTER LES DOSSIERS</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#engine-sound"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white px-5 py-3.5 font-mono text-xs tracking-wider uppercase transition-all"
              >
                <Disc className="h-3.5 w-3.5 text-zinc-400" />
                <span>BANC ACOUSTIQUE</span>
              </a>
            </div>
          </div>

          {/* Right Column: Ultra-Minimalist Technical Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950 p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <span className="font-mono text-xs text-zinc-400 tracking-wider">
                  COLORWAY // LIVRÉE
                </span>
                <span className="font-mono text-[10px] text-zinc-500 border border-white/[0.08] px-2 py-0.5 rounded">
                  {COLORWAYS[selectedColor].tag}
                </span>
              </div>

              {/* Minimal preview block */}
              <div className="rounded-xl border border-white/[0.06] bg-black p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-white tracking-tight">
                      {COLORWAYS[selectedColor].name}
                    </div>
                    <div className="font-mono text-xs text-zinc-500">
                      {COLORWAYS[selectedColor].sub}
                    </div>
                  </div>
                  <span
                    className="h-4 w-4 rounded-full border border-white/20 shadow-sm"
                    style={{backgroundColor: COLORWAYS[selectedColor].accent}}
                  />
                </div>

                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {COLORWAYS[selectedColor].desc}
                </p>

                {/* Color Selector Pills */}
                <div className="flex gap-2 pt-2 border-t border-white/[0.06]">
                  {COLORWAYS.map((c, idx) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(idx)}
                      className={`flex-1 py-1.5 px-2 rounded font-mono text-[10px] uppercase border transition-all cursor-pointer ${
                        selectedColor === idx
                          ? 'border-white text-white bg-white/[0.06]'
                          : 'border-white/[0.06] text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {c.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical telemetry mini-grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 font-mono">
                <div className="rounded-lg border border-white/[0.06] bg-black p-3 space-y-0.5">
                  <div className="text-[10px] text-zinc-500">BLOC MOTEUR</div>
                  <div className="text-sm font-bold text-white">890 cm³ CP3</div>
                  <div className="text-[10px] text-zinc-400">120° Crossplane</div>
                </div>

                <div className="rounded-lg border border-white/[0.06] bg-black p-3 space-y-0.5">
                  <div className="text-[10px] text-zinc-500">PUISSANCE</div>
                  <div className="text-sm font-bold text-white">119 CH</div>
                  <div className="text-[10px] text-zinc-400">@ 10 000 tr/min</div>
                </div>

                <div className="rounded-lg border border-white/[0.06] bg-black p-3 space-y-0.5">
                  <div className="text-[10px] text-zinc-500">COUPLE MAX</div>
                  <div className="text-sm font-bold text-white">93.0 Nm</div>
                  <div className="text-[10px] text-zinc-400">@ 7 000 tr/min</div>
                </div>

                <div className="rounded-lg border border-white/[0.06] bg-black p-3 space-y-0.5">
                  <div className="text-[10px] text-zinc-500">MASSE À SEC</div>
                  <div className="text-sm font-bold text-white">193 kg</div>
                  <div className="text-[10px] text-zinc-400">Plein effectué</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Technical Strip */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/[0.08] pt-6 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">01 // CHÂSSIS</span>
            <p className="text-white font-medium">Deltabox Aluminium CF</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">02 // FREINAGE</span>
            <p className="text-white font-medium">Brembo Radial 16 mm</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">03 // TRANSMISSION</span>
            <p className="text-white font-medium">Shifter QSS Up/Down</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">04 // ASSISTANCE</span>
            <p className="text-white font-medium">Centrale IMU 6 Axes</p>
          </div>
        </div>
      </div>
    </section>
  )
}

