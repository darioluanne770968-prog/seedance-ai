import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
}

export function getLocaleFromCookie(): Locale {
  // This is for client-side use
  if (typeof window !== 'undefined') {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
    const locale = cookie?.split('=')[1] as Locale
    if (locale && locales.includes(locale)) {
      return locale
    }
  }
  return defaultLocale
}

export default getRequestConfig(async () => {
  // Get locale from cookie or Accept-Language header
  const cookieStore = await cookies()
  const headerStore = await headers()

  let locale: Locale = defaultLocale

  // Try cookie first
  const cookieLocale = cookieStore.get('locale')?.value as Locale
  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale
  } else {
    // Fall back to Accept-Language header
    const acceptLanguage = headerStore.get('accept-language')
    if (acceptLanguage) {
      const preferredLocale = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].trim().substring(0, 2))
        .find(lang => locales.includes(lang as Locale)) as Locale

      if (preferredLocale) {
        locale = preferredLocale
      }
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
