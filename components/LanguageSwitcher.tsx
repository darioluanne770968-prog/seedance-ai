'use client'

import { useRouter } from 'next/navigation'
import { locales, localeNames, type Locale } from '@/lib/i18n'
import { Globe } from 'lucide-react'
import { useState } from 'react'

export function LanguageSwitcher() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const getCurrentLocale = (): Locale => {
    if (typeof document !== 'undefined') {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('locale='))
      const locale = cookie?.split('=')[1] as Locale
      if (locale && locales.includes(locale)) {
        return locale
      }
    }
    return 'en'
  }

  const switchLocale = (locale: Locale) => {
    // Set cookie
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`

    // Reload to apply new locale
    router.refresh()
    setOpen(false)
  }

  const currentLocale = getCurrentLocale()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Globe className="w-4 h-4 mr-2" />
        {localeNames[currentLocale]}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-background border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLocale(locale)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${
                locale === currentLocale ? 'text-blue-400 bg-blue-500/10' : ''
              }`}
            >
              {localeNames[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
