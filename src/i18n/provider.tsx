'use client'

import { NextIntlClientProvider } from 'next-intl'
import { useState, useEffect, createContext, useContext } from 'react'
import { type Locale, defaultLocale } from './config'

import it from './messages/it.json'

const messagesMap: Record<string, () => Promise<Record<string, unknown>>> = {
  en: () => import('./messages/en.json').then(m => m.default),
  ar: () => import('./messages/ar.json').then(m => m.default),
  fr: () => import('./messages/fr.json').then(m => m.default),
  es: () => import('./messages/es.json').then(m => m.default),
  de: () => import('./messages/de.json').then(m => m.default),
  pt: () => import('./messages/pt.json').then(m => m.default),
  ro: () => import('./messages/ro.json').then(m => m.default),
  uk: () => import('./messages/uk.json').then(m => m.default),
  pl: () => import('./messages/pl.json').then(m => m.default),
  sq: () => import('./messages/sq.json').then(m => m.default),
  zh: () => import('./messages/zh.json').then(m => m.default),
  hi: () => import('./messages/hi.json').then(m => m.default),
  bn: () => import('./messages/bn.json').then(m => m.default),
  tl: () => import('./messages/tl.json').then(m => m.default),
  ru: () => import('./messages/ru.json').then(m => m.default),
}

const LocaleContext = createContext<{
  locale: Locale
  setLocale: (l: Locale) => void
}>({ locale: defaultLocale, setLocale: () => {} })

export function useLocale() {
  return useContext(LocaleContext)
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [messages, setMessages] = useState<Record<string, unknown>>(it)

  useEffect(() => {
    const saved = localStorage.getItem('funerix-lang') as Locale | null
    if (saved && saved !== 'it') {
      setLocaleState(saved)
      loadMessages(saved)
    }
  }, [])

  const loadMessages = async (code: Locale) => {
    if (code === 'it') {
      setMessages(it)
      return
    }
    const loader = messagesMap[code]
    if (loader) {
      try {
        const msgs = await loader()
        setMessages(msgs)
      } catch {
        setMessages(it)
      }
    }
  }

  const setLocale = (code: Locale) => {
    setLocaleState(code)
    localStorage.setItem('funerix-lang', code)
    document.documentElement.lang = code
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
    loadMessages(code)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}
