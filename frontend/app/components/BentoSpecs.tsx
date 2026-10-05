'use client'

import {motion} from 'framer-motion'
import {Activity, Cpu, Compass, Wrench, Sparkles} from 'lucide-react'

const SPECS = [
  {
    tag: 'MOTORISATION',
    title: 'Moteur CP3 890 cm³ : L’art du Crossplane',
    description:
      'Trois cylindres en ligne calés à 120°. Grâce à son ordre d’allumage irrégulier, le CP3 élimine le couple d’inertie parasite. Le résultat : une connexion millimétrique entre la poignée de gaz et le pneu arrière, doublée d’une allonge rageuse jusqu’à 11 500 tr/min.',
    icon: Activity,
    highlight: '119 CH // 93 NM',
    cols: 'md:col-span-8',
    gradient: 'from-amber-500/10 via-zinc-900 to-zinc-950',
  },
  {
    tag: 'CHÂSSIS',
    title: 'Deltabox CF Aluminium',
    description:
      'Structure coulée sous pression à parois ultra-fines (1,7 mm). Bras oscillant étiré de 55 mm garantissant une stabilité imperturbable en sortie de courbe.',
    icon: Compass,
    highlight: '193 KG PLEIN FAIT',
    cols: 'md:col-span-4',
    gradient: 'from-blue-600/10 via-zinc-900 to-zinc-950',
  },
  {
    tag: 'ÉLECTRONIQUE',
    title: 'Centrale IMU 6 Axes dérivée de la R1',
    description:
      'Capteur gyroscopique mesurant roulis, tangage et lacet 125 fois par seconde. Pilote le Traction Control (TCS), Slide Control (SCS), Wheelie Control (LIF) et le Brake Control en virage.',
    icon: Cpu,
    highlight: '4 MODES D-MODE',
    cols: 'md:col-span-5',
    gradient: 'from-red-600/10 via-zinc-900 to-zinc-950',
  },
  {
    tag: 'COMPÉTITION & RÉTRO',
    title: 'Poste de pilotage & Freinage Brembo',
    description:
      'Maître-cylindre radial Brembo à piston de 16 mm, commodos épurés avec régulateur de vitesse, et dosseret de selle inspiré des TZ250 championnes du monde de Grand Prix.',
    icon: Wrench,
    highlight: 'BREMBO RADIAL',
    cols: 'md:col-span-7',
    gradient: 'from-yellow-500/10 via-zinc-900 to-zinc-950',
  },
]

export default function BentoSpecs() {
  return (
    <section id="specs" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 font-mono text-xs text-amber-400">
              <Sparkles className="h-3 w-3" />
              INGÉNIERIE JAPONAISE HAUT DE GAMME
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              ANATOMIE D’UNE ICÔNE
            </h2>
          </div>
          <p className="text-zinc-400 max-w-md font-light text-sm sm:text-base">
            Chaque composant de la XSR 900 est pensé pour marier technologie moderne de pointe et pureté mécanique des années d’or de la moto.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {SPECS.map((spec, idx) => {
            const Icon = spec.icon
            return (
              <motion.div
                key={spec.title}
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.6, delay: idx * 0.1}}
                className={`${spec.cols} relative rounded-3xl border border-white/10 bg-gradient-to-b ${spec.gradient} p-8 md:p-10 flex flex-col justify-between overflow-hidden group hover:border-amber-400/30 transition-all duration-300 shadow-xl`}
              >
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-amber-400 tracking-wider">
                      // {spec.tag}
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-amber-400 group-hover:border-amber-400/40 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    {spec.title}
                  </h3>
                  <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-light">
                    {spec.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                  <span className="text-zinc-500">SPEC CLÉ</span>
                  <span className="font-bold text-white tracking-wider bg-white/5 px-2.5 py-1 rounded border border-white/10">
                    {spec.highlight}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
