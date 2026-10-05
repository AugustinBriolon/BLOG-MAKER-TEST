import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {Suspense} from 'react'

import BlogHubClient, {type BlogItem} from '@/app/components/BlogHubClient'
import {CURATED_ARTICLES} from '@/app/data/curated-articles'
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  type DynamicFetchOptions,
} from '@/sanity/lib/live'
import {allPostsQuery, settingsQuery} from '@/sanity/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const {perspective} = await getDynamicFetchOptions()
  const {data: settings} = await sanityFetchMetadata({
    query: settingsQuery,
    perspective,
  })

  return {
    title: `Le Blog XSR 900 // Dossiers & Essais Techniques`,
    description: settings?.description
      ? 'Dossiers complets, guides d’entretien moteur CP3 et essais de la Yamaha XSR 900.'
      : 'Actualités, essais détaillés et chroniques mécaniques de la Yamaha XSR 900.',
  }
}

// Layer 1: Page component (draftMode branch)
export default async function BlogPage() {
  const {isEnabled: isDraftMode} = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<BlogFallback />}>
        <DynamicBlogPage />
      </Suspense>
    )
  }
  return <CachedBlogPage perspective="published" stega={false} />
}

// Layer 2: Dynamic component
async function DynamicBlogPage() {
  const {perspective, stega} = await getDynamicFetchOptions()
  return <CachedBlogPage perspective={perspective} stega={stega} />
}

// Layer 3: Cached component
async function CachedBlogPage({perspective, stega}: DynamicFetchOptions) {
  'use cache'
  const {data: sanityPosts} = await sanityFetch({
    query: allPostsQuery,
    perspective,
    stega,
  })

  const hasSanity = sanityPosts && sanityPosts.length > 0

  let articles: BlogItem[] = []

  if (hasSanity) {
    articles = sanityPosts.map((p) => ({
      _id: p._id,
      title: p.title || 'Sans titre',
      slug: p.slug || '',
      category: 'DOSSIER CMS',
      readTime: '5 min de lecture',
      date: p.date
        ? new Date(p.date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'Récemment',
      excerpt: p.excerpt || 'Consultez le dossier complet rédigé dans le CMS.',
      tag: 'SANITY PUBLIÉ',
      highlight: 'CMS EN DIRECT',
      isSanity: true,
      authorName:
        p.author?.firstName && p.author?.lastName
          ? `${p.author.firstName} ${p.author.lastName}`
          : undefined,
    }))
  } else {
    articles = CURATED_ARTICLES.map((a) => ({
      _id: a._id,
      title: a.title,
      slug: a.slug,
      category: a.category,
      readTime: a.readTime,
      date: new Date(a.date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      excerpt: a.excerpt,
      tag: a.tag,
      highlight: a.highlight,
      isSanity: false,
      authorName: a.author.name,
    }))
  }

  const categories = [
    'TOUS',
    'ESSAIS & TESTS',
    'ACCESSOIRES & SON',
    'CUSTOM & ATELIER',
    'MOTEUR & TECHNIQUE',
  ]

  return <BlogHubClient articles={articles} categories={categories} />
}

function BlogFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center font-mono text-xs text-zinc-500 bg-black">
      CHARGEMENT DU BLOG XSR 900...
    </div>
  )
}
