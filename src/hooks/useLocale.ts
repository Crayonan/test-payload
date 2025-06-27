import 'server-only'

const t = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  de: () => import('@/locales/de.json').then((module) => module.default),
}

export const getLang = async (locale: 'en' | 'de') => t[locale]()
