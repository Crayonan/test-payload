import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { defaultLexical } from '@/fields/defaultLexical'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'socialMediaLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
      maxRows: 10,
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'contactInfo',
      type: 'richText',
      editor: defaultLexical,
      admin: {
        description: 'Contact information displayed in the footer',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Short tagline displayed under the logo',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
