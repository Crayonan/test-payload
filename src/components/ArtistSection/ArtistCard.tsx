import Image from 'next/image'
import type { ArtistCardProps } from './types'

export function ArtistCard({ name, image, day, time, venue, altTitle, onClick }: ArtistCardProps) {
  return (
    <div
      className="act cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      <figure className="act__image">
        <Image src={image || '/placeholder.svg'} alt={altTitle || name} loading="lazy" />
      </figure>

      <span className="act__content">
        <h4 className="title-6 act__content-title">{altTitle || name}</h4>
        {day && day !== 'TBA' && <span className="act__content-days">{day.toLowerCase()}</span>}
        {(time !== 'TBA' || venue !== 'TBA') && (
          <span className="act__content-meta">
            {time !== 'TBA' && <span>{time}</span>}
            {time !== 'TBA' && venue !== 'TBA' && <span className="mx-1 hidden sm:inline">|</span>}
            {venue !== 'TBA' && (
              <span className="act-performance__location block sm:inline">{venue}</span>
            )}
          </span>
        )}
      </span>
    </div>
  )
}
