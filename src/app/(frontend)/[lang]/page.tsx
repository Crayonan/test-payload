import { getLang } from '@/hooks/useLocale'
import { Page } from '@/payload-types'

export default async function Home({ params }: { params: { locale: 'en' | 'de' } }) {
  const { locale } = await params
  const t = await getLang(locale)

  return <div>Home</div>
}
