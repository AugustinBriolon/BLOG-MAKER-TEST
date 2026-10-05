'use client'

import {useState} from 'react'
import Link from 'next/link'
import {motion, AnimatePresence} from 'framer-motion'
import {BookOpen, Clock, Tag, ExternalLink, Sparkles, ArrowRight} from 'lucide-react'
import type {AllPostsQueryResult} from '@/sanity.types'
import {studioUrl} from '@/sanity/lib/api'

// Curated reference articles used for testing & immediate niche content
const FALLBACK_ARTICLES = [
  {
    _id: 'draft-1',
    title: 'Essai Longue Durée : 5 000 km au guidon de la Yamaha XSR 900',
    slug: 'essai-longue-duree-yamaha-xsr-900',
    category: 'ESSAIS & TESTS',
    readTime: '8 min de lecture',
    date: '2026-10-05',
    excerpt:
      'Que vaut le roadster néo-rétro japonais sur le réseau secondaire et les trajets quotidiens ? Retour d’expérience sans concession sur la rigidité du châssis Deltabox, la position de conduite et la consommation réelle du 3-cylindres CP3.',
    tag: 'ESSAI ROUTIER',
    highlight: '119 CH SUR LE BANC',
  },
  {
    _id: 'draft-2',
    title: 'Top 5 des Lignes d’Échappement pour magnifier le Moteur CP3',
    slug: 'meilleurs-echappements-yamaha-xsr-900',
    category: 'ACCESSOIRES & SON',
    readTime: '6 min de lecture',
    date: '2026-10-04',
    excerpt:
      'Comparatif des systèmes d’échappement complets pour la XSR 900 : Akrapovič Titane homologué Euro 5+, SC-Project S1, Spark 3-en-1 et Arrow. Mesures au sonomètre, courbes de couple et gains de poids.',
    tag: 'ÉCHAPPEMENT CP3',
    highlight: 'SONORITÉ RACING',
  },
  {
    _id: 'draft-3',
    title: 'Prépa Café Racer : Transformer sa XSR 900 en bête de Grand Prix 80s',
    slug: 'prepa-cafe-racer-yamaha-xsr-900',
    category: 'CUSTOM & ATELIER',
    readTime: '7 min de lecture',
    date: '2026-10-03',
    excerpt:
      'Guide pas à pas pour radicaliser votre roadster : installation du kit carénage Faster Sons, demi-guidons bracelets, commandes reculées Gilles Tooling et support de plaque court taillé dans la masse.',
    tag: 'PERSONNALISATION',
    highlight: 'STYLE TZ GRAND PRIX',
  },
  {
    _id: 'draft-4',
    title: 'Guide d’Entretien CP3 : Vidange, Tendeur de Distribution et Révisions',
    slug: 'guide-entretien-moteur-cp3-yamaha',
    category: 'MOTEUR & TECHNIQUE',
    readTime: '10 min de lecture',
    date: '2026-10-02',
    excerpt:
      'Tout ce qu’il faut savoir pour préserver la santé mécanique de votre bloc 890 cm³. Choix de l’huile moteur Yamalube 10W40, contrôle du jeu aux soupapes à 40 000 km et surveillance du tendeur de chaîne hydraulique.',
    tag: 'MÉCANIQUE',
    highlight: 'INTERVALLES CONSTRUCTEUR',
  },
]

type ArticlesSectionProps = {
  sanityPosts?: any[]
}

export default function ArticlesSection({sanityPosts = []}: ArticlesSectionProps) {
  const [activeFilter, setActiveFilter] = useState('TOUS')

  const hasSanityPosts = sanityPosts && sanityPosts.length > 0

  // Combine or select items
  const categories = ['TOUS', 'ESSAIS & TESTS', 'ACCESSOIRES & SON', 'CUSTOM & ATELIER', 'MOTEUR & TECHNIQUE']

  const displayItems = hasSanityPosts
    ? sanityPosts.map((p) => ({
        _id: p._id,
        title: p.title || 'Sans titre',
        slug: p.slug || '',
        category: 'BLOG ARTICLE',
        readTime: '5 min de lecture',
        date: p.date ? new Date(p.date).toLocaleDateString('fr-FR') : 'Récemment',
        excerpt: p.excerpt || 'Découvrez l’analyse complète et détaillée dans cet article.',
        tag: 'SANITY PUBLIÉ',
        highlight: 'DIRECT CMS',
        isSanity: true,
      }))
    : FALLBACK_ARTICLES.map((a) => ({...a, isSanity: false}))

  const filteredItems =
    activeFilter === 'TOUS'
      ? displayItems
      : displayItems.filter((i) => i.category === activeFilter || activeFilter === 'TOUS')

  return (
    <section id="articles" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header & Filter Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-white/[0.08] pb-8">
          <div className="space-y-3">
            <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase block">
              [ 04 // DOSSIERS & PUBLICATIONS ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              LE MAGAZINE XSR 900
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={studioUrl}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-zinc-950 hover:bg-zinc-900 text-xs font-mono px-3.5 py-2 text-zinc-300 hover:text-white transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>CMS STUDIO</span>
              <ExternalLink className="h-3 w-3 text-zinc-500" />
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
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

        {/* Articles Grid */}
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
                  {/* Meta tags top */}
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-5">
                    <span className="border border-white/[0.08] bg-black px-2 py-0.5 rounded text-[11px] text-zinc-300">
                      {article.tag}
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-zinc-300 transition-colors tracking-tight leading-snug mb-3">
                    <Link href={`/posts/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-zinc-400 text-sm leading-relaxed font-light line-clamp-3 mb-6">
                    {article.excerpt}
                  </p>
                </div>

                {/* Footer of Card */}
                <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                  <span className="text-zinc-500 text-[11px]">
                    {article.date}
                  </span>

                  <Link
                    href={`/posts/${article.slug}`}
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

        {/* Dynamic CMS Status / Injection Box */}
        <div className="mt-16 rounded-2xl border border-dashed border-white/[0.15] bg-zinc-950 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              SYNCHRONISATION CMS SANITY ACTIVE
            </div>
            <h4 className="text-xl font-bold text-white">
              Publication en direct depuis le CMS Sanity
            </h4>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              Vos articles rédigés dans le Studio Sanity s&apos;affichent immédiatement ici grâce au composant <code className="text-white bg-black px-1.5 py-0.5 rounded border border-white/[0.08] font-mono text-xs">&lt;SanityLive&gt;</code> et au cache intelligent.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Link
              href={studioUrl}
              className="cursor-pointer w-full sm:w-auto rounded-lg bg-white text-black hover:bg-zinc-200 font-mono text-xs font-semibold px-5 py-3 tracking-wider uppercase transition-colors text-center"
            >
              OUVRIR LE STUDIO
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
