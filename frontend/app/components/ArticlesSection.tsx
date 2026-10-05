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
  sanityPosts?: AllPostsQueryResult
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
      <div className="container mx-auto px-4">
        {/* Header & Filter Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 font-mono text-xs text-amber-400 mb-3">
              <BookOpen className="h-3.5 w-3.5" />
              CHRONIQUES & ESSAIS SPÉCIALISÉS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              LE MAGAZINE XSR 900
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={studioUrl}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-xs font-mono px-3.5 py-2 text-zinc-300 transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OUVRIR SANITY STUDIO</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                activeFilter === cat
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-zinc-900/60 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((article, idx) => (
              <motion.article
                layout
                key={article._id}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, scale: 0.95}}
                transition={{duration: 0.4, delay: idx * 0.05}}
                className="group relative rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950 p-8 flex flex-col justify-between hover:border-amber-400/40 transition-all duration-300 shadow-xl overflow-hidden"
              >
                {/* Background Hover Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Meta tags top */}
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-6">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-amber-300 font-semibold">
                      <Tag className="h-3 w-3" />
                      {article.tag}
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors tracking-tight leading-snug mb-4">
                    {article.title}
                  </h3>

                  <p className="text-zinc-400 text-sm leading-relaxed font-light line-clamp-3 mb-6">
                    {article.excerpt}
                  </p>
                </div>

                {/* Footer of Card */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-xs text-zinc-500">
                    {article.date}
                  </span>

                  <Link
                    href={`/posts/${article.slug}`}
                    className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 group-hover:text-white transition-colors"
                  >
                    <span>LIRE LE DOSSIER</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Dynamic CMS Status / Injection Box */}
        <div className="mt-16 rounded-3xl border border-dashed border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-zinc-950 to-zinc-900 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              SYNCHRONISATION CMS ACTIVE
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-white">
              Générez et publiez vos prochains articles en 1 clic
            </h4>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              Votre outil <strong className="text-white">Blog Maker</strong> est relié à ce projet Sanity. Dès que vous publiez un article depuis l&apos;Étape 5 de l&apos;interface, il s&apos;affiche instantanément ici avec son formatage complet.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Link
              href={studioUrl}
              className="cursor-pointer w-full sm:w-auto rounded-xl bg-white text-black hover:bg-amber-400 font-mono text-xs font-bold px-6 py-3.5 tracking-wider uppercase transition-colors text-center shadow"
            >
              ACCÉDER AU STUDIO
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
