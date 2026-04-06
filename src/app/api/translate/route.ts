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

// Ensure cache table exists (runs once)
let tableChecked = false
async function ensureTable() {
  if (tableChecked) return
  try {
    // Try to query - if fails, table doesn't exist
    const { error } = await sb.from('traduzioni_cache').select('id').limit(1)
    if (error && error.code === 'PGRST205') {
      // Table doesn't exist yet - will be created from Supabase Dashboard
      // Visit /api/setup-translations for the SQL
    }
  } catch { /* ignore */ }
  tableChecked = true
}

// Lookup cached translations from Supabase
async function getCachedTranslations(texts: string[], lang: string): Promise<Map<string, string>> {
  const cached = new Map<string, string>()
  try {
    // Query in batches of 50
    for (let i = 0; i < texts.length; i += 50) {
      const batch = texts.slice(i, i + 50)
      const { data } = await sb
        .from('traduzioni_cache')
        .select('testo_originale, traduzione')
        .eq('lingua', lang)
        .in('testo_originale', batch)
      if (data) {
        data.forEach((row: { testo_originale: string; traduzione: string }) => {
          cached.set(row.testo_originale, row.traduzione)
        })
      }
    }
  } catch { /* table may not exist yet */ }
  return cached
}

// Save translations to Supabase cache
async function saveCachedTranslations(entries: { text: string; translation: string }[], lang: string) {
  try {
    const rows = entries.map(e => ({
      testo_originale: e.text,
      lingua: lang,
      traduzione: e.translation,
    }))
    // Upsert to handle duplicates
    await sb.from('traduzioni_cache').upsert(rows, {
      onConflict: 'testo_originale,lingua',
    })
  } catch { /* ignore - table may not exist */ }
}

// POST /api/translate — traduce testi al volo via DeepL con cache Supabase
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

  await ensureTable()

  const textArray: string[] = Array.isArray(texts) ? texts : [texts]

  // 1. Check Supabase cache first
  const cached = await getCachedTranslations(textArray, targetLang)

  // 2. Find texts NOT in cache
  const missing: { index: number; text: string }[] = []
  const results: string[] = new Array(textArray.length)

  textArray.forEach((text, i) => {
    const cachedTranslation = cached.get(text)
    if (cachedTranslation) {
      results[i] = cachedTranslation
    } else {
      missing.push({ index: i, text })
    }
  })

  // 3. Translate only missing texts via DeepL
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

      if (!res.ok) {
        // If DeepL fails, return cached + originals for missing
        missing.forEach(m => { results[m.index] = m.text })
        return NextResponse.json({
          translations: Array.isArray(texts) ? results : results[0],
        })
      }

      const data = await res.json()
      const translations = data.translations.map((t: { text: string }) => t.text)

      // Fill results and prepare cache entries
      const toCache: { text: string; translation: string }[] = []
      missing.forEach((m, j) => {
        const translated = translations[j] || m.text
        results[m.index] = translated
        toCache.push({ text: m.text, translation: translated })
      })

      // 4. Save new translations to Supabase (non-blocking)
      saveCachedTranslations(toCache, targetLang).catch(() => {})

    } catch (err) {
      // On error, fill missing with originals
      missing.forEach(m => { results[m.index] = m.text })
      return NextResponse.json({
        translations: Array.isArray(texts) ? results : results[0],
        error: String(err),
      })
    }
  }

  return NextResponse.json({
    translations: Array.isArray(texts) ? results : results[0],
    cached: textArray.length - missing.length,
    translated: missing.length,
  })
}
