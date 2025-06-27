'use client'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FaInstagram, FaTwitter, FaSpotify, FaSoundcloud, FaFacebook } from 'react-icons/fa'
import type { ArtistModalProps } from './types'
import { getImageUrl, extractBio, formatLocation } from './utils'

const socialIcons = {
  instagram: <FaInstagram className="w-7 h-7 text-sky-950 hover:text-sky-700" />,
  twitter: <FaTwitter className="w-7 h-7 text-sky-950 hover:text-sky-700" />,
  spotify: <FaSpotify className="w-7 h-7 text-sky-950 hover:text-sky-700" />,
  soundcloud: <FaSoundcloud className="w-7 h-7 text-sky-950 hover:text-sky-700" />,
  facebook: <FaFacebook className="w-7 h-7 text-sky-950 hover:text-sky-700" />,
}

export function ArtistModal({ artist, isOpen, onClose }: ArtistModalProps) {
  if (!artist) return null

  const imageUrl = getImageUrl(artist.image)
  const bio = extractBio(artist.biography)
  const day = artist.day?.charAt(0).toUpperCase() + (artist.day?.slice(1) || '') || 'TBA'
  const time =
    artist.time && artist.endTime ? `${artist.time} - ${artist.endTime}` : artist.time || 'TBA'
  const location = formatLocation(artist.location)

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0 sm:rounded-lg">
        <DialogHeader className="sr-only">
          <DialogTitle>{artist.name} - Artist Profile</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Side */}
          <div className="relative aspect-square md:aspect-auto md:min-h-[400px] lg:min-h-[500px] bg-gradient-to-br from-gray-100 to-gray-200">
            <Image
              src={imageUrl}
              alt={`${artist.name} profile photo`}
              fill
              className="object-cover"
              priority={isOpen}
            />
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <div className="bg-purple-600 text-white px-4 py-2 text-xs md:text-sm font-bold shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span>{day}</span>
                  {time !== 'TBA' && (
                    <>
                      <span className="hidden sm:inline">|</span>
                      <span>{time}</span>
                    </>
                  )}
                  {location !== 'TBA' && (
                    <>
                      <span className="hidden sm:inline">|</span>
                      <span className="font-extrabold">{location}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-red-500 text-white px-6 py-3 text-3xl md:text-4xl font-black transform -skew-x-2 shadow-lg">
                {artist.name}
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="p-6 md:p-8 flex flex-col space-y-6 bg-white">
            <div className="space-y-4">
              <div className="bg-purple-600 text-white px-4 py-2 font-bold text-lg inline-block">
                About
              </div>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {bio}
              </p>
            </div>

            {artist.biography?.socialLinks && artist.biography.socialLinks.length > 0 && (
              <div className="space-y-4">
                <div className="bg-red-500 text-white px-4 py-2 font-bold text-lg inline-block">
                  Follow {artist.name}
                </div>
                <div className="flex flex-wrap gap-3">
                  {artist.biography?.socialLinks?.map((link) => {
                    const Icon = socialIcons[link.platform as keyof typeof socialIcons]
                    if (!link.url) return null
                    return (
                      <a
                        key={link.id || link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white p-3 hover:opacity-80 transition-opacity rounded-md"
                        aria-label={`Follow ${artist.name} on ${link.platform}`}
                      >
                        {Icon || <span className="capitalize text-xs">{link.platform}</span>}
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
