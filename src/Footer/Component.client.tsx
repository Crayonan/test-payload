'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronUp,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
} from 'lucide-react'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { useParams } from 'next/navigation'
import type { Footer } from '@/payload-types'

interface FooterClientProps {
  data: Footer
}

export const FooterClient: React.FC<FooterClientProps> = ({ data }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const params = useParams()
  const locale = params?.lang || 'en'

  const navItems = data?.navItems || []
  const socialMediaLinks = data?.socialMediaLinks || []
  const contactInfo = data?.contactInfo
  const tagline = data?.tagline

  const toggle = (section: string) =>
    setExpandedSection((prev) => (prev === section ? null : section))

  useEffect(() => {
    if (!expandedSection) return
    const timer = setTimeout(() => {
      document
        .querySelectorAll(`.footer-section-${expandedSection} > *`)
        .forEach((el) => el.classList.add('footer-content-animate'))
    }, 50)
    return () => clearTimeout(timer)
  }, [expandedSection])

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return Instagram
      case 'twitter':
        return Twitter
      case 'facebook':
        return Facebook
      case 'linkedin':
        return Linkedin
      case 'youtube':
        return Youtube
      default:
        return Instagram
    }
  }

  return (
    <footer className="bg-black py-8 sm:py-10 md:py-12 border-t border-purple-900/30">
      <div className="container mx-auto px-4">
        {/* ========== MOBILE FOOTER ========== */}
        <div className="md:hidden">
          {/* Logo + Social */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <Link href={`/${locale}`}>
                <h3 className="text-2xl font-light italic text-white">PAYLOAD CMS</h3>
              </Link>
              {tagline && <p className="text-xs text-purple-200/70">{tagline}</p>}
            </div>
            <div className="flex gap-3">
              {socialMediaLinks.map((link, i) => {
                const Icon = getSocialIcon(link.platform)
                return (
                  <Link
                    key={link.id || i}
                    href={link.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-200/70 hover:text-purple-400 transition-colors p-2"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Links Accordion */}
          <div className="border-t border-purple-900/30 py-3">
            <button
              onClick={() => toggle('links')}
              className="w-full flex justify-between items-center py-2"
              aria-expanded={expandedSection === 'links'}
            >
              <h4 className="text-purple-400 font-semibold text-sm">Quick Links</h4>
              {expandedSection === 'links' ? (
                <ChevronUp className="h-4 w-4 text-purple-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-purple-400" />
              )}
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out footer-section-links ${
                expandedSection === 'links'
                  ? 'max-h-[999px] opacity-100 pt-2 pb-1'
                  : 'max-h-0 opacity-0 pt-0 pb-0'
              }`}
            >
              {navItems.map(({ link }, i) => (
                <div key={i} className="mb-2">
                  <CMSLink
                    {...link}
                    className="block text-purple-200/70 hover:text-purple-400 transition-colors text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Contact Accordion */}
          {contactInfo && (
            <div className="border-t border-purple-900/30 py-3">
              <button
                onClick={() => toggle('contact')}
                className="w-full flex justify-between items-center py-2"
                aria-expanded={expandedSection === 'contact'}
              >
                <h4 className="text-purple-400 font-semibold text-sm">Contact</h4>
                {expandedSection === 'contact' ? (
                  <ChevronUp className="h-4 w-4 text-purple-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-purple-400" />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out footer-section-contact ${
                  expandedSection === 'contact'
                    ? 'max-h-[999px] opacity-100 pt-2 pb-1'
                    : 'max-h-0 opacity-0 pt-0 pb-0'
                }`}
              >
                <div className="text-purple-200/70 text-sm">
                  <RichText content={contactInfo} />
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-purple-900/30 text-center text-purple-200/50">
            <p className="text-xs">© 2024 All rights reserved.</p>
          </div>
        </div>

        {/* ========== DESKTOP FOOTER ========== */}
        <div className="hidden md:block">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo & Tagline */}
              <div>
                <Link href={`/${locale}`}>
                  <h3 className="text-2xl font-light italic text-white mb-4">PAYLOAD CMS</h3>
                </Link>
                {tagline && <p className="text-purple-200/70">{tagline}</p>}
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-purple-400 font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {navItems.map(({ link }, i) => (
                    <li key={i}>
                      <CMSLink
                        {...link}
                        className="block text-purple-200/70 hover:text-purple-400 transition-colors"
                      />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              {contactInfo && (
                <div>
                  <h4 className="text-purple-400 font-semibold mb-4">Contact</h4>
                  <div className="text-purple-200/70">
                    <RichText content={contactInfo} />
                  </div>
                </div>
              )}

              {/* Follow Us */}
              {socialMediaLinks.length > 0 && (
                <div>
                  <h4 className="text-purple-400 font-semibold mb-4">Follow Us</h4>
                  <div className="flex flex-col gap-4">
                    {socialMediaLinks.map((link, i) => {
                      const Icon = getSocialIcon(link.platform)
                      const label = link.platform.charAt(0).toUpperCase() + link.platform.slice(1)
                      return (
                        <Link
                          key={link.id || i}
                          href={link.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-purple-200/70 hover:text-purple-400 transition-colors"
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-sm">{label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full mt-12 pt-8 border-t border-purple-900/30">
            <p className="text-center text-purple-200/50">© 2024 All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
