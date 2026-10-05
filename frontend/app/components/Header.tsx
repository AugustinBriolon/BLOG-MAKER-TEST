import Link from 'next/link'
import {studioUrl} from '@/sanity/lib/api'
import {Flame, ArrowUpRight} from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-20 bg-[#08080b]/80 border-b border-white/10 backdrop-blur-xl flex items-center transition-all">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Flame className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-base font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                YAMAHA XSR 900
              </span>
              <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase">
                FASTER SONS // CP3 CHRONICLE
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs font-semibold tracking-wider text-zinc-300">
            <Link href="/#articles" className="hover:text-amber-400 transition-colors">
              DOSSIERS
            </Link>
            <Link href="/#specs" className="hover:text-amber-400 transition-colors">
              INGÉNIERIE
            </Link>
            <Link href="/#engine-sound" className="hover:text-amber-400 transition-colors">
              SON CP3
            </Link>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <Link
              href={studioUrl}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-400/40 px-4 py-2 font-mono text-xs font-bold text-white hover:text-amber-400 transition-all shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SANITY STUDIO</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
