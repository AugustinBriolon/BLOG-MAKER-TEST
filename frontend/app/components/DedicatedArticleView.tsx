import Link from 'next/link'
import {ArrowLeft, ArrowRight, Calendar, Clock, User} from 'lucide-react'
import ArticleBody from '@/app/components/ArticleBody'
import ArticleShareButton from '@/app/components/ArticleShareButton'
import Image from '@/app/components/SanityImage'
import {estimateReadTimeMinutes, formatAuthorName, formatFrenchDate} from '@/app/articleContent'

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
  const title = sanityPost?.h1 || sanityPost?.title || 'Dossier XSR 900'
  const excerpt = sanityPost?.excerpt || ''
  const category = sanityPost?.category?.title || 'Dossier'
  const readMinutes = estimateReadTimeMinutes({
    body: sanityPost?.body,
    introduction: sanityPost?.introduction,
    content: sanityPost?.content,
    conclusion: sanityPost?.conclusion,
    faq: sanityPost?.faq,
  })
  const dateFormatted = formatFrenchDate(sanityPost?.date)
  const authorName = formatAuthorName(sanityPost?.author)
  const authorRole = sanityPost?.author?.role?.trim() || 'Chroniqueur technique'
  const authorBio =
    (typeof sanityPost?.author?.bio === 'string' && sanityPost.author.bio.trim()) ||
    "Spécialiste de l'architecture moteur CP3 et de l'histoire de la gamme Sport Heritage Yamaha."
  const coverRef = sanityPost?.coverImage?.asset?._ref

  return (
    <article className="min-h-screen bg-black text-zinc-100 pt-8 pb-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-zinc-500 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2 min-w-0">
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
            <ArticleShareButton title={title} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <header className="space-y-6 pb-12 border-b border-white/[0.08] mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-amber-500/30 bg-amber-500/10 px-3 py-1 rounded font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
              {category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {title}
          </h1>

          {excerpt && (
            <p className="text-lg sm:text-xl text-zinc-300 font-light leading-relaxed border-l-2 border-white/20 pl-4 py-1">
              {excerpt}
            </p>
          )}

          <div className="pt-4 flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.06] text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-white/10 bg-zinc-900 flex items-center justify-center">
                <User className="h-4 w-4 text-zinc-400" />
              </div>
              <div>
                <div className="font-bold text-white tracking-wider">{authorName}</div>
                <div className="text-[11px] text-zinc-500">{authorRole}</div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-[11px] text-zinc-500">
              {dateFormatted && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <time dateTime={sanityPost?.date}>{dateFormatted}</time>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {readMinutes} min de lecture
              </span>
            </div>
          </div>
        </header>

        {coverRef ? (
          <div className="mb-14 rounded-2xl overflow-hidden border border-white/[0.08] bg-zinc-950">
            <Image
              id={coverRef}
              alt={sanityPost.coverImage.alt || sanityPost.featuredImageAlt || title}
              className="w-full object-cover max-h-[550px]"
              width={1200}
              height={630}
              mode="cover"
              hotspot={sanityPost.coverImage.hotspot}
              crop={sanityPost.coverImage.crop}
            />
          </div>
        ) : null}

        <ArticleBody
          title={title}
          body={sanityPost?.body}
          content={sanityPost?.content}
          introduction={sanityPost?.introduction}
          conclusion={sanityPost?.conclusion}
          faq={sanityPost?.faq}
          keyTakeaways={sanityPost?.keyTakeaways}
          sources={sanityPost?.sources}
          ctaFinal={sanityPost?.ctaFinal}
        />

        <div className="mt-16 p-8 rounded-2xl border border-white/[0.08] bg-zinc-950 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="h-16 w-16 rounded-full border border-white/10 bg-zinc-900 flex items-center justify-center shrink-0">
            <User className="h-6 w-6 text-zinc-400" />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
              AUTEUR DU DOSSIER
            </div>
            <h2 className="text-lg font-bold text-white">{authorName}</h2>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">{authorBio}</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>RETOUR AU BLOG COMPLET</span>
          </Link>
          <Link
            href="/#showroom-3d"
            className="inline-flex min-h-11 items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <span>EXPLORER LA MACHINE EN 3D</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block">
                  [ LECTURES RECOMMANDÉES ]
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight uppercase">
                  AUTRES DOSSIERS LIÉS
                </h2>
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
                    <h3 className="text-sm font-bold text-white group-hover:text-zinc-300 transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
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
