/**
 * Traduzione via Google Translate API gratuita.
 * Traduce batch di testi e cacha tutto in localStorage.
 */

const CACHE_KEY = 'funerix-gt-cache'
const API_URL = 'https://translate.googleapis.com/translate_a/single'

// Cache in memoria
const memCache = new Map<string, string>()

// Carica cache da localStorage
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(CACHE_KEY)
    if (saved) {
      const entries = JSON.parse(saved) as Record<string, string>
      Object.entries(entries).forEach(([k, v]) => memCache.set(k, v))
    }
  } catch { /* ignore */ }
}

function saveCache() {
  try {
    const obj: Record<string, string> = {}
    memCache.forEach((v, k) => { obj[k] = v })
    localStorage.setItem(CACHE_KEY, JSON.stringify(obj))
  } catch { /* ignore */ }
}

function cacheKey(text: string, lang: string) {
  return `${lang}:${text}`
}

/** Traduce un singolo testo via Google */
async function translateOne(text: string, targetLang: string): Promise<string> {
  const key = cacheKey(text, targetLang)
  const cached = memCache.get(key)
  if (cached) return cached

  try {
    const url = `${API_URL}?client=gtx&sl=it&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url)
    const data = await res.json()
    // La risposta è un array annidato: [[["translated text","original text",...],...],...]
    const translated = (data[0] as Array<Array<string>>).map(s => s[0]).join('')
    if (translated) {
      memCache.set(key, translated)
      return translated
    }
  } catch { /* fallback */ }
  return text
}

/** Traduce un array di testi. Usa cache, chiama API solo per mancanti. */
export async function translateTexts(texts: string[], targetLang: string): Promise<string[]> {
  if (targetLang === 'it') return texts

  const results: string[] = new Array(texts.length)
  const toFetch: { idx: number; text: string }[] = []

  // Check cache
  texts.forEach((text, i) => {
    const cached = memCache.get(cacheKey(text, targetLang))
    if (cached) {
      results[i] = cached
    } else if (text.trim().length < 2) {
      results[i] = text
    } else {
      toFetch.push({ idx: i, text })
    }
  })

  // Fetch mancanti in batch (max 20 alla volta per non sovraccaricare)
  const BATCH = 20
  for (let i = 0; i < toFetch.length; i += BATCH) {
    const batch = toFetch.slice(i, i + BATCH)
    const promises = batch.map(b => translateOne(b.text, targetLang))
    const translated = await Promise.all(promises)
    batch.forEach((b, j) => {
      results[b.idx] = translated[j]
    })
  }

  saveCache()
  return results
}

/** Traduce tutto il testo visibile nella pagina */
export async function translatePage(targetLang: string) {
  if (targetLang === 'it') return

  const SKIP = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'NOSCRIPT', 'IMG'])

  // Raccogli tutti i nodi testo
  const nodes: { node: Text; text: string }[] = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const el = node.parentElement
      if (!el) return NodeFilter.FILTER_REJECT
      if (SKIP.has(el.tagName)) return NodeFilter.FILTER_REJECT
      if (el.closest('[data-admin]') || el.closest('.notranslate')) return NodeFilter.FILTER_REJECT
      const txt = node.textContent?.trim()
      if (!txt || txt.length < 2) return NodeFilter.FILTER_REJECT
      if (/^[\d\s€$%.,+\-/:()#@&<>]+$/.test(txt)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  while (walker.nextNode()) {
    const t = walker.currentNode as Text
    nodes.push({ node: t, text: t.textContent || '' })
  }

  if (nodes.length === 0) return

  // Traduci tutti i testi
  const originals = nodes.map(n => n.text)
  const translated = await translateTexts(originals, targetLang)

  // Applica al DOM
  nodes.forEach((n, i) => {
    if (translated[i] && translated[i] !== n.text) {
      n.node.textContent = translated[i]
    }
  })
}

/** Salva gli originali per poter ripristinare */
let savedOriginals: { node: Text; text: string }[] = []

export function saveOriginals() {
  const SKIP = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'NOSCRIPT', 'IMG'])
  savedOriginals = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const el = node.parentElement
      if (!el) return NodeFilter.FILTER_REJECT
      if (SKIP.has(el.tagName)) return NodeFilter.FILTER_REJECT
      if (el.closest('[data-admin]') || el.closest('.notranslate')) return NodeFilter.FILTER_REJECT
      const txt = node.textContent?.trim()
      if (!txt || txt.length < 2) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  while (walker.nextNode()) {
    const t = walker.currentNode as Text
    savedOriginals.push({ node: t, text: t.textContent || '' })
  }
}

export function restoreOriginals() {
  savedOriginals.forEach(({ node, text }) => {
    if (node.isConnected) node.textContent = text
  })
  savedOriginals = []
}
