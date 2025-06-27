'use client'
import { motion } from 'framer-motion'
import React from 'react'
import type { ArtistMarqueeProps } from './types'

export function ArtistMarquee({ items }: ArtistMarqueeProps) {
  if (items.length === 0) return null

  const allItems = [...items, ...items]

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-block"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, repeatType: 'loop', duration: 20, ease: 'linear' }}
      >
        {allItems.map((item, index) => (
          <React.Fragment key={index}>
            <span className="inline-block mx-2 xs:mx-3 sm:mx-6 text-black xs:text-sm sm:text-base font-bold">
              {item}
            </span>
            {index !== allItems.length - 1 && (
              <span className="inline-block text-black mx-1 sm:mx-2 align-middle relative top-[-2px]">
                •
              </span>
            )}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}
