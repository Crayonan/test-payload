import type { Artist as PayloadArtist, Media as PayloadMedia } from '@/payload-types'
import type { ArtistCardProps, FilterType } from './types'

const PAYLOAD_PUBLIC_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export const formatLocation = (location?: string | null): string => {
  if (!location) return 'TBA'
  return location.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export const getImageUrl = (image?: PayloadArtist['image']): string => {
  if (!image || typeof image !== 'object' || !('url' in image)) return '/placeholder.svg'
  const media = image as PayloadMedia
  if (!media.url) return '/placeholder.svg'
  return media.url.startsWith('/') ? `${PAYLOAD_PUBLIC_URL}${media.url}` : media.url
}

export const mapArtist = (artist: PayloadArtist): ArtistCardProps => ({
  name: artist.name,
  image: getImageUrl(artist.image),
  day: artist.day || 'TBA',
  time: artist.time && artist.endTime ? `${artist.time} - ${artist.endTime}` : artist.time || 'TBA',
  venue: formatLocation(artist.location),
})

export const filterArtists = (artists: ArtistCardProps[], filter: FilterType) => {
  switch (filter) {
    case 'A-Z':
      return [...artists].sort((a, b) => a.name.localeCompare(b.name))
    case 'VR':
      return artists.filter((a) => a.day === 'friday')
    case 'ZA':
      return artists.filter((a) => a.day === 'saturday')
    case 'ZO':
      return artists.filter((a) => a.day === 'sunday')
    default:
      return artists
  }
}

export const extractBio = (bio?: PayloadArtist['biography']): string => {
  if (!bio?.bio?.root.children) return 'No biography available.'
  let text = ''
  const traverse = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (node.type === 'text' && node.text) text += node.text + ' '
      if (node.children) traverse(node.children)
    })
  }
  traverse(bio.bio.root.children)
  return text.trim() || 'No biography available.'
}
