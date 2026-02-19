'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Globe, Check } from 'lucide-react'
import { locales, localeNames, type Locale } from '@/lib/locales'

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState<Locale>('en')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get current locale from cookie
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
    const locale = cookie?.split('=')[1] as Locale
    if (locale && locales.includes(locale)) {
      setCurrentLocale(locale)
    } else {
      // Detect from browser
      const browserLang = navigator.language.substring(0, 2) as Locale
      if (locales.includes(browserLang)) {
        setCurrentLocale(browserLang)
      }
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLocaleChange = (locale: Locale) => {
    // Set cookie
    document.cookie = `locale=${locale};path=/;max-age=31536000`
    setCurrentLocale(locale)
    setIsOpen(false)
    // Reload to apply new locale
    window.location.reload()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-44 bg-background border border-white/10 rounded-xl shadow-2xl py-2 z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-white/5 transition-colors ${
                locale === currentLocale ? 'text-blue-400' : 'text-foreground'
              }`}
            >
              <span>{localeNames[locale]}</span>
              {locale === currentLocale && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
