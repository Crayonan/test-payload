'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArtistCard } from './ArtistCard'
import { ArtistModal } from './ArtistModal'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Artist as PayloadArtist } from '@/payload-types'
import type { ArtistPageProps, ArtistCardProps, FilterType } from './types'
import { mapArtist, filterArtists } from './utils'
import './artists-page.css'

async function getArtists(): Promise<PayloadArtist[]> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'artists',
    limit: 0, // Get all artists
    sort: 'name',
    depth: 2, // Populate related fields
  })

  return result.docs
}

export function ArtistPage({ title = 'LINE-UP' }: ArtistPageProps) {
  const [artists, setArtists] = useState<ArtistCardProps[]>([])
  const [rawArtists, setRawArtists] = useState<PayloadArtist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterType>('A-Z')
  const [selectedArtist, setSelectedArtist] = useState<PayloadArtist | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    videoRef.current?.play().catch(console.error)
  }, [])

  useEffect(() => {
    const loadArtists = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetchedArtists: PayloadArtist[] = await getArtists()
        setRawArtists(fetchedArtists)
        setArtists(fetchedArtists.map(mapArtist))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        console.error('Error loading artists:', err)
      } finally {
        setLoading(false)
      }
    }
    loadArtists()
  }, [])

  const handleArtistClick = useCallback(
    (artistName: string) => {
      const artist = rawArtists.find((a) => a.name === artistName)
      if (artist) {
        setSelectedArtist(artist)
        setIsModalOpen(true)
      }
    },
    [rawArtists],
  )

  const filteredArtists = useMemo(
    () => filterArtists(artists, activeFilter),
    [artists, activeFilter],
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-red-500">
        <p>Error loading artists: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <>
      <main className="min-h-screen relative bg-black">
        <div className="w-full overflow-hidden relative">
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <section className="line-up-page__content pt-12">
          <div className="act-collection">
            <h1 className="text-center text-white text-7xl md:text-8xl lg:text-9xl font-bold tracking-wider mb-24 mt-12">
              {title}
            </h1>

            <div className="flex justify-center gap-4 mb-32 mx-2">
              {(['A-Z', 'VR', 'ZA', 'ZO'] as FilterType[]).map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? 'secondary' : 'outline'}
                  className={`${activeFilter === filter ? 'bg-purple-400 hover:bg-purple-500' : 'bg-white hover:bg-gray-100'} text-black font-bold px-8`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </Button>
              ))}
            </div>

            {filteredArtists.length > 0 ? (
              <ol className="act-list">
                {filteredArtists.map((artist) => (
                  <li key={artist.name} className="act-list__item">
                    <ArtistCard {...artist} onClick={() => handleArtistClick(artist.name)} />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-center text-white text-xl">No artists found for this filter.</p>
            )}
          </div>
        </section>
      </main>

      <ArtistModal
        artist={selectedArtist}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedArtist(null)
        }}
      />
    </>
  )
}
