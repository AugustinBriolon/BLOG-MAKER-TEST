'use client'

import {useState} from 'react'
import {motion} from 'framer-motion'
import {ChevronRight, Flame, Disc, Shield, ArrowDown} from 'lucide-react'
import Link from 'next/link'

const COLORWAYS = [
  {
    name: 'Legend Blue (Sonauto 80s)',
    accent: '#1E40AF',
    tag: 'HERITAGE GP',
    desc: 'L’hommage mythique aux victoires de Christian Sarron en Grand Prix.',
  },
  {
    name: 'Midnight Black (Brushed Gold)',
    accent: '#D97706',
    tag: 'STEALTH NEO',
    desc: 'Finition noir profond et jantes forgées SpinForged dorées.',
  },
  {
    name: 'Historic White (Red Speedblock)',
    accent: '#DC2626',
    tag: 'RACING LEGEND',
    desc: 'La célèbre livrée compétition blanche à damiers rouges Speedblock.',
  },
]

export default function HeroXsr() {
  const [selectedColor, setSelectedColor] = useState(0)

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-8 pb-16 overflow-hidden">
      {/* Background ambient neon glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-500/15 via-blue-600/10 to-red-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none -z-10" />

      {/* Top HUD Telemetry Banner */}
      <div className="container mx-auto px-4">
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 text-xs font-mono"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
            <span className="text-zinc-400">FASTER SONS ARCHIVE // 2026 EDITION</span>
            <span className="hidden sm:inline-block text-zinc-600">|</span>
            <span className="hidden sm:inline-block text-amber-400 font-semibold tracking-wider">
              YAMAHA MOTORSPORT HERITAGE
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span className="hidden md:inline">HOMOLOGATION : EURO 5+</span>
            <span className="border border-white/10 px-2 py-0.5 rounded text-white bg-zinc-900">
              CHÂSSIS DELTABOX
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Hero Visual & Headline */}
      <div className="container mx-auto px-4 my-auto py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Bold Typography & Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{opacity: 0, x: -30}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.7, delay: 0.1}}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-xs uppercase tracking-widest"
            >
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              Le Roadster Néo-Rétro Ultime
            </motion.div>

            <motion.h1
              initial={{opacity: 0, y: 30}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.8, delay: 0.2}}
              className="text-5xl sm:text-7xl xl:text-8xl font-black tracking-tighter text-white uppercase leading-[0.95]"
            >
              YAMAHA <br />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                XSR 900
              </span>
            </motion.h1>

            <motion.p
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.7, delay: 0.3}}
              className="text-base sm:text-lg text-zinc-300 max-w-xl font-light leading-relaxed"
            >
              L’alliance sauvage du 3-cylindres <strong className="text-white font-semibold">Crossplane CP3</strong> et de l’esprit Grand Prix des années 80. Essais poussés, sonorités d’échappements, prépas café racer et chroniques mécaniques.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.7, delay: 0.4}}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                href="#articles"
                className="group inline-flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black px-7 py-4 font-mono text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_45px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5"
              >
                <span>LIRE LES DOSSIERS</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="#engine-sound"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-zinc-900/80 hover:bg-zinc-800 text-white px-6 py-4 font-mono text-sm font-semibold tracking-wider transition-all duration-300 backdrop-blur"
              >
                <Disc className="h-4 w-4 text-amber-400 animate-spin" style={{animationDuration: '6s'}} />
                <span>ÉCOUTER LE CP3</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: 3D-Style Interactive Showcase Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{opacity: 0, scale: 0.95}}
              animate={{opacity: 1, scale: 1}}
              transition={{duration: 0.8, delay: 0.3}}
              className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-6 md:p-8 backdrop-blur-2xl shadow-2xl"
            >
              {/* Card top badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <span className="font-mono text-xs text-amber-400 font-bold tracking-wider">
                  SPEC SHEET // MODEL RN80
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">
                  {COLORWAYS[selectedColor].tag}
                </span>
              </div>

              {/* Visual Bike Graphic Representation */}
              <div className="relative h-64 md:h-72 w-full rounded-2xl bg-zinc-950/80 border border-white/5 flex flex-col items-center justify-center p-6 overflow-hidden group">
                {/* Radial glow matching colorway */}
                <div
                  className="absolute inset-0 opacity-25 blur-2xl transition-all duration-500"
                  style={{backgroundColor: COLORWAYS[selectedColor].accent}}
                />

                {/* Bike Silhouette Blueprint / SVG Art */}
                <div className="relative z-10 text-center space-y-4">
                  <div className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                    LIVRÉE SÉLECTIONNÉE
                  </div>
                  <div className="text-xl md:text-2xl font-black text-white tracking-tight">
                    {COLORWAYS[selectedColor].name}
                  </div>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto font-light">
                    {COLORWAYS[selectedColor].desc}
                  </p>
                </div>

                {/* Color Selector Pills */}
                <div className="absolute bottom-4 flex gap-2 z-20">
                  {COLORWAYS.map((c, idx) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(idx)}
                      className={`h-4 w-4 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor === idx ? 'scale-125 border-white shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      style={{backgroundColor: c.accent}}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Fast specs mini-grid */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-2">
                <div className="rounded-xl border border-white/5 bg-zinc-950/60 p-3 font-mono">
                  <div className="text-[10px] text-zinc-500">MOTEUR</div>
                  <div className="text-base font-bold text-white">890 cm³ CP3</div>
                  <div className="text-[11px] text-amber-400">3 cyl. en ligne</div>
                </div>

                <div className="rounded-xl border border-white/5 bg-zinc-950/60 p-3 font-mono">
                  <div className="text-[10px] text-zinc-500">PUISSANCE</div>
                  <div className="text-base font-bold text-white">119 CH</div>
                  <div className="text-[11px] text-zinc-400">@ 10 000 tr/min</div>
                </div>

                <div className="rounded-xl border border-white/5 bg-zinc-950/60 p-3 font-mono">
                  <div className="text-[10px] text-zinc-500">COUPLE MAX</div>
                  <div className="text-base font-bold text-white">93.0 Nm</div>
                  <div className="text-[11px] text-zinc-400">@ 7 000 tr/min</div>
                </div>

                <div className="rounded-xl border border-white/5 bg-zinc-950/60 p-3 font-mono">
                  <div className="text-[10px] text-zinc-500">POIDS PLEIN FAIT</div>
                  <div className="text-base font-bold text-white">193 kg</div>
                  <div className="text-[11px] text-emerald-400">Châssis Deltabox</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Technical Strip */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-6">
          <div className="space-y-1">
            <span className="font-mono text-[11px] text-zinc-500 flex items-center gap-1">
              <Shield className="h-3 w-3 text-amber-400" /> CHÂSSIS
            </span>
            <p className="font-mono text-sm text-white font-bold">Deltabox Aluminium CF</p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[11px] text-zinc-500">FREINAGE RADIAL</span>
            <p className="font-mono text-sm text-white font-bold">Maître-cylindre Brembo</p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[11px] text-zinc-500">TRANSMISSION</span>
            <p className="font-mono text-sm text-white font-bold">Shifter QSS Up/Down</p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[11px] text-zinc-500">ÉLECTRONIQUE</span>
            <p className="font-mono text-sm text-white font-bold">Centrale IMU 6 Axes</p>
          </div>
        </div>
      </div>
    </section>
  )
}
