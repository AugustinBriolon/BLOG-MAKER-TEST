import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {validateSlugKebabField} from '../../validators/slugKebabField'
import {blogPostCta, htmlEmbed, textBlock} from '../objects/sections'

/**
 * Article de blog — FR only, structure alignée Metabole (5 groupes).
 * Auteur + catégorie = documents référencés.
 */
export const blogPost = defineType({
  name: 'blogPost',
  title: 'Article de blog',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'seo', title: '1. Métadonnées SEO', default: true},
    {name: 'schema', title: '2. Données structurées (Schema.org)'},
    {name: 'header', title: '3. En-tête (H1 · auteur · intro)'},
    {name: 'content', title: "4. Corps de l'article"},
    {name: 'footer', title: "5. Bas d'article (conclusion · sources · liens)"},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de l’article',
      type: 'string',
      group: 'seo',
      description: 'Titre principal de l’article (utilisé par Blog Maker et Studio).',
    }),
    defineField({
      name: 'metaTitle',
      title: 'Balise Title',
      type: 'string',
      group: 'seo',
      description: "55–65 caractères. À rédiger en premier pour fixer l'angle.",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: '140–160 caractères. Bénéfice + CTA implicite.',
      validation: (Rule) => Rule.required().min(50).max(180),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'seo',
      options: {source: 'metaTitle', maxLength: 80},
      description: 'Sans accents. URL : /blog/[slug]/',
      validation: (Rule) => Rule.required().custom(validateSlugKebabField),
    }),
    defineField({
      name: 'keywordPrimary',
      title: 'Mot-clé principal',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'keywordsSecondary',
      title: 'Mots-clés secondaires (séparés par des virgules)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'reference',
      group: 'seo',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'seo',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'featuredImage',
      title: 'Image mise en avant',
      type: 'image',
      group: 'seo',
      description: '1200×630px · format .webp recommandé.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredImageAlt',
      title: 'Texte alternatif (alt)',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'schemaPrincipalType',
      title: 'Type principal Schema.org',
      type: 'string',
      group: 'schema',
      options: {
        list: [
          {title: 'Article', value: 'Article'},
          {title: 'BlogPosting', value: 'BlogPosting'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'BlogPosting',
    }),
    defineField({
      name: 'structuredDataJsonLd',
      title: 'Données structurées JSON-LD',
      type: 'text',
      rows: 16,
      group: 'schema',
      description:
        'Coller du JSON-LD ou <script type="application/ld+json">…</script>. Injecté en plus du JSON-LD auto.',
    }),

    defineField({
      name: 'h1',
      title: 'H1 — Titre principal',
      type: 'string',
      group: 'header',
      description: 'Différent de la balise Title.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      group: 'header',
      to: [{type: 'author'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'date',
      group: 'header',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Date de mise à jour',
      type: 'date',
      group: 'header',
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'blockContentSeo',
      group: 'header',
      description: '100–150 mots. Mot-clé dans les 100 premiers mots.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'keyTakeaways',
      title: 'À retenir',
      type: 'array',
      group: 'header',
      description: '3 à 5 points clés.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Point clé',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'text'},
          },
        }),
      ],
      validation: (Rule) => Rule.min(3).max(5),
    }),

    defineField({
      name: 'body',
      title: 'Contenu principal (Blog Maker / Standard)',
      type: 'blockContentSeo',
      group: 'content',
      description: 'Corps principal rédigé par Blog Maker ou l’éditeur standard.',
    }),

    defineField({
      name: 'content',
      title: 'Sections modulaires',
      type: 'array',
      group: 'content',
      description: 'Texte (rich) ou HTML tableaux. JSON-LD → groupe 2 uniquement.',
      of: [defineArrayMember({type: textBlock.name}), defineArrayMember({type: htmlEmbed.name})],
    }),

    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'footer',
      description: '2 à 6 questions — active le schema FAQPage.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Réponse',
              type: 'blockContentSeo',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'question'},
          },
        }),
      ],
      validation: (Rule) => Rule.min(2).max(6),
    }),
    defineField({
      name: 'conclusion',
      title: 'Conclusion',
      type: 'blockContentSeo',
      group: 'footer',
    }),
    defineField({
      name: 'ctaFinal',
      title: 'CTA final',
      type: blogPostCta.name,
      group: 'footer',
    }),
    defineField({
      name: 'sources',
      title: 'Sources',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Libellé',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label'},
          },
        }),
      ],
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Articles recommandés',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({type: 'reference', to: [{type: 'blogPost'}]})],
      validation: (Rule) => Rule.max(3),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      metaTitle: 'metaTitle',
      slug: 'slug.current',
      media: 'featuredImage',
    },
    prepare: ({title, metaTitle, slug, media}: Record<string, unknown>) => ({
      title: ((title || metaTitle) as string) ?? 'Article de blog',
      subtitle: slug ? `/blog/${slug}` : undefined,
      media: media as any,
    }),
  },
})
