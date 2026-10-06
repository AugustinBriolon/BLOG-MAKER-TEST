import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {validateSlugKebabField} from '../../validators/slugKebabField'

export const author = defineType({
  name: 'author',
  title: 'Auteur',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 80},
      validation: (Rule) => Rule.required().custom(validateSlugKebabField),
    }),
    defineField({
      name: 'role',
      title: 'Rôle / titre',
      type: 'string',
      description: 'Ex : Rédacteur Technique · Pilote Essayeur',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'bio',
      title: 'Bio courte',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
})
