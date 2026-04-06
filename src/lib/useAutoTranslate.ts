'use client'

import { useState, useEffect, useRef } from 'react'

const cache = new Map<string, string>()

// Load cache from localStorage
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('funerix-translations')
    if (saved) {
      const entries = JSON.parse(saved)
      Object.entries(entries).forEach(([k, v]) => cache.set(k, v as string))
    }
  } catch { /* ignore */ }
}

function saveCache() {
  if (typeof window === 'undefined') return
  const obj: Record<string, string> = {}
  cache.forEach((v, k) => { obj[k] = v })
  try { localStorage.setItem('funerix-translations', JSON.stringify(obj)) } catch { /* ignore */ }
}

/**
 * Hook che traduce automaticamente un array di testi quando la lingua non è 'it'.
 * Restituisce l'array tradotto (o l'originale se lingua è IT o traduzione in corso).
 */
export function useAutoTranslate(texts: string[], locale: string): string[] {
  const [translated, setTranslated] = useState<string[]>(texts)
  const prevLocale = useRef(locale)
  const prevTexts = useRef(texts.join('|||'))

  useEffect(() => {
    const textsKey = texts.join('|||')
    if (locale === 'it') {
      setTranslated(texts)
      return
    }

    // Check cache first
    const cached = texts.map(t => cache.get(`${locale}:${t.slice(0, 100)}`))
    if (cached.every(c => c !== undefined)) {
      setTranslated(cached as string[])
      if (prevLocale.current === locale && prevTexts.current === textsKey) return
    }

    prevLocale.current = locale
    prevTexts.current = textsKey

    // Find missing
    const missing: { index: number; text: string }[] = []
    texts.forEach((t, i) => {
      if (!cache.get(`${locale}:${t.slice(0, 100)}`)) {
        missing.push({ index: i, text: t })
      }
    })

    if (missing.length === 0) return

    // Translate missing via API
    const controller = new AbortController()
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texts: missing.map(m => m.text),
        targetLang: locale,
        sourceLang: 'it',
      }),
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => {
        if (data.translations) {
          const arr = Array.isArray(data.translations) ? data.translations : [data.translations]
          const result = [...texts]
          missing.forEach((m, j) => {
            const translated = arr[j] || m.text
            result[m.index] = translated
            cache.set(`${locale}:${m.text.slice(0, 100)}`, translated)
          })
          // Fill from cache for non-missing
          texts.forEach((t, i) => {
            const c = cache.get(`${locale}:${t.slice(0, 100)}`)
            if (c) result[i] = c
          })
          saveCache()
          setTranslated(result)
        }
      })
      .catch(() => { /* ignore abort */ })

    return () => controller.abort()
  }, [texts, locale])

  return translated
}
