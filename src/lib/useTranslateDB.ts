'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Hook per tradurre un array di testi dal DB quando la lingua non è IT.
 * Usa cache localStorage per evitare chiamate ripetute.
 * Restituisce l'array tradotto (o originale se IT).
 */

const localCache = new Map<string, string>()

// Load from localStorage once
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('funerix-db-translations')
    if (saved) {
      Object.entries(JSON.parse(saved)).forEach(([k, v]) => localCache.set(k, v as string))
    }
  } catch { /* ignore */ }
}

function saveLocal() {
  if (typeof window === 'undefined') return
  const obj: Record<string, string> = {}
  localCache.forEach((v, k) => { obj[k] = v })
  try {
    // Limit cache size
    const str = JSON.stringify(obj)
    if (str.length < 500000) localStorage.setItem('funerix-db-translations', str)
  } catch { /* ignore */ }
}

export function useTranslateDB(texts: string[], locale: string): string[] {
  const [results, setResults] = useState<string[]>(texts)
  const prevKey = useRef('')

  useEffect(() => {
    const key = locale + ':' + texts.join('|||')
    if (key === prevKey.current) return
    prevKey.current = key

    if (locale === 'it' || texts.length === 0) {
      setResults(texts)
      return
    }

    // Check cache
    const cached = texts.map(t => localCache.get(`${locale}:${t.slice(0, 100)}`))
    if (cached.every(c => c !== undefined)) {
      setResults(cached as string[])
      return
    }

    // Find missing
    const missing: { idx: number; text: string }[] = []
    const partial = [...texts]
    texts.forEach((t, i) => {
      const c = localCache.get(`${locale}:${t.slice(0, 100)}`)
      if (c) {
        partial[i] = c
      } else if (t.trim().length > 1) {
        missing.push({ idx: i, text: t })
      }
    })

    if (missing.length === 0) {
      setResults(partial)
      return
    }

    // Fetch translations
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
          const updated = [...partial]
          missing.forEach((m, j) => {
            const translated = arr[j] || m.text
            updated[m.idx] = translated
            localCache.set(`${locale}:${m.text.slice(0, 100)}`, translated)
          })
          saveLocal()
          setResults(updated)
        }
      })
      .catch(() => {
        setResults(partial)
      })

    return () => controller.abort()
  }, [texts, locale])

  return results
}
