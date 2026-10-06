'use client'

import Link from 'next/link'

export default function Footer() {
  const marqueeItems = [
    'YAMAHA XSR 900',
    'CP3 890 CM³ CROSSPLANE',
    '119 CH // 93 NM',
    'CHÂSSIS DELTABOX CF',
    'QUICKSHIFTER QSS UP/DOWN',
    'BREMBO RADIAL MASTER',
    'CENTRALE IMU 6 AXES',
    'FASTER SONS ARCHIVE',
  ]

  return (
    <footer className="relative bg-black border-t border-white/[0.08] overflow-hidden text-zinc-400">
      {/* Infinite Marquee Strip */}
      <div className="border-b border-white/[0.08] bg-black py-3.5 overflow-hidden flex whitespace-nowrap">
        <div className="flex animate-[marquee_30s_linear_infinite] gap-8 font-mono text-[11px] uppercase tracking-widest text-zinc-600">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="flex items-center gap-6">
              <span className="text-zinc-400">{item}</span>
              <span className="text-zinc-600">/</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="font-mono text-base font-bold text-white tracking-tight">
                XSR 900 // CP3 ARCHIVE
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm font-light leading-relaxed">
              La référence dédiée au roadster néo-rétro japonais. Essais approfondis, optimisations
              mécaniques et culture Faster Sons.
            </p>
            <div className="pt-2 font-mono text-xs text-zinc-600">
              Conçu pour les passionnés de mécanique et de pureté sur deux roues.
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-zinc-300 font-semibold uppercase tracking-wider block">
              NAVIGATION
            </span>
            <ul className="space-y-2.5 text-zinc-500">
              <li>
                <Link href="/#showroom-3d" className="hover:text-white transition-colors">
                  Studio 3D Interactif
                </Link>
              </li>
              <li>
                <Link href="/#specs" className="hover:text-white transition-colors">
                  Fiche technique & Deltabox
                </Link>
              </li>
              <li>
                <Link href="/#engine-sound" className="hover:text-white transition-colors">
                  Banc acoustique CP3
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Le Blog & Dossiers
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                  Sitemap XML
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-zinc-300 font-semibold uppercase tracking-wider block">
              MAGAZINE
            </span>
            <ul className="space-y-2.5 text-zinc-500">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Tous les dossiers
                </Link>
              </li>
              <li>
                <Link href="/#articles" className="hover:text-white transition-colors">
                  Dernières publications
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-600">
          <div>© 2025 Yamaha XSR 900 Hub. Tous droits réservés.</div>
          <div className="flex items-center gap-6">
            <span>YAMAHA MOTOR TRADEMARK</span>
            <span className="text-zinc-500">FASTER SONS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
