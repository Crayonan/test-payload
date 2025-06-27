'use client'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/utilities/ui'

interface FrameItemProps {
  image: string
  width: number | string
  height: number | string
  className?: string
  label: string
  isHovered: boolean
  isMobile?: boolean
}

export function FrameItem({
  image,
  width,
  height,
  className = '',
  label,
  isHovered,
  isMobile = false,
}: FrameItemProps) {
  const [showLabelState, setShowLabelState] = useState(false)
  const shouldShowLabelOverlay = isMobile || isHovered || showLabelState
  const imageAltText = label && label.trim() !== '' ? label : 'Gallery image view'

  return (
    <div
      className={`relative ${className}`}
      style={{
        width,
        height,
        transition: isMobile ? 'none' : 'width 0.3s ease-in-out, height 0.3s ease-in-out',
      }}
      onMouseEnter={() => !isMobile && setShowLabelState(true)}
      onMouseLeave={() => !isMobile && setShowLabelState(false)}
    >
      <div className="relative w-full h-full overflow-hidden rounded-lg group">
        <Image
          src={image || '/placeholder.svg'}
          alt={imageAltText}
          fill
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          priority={true}
        />
        {shouldShowLabelOverlay && (
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10',
              'transition-opacity duration-300',
              isHovered || isMobile ? 'opacity-100' : 'opacity-0',
            )}
          >
            <div className="text-white font-bold text-center text-xs sm:text-sm md:text-base break-words">
              {label}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
