import { NextRequest, NextResponse } from 'next/server'

const API_URL = 'https://translate.googleapis.com/translate_a/single'

// POST /api/translate — Traduce testo (usato dalla chat admin)
export async function POST(req: NextRequest) {
  const { text, targetLang, sourceLang } = await req.json()

  if (!text || !targetLang) {
    return NextResponse.json({ error: 'text e targetLang obbligatori' }, { status: 400 })
  }

  try {
    const sl = sourceLang || 'auto'
    const url = `${API_URL}?client=gtx&sl=${sl}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url)
    const data = await res.json()

    const translated = (data[0] as Array<Array<string>>).map(s => s[0]).join('')
    const detectedLang = data[2] as string || sl

    return NextResponse.json({ translated, detectedLang })
  } catch {
    return NextResponse.json({ error: 'Errore traduzione' }, { status: 500 })
  }
}
