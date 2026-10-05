import Link from 'next/link'
import {studioUrl} from '@/sanity/lib/api'
import {Flame, ArrowUpRight} from 'lucide-react'

export default function Footer() {
  const marqueeItems = [
    'YAMAHA XSR 900',
    'FASTER SONS HERITAGE',
    'MOTEUR CP3 890 CM³',
    '119 CH // 93 NM',
    'CHÂSSIS DELTABOX',
    'QUICKSHIFTER QSS',
    'BREMBO RADIAL MASTER',
    'NEO-RETRO REVOLUTION',
  ]

  return (
    <footer className="relative bg-[#050507] border-t border-white/10 overflow-hidden text-zinc-400">
      {/* Infinite Marquee Strip */}
      <div className="border-b border-white/10 bg-zinc-950 py-4 overflow-hidden flex whitespace-nowrap">
        <div className="flex animate-[marquee_25s_linear_infinite] gap-8 font-mono text-xs font-bold uppercase tracking-widest text-zinc-500">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="flex items-center gap-6">
              <span className="text-zinc-300">{item}</span>
              <span className="text-amber-500">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-400 flex items-center justify-center text-black">
                <Flame className="h-5 w-5" />
              </div>
              <span className="font-mono text-xl font-black text-white tracking-tight">
                XSR 900 // CHRONICLE
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm font-light leading-relaxed">
              La référence francophone sur le roadster néo-rétro japonais. Essais approfondis, optimisations mécaniques, accessoires et culture Faster Sons.
            </p>
            <div className="pt-2 font-mono text-xs text-zinc-500">
              Conçu pour les passionnés de mécanique et de liberté sur deux roues.
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-white font-bold uppercase tracking-wider block">NAVIGATION</span>
            <ul className="space-y-2">
              <li>
                <Link href="/#articles" className="hover:text-amber-400 transition-colors">
                  Tous les dossiers
                </Link>
              </li>
              <li>
                <Link href="/#specs" className="hover:text-amber-400 transition-colors">
                  Fiche technique & Deltabox
                </Link>
              </li>
              <li>
                <Link href="/#engine-sound" className="hover:text-amber-400 transition-colors">
                  Banc acoustique CP3
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-amber-400 transition-colors">
                  Sitemap XML (Googlebot)
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-white font-bold uppercase tracking-wider block">ADMINISTRATION</span>
            <ul className="space-y-2">
              <li>
                <Link
                  href={studioUrl}
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors"
                >
                  <span>Sanity Studio</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li className="text-zinc-500">
                Connecté à l&apos;outil <span className="text-zinc-300">Blog Maker</span>
              </li>
              <li className="text-zinc-500">
                Dataset : <span className="text-zinc-300">production</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-600">
          <div>© {new Date().getFullYear()} Yamaha XSR 900 Hub. Tous droits réservés.</div>
          <div className="flex items-center gap-6">
            <span>YAMAHA MOTOR TRADEMARK RECOGNIZED</span>
            <span className="text-amber-500/80">FASTER SONS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
