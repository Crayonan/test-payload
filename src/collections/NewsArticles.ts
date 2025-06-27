// src/collections/NewsArticles.ts
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'

export const NewsArticles: CollectionConfig = {
  slug: 'news-articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'publishedDate', 'status'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Lineup Announcements', value: 'lineup' },
        { label: 'Artist Spotlights', value: 'artists' },
        { label: 'Festival Updates', value: 'updates' },
        { label: 'Behind the Scenes', value: 'behind-scenes' },
        { label: 'Food & Vendors', value: 'food-vendors' },
        { label: 'Sustainability', value: 'sustainability' },
        { label: 'Community', value: 'community' },
        { label: 'Press Releases', value: 'press' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}
