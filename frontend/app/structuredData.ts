// The site is editorial: it neither sells the motorcycle nor shows ratings, so it must not
// declare a schema.org Product (or subtypes such as Vehicle/Motorcycle). Google requires
// `offers`, `review` or `aggregateRating` on every Product and flags the page otherwise.
export function buildHomeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        'name': 'Yamaha XSR 900 Hub',
        'description': 'Guide technique, essais et archives du roadster Yamaha XSR 900 CP3.',
        'inLanguage': 'fr-FR',
      },
      {
        '@type': 'WebPage',
        'name': 'Yamaha XSR 900 Hub',
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
