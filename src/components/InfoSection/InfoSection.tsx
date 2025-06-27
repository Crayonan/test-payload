import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { NewsArticle, FaqItem, InstagramPost, Media } from '@/payload-types'
import { InfoSectionTabs } from './InfoSectionTabs'

// Define the populated Instagram post type locally
export interface PopulatedInstagramPost extends InstagramPost {
  localImage?: Media | null | undefined
  localVideo?: Media | null | undefined
  localImages?: Media[] | null | undefined
}

interface InfoSectionProps {
  locale?: string
}

async function getNewsArticles(limit: number = 4): Promise<NewsArticle[]> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'news-articles',
    limit,
    sort: '-publishedDate',
    where: {
      _status: { equals: 'published' },
    },
  })

  return result.docs
}

async function getFaqItems(limit: number = 5): Promise<FaqItem[]> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'faq-items',
    limit,
    sort: '_order',
  })

  return result.docs
}

async function getInstagramPosts(limit: number = 5): Promise<PopulatedInstagramPost[]> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'instagram-posts',
    limit,
    sort: '-postDate',
    depth: 2, // Populate related media
  })

  return result.docs as PopulatedInstagramPost[]
}

export default async function InfoSection({ locale }: InfoSectionProps) {
  const newsItemsData: NewsArticle[] = await getNewsArticles(4)
  const faqItemsData: FaqItem[] = await getFaqItems(5)
  const instagramPostsData: PopulatedInstagramPost[] = await getInstagramPosts(5)

  return (
    <InfoSectionTabs
      initialNewsItems={newsItemsData}
      initialFaqItems={faqItemsData}
      initialInstagramPosts={instagramPostsData}
    />
  )
}
