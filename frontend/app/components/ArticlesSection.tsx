'use client'

import {useState} from 'react'
import Link from 'next/link'
import {motion, AnimatePresence} from 'framer-motion'
import {Clock, ArrowRight, BookOpen} from 'lucide-react'
import {BLOG_MAGAZINE_CATEGORIES, resolveBlogMagazineCategory} from '@/app/blogCategory'

type ArticleItem = {
  _id: string
  title?: string | null
  slug?: string | null
  date?: string | null
  excerpt?: string | null
  tags?: Array<string | null> | null
  keywordPrimary?: string | null
  category?: {title?: string | null; slug?: string | null} | null
}

type ArticlesSectionProps = {
  sanityPosts?: ArticleItem[]
}

export default function ArticlesSection({sanityPosts = []}: ArticlesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof BLOG_MAGAZINE_CATEGORIES)[number]>('TOUS')

  const displayItems = (sanityPosts || []).map((p) => ({
    _id: p._id,
    title: p.title || 'Sans titre',
    slug: p.slug || '',
    category: resolveBlogMagazineCategory({
      categoryTitle: p.category?.title,
      categorySlug: p.category?.slug,
      tags: p.tags,
      title: p.title,
      keywordPrimary: p.keywordPrimary,
    }),
    readTime: '5 min de lecture',
    date: p.date ? new Date(p.date).toLocaleDateString('fr-FR') : 'Récemment',
    excerpt: p.excerpt || 'Découvrez l’analyse complète et détaillée dans cet article.',
  }))

  const filteredItems =
    activeFilter === 'TOUS'
      ? displayItems
      : displayItems.filter((item) => item.category === activeFilter)

  return (
    <section id="articles" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-white/[0.08] pb-8">
          <div className="space-y-3">
            <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase block">
              [ 04 // DOSSIERS & PUBLICATIONS ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              LE MAGAZINE XSR 900
            </h2>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-zinc-950 hover:bg-zinc-900 text-xs font-mono px-3.5 py-2 text-zinc-300 hover:text-white transition-colors"
          >
            <span>TOUT LE BLOG</span>
            <ArrowRight className="h-3 w-3 text-zinc-400" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {BLOG_MAGAZINE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-medium tracking-wider uppercase transition-all cursor-pointer ${
                activeFilter === cat
                  ? 'border border-white bg-white text-black'
                  : 'border border-white/[0.08] bg-black text-zinc-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {displayItems.length === 0 ? (
          <div className="py-20 text-center space-y-5 rounded-2xl border border-dashed border-white/[0.12] bg-zinc-950 p-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-black text-amber-400 mx-auto">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block">
                [ 0 PUBLICATION ]
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Aucun article publié pour le moment
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-md mx-auto">
                Les dossiers du magazine apparaîtront ici dès qu’ils seront publiés.
              </p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-white/[0.1] bg-zinc-950 p-8">
            <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
              Aucun article dans cette rubrique
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('TOUS')}
              className="mt-2 px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-semibold cursor-pointer"
            >
              Voir tous les dossiers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((article, idx) => (
                <motion.article
                  layout
                  key={article._id}
                  initial={{opacity: 0, y: 15}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, scale: 0.98}}
                  transition={{duration: 0.35, delay: idx * 0.04}}
                  className="group relative rounded-2xl border border-white/[0.08] bg-zinc-950 p-8 flex flex-col justify-between hover:border-white/25 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-5">
                      <span className="border border-white/[0.08] bg-black px-2 py-0.5 rounded text-[11px] text-zinc-300">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-zinc-300 transition-colors tracking-tight leading-snug mb-3">
                      <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                    </h3>

                    <p className="text-zinc-400 text-sm leading-relaxed font-light line-clamp-3 mb-6">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                    <span className="text-zinc-500 text-[11px]">{article.date}</span>

                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-zinc-300 group-hover:text-white transition-colors text-[11px] font-semibold"
                    >
                      <span>LIRE LE DOSSIER</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}
