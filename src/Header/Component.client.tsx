'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CMSLink } from '@/components/Link'
import { useParams } from 'next/navigation'
import type { Header } from '@/payload-types'

const HEADER_HEIGHT_PX = 200

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const params = useParams()
  const locale = params?.lang || 'en' // Default to 'en' if no locale param
  const navItems = data?.navItems || []

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleMobileMenuItemClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="bg-black/90 backdrop-blur-md border border-purple-900/30 rounded-full px-6 py-3 flex justify-between items-center shadow-lg shadow-purple-900/20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            <h1 className="text-sm sm:text-lg font-light italic text-white whitespace-nowrap">
              PAYLOAD CMS
            </h1>
            <span className="hidden sm:block text-[0.5rem] sm:text-xs uppercase tracking-widest text-purple-300/70 whitespace-nowrap">
              Website Template
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navItems.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  className="text-white hover:text-purple-400 transition-colors text-sm font-medium"
                />
              ))}
            </nav>

            {/* Desktop Ticket Button */}
            <Button
              asChild
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full"
            >
              <Link
                href="https://tickets.infield.live/event/lost-and-sound-2025-nrzehh"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Ticket className="mr-2 h-4 w-4" />
                Get Tickets
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="relative z-50 text-white p-2 rounded-full hover:bg-purple-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 md:hidden"
          style={{
            paddingTop: `${HEADER_HEIGHT_PX + 16}px`, // Account for header height + top margin
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="container mx-auto px-4 py-8 h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col items-center space-y-8 text-center">
              {navItems.map(({ link }, i) => (
                <div key={i} onClick={handleMobileMenuItemClick}>
                  <CMSLink
                    {...link}
                    className="text-white hover:text-purple-400 transition-colors text-2xl font-semibold"
                  />
                </div>
              ))}

              {/* Mobile Ticket Button */}
              <Button
                asChild
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full mt-8"
              >
                <Link
                  href="https://tickets.infield.live/event/lost-and-sound-2025-nrzehh"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleMobileMenuItemClick}
                >
                  <Ticket className="mr-2 h-5 w-5" />
                  Get Tickets
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
