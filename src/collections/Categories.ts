import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'categoryType',
      type: 'select',
      required: true,
      options: [
        { label: 'Music Genre', value: 'music-genre' },
        { label: 'Picture Category', value: 'picture-category' },
        { label: 'Social Media Platform', value: 'social-platform' },
        { label: 'Article Category', value: 'article-category' },
      ],
      admin: {
        description: 'Select the type of category this represents',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
