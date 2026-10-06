import {CogIcon, DocumentIcon, TagIcon, UserIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

/**
 * Structure personnalisée et épurée pour le Studio Sanity.
 */
export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Gestion du Contenu')
    .items([
      // 1. Articles de blog SEO
      S.listItem()
        .title('Articles de Blog')
        .schemaType('blogPost')
        .child(S.documentTypeList('blogPost').title('Tous les articles de blog'))
        .icon(DocumentIcon),

      // 2. Catégories
      S.listItem()
        .title('Catégories')
        .schemaType('category')
        .child(S.documentTypeList('category').title('Catégories du blog'))
        .icon(TagIcon),

      // 3. Auteurs
      S.listItem()
        .title('Auteurs')
        .schemaType('author')
        .child(S.documentTypeList('author').title('Auteurs / Contributeurs'))
        .icon(UserIcon),

      S.divider(),

      // 4. Configuration globale du site (Singleton)
      S.listItem()
        .title('Configuration du Site (SEO & Meta)')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
