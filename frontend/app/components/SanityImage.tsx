import {SanityImage, type WrapperProps} from 'sanity-image'

import {dataset, projectId} from '@/sanity/lib/api'

const Image = <T extends React.ElementType = 'img'>({queryParams, ...props}: WrapperProps<T>) => {
  const mergedParams = {fm: 'webp' as const, ...queryParams}
  return (
    <SanityImage
      baseUrl={`https://cdn.sanity.io/images/${projectId}/${dataset}/`}
      queryParams={mergedParams}
      {...(props as WrapperProps<T>)}
    />
  )
}

export default Image
