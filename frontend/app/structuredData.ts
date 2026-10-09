// The site is editorial: it neither sells the motorcycle nor shows ratings, so it must not
// declare a schema.org Product (or subtypes such as Vehicle/Motorcycle). Google requires
// `offers`, `review` or `aggregateRating` on every Product and flags the page otherwise.

export interface ArticleJsonLdInput {
  title: string
  description?: string | null
  slug: string
  date?: string | null
  updatedAt?: string | null
  imageUrl?: string | null
  authorName?: string | null
  authorRole?: string | null
  authorBio?: string | null
  baseUrl?: string
}

function resolveSiteOrigin(inputUrl?: string): string {
  if (inputUrl && inputUrl.trim()) {
    try {
      const u = new URL(inputUrl)
      return `${u.protocol}//${u.host}`
    } catch {
      // ignore
    }
  }
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined)
  if (fromEnv) {
    try {
      const u = new URL(fromEnv)
      return `${u.protocol}//${u.host}`
    } catch {
      // ignore
    }
  }
  return 'https://yamaha-xsr900.vercel.app'
}

export function buildHomeJsonLd() {
  const origin = resolveSiteOrigin()
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        'name': 'Yamaha XSR 900 Hub',
        'url': origin,
        'description': 'Guide technique, essais et archives du roadster Yamaha XSR 900 CP3.',
        'inLanguage': 'fr-FR',
      },
      {
        '@type': 'WebPage',
        '@id': `${origin}/#webpage`,
        'name': 'Yamaha XSR 900 Hub',
        'url': origin,
        'inLanguage': 'fr-FR',
        'about': {
          '@type': 'Thing',
          'name': 'Yamaha XSR 900',
          'description':
            'Roadster néo-rétro propulsé par le 3-cylindres Crossplane CP3 de 890 cm³ et cadre Deltabox.',
        },
      },
    ],
  }
}

export function buildBlogHubJsonLd(baseUrlInput?: string) {
  const origin = resolveSiteOrigin(baseUrlInput)
  const blogUrl = `${origin}/blog`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${blogUrl}#blog`,
        'name': 'Le Blog XSR 900 // Dossiers & Essais Techniques',
        'description':
          'Dossiers complets, guides d’entretien moteur CP3 et essais de la Yamaha XSR 900.',
        'url': blogUrl,
        'inLanguage': 'fr-FR',
        'publisher': {
          '@type': 'Organization',
          'name': 'Yamaha XSR 900 Hub',
          'url': origin,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${blogUrl}#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Accueil',
            'item': `${origin}/`,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Blog',
            'item': blogUrl,
          },
        ],
      },
    ],
  }
}

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  const origin = resolveSiteOrigin(input.baseUrl)
  const articleUrl = `${origin}/blog/${input.slug}`
  const authorName = input.authorName?.trim() || 'Augustin Briolon'
  const authorRole = input.authorRole?.trim() || 'Rédacteur technique & Pilote'

  const graph: Array<Record<string, unknown>> = [
    {
      '@type': 'BlogPosting',
      '@id': `${articleUrl}#article`,
      'isPartOf': {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        'name': 'Yamaha XSR 900 Hub',
        'url': origin,
      },
      'headline': input.title,
      'description': input.description || undefined,
      'inLanguage': 'fr-FR',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': articleUrl,
      },
      'url': articleUrl,
      ...(input.date ? {datePublished: input.date} : {}),
      ...(input.updatedAt || input.date ? {dateModified: input.updatedAt || input.date} : {}),
      ...(input.imageUrl ? {image: [input.imageUrl]} : {}),
      'author': {
        '@type': 'Person',
        'name': authorName,
        'jobTitle': authorRole,
        ...(input.authorBio ? {description: input.authorBio} : {}),
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Yamaha XSR 900 Hub',
        'url': origin,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${articleUrl}#breadcrumb`,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Accueil',
          'item': `${origin}/`,
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Blog',
          'item': `${origin}/blog`,
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': input.title,
          'item': articleUrl,
        },
      ],
    },
  ]

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}
