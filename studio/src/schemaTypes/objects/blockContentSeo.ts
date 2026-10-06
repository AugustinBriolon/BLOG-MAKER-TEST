import {defineArrayMember, defineType} from 'sanity'

/** Portable Text SEO : H2–H4, listes, liens (Metabole-aligned, FR only). */
export const blockContentSeo = defineType({
  name: 'blockContentSeo',
  title: 'Contenu SEO (rich text)',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraphe', value: 'normal'},
        {title: 'Titre H2', value: 'h2'},
        {title: 'Titre H3', value: 'h3'},
        {title: 'Titre H4', value: 'h4'},
        {title: 'Citation', value: 'blockquote'},
      ],
      lists: [
        {title: 'Liste à puces', value: 'bullet'},
        {title: 'Liste numérotée', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Gras', value: 'strong'},
          {title: 'Italique', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Lien',
            fields: [
              {
                name: 'href',
                type: 'string',
                title: 'URL',
                description: 'Lien interne (ex: /contact/) ou externe.',
              },
              {
                name: 'follow',
                type: 'boolean',
                title: 'Follow',
                description: 'Suivi par les moteurs de recherche (défaut: true).',
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),
  ],
})
