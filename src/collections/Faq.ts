// src/collections/FaqItems.ts
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'

export const FaqItems: CollectionConfig = {
  slug: 'faq-items',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'updatedAt'],
  },
  orderable: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}
