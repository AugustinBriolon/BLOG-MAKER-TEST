import {defineField, defineType} from 'sanity'

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Bloc de texte',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Texte',
      type: 'blockContentSeo',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      blocks: 'body',
    },
    prepare({blocks}) {
      const block = (blocks || []).find((b: any) => b._type === 'block')
      return {
        title: block?.children?.[0]?.text || 'Bloc de texte',
        subtitle: 'Section de contenu',
      }
    },
  },
})

export const htmlEmbed = defineType({
  name: 'htmlEmbed',
  title: 'Intégration HTML / Tableau',
  type: 'object',
  fields: [
    defineField({
      name: 'html',
      title: 'Code HTML',
      type: 'text',
      rows: 8,
      description: 'Code HTML brut (tableaux comparatifs, embeds).',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      html: 'html',
    },
    prepare({html}) {
      return {
        title: 'Intégration HTML',
        subtitle: (html || '').substring(0, 40) + '...',
      }
    },
  },
})

export const blogPostCta = defineType({
  name: 'blogPostCta',
  title: 'Call to Action Final',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre du CTA',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'buttonText',
      title: 'Texte du bouton',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonUrl',
      title: 'Lien du bouton',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'buttonText',
    },
  },
})
