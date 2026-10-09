import Link from 'next/link'
import {ArrowRight} from 'lucide-react'

export default function Header() {
  return (
    <header className="chrome-glass fixed top-0 inset-x-0 z-50 h-16 bg-black/75 border-b border-white/[0.08] backdrop-blur-md flex items-center transition-all">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-3 pressable">
            <span className="h-2 w-2 rounded-full bg-white group-hover:scale-125 transition-transform motion-reduce:group-hover:scale-100" />
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-sm font-bold tracking-tight text-white group-hover:text-zinc-300 transition-colors">
                XSR 900
              </span>
              <span className="text-[10px] text-zinc-500 tracking-widest uppercase">
                / CP3 ARCHIVE
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-widest text-zinc-400">
            <Link href="/#showroom-3d" className="hover:text-white transition-colors pressable">
              STUDIO 3D
            </Link>
            <Link href="/#specs" className="hover:text-white transition-colors pressable">
              INGÉNIERIE
            </Link>
            <Link href="/#engine-sound" className="hover:text-white transition-colors pressable">
              SON CP3
            </Link>
            <Link href="/blog" className="hover:text-white transition-colors pressable">
              BLOG
            </Link>
          </nav>

          <Link
            href="/blog"
            className="pressable inline-flex items-center gap-2 rounded-md bg-zinc-950 border border-white/[0.1] hover:border-white/30 px-3 py-1.5 font-mono text-[11px] font-medium text-zinc-300 hover:text-white"
          >
            <span>LE BLOG</span>
            <ArrowRight className="h-3 w-3 text-zinc-500" />
          </Link>
        </div>
      </div>
    </header>
  )
}
