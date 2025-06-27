import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { validateTime } from '@/utilities/validateTime'
import { CollectionConfig } from 'payload'

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Artist Image (Optional)',
    },
    {
      type: 'tabs',
      label: 'Location/Time',
      tabs: [
        {
          name: 'biography',
          label: 'Biography',
          fields: [
            {
              name: 'bio',
              type: 'richText',
              label: 'Biography (Optional)',
            },
            {
              name: 'musicGenres',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              filterOptions: {
                categoryType: {
                  equals: 'music-genre',
                },
              },
              admin: {
                description: 'Select music genres for this artist',
              },
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social Media Links (Optional)',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Twitter / X', value: 'twitter' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Spotify', value: 'spotify' },
                    { label: 'SoundCloud', value: 'soundcloud' },
                    // Add more platforms as needed
                  ],
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Location/Time',
          fields: [
            {
              name: 'day',
              type: 'select',
              label: 'Day of the Week',
              options: [
                { label: 'Friday', value: 'friday' },
                { label: 'Saturday', value: 'saturday' },
                { label: 'Sunday', value: 'sunday' },
              ],
            },
            {
              name: 'time',
              type: 'text',
              label: 'Start Time (e.g., 18:00)',
              validate: validateTime,
            },
            {
              name: 'endTime',
              type: 'text',
              label: 'End Time (e.g., 20:00)',
              validate: validateTime,
            },
            {
              name: 'location',
              type: 'select',
              label: 'Location',
              options: [
                { label: 'Main Stage', value: 'main-stage' },
                { label: 'Outside Stage', value: 'outside-stage' },
                { label: 'Tent Area', value: 'tent-area' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
