/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {PortableText, type PortableTextComponents, type PortableTextBlock} from 'next-sanity'
import ResolvedLink from '@/app/components/ResolvedLink'
import Image from '@/app/components/SanityImage'

function HeadingAnchor({id}: {id?: string}) {
  if (!id) {
    return null
  }

  return (
    <a
      href={`#${id}`}
      className="ml-2 inline-flex min-h-11 min-w-11 items-center justify-center align-middle text-zinc-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 hover:text-amber-400"
      aria-label="Lien vers cette section"
    >
      #
    </a>
  )
}

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string
  value: PortableTextBlock[]
}) {
  const components: PortableTextComponents = {
    types: {
      image: ({value}) => {
        if (!value?.asset?._ref) {
          return null
        }

        return (
          <figure className="my-10">
            <Image
              id={value.asset._ref}
              alt={value.alt || ''}
              width={720}
              crop={value.crop}
              mode="cover"
              className="w-full rounded-md"
            />
            {value.alt ? (
              <figcaption className="mt-3 text-sm text-zinc-500">{value.alt}</figcaption>
            ) : null}
          </figure>
        )
      },
    },
    block: {
      h1: ({children, value}) => (
        <h2 id={value?._key} className="group scroll-mt-28">
          {children}
          <HeadingAnchor id={value?._key} />
        </h2>
      ),
      h2: ({children, value}) => (
        <h2 id={value?._key} className="group scroll-mt-28">
          {children}
          <HeadingAnchor id={value?._key} />
        </h2>
      ),
      h3: ({children, value}) => (
        <h3 id={value?._key} className="group scroll-mt-28">
          {children}
          <HeadingAnchor id={value?._key} />
        </h3>
      ),
      h4: ({children, value}) => (
        <h4 id={value?._key} className="group scroll-mt-28">
          {children}
          <HeadingAnchor id={value?._key} />
        </h4>
      ),
      blockquote: ({children}) => <blockquote>{children}</blockquote>,
    },
    marks: {
      link: ({children, value: link}) => {
        const seoLink = link as {href?: string; linkType?: string; follow?: boolean} | undefined
        if (seoLink?.href && !seoLink.linkType) {
          return (
            <a href={seoLink.href} rel={seoLink.follow === false ? 'nofollow' : undefined}>
              {children}
            </a>
          )
        }
        return <ResolvedLink link={link}>{children}</ResolvedLink>
      },
    },
  }

  return (
    <div className={className}>
      <PortableText components={components} value={value} />
    </div>
  )
}
