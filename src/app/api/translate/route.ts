import { NextRequest, NextResponse } from 'next/server'

const DEEPL_API_KEY = process.env.DEEPL_API_KEY
const DEEPL_URL = 'https://api-free.deepl.com/v2/translate'

const DEEPL_CODES: Record<string, string> = {
  en: 'EN', fr: 'FR', es: 'ES', de: 'DE', pt: 'PT-BR', ro: 'RO',
  uk: 'UK', pl: 'PL', sq: 'SQ', zh: 'ZH-HANS', ru: 'RU', ar: 'AR',
  it: 'IT',
}

// POST /api/translate — traduce testi al volo via DeepL
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

  try {
    const textArray = Array.isArray(texts) ? texts : [texts]

    const body: Record<string, unknown> = {
      text: textArray,
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
      const err = await res.text()
      return NextResponse.json({ error: `DeepL error: ${err}` }, { status: res.status })
    }

    const data = await res.json()
    const translations = data.translations.map((t: { text: string }) => t.text)

    return NextResponse.json({
      translations: Array.isArray(texts) ? translations : translations[0],
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
