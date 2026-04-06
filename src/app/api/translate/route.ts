import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const DEEPL_API_KEY = process.env.DEEPL_API_KEY
const DEEPL_URL = 'https://api-free.deepl.com/v2/translate'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DEEPL_CODES: Record<string, string> = {
  en: 'EN', fr: 'FR', es: 'ES', de: 'DE', pt: 'PT-BR', ro: 'RO',
  uk: 'UK', pl: 'PL', sq: 'SQ', zh: 'ZH-HANS', ru: 'RU', ar: 'AR',
  it: 'IT',
}

// In-memory cache per lingua (reset ad ogni cold start, ma velocissima)
const memoryCache = new Map<string, Map<string, string>>()

// Load cache from Supabase Storage for a given language
async function loadStorageCache(lang: string): Promise<Map<string, string>> {
  if (memoryCache.has(lang)) return memoryCache.get(lang)!

  const map = new Map<string, string>()
  try {
    const { data, error } = await sb.storage
      .from('translations')
      .download(`cache-${lang}.json`)
    if (!error && data) {
      const text = await data.text()
      const obj = JSON.parse(text) as Record<string, string>
      Object.entries(obj).forEach(([k, v]) => map.set(k, v))
    }
  } catch { /* file may not exist yet */ }

  memoryCache.set(lang, map)
  return map
}

// Save cache to Supabase Storage
async function saveStorageCache(lang: string, cacheMap: Map<string, string>) {
  try {
    const obj: Record<string, string> = {}
    cacheMap.forEach((v, k) => { obj[k] = v })
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

    await sb.storage
      .from('translations')
      .upload(`cache-${lang}.json`, blob, {
        upsert: true,
        contentType: 'application/json',
      })
  } catch { /* ignore storage errors */ }
}

// POST /api/translate
export async function POST(req: NextRequest) {
  if (!DEEPL_API_KEY) {
    return NextResponse.json({ error: 'DeepL API key not configured' }, { status: 500 })
  }

  const { texts, targetLang, sourceLang } = await req.json()

  if (!texts || !targetLang) {
    return NextResponse.json({ error: 'Missing texts or targetLang' }, { status: 400 })
  }

  const deeplTarget = DEEPL_CODES[targetLang]
  if (!deeplTarget) {
    return NextResponse.json({ error: `Language ${targetLang} not supported` }, { status: 400 })
  }

  const textArray: string[] = Array.isArray(texts) ? texts : [texts]

  // 1. Load cache from Supabase Storage
  const cacheMap = await loadStorageCache(targetLang)

  // 2. Separate cached vs missing
  const results: string[] = new Array(textArray.length)
  const missing: { index: number; text: string }[] = []
  let cachedCount = 0

  textArray.forEach((text, i) => {
    const cached = cacheMap.get(text)
    if (cached) {
      results[i] = cached
      cachedCount++
    } else {
      missing.push({ index: i, text })
    }
  })

  // 3. Translate missing via DeepL
  if (missing.length > 0) {
    try {
      const body: Record<string, unknown> = {
        text: missing.map(m => m.text),
        target_lang: deeplTarget,
      }
      if (sourceLang && DEEPL_CODES[sourceLang]) {
        body.source_lang = DEEPL_CODES[sourceLang]
      }

      const res = await fetch(DEEPL_URL, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        const data = await res.json()
        const translations = data.translations.map((t: { text: string }) => t.text)

        missing.forEach((m, j) => {
          const translated = translations[j] || m.text
          results[m.index] = translated
          cacheMap.set(m.text, translated)
        })

        // 4. Save updated cache to Supabase Storage (non-blocking)
        saveStorageCache(targetLang, cacheMap).catch(() => {})
      } else {
        // DeepL failed - return originals for missing
        missing.forEach(m => { results[m.index] = m.text })
      }
    } catch {
      missing.forEach(m => { results[m.index] = m.text })
    }
  }

  return NextResponse.json({
    translations: Array.isArray(texts) ? results : results[0],
    cached: cachedCount,
    translated: missing.length,
  })
}
