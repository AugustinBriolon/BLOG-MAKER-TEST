import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {blogPost} from './documents/blogPost'
import {category} from './documents/category'
import {author} from './documents/author'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import {blockContentSeo} from './objects/blockContentSeo'
import button from './objects/button'
import {blockContentTextOnly} from './objects/blockContentTextOnly'
import {textBlock, htmlEmbed, blogPostCta} from './objects/sections'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  blogPost,
  category,
  author,
  page,
  post,
  person,
  // Objects
  blockContentSeo,
  textBlock,
  htmlEmbed,
  blogPostCta,
  button,
  blockContent,
  blockContentTextOnly,
  infoSection,
  callToAction,
  link,
]
