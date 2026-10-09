import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const postFields = /* groq */ `
  _id,
  _type,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, h1, metaTitle, "Untitled"),
  metaTitle,
  metaDescription,
  "slug": slug.current,
  "excerpt": coalesce(metaDescription, excerpt, ""),
  "coverImage": coalesce(featuredImage, coverImage),
  featuredImageAlt,
  "date": coalesce(publishedAt, date, _updatedAt),
  "author": coalesce(
    author->{ "firstName": name, "lastName": "", "picture": photo, role, bio },
    author->{ firstName, lastName, picture }
  ),
  category->{ title, "slug": slug.current },
  tags,
  keywordPrimary,
  keywordsSecondary,
  keyTakeaways,
  h1,
  introduction,
  faq,
  conclusion,
  ctaFinal,
  sources,
  structuredDataJsonLd,
  schemaPrincipalType
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ...,
        button {
          ...,
          ${linkFields}
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type in ["page", "post", "blogPost"] && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type in ["post", "blogPost"] && defined(slug.current)] | order(coalesce(publishedAt, date, _updatedAt) desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type in ["post", "blogPost"] && _id != $skip && defined(slug.current)] | order(coalesce(publishedAt, date, _updatedAt) desc) [0...$limit] {
    ${postFields}
  }
`)

const portableTextProjection = /* groq */ `
  ...,
  markDefs[]{
    ...,
    ${linkReference}
  }
`

export const postQuery = defineQuery(`
  *[_type in ["post", "blogPost"] && slug.current == $slug] [0] {
    body[]{
      ${portableTextProjection}
    },
    content[]{
      ${portableTextProjection},
      _type == "textBlock" => {
        ...,
        body[]{
          ${portableTextProjection}
        }
      }
    },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type in ["post", "blogPost"] && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)
