import Image from '@/app/components/SanityImage'
import DateComponent from '@/app/components/Date'

type Props = {
  person: {
    firstName: string | null
    lastName: string | null
    picture?: {
      asset?: Record<string, unknown> | null
      hotspot?: {x: number; y: number} | null
      crop?: {top: number; bottom: number; left: number; right: number} | null
      alt?: string | null
    } | null
  }
  date?: string
  small?: boolean
}

export default function Avatar({person, date, small = false}: Props) {
  const {firstName, lastName, picture} = person || {}

  const assetRef =
    typeof picture?.asset?._ref === 'string'
      ? picture.asset._ref
      : typeof picture?.asset?._id === 'string'
        ? picture.asset._id
        : undefined

  const displayName = [firstName, lastName].filter(Boolean).join(' ')

  return (
    <div className="flex items-center font-mono">
      {assetRef ? (
        <div className={`${small ? 'h-6 w-6 mr-2' : 'h-9 w-9 mr-4'}`}>
          <Image
            id={assetRef}
            alt={picture?.alt || ''}
            className="h-full rounded-full"
            height={small ? 32 : 48}
            width={small ? 32 : 48}
            hotspot={picture?.hotspot || undefined}
            crop={picture?.crop || undefined}
            mode="cover"
          />
        </div>
      ) : (
        <div className="mr-1">By </div>
      )}
      <div className="flex flex-col">
        {displayName && <div className={`${small ? 'text-sm' : ''}`}>{displayName}</div>}
        <div className={`text-gray-500 ${small ? 'text-xs' : 'text-sm'}`}>
          <DateComponent dateString={date} />
        </div>
      </div>
    </div>
  )
}
