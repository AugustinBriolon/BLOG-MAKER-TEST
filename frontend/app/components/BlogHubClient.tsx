'use client'

import {useState, useMemo} from 'react'
import Link from 'next/link'
import {motion, AnimatePresence} from 'framer-motion'
import {Search, Clock, ArrowRight, BookOpen, Filter} from 'lucide-react'

export interface BlogItem {
  _id: string
  title: string
  slug: string
  category: string
  readTime: string
  date: string
  excerpt: string
  tag: string
  highlight?: string
  isSanity?: boolean
  authorName?: string
}

interface BlogHubClientProps {
  articles: BlogItem[]
  categories: string[]
}

export default function BlogHubClient({articles, categories}: BlogHubClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('TOUS')

  // Filter articles based on category and search query
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'TOUS' ||
        article.category.toLowerCase() === selectedCategory.toLowerCase()

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tag.toLowerCase().includes(q)

      return matchesCategory && matchesSearch
    })
  }, [articles, selectedCategory, searchQuery])

  const featuredArticle = articles[0]

  return (
    <div className="min-h-screen bg-black text-zinc-100 pt-8 pb-24">
      {/* Top Breadcrumb & Quick Telemetry */}
      <div className="container mx-auto px-4 sm:px-6 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-zinc-500 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              ACCUEIL
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">LE BLOG XSR 900</span>
          </div>
          <span className="border border-white/[0.08] bg-zinc-950 px-2.5 py-1 rounded text-zinc-400">
            {articles.length} DOSSIERS INDEXÉS
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="container mx-auto px-4 sm:px-6 mb-16">
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-zinc-950 px-3 py-1 font-mono text-xs text-amber-400 font-bold tracking-widest uppercase">
            <BookOpen className="h-3.5 w-3.5" />
            <span>ARCHIVES TECHNIQUES // FASTER SONS</span>
          </div>

          <h1 className="type-display text-4xl sm:text-6xl lg:text-7xl font-semibold text-white tracking-tight">
            Le blog XSR 900
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 font-light leading-relaxed max-w-2xl">
            Essais approfondis, optimisations du bloc 3-cylindres CP3, fiches de préparation café
            racer et manuels d&apos;atelier exclusifs.
          </p>
        </div>
      </div>

      {/* Featured Article Card */}
      {featuredArticle && !searchQuery && selectedCategory === 'TOUS' && (
        <div className="container mx-auto px-4 sm:px-6 mb-20">
          <div className="rounded-xl border border-white/[0.12] bg-zinc-950 p-8 sm:p-12 relative overflow-hidden group hover:border-white/30 transition-colors duration-300">
            <div className="relative z-10 flex flex-col justify-between min-h-[300px]">
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="border border-amber-500/30 bg-amber-500/10 text-amber-400 px-3 py-1 rounded font-bold uppercase tracking-wider">
                    ★ DOSSIER À LA UNE
                  </span>
                  <span className="text-zinc-500 uppercase">{featuredArticle.category}</span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {featuredArticle.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase group-hover:text-zinc-200 transition-colors">
                  <Link href={`/blog/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
                </h2>

                <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center gap-3 text-zinc-400">
                  <span>PUBLIÉ LE {featuredArticle.date}</span>
                  {featuredArticle.authorName && (
                    <>
                      <span>•</span>
                      <span>PAR {featuredArticle.authorName.toUpperCase()}</span>
                    </>
                  )}
                </div>

                <Link
                  href={`/blog/${featuredArticle.slug}`}
                  className="pressable inline-flex items-center gap-2 rounded-md bg-white text-black hover:bg-zinc-200 px-5 py-2.5 font-semibold tracking-wide"
                >
                  <span>LIRE LE DOSSIER COMPLET</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Controls Bar */}
      <div className="container mx-auto px-4 sm:px-6 mb-12">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 border-y border-white/[0.08] py-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <Filter className="h-4 w-4 text-zinc-500 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'border border-white bg-white text-black'
                    : 'border border-white/[0.08] bg-zinc-950 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par mot-clé, titre, tag..."
              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 font-mono text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-zinc-500 hover:text-white"
              >
                EFFACER
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 sm:px-6">
        {filteredArticles.length === 0 ? (
          <div className="py-20 text-center space-y-4 border border-dashed border-white/[0.1] rounded-2xl bg-zinc-950 p-8">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block">
              [ 0 RÉSULTAT ]
            </span>
            <h3 className="text-xl font-bold text-white">
              Aucun article ne correspond à votre recherche
            </h3>
            <p className="text-zinc-400 text-sm font-light max-w-md mx-auto">
              Essayez avec un autre mot-clé ou réinitialisez les filtres pour voir
              l&apos;intégralité des dossiers.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('TOUS')
              }}
              className="pressable mt-4 px-4 py-2 rounded-md bg-white text-black font-mono text-xs font-semibold cursor-pointer"
            >
              RÉINITIALISER LES FILTRES
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article, idx) => (
                <motion.article
                  layout
                  key={article._id}
                  initial={{opacity: 0, y: 15}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, scale: 0.98}}
                  transition={{duration: 0.3, delay: idx * 0.03}}
                  className="group rounded-xl border border-white/[0.08] bg-zinc-950 p-6 flex flex-col justify-between hover:border-white/25 transition-colors duration-300"
                >
                  <div className="space-y-4">
                    {/* Header tags */}
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                      <span className="border border-white/[0.08] bg-black px-2 py-0.5 rounded text-[10px] text-zinc-300 uppercase">
                        {article.tag}
                      </span>
                      <span className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white group-hover:text-zinc-300 transition-colors tracking-tight leading-snug">
                      <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                    <span className="text-zinc-500 text-[11px]">{article.date}</span>

                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-zinc-300 group-hover:text-white transition-colors text-[11px] font-semibold"
                    >
                      <span>LIRE</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
