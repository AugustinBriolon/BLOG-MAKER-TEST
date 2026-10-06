'use client'

import {Share2} from 'lucide-react'
import {useState} from 'react'
import {toast} from 'sonner'

export default function ArticleShareButton({title}: {title: string}) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({title, url})
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Lien copié')
      window.setTimeout(() => setCopied(false), 2500)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Lien copié')
      window.setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex min-h-11 items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
    >
      <Share2 className="h-3.5 w-3.5" />
      <span>{copied ? 'COPIÉ !' : 'PARTAGER'}</span>
    </button>
  )
}
