// Shared locale configuration (can be used in both client and server components)

export const locales = ['en', 'zh', 'ja', 'ko', 'fr', 'de', 'es', 'pt', 'it', 'ar'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  it: 'Italiano',
  ar: 'العربية',
}
