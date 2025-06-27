'use client'

import { useState, useEffect } from 'react'
// Remove server-only import for client component
import { Button } from '@/components/ui/button'
import { ChevronRight, Instagram, HelpCircle, ExternalLink } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'
import Image from 'next/image'
import { formatDateTime } from '@/utilities/formatDateTime'
import RichText from '@/components/RichText'
import type { NewsArticle, FaqItem, Category, Media as PayloadMedia } from '@/payload-types'
import type { PopulatedInstagramPost } from './InfoSection'

const PAYLOAD_PUBLIC_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

interface InfoSectionTabsProps {
  initialInstagramPosts: PopulatedInstagramPost[]
  initialNewsItems: NewsArticle[]
  initialFaqItems: FaqItem[]
}

// Static text content (could be moved to a constants file)
const t = {
  info: {
    noInstagramPosts: 'No Instagram posts available',
    loadingInstagram: 'Loading Instagram posts...',
    instagram: 'Instagram',
    instagramFollow: 'Follow us for the latest updates',
    viewAllInstagram: 'View All on Instagram',
    noNewsPosts: 'No news posts available',
    noNewsSelected: 'No news item selected',
    news: 'News',
    viewAllNews: 'View All News',
    noFaqs: 'No FAQs available',
    faq: 'FAQ',
    stillQuestions: 'Still have questions?',
    stillQuestionsDesc: 'Contact our support team for help',
    contactSupport: 'Contact Support',
    secureTickets: 'Secure Your Tickets',
    dateLabel: 'Date',
    dateValue: 'TBA',
    locationLabel: 'Location',
    locationValue: 'TBA',
  },
}

export function InfoSectionTabs({
  initialInstagramPosts,
  initialNewsItems,
  initialFaqItems,
}: InfoSectionTabsProps) {
  const [activeSection, setActiveSection] = useState<'instagram' | 'news' | 'faq'>('instagram')
  const [selectedInstagramPost, setSelectedInstagramPost] = useState<PopulatedInstagramPost | null>(
    null,
  )
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsArticle | null>(
    initialNewsItems?.[0] || null,
  )
  const [isLoadingInstagram, setIsLoadingInstagram] = useState(false)

  useEffect(() => {
    if (initialInstagramPosts && initialInstagramPosts.length > 0 && !selectedInstagramPost) {
      setSelectedInstagramPost(initialInstagramPosts[0] || null)
    }
  }, [initialInstagramPosts, selectedInstagramPost])

  useEffect(() => {
    if (activeSection === 'instagram') {
      setIsLoadingInstagram(true)
      const timer = setTimeout(() => setIsLoadingInstagram(false), 300)
      return () => clearTimeout(timer)
    }
  }, [activeSection])

  const handleSectionChange = (section: 'instagram' | 'news' | 'faq') => {
    setActiveSection(section)
  }

  const handleInstagramPostSelect = (post: PopulatedInstagramPost) => {
    setSelectedInstagramPost(post)
  }

  const handleNewsItemSelect = (newsItem: NewsArticle) => {
    setSelectedNewsItem(newsItem)
  }

  // Helper function to ensure proper URL formatting
  const formatImageUrl = (url: string | null | undefined): string => {
    if (!url) return '/placeholder.svg'
    return url.startsWith('/') ? `${PAYLOAD_PUBLIC_URL}${url}` : url
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'instagram':
        if (!initialInstagramPosts || initialInstagramPosts.length === 0) {
          return <p className="p-8 text-center">{t.info.noInstagramPosts}</p>
        }
        const currentInstaPost = selectedInstagramPost || initialInstagramPosts[0]
        if (!currentInstaPost) {
          return <p className="p-8 text-center">{t.info.loadingInstagram}</p>
        }

        const imageToDisplay =
          currentInstaPost.localImage &&
          typeof currentInstaPost.localImage === 'object' &&
          'url' in currentInstaPost.localImage
            ? (currentInstaPost.localImage as PayloadMedia)
            : null
        const videoToDisplay =
          currentInstaPost.localVideo &&
          typeof currentInstaPost.localVideo === 'object' &&
          'url' in currentInstaPost.localVideo
            ? (currentInstaPost.localVideo as PayloadMedia)
            : null

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 content-section-mobile">
            <div className="relative h-[40vh] sm:h-[50vh] lg:h-[80vh] bg-black">
              {isLoadingInstagram ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <>
                  {videoToDisplay && videoToDisplay.url ? (
                    <video
                      src={formatImageUrl(videoToDisplay.url)}
                      controls
                      autoPlay
                      loop
                      muted
                      preload="auto"
                      className="absolute inset-0 w-full h-full object-contain"
                      onError={(e) => console.error('Video load error:', e, videoToDisplay.url)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : imageToDisplay && imageToDisplay.url ? (
                    <Image
                      src={formatImageUrl(imageToDisplay.url)}
                      alt={imageToDisplay.alt || 'Instagram post image'}
                      fill
                      className="absolute inset-0 object-cover"
                      priority
                      onError={(e) => console.error('Image load error:', e, imageToDisplay.url)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <p className="text-white">{t.info.noInstagramPosts}</p>
                    </div>
                  )}
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mr-2">
                      <Instagram className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="font-bold text-sm sm:text-base">
                      @{currentInstaPost.ownerUsername || 'instagram'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm mb-2 line-clamp-2 sm:line-clamp-3">
                    {currentInstaPost.caption}
                  </p>
                  <div className="flex items-center text-xs text-white/70">
                    <span>
                      {currentInstaPost.postDate
                        ? new Date(currentInstaPost.postDate).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 p-4 sm:p-8 md:p-12 bg-black instagram-content-mobile">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4 sm:mb-6 text-white">
                {t.info.instagram}
              </h2>
              <p className="text-sm sm:text-base text-white/80 mb-4 sm:mb-6">
                {t.info.instagramFollow}
              </p>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {initialInstagramPosts.slice(0, 3).map((post) => {
                  const postListItemImage =
                    post.localImage &&
                    typeof post.localImage === 'object' &&
                    'url' in post.localImage
                      ? (post.localImage as PayloadMedia)
                      : null
                  return (
                    <div
                      key={post.id}
                      className={`p-2 sm:p-3 border rounded-lg cursor-pointer transition-all instagram-post-mobile ${
                        selectedInstagramPost?.id === post.id
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-purple-900/30 hover:border-purple-500/50'
                      }`}
                      onClick={() => handleInstagramPostSelect(post)}
                    >
                      <div className="flex items-start">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden mr-2 sm:mr-3 flex-shrink-0 post-image relative bg-gray-700">
                          {postListItemImage?.url ? (
                            <Image
                              src={formatImageUrl(postListItemImage.url)}
                              alt={postListItemImage.alt || 'Instagram post image'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Image
                              src={'/placeholder.svg'}
                              alt={'Placeholder'}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                            {post.caption}
                          </p>
                          <p className="text-xs text-purple-400 mt-1">
                            {post.postDate ? new Date(post.postDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <a
                href={`https://www.instagram.com/${initialInstagramPosts?.[0]?.ownerUsername || process.env.NEXT_PUBLIC_INSTAGRAM_FALLBACK_USERNAME || 'lostandsound.festival'}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm sm:text-base text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span>{t.info.viewAllInstagram}</span>
                <ExternalLink className="ml-2 w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>
        )

      case 'news':
        if (!selectedNewsItem && initialNewsItems.length === 0)
          return <p className="p-8 text-center">N{t.info.noNewsPosts}</p>
        const currentNewsItem = selectedNewsItem || initialNewsItems[0]
        if (!currentNewsItem) return <p className="p-8 text-center">{t.info.noNewsSelected}</p>
        const coverImage = currentNewsItem?.coverImage as PayloadMedia | undefined
        const category = currentNewsItem?.category as Category | undefined

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 content-section-mobile">
            <div className="relative h-[40vh] sm:h-[50vh] lg:h-[80vh]">
              {coverImage?.url && (
                <Image
                  src={formatImageUrl(coverImage.url)}
                  alt={coverImage.alt || currentNewsItem.title || 'News article image'}
                  fill
                  className="absolute inset-0 object-cover"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <div className="inline-block px-2 py-1 bg-purple-600 text-xs font-bold rounded mb-2">
                    {typeof category === 'object' && category?.title ? category.title : 'General'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{currentNewsItem.title}</h3>
                  <p className="text-xs sm:text-sm mb-2 line-clamp-2 sm:line-clamp-3">
                    {currentNewsItem.excerpt || ''}
                  </p>
                  <div className="text-xs text-white/70">
                    {currentNewsItem.publishedDate
                      ? formatDateTime(currentNewsItem.publishedDate)
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-8 md:p-12 bg-black">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4 sm:mb-6 text-white">
                {t.info.news}
              </h2>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {initialNewsItems.slice(0, 4).map((newsItem) => (
                  <div
                    key={newsItem.id}
                    className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all news-item-mobile ${
                      selectedNewsItem?.id === newsItem.id
                        ? 'border-purple-500 bg-purple-900/20'
                        : 'border-purple-900/30 hover:border-purple-500/50'
                    }`}
                    onClick={() => handleNewsItemSelect(newsItem)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-white">
                          {newsItem.title}
                        </h3>
                        <p className="text-xs text-purple-400 mt-1">
                          {newsItem.publishedDate ? formatDateTime(newsItem.publishedDate) : 'N/A'}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                          selectedNewsItem?.id === newsItem.id
                            ? 'text-purple-400 rotate-90'
                            : 'text-white/50'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/news" passHref>
                <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm sm:text-base">
                  {t.info.viewAllNews}
                </Button>
              </Link>
            </div>
          </div>
        )

      case 'faq':
        if (initialFaqItems.length === 0) return <p className="p-8 text-center">{t.info.noFaqs}</p>
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 content-section-mobile">
            <div className="relative h-[30vh] sm:h-[40vh] md:h-[80vh] faq-image-mobile">
              <Image
                src="https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2070&auto=format&fit=crop"
                alt="FAQ Background"
                fill
                className="absolute inset-0 object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center p-4 sm:p-6 max-w-xs sm:max-w-sm md:max-w-md">
                  <HelpCircle className="w-10 h-10 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-white">
                    {t.info.faq}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80">{t.info.stillQuestions}</p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-8 md:p-12 bg-black faq-content-mobile">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4 sm:mb-6 text-white">
                {t.info.faq}
              </h2>
              <Accordion type="single" collapsible className="w-full faq-accordion-mobile">
                {initialFaqItems.map((faq, index) => (
                  <AccordionItem
                    key={faq.id || index}
                    value={`item-${index}`}
                    className="border-purple-900/30"
                  >
                    <AccordionTrigger className="text-sm sm:text-base text-white hover:text-purple-400 transition-colors py-3 sm:py-4 text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-sm text-white/80">
                      <RichText content={faq.answer} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-purple-900/30">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {t.info.stillQuestions}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 mb-3 sm:mb-4">
                  {t.info.stillQuestionsDesc}
                </p>
                <Button className="bg-purple-600 hover:bg-purple-500 text-white text-sm sm:text-base">
                  {t.info.contactSupport}
                </Button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section className="relative bg-black">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-3 bg-[#f2f2f2]/5 border-r border-purple-900/30">
          {/* ... Sidebar content ... */}
          <div className="p-4 sm:p-6">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 sm:py-3 rounded-none text-sm sm:text-base">
              {t.info.secureTickets}
            </Button>
          </div>
          <div className="flex flex-row lg:flex-col border-t border-purple-900/30">
            <div className="flex-1 p-4 sm:p-6 lg:border-b-0 border-r md:border-r-0 border-purple-900/30">
              <p className="text-right text-xs uppercase tracking-wider text-purple-300/70 mb-1 sm:mb-2">
                {t.info.dateLabel}
              </p>
              <p className="text-right text-sm sm:text-xl font-medium">{t.info.dateValue}</p>
            </div>
            <div className="flex-1 p-4 sm:p-6">
              <p className="text-right text-xs uppercase tracking-wider text-purple-300/70 mb-1 sm:mb-2">
                {t.info.locationLabel}
              </p>
              <p className="text-right text-sm sm:text-xl font-medium">{t.info.locationValue}</p>
            </div>
          </div>
          <div className="mt-6 md:mt-12 flex lg:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            <button
              onClick={() => handleSectionChange('instagram')}
              className={`flex-shrink-0 block p-4 md:p-6 text-right text-base md:text-xl font-bold transition-colors whitespace-nowrap ${
                activeSection === 'instagram'
                  ? 'text-purple-500 hover:text-purple-400 border-b-4 md:border-b-0 md:border-l-4 border-purple-500'
                  : 'text-white hover:text-purple-400'
              }`}
            >
              INSTAGRAM
            </button>
            <button
              onClick={() => handleSectionChange('news')}
              className={`flex-shrink-0 block p-4 md:p-6 text-right text-base md:text-xl font-bold transition-colors whitespace-nowrap ${
                activeSection === 'news'
                  ? 'text-purple-500 hover:text-purple-400 border-b-4 md:border-b-0 md:border-l-4 border-purple-500'
                  : 'text-white hover:text-purple-400'
              }`}
            >
              {t.info.news}
            </button>
            <button
              onClick={() => handleSectionChange('faq')}
              className={`flex-shrink-0 block p-4 md:p-6 text-right text-base md:text-xl font-bold transition-colors whitespace-nowrap ${
                activeSection === 'faq'
                  ? 'text-purple-500 hover:text-purple-400 border-b-4 md:border-b-0 md:border-l-4 border-purple-500'
                  : 'text-white hover:text-purple-400'
              }`}
            >
              {t.info.faq}
            </button>
          </div>
        </div>
        <div className="lg:col-span-9 relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-purple-600/30 via-purple-500/20 to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-purple-600/30 via-purple-500/20 to-transparent z-10"></div>
          {renderContent()}
        </div>
      </div>
    </section>
  )
}
