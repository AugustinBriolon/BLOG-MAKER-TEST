import type {PortableTextBlock} from 'next-sanity'

export type ArticleSection = {
  _key?: string
  _type?: string
  body?: PortableTextBlock[] | null
  html?: string | null
}

export type ArticleContentSource = {
  body?: unknown
  content?: unknown
  introduction?: unknown
  conclusion?: unknown
  faq?: unknown
  keyTakeaways?: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

export function isPortableTextArray(value: unknown): value is PortableTextBlock[] {
  if (!Array.isArray(value) || value.length === 0) {
    return false
  }

  return value.every((item) => {
    if (!isRecord(item) || typeof item._type !== 'string') {
      return false
    }
    return item._type === 'block' || item._type === 'image'
  })
}

export function isModularArticleContent(value: unknown): value is ArticleSection[] {
  if (!Array.isArray(value) || value.length === 0) {
    return false
  }

  return value.some((item) => {
    if (!isRecord(item) || typeof item._type !== 'string') {
      return false
    }
    return item._type === 'textBlock' || item._type === 'htmlEmbed'
  })
}

export function hasArticleContent(post: ArticleContentSource | null | undefined): boolean {
  if (!post) {
    return false
  }

  return (
    isPortableTextArray(post.body) ||
    isPortableTextArray(post.introduction) ||
    isPortableTextArray(post.conclusion) ||
    isPortableTextArray(post.content) ||
    isModularArticleContent(post.content) ||
    (Array.isArray(post.faq) && post.faq.length > 0) ||
    (Array.isArray(post.keyTakeaways) && post.keyTakeaways.length > 0)
  )
}

export function portableTextPlainText(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    return value.map(portableTextPlainText).join(' ')
  }
  if (!isRecord(value)) {
    return ''
  }
  if (typeof value.text === 'string') {
    return value.text
  }
  if (typeof value.html === 'string') {
    return value.html.replace(/<[^>]+>/g, ' ')
  }
  if ('children' in value) {
    return portableTextPlainText(value.children)
  }
  return ['body', 'content', 'introduction', 'conclusion', 'faq', 'answer', 'question']
    .filter((key) => key in value)
    .map((key) => portableTextPlainText(value[key]))
    .join(' ')
}

export function withoutRedundantLeadBlocks(
  blocks: PortableTextBlock[] | undefined,
  title: string,
): PortableTextBlock[] {
  if (!blocks?.length) {
    return []
  }

  const normalizedTitle = title.trim().toLowerCase()
  const firstText = portableTextPlainText(blocks[0]).trim()
  const headingMatch = firstText.match(/^#{1,6}\s+(.+)$/)
  const headingText = headingMatch?.[1]?.trim().toLowerCase() || ''

  if (
    headingMatch &&
    (!normalizedTitle || headingText === normalizedTitle || headingText.startsWith(normalizedTitle))
  ) {
    return blocks.slice(1)
  }

  return blocks
}

export function formatAuthorName(author?: {
  firstName?: string | null
  lastName?: string | null
} | null): string {
  const firstName = author?.firstName?.trim()
  const lastName = author?.lastName?.trim()
  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  }
  return firstName || 'Rédaction XSR 900'
}

export function formatFrenchDate(value?: string | null): string | null {
  if (!value) {
    return null
  }

  const dateOnly = value.slice(0, 10)
  const match = dateOnly.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) {
    return null
  }

  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ]
  const day = Number(match[3])
  const month = months[Number(match[2]) - 1]
  if (!month) {
    return null
  }
  return `${day} ${month} ${match[1]}`
}

export function estimateReadTimeMinutes(post: ArticleContentSource): number {
  const words = portableTextPlainText(post)
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
