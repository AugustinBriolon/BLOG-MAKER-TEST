export const BLOG_MAGAZINE_CATEGORIES = [
  'TOUS',
  'ESSAIS & TESTS',
  'ACCESSOIRES & SON',
  'CUSTOM & ATELIER',
  'MOTEUR & TECHNIQUE',
] as const

export type BlogMagazineCategory = Exclude<(typeof BLOG_MAGAZINE_CATEGORIES)[number], 'TOUS'>

const LABELS: BlogMagazineCategory[] = [
  'ESSAIS & TESTS',
  'ACCESSOIRES & SON',
  'CUSTOM & ATELIER',
  'MOTEUR & TECHNIQUE',
]

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function resolveBlogMagazineCategory(input: {
  categoryTitle?: string | null
  categorySlug?: string | null
  tags?: Array<string | null> | null
  title?: string | null
  keywordPrimary?: string | null
}): BlogMagazineCategory {
  const titleNorm = input.categoryTitle ? normalize(input.categoryTitle) : ''
  for (const label of LABELS) {
    if (titleNorm && titleNorm === normalize(label)) return label
  }

  const haystack = normalize(
    [
      input.categoryTitle,
      input.categorySlug,
      input.keywordPrimary,
      input.title,
      ...(input.tags ?? []),
    ]
      .filter((part): part is string => Boolean(part && part.trim()))
      .join(' '),
  )

  if (/essai|test|route|performance|chronique/.test(haystack)) return 'ESSAIS & TESTS'
  if (/accessoire|son|echappement|casque|faster/.test(haystack)) return 'ACCESSOIRES & SON'
  if (/custom|cafe racer|atelier|preparation/.test(haystack)) return 'CUSTOM & ATELIER'
  return 'MOTEUR & TECHNIQUE'
}
