// src/collections/InstagramPosts.ts
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { CollectionConfig } from 'payload'

export const InstagramPosts: CollectionConfig = {
  slug: 'instagram-posts',
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'postDate', 'localImage', 'localVideo', 'likesCount'],
    group: 'Social Media',
    description:
      'Fetched Instagram posts. Use the "Fetch Instagram Posts" action above the list to fetch new posts.',
    components: {
      beforeList: ['./components/InstagramPosts'],
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'instagramPostId',
      label: 'Instagram Post ID',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'shortcode',
      label: 'Shortcode',
      type: 'text',
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'ownerUsername',
      label: 'Owner Username',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'originalImageUrl',
      label: 'Original Image URL',
      type: 'text',
      admin: { readOnly: true, hidden: true },
    },
    {
      name: 'localImage',
      label: 'Local Image (Main)',
      type: 'relationship',
      relationTo: 'media', // Your Media collection slug
      admin: { readOnly: true },
    },
    {
      name: 'localImages',
      label: 'Local Images (Carousel)',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: { readOnly: true },
    },
    {
      name: 'originalVideoUrl',
      label: 'Original Video URL',
      type: 'text',
      admin: { readOnly: true, hidden: true },
    },
    {
      name: 'localVideo',
      label: 'Local Video',
      type: 'relationship',
      relationTo: 'media', // Assuming videos also go to 'media' collection
      admin: { readOnly: true },
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: { readOnly: true },
    },
    {
      name: 'postDate',
      label: 'Post Date',
      type: 'date',
      admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'likesCount',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'commentsCount',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'isCarousel',
      label: 'Is Carousel Post',
      type: 'checkbox',
      admin: { readOnly: true },
    },
  ],
}

export default InstagramPosts
