'use client'

import { useState, useCallback } from 'react'

const cache = new Map<string, string>()

function cacheKey(text: string, lang: string) {
  return `${lang}:${text.slice(0, 100)}`
}

// Carica cache da localStorage
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
 * Hook per tradurre contenuti dinamici (da DB) al volo via DeepL
 * Usa cache localStorage per non ripetere chiamate
 */
export function useTranslateContent() {
  const [loading, setLoading] = useState(false)

  const translate = useCallback(async (texts: string[], targetLang: string): Promise<string[]> => {
    if (targetLang === 'it') return texts

    // Controlla cache
    const results: (string | null)[] = texts.map(t => cache.get(cacheKey(t, targetLang)) || null)
    const missing = texts.filter((_, i) => !results[i])

    if (missing.length === 0) return results as string[]

    // Traduci solo quelli mancanti
    setLoading(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: missing, targetLang, sourceLang: 'it' }),
      })
      const data = await res.json()

      if (data.translations) {
        const translated = Array.isArray(data.translations) ? data.translations : [data.translations]
        let j = 0
        for (let i = 0; i < texts.length; i++) {
          if (!results[i]) {
            results[i] = translated[j] || texts[i]
            cache.set(cacheKey(texts[i], targetLang), results[i]!)
            j++
          }
        }
        saveCache()
      }
    } catch {
      // Fallback: testo originale
      for (let i = 0; i < results.length; i++) {
        if (!results[i]) results[i] = texts[i]
      }
    }
    setLoading(false)
    return results as string[]
  }, [])

  const translateOne = useCallback(async (text: string, targetLang: string): Promise<string> => {
    const [result] = await translate([text], targetLang)
    return result
  }, [translate])

  return { translate, translateOne, loading }
}
