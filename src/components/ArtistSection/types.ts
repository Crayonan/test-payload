import type { Artist as PayloadArtist } from '@/payload-types'

export interface ArtistCardProps {
  name: string
  image: string
  day: string
  time: string
  venue: string
  altTitle?: string
  onClick?: () => void
}

export interface ArtistPageProps {
  title?: string
}

export interface ArtistModalProps {
  artist: PayloadArtist | null
  isOpen: boolean
  onClose: () => void
}

export interface ArtistMarqueeProps {
  items: string[]
}

export type FilterType = 'A-Z' | 'VR' | 'ZA' | 'ZO'
