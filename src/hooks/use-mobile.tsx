'use client'

import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Basic hook to check if device is considered mobile (below 768px)
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}

/**
 * Extended hook for fine-grained device width detection
 */
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallMobile, setIsSmallMobile] = useState(false)
  const [isMediumMobile, setIsMediumMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
      setIsSmallMobile(window.innerWidth < 375)
      setIsMediumMobile(window.innerWidth < 425 && window.innerWidth >= 375)
      setIsTablet(window.innerWidth < 1024 && window.innerWidth >= 768)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { isMobile, isSmallMobile, isMediumMobile, isTablet }
}
