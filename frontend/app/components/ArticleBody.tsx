import {Plus} from 'lucide-react'
import type {PortableTextBlock} from 'next-sanity'
import PortableText from '@/app/components/PortableText'
import {
  hasArticleContent,
  isModularArticleContent,
  isPortableTextArray,
  withoutRedundantLeadBlocks,
  type ArticleContentSource,
  type ArticleSection,
} from '@/app/articleContent'

type FaqItem = {
  _key?: string
  question?: string | null
  answer?: unknown
}

type SourceItem = {
  _key?: string
  label?: string | null
  url?: string | null
}

type CtaItem = {
  title?: string | null
  description?: string | null
  buttonText?: string | null
  buttonUrl?: string | null
}

type KeyTakeaway = {
  _key?: string
  text?: string | null
}

type ArticleBodyProps = ArticleContentSource & {
  title?: string
  faq?: FaqItem[] | null
  keyTakeaways?: KeyTakeaway[] | null
  sources?: SourceItem[] | null
  ctaFinal?: CtaItem | null
}

function RichText({value, tone = 'body'}: {value: PortableTextBlock[]; tone?: 'lead' | 'body'}) {
  return (
    <div className={tone === 'lead' ? 'article-lead' : 'article-prose'}>
      <PortableText value={value} />
    </div>
  )
}

function ModularSections({sections}: {sections: ArticleSection[]}) {
  return (
    <div className="space-y-10">
      {sections.map((section, index) => {
        const key = section._key || `section-${index}`
        if (section._type === 'textBlock' && isPortableTextArray(section.body)) {
          return <RichText key={key} value={section.body} />
        }
        if (section._type === 'htmlEmbed' && section.html) {
          return (
            <div
              key={key}
              className="article-prose overflow-x-auto"
              dangerouslySetInnerHTML={{__html: section.html}}
            />
          )
        }
        return null
      })}
    </div>
  )
}

export default function ArticleBody(post: ArticleBodyProps) {
  if (!hasArticleContent(post)) {
    return (
      <p className="text-zinc-400 text-base leading-relaxed">
        Contenu en cours de rédaction dans le Studio Sanity.
      </p>
    )
  }

  const title = post.title || ''
  const body = isPortableTextArray(post.body) ? withoutRedundantLeadBlocks(post.body, title) : []
  const takeaways = (post.keyTakeaways || []).filter((item) => item.text)
  const faqs = (post.faq || []).filter((item) => item.question)
  const sources = (post.sources || []).filter((item) => item.label && item.url)

  return (
    <div className="space-y-14">
      {isPortableTextArray(post.introduction) && <RichText tone="lead" value={post.introduction} />}

      {takeaways.length > 0 && (
        <section className="rounded-2xl border border-white/[0.08] bg-zinc-950 p-6 sm:p-8">
          <h2 className="font-mono text-xs text-amber-400 uppercase tracking-widest mb-4">
            À retenir
          </h2>
          <ol className="space-y-3 text-sm text-zinc-300 font-light leading-relaxed">
            {takeaways.map((item, index) => (
              <li key={item._key || `takeaway-${index}`} className="flex gap-3">
                <span className="font-mono text-[11px] text-amber-400 mt-0.5 w-5 shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item.text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {body.length > 0 && <RichText value={body} />}
      {isPortableTextArray(post.content) && <RichText value={post.content} />}
      {isModularArticleContent(post.content) && <ModularSections sections={post.content} />}

      {faqs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase">FAQ</h2>
          <div className="space-y-3">
            {faqs.map((item, index) => (
              <details
                key={item._key || `faq-${index}`}
                className="group rounded-xl border border-white/[0.08] bg-zinc-950 p-5"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-sm font-bold text-white">
                  <span>{item.question}</span>
                  <Plus className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5 group-open:rotate-45 transition-transform duration-200" />
                </summary>
                {isPortableTextArray(item.answer) && (
                  <div className="pt-3">
                    <RichText value={item.answer} />
                  </div>
                )}
              </details>
            ))}
          </div>
        </section>
      )}

      {isPortableTextArray(post.conclusion) && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Conclusion</h2>
          <RichText value={post.conclusion} />
        </section>
      )}

      {sources.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Sources</h2>
          <ul className="space-y-2 text-sm font-light">
            {sources.map((item, index) => (
              <li key={item._key || `source-${index}`}>
                <a
                  href={item.url || undefined}
                  className="text-zinc-300 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {post.ctaFinal?.title && post.ctaFinal.buttonUrl ? (
        <section className="rounded-2xl border border-white/[0.08] bg-zinc-950 p-8 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="space-y-2 flex-1">
            <h2 className="text-lg font-bold text-white">{post.ctaFinal.title}</h2>
            {post.ctaFinal.description && (
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                {post.ctaFinal.description}
              </p>
            )}
          </div>
          <a
            href={post.ctaFinal.buttonUrl}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 transition-colors shrink-0"
          >
            {post.ctaFinal.buttonText || 'En savoir plus'}
          </a>
        </section>
      ) : (
        <section className="rounded-2xl border border-white/[0.08] bg-zinc-950 p-8 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="space-y-2 flex-1">
            <div className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold">
              [ EXPÉRIENCE XSR 900 // CP3 ]
            </div>
            <h2 className="text-lg font-bold text-white">
              Découvrez la machine en 3D temps réel & écoutez le CP3
            </h2>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Pivotez autour du châssis Deltabox à 360°, zoomez sur les détails mécaniques et
              écoutez la montée en régime du 3-cylindres calé à 120°.
            </p>
          </div>
          <a
            href="/#showroom-3d"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 transition-colors shrink-0"
          >
            Studio 3D & Specs
          </a>
        </section>
      )}
    </div>
  )
}
