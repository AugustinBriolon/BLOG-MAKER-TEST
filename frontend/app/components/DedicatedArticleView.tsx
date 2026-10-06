'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  CheckCircle2,
  User,
  ExternalLink,
} from 'lucide-react'
import {useState} from 'react'
import {toast} from 'sonner'
import type {PortableTextBlock} from 'next-sanity'
import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import {studioUrl} from '@/sanity/lib/api'

interface DedicatedArticleViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sanityPost: any
  relatedArticles?: {
    slug: string
    title: string
    category: string
    readTime: string
    excerpt: string
  }[]
}

export default function DedicatedArticleView({
  sanityPost,
  relatedArticles = [],
}: DedicatedArticleViewProps) {
  const [copied, setCopied] = useState(false)

  const title = sanityPost?.title || 'Dossier XSR 900'
  const excerpt = sanityPost?.excerpt || ''
  const category = 'DOSSIER CMS'
  const readTime = '5 min de lecture'
  const dateFormatted = sanityPost?.date
    ? new Date(sanityPost.date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Récemment'

  const authorName =
    sanityPost?.author?.firstName && sanityPost?.author?.lastName
      ? `${sanityPost.author.firstName} ${sanityPost.author.lastName}`
      : 'Rédaction XSR 900'

  const authorRole = 'Chroniqueur Technique & Essais'

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Lien du dossier copié dans le presse-papier')
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <article className="min-h-screen bg-black text-zinc-100 pt-8 pb-24">
      {/* Top Breadcrumb & Return Row */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-zinc-500 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              ACCUEIL
            </Link>
            <span className="text-zinc-700">/</span>
            <Link href="/blog" className="hover:text-white transition-colors">
              BLOG
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-400 truncate max-w-[200px] sm:max-w-xs">{title}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copied ? 'COPIÉ !' : 'PARTAGER'}</span>
            </button>
            <Link
              href={studioUrl}
              className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-amber-400 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>ÉDITER</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Article Header */}
        <header className="space-y-6 pb-12 border-b border-white/[0.08] mb-12">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-white/[0.1] bg-zinc-950 px-3 py-1 rounded font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
              {category}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              CMS SANITY DIRECT
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {title}
          </h1>

          {/* Excerpt Chapeau */}
          {excerpt && (
            <p className="text-lg sm:text-xl text-zinc-300 font-light leading-relaxed border-l-2 border-white/20 pl-4 py-1">
              {excerpt}
            </p>
          )}

          {/* Author & Timing Row */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.06] text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-white/10 bg-zinc-900 flex items-center justify-center text-white">
                <User className="h-4 w-4 text-zinc-400" />
              </div>
              <div>
                <div className="font-bold text-white tracking-wider">{authorName}</div>
                <div className="text-[11px] text-zinc-500">{authorRole}</div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {dateFormatted}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {readTime}
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {sanityPost?.coverImage ? (
          <div className="mb-14 rounded-2xl overflow-hidden border border-white/[0.08] bg-zinc-950">
            <Image
              id={sanityPost.coverImage.asset?._ref || ''}
              alt={sanityPost.coverImage.alt || title}
              className="w-full object-cover max-h-[550px]"
              width={1200}
              height={630}
              mode="cover"
              hotspot={sanityPost.coverImage.hotspot}
              crop={sanityPost.coverImage.crop}
            />
          </div>
        ) : (
          <div className="mb-14 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900 to-black p-8 sm:p-12 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-8 border-b border-white/[0.08] pb-4">
              <span>DOCUMENTATION TECHNIQUE OFFICIELLE</span>
              <span>YAMAHA SPORT HERITAGE // FASTER SONS</span>
            </div>
            <div className="max-w-xl space-y-3">
              <span className="font-mono text-xs text-amber-400 tracking-widest uppercase font-bold">
                [ FOCUS MACHINE // MOTEUR CP3 DELTABOX ]
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {title}
              </h3>
            </div>
          </div>
        )}

        {/* Article Body Content */}
        {sanityPost?.content?.length ? (
          <div className="prose prose-invert prose-zinc prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-a:text-white hover:prose-a:underline prose-p:text-zinc-300 prose-p:font-light prose-p:leading-relaxed">
            <PortableText className="space-y-6" value={sanityPost.content as PortableTextBlock[]} />
          </div>
        ) : (
          <div className="p-8 rounded-xl border border-white/[0.08] bg-zinc-950 font-mono text-xs text-zinc-400 text-center">
            Contenu en cours de rédaction dans le Studio Sanity.
          </div>
        )}

        {/* Author Bio Box */}
        <div className="mt-16 p-8 rounded-2xl border border-white/[0.08] bg-zinc-950 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="h-16 w-16 rounded-full border border-white/10 bg-zinc-900 flex items-center justify-center shrink-0">
            <User className="h-6 w-6 text-zinc-400" />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
              AUTEUR DU DOSSIER
            </div>
            <h4 className="text-lg font-bold text-white">{authorName}</h4>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Spécialiste de l&apos;architecture moteur CP3 et de l&apos;histoire de la gamme Sport
              Heritage Yamaha. Analyse rigoureuse axée sur la dynamique de pilotage et la fiabilité
              technique.
            </p>
          </div>
        </div>

        {/* Back and Next navigation links */}
        <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>RETOUR AU BLOG COMPLET</span>
          </Link>

          <Link
            href="/#showroom-3d"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <span>EXPLORER LA MACHINE EN 3D</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block">
                  [ LECTURES RECOMMANDÉES ]
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight uppercase">
                  AUTRES DOSSIERS LIÉS
                </h3>
              </div>
              <Link
                href="/blog"
                className="font-mono text-xs text-zinc-400 hover:text-white transition-colors"
              >
                TOUT VOIR →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group rounded-xl border border-white/[0.08] bg-zinc-950 p-5 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider block">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-zinc-300 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-zinc-500 font-light line-clamp-2">{rel.excerpt}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-[11px] text-zinc-500">
                    <span>{rel.readTime}</span>
                    <span className="text-zinc-300 group-hover:text-white transition-colors">
                      LIRE →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
