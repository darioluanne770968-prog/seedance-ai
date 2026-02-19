'use client'

import { NextIntlClientProvider } from 'next-intl'
import { useEffect, useState } from 'react'
import { locales, defaultLocale, type Locale } from '@/lib/locales'

interface IntlProviderProps {
  children: React.ReactNode
}

export function IntlProvider({ children }: IntlProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)
  const [messages, setMessages] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    // Get locale from cookie
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
    const cookieLocale = cookie?.split('=')[1] as Locale

    let selectedLocale: Locale = defaultLocale

    if (cookieLocale && locales.includes(cookieLocale)) {
      selectedLocale = cookieLocale
    } else {
      // Detect from browser
      const browserLang = navigator.language.substring(0, 2) as Locale
      if (locales.includes(browserLang)) {
        selectedLocale = browserLang
        // Set cookie for future visits
        document.cookie = `locale=${browserLang};path=/;max-age=31536000`
      }
    }

    setLocale(selectedLocale)

    // Load messages
    import(`@/messages/${selectedLocale}.json`)
      .then((mod) => setMessages(mod.default))
      .catch(() => {
        // Fallback to English
        import('@/messages/en.json').then((mod) => setMessages(mod.default))
      })
  }, [])

  if (!messages) {
    return null // or a loading spinner
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
