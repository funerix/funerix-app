/**
 * Sistema traduzione Funerix
 * - Google Translate API gratuita
 * - Cache localStorage (client) + Supabase DB tabella traduzioni (server)
 * - Batch unico: tutti i testi in una sola chiamata API
 * - data-original: salva il testo italiano originale per switching lingua corretto
 */

const LOCAL_CACHE_KEY = 'funerix-gt-cache'
const API_URL = 'https://translate.googleapis.com/translate_a/single'
const SEPARATOR = '\n§§§\n'

// Cache in memoria
const cache = new Map<string, string>()

// Carica cache da localStorage
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(LOCAL_CACHE_KEY)
    if (saved) {
      Object.entries(JSON.parse(saved) as Record<string, string>).forEach(([k, v]) => cache.set(k, v))
    }
  } catch { /* ignore */ }
}

function saveLocalCache() {
  try {
    const obj: Record<string, string> = {}
    cache.forEach((v, k) => { obj[k] = v })
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(obj))
  } catch { /* ignore */ }
}

/** Carica cache dal DB Supabase (tabella traduzioni) */
async function loadServerCache(lang: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/traduzioni?lingua=${lang}`, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return false
    const data = await res.json() as Record<string, string>
    let loaded = 0
    Object.entries(data).forEach(([k, v]) => {
      const key = `${lang}:${k}`
      if (!cache.has(key)) {
        cache.set(key, v)
        loaded++
      }
    })
    if (loaded > 0) saveLocalCache()
    return loaded > 0
  } catch { return false }
}

/** Salva cache su DB Supabase (tabella traduzioni) */
async function saveServerCache(lang: string) {
  try {
    const entries: { originale: string; traduzione: string }[] = []
    const prefix = `${lang}:`
    cache.forEach((v, k) => {
      if (k.startsWith(prefix)) {
        entries.push({ originale: k.slice(prefix.length), traduzione: v })
      }
    })
    if (entries.length === 0) return

    await fetch('/api/traduzioni', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lingua: lang, entries }),
    })
  } catch { /* ignore */ }
}

/** Traduce un batch di testi in UNA SOLA chiamata Google */
async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  const combined = texts.join(SEPARATOR)

  try {
    const url = `${API_URL}?client=gtx&sl=it&tl=${targetLang}&dt=t&q=${encodeURIComponent(combined)}`
    const res = await fetch(url)
    const data = await res.json()

    const translated = (data[0] as Array<Array<string>>).map(s => s[0]).join('')
    const parts = translated.split(/\s*§§§\s*/)

    return texts.map((original, i) => {
      const t = parts[i]?.trim()
      if (t) {
        cache.set(`${targetLang}:${original}`, t)
        return t
      }
      return original
    })
  } catch {
    return texts
  }
}

/** Traduce un array di testi. Cache first, poi Google API. */
export async function translateTexts(texts: string[], targetLang: string): Promise<string[]> {
  if (targetLang === 'it') return texts

  const results: string[] = new Array(texts.length)
  const toFetch: { idx: number; text: string }[] = []

  texts.forEach((text, i) => {
    const cached = cache.get(`${targetLang}:${text}`)
    if (cached) {
      results[i] = cached
    } else if (text.trim().length < 2) {
      results[i] = text
    } else {
      toFetch.push({ idx: i, text })
    }
  })

  if (toFetch.length === 0) return results

  // Traduci tutti i mancanti in un batch unico
  const batchTexts = toFetch.map(f => f.text)
  const translated = await translateBatch(batchTexts, targetLang)

  toFetch.forEach((f, j) => {
    results[f.idx] = translated[j] || f.text
  })

  saveLocalCache()
  saveServerCache(targetLang).catch(() => {})

  return results
}

// ============================================
// DOM Translation con data-original
// ============================================

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'NOSCRIPT', 'IMG'])

function collectTextNodes(): { node: Text; text: string; original: string }[] {
  const nodes: { node: Text; text: string; original: string }[] = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const el = node.parentElement
      if (!el) return NodeFilter.FILTER_REJECT
      if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT
      if (el.closest('[data-admin]') || el.closest('.notranslate')) return NodeFilter.FILTER_REJECT
      const txt = node.textContent?.trim()
      if (!txt || txt.length < 2) return NodeFilter.FILTER_REJECT
      if (/^[\d\s€$%.,+\-/:()#@&<>]+$/.test(txt)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  while (walker.nextNode()) {
    const t = walker.currentNode as Text
    const el = t.parentElement
    // Usa data-original se presente (testo già tradotto), altrimenti testo corrente
    const original = el?.getAttribute('data-original') || t.textContent || ''
    nodes.push({ node: t, text: t.textContent || '', original })
  }
  return nodes
}

/** Traduce tutta la pagina — usa sempre l'italiano originale come sorgente */
export async function translatePage(targetLang: string) {
  if (targetLang === 'it') return

  // Carica cache dal server
  await loadServerCache(targetLang)

  const nodes = collectTextNodes()
  if (nodes.length === 0) return

  // Usa sempre gli ORIGINALI italiani come input per la traduzione
  const originals = nodes.map(n => n.original)
  const translated = await translateTexts(originals, targetLang)

  nodes.forEach((n, i) => {
    if (translated[i] && translated[i] !== n.original) {
      const el = n.node.parentElement
      // Salva l'originale italiano come attributo data-original
      if (el && !el.getAttribute('data-original')) {
        el.setAttribute('data-original', n.original)
      }
      n.node.textContent = translated[i]
    }
  })
}

// ============================================
// Save/Restore originals (usa data-original)
// ============================================

export function saveOriginals() {
  // Non serve più salvare in array — usiamo data-original
}

export function restoreOriginals() {
  stopObserver()
  const elements = document.querySelectorAll('[data-original]')
  elements.forEach(el => {
    const original = el.getAttribute('data-original')
    if (original) {
      const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE)
      if (textNode) {
        textNode.textContent = original
      } else if (el.childNodes.length === 0) {
        el.textContent = original
      }
      el.removeAttribute('data-original')
    }
  })
}

// ============================================
// MutationObserver — traduce nuovi nodi DOM
// (FAQ che si aprono, dropdown, contenuti lazy)
// ============================================

let observer: MutationObserver | null = null
let currentLang: string | null = null
let mutationTimer: ReturnType<typeof setTimeout> | null = null

function shouldTranslateNode(node: Node): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.TEXT_NODE) return false
  const el = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement
  if (!el) return false
  if (SKIP_TAGS.has(el.tagName)) return false
  if (el.closest('[data-admin]') || el.closest('.notranslate')) return false
  if (el.getAttribute('data-original')) return false
  return true
}

function collectNewTextNodes(root: Node): { node: Text; text: string; original: string }[] {
  const nodes: { node: Text; text: string; original: string }[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const el = node.parentElement
      if (!el) return NodeFilter.FILTER_REJECT
      if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT
      if (el.closest('[data-admin]') || el.closest('.notranslate')) return NodeFilter.FILTER_REJECT
      if (el.getAttribute('data-original')) return NodeFilter.FILTER_REJECT
      const txt = node.textContent?.trim()
      if (!txt || txt.length < 2) return NodeFilter.FILTER_REJECT
      if (/^[\d\s€$%.,+\-/:()#@&<>]+$/.test(txt)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  while (walker.nextNode()) {
    const t = walker.currentNode as Text
    nodes.push({ node: t, text: t.textContent || '', original: t.textContent || '' })
  }
  return nodes
}

async function translateNewNodes(addedNodes: Node[]) {
  if (!currentLang || currentLang === 'it') return

  const allTextNodes: { node: Text; text: string; original: string }[] = []
  for (const node of addedNodes) {
    if (!shouldTranslateNode(node)) continue
    if (node.nodeType === Node.ELEMENT_NODE) {
      allTextNodes.push(...collectNewTextNodes(node))
    }
  }

  if (allTextNodes.length === 0) return

  const originals = allTextNodes.map(n => n.original)
  const translated = await translateTexts(originals, currentLang)

  allTextNodes.forEach((n, i) => {
    if (translated[i] && translated[i] !== n.original) {
      const el = n.node.parentElement
      if (el && !el.getAttribute('data-original')) {
        el.setAttribute('data-original', n.original)
      }
      n.node.textContent = translated[i]
    }
  })
}

export function startObserver(lang: string) {
  stopObserver()
  currentLang = lang
  if (lang === 'it') return

  observer = new MutationObserver((mutations) => {
    const addedNodes: Node[] = []
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => addedNodes.push(node))
    }
    if (addedNodes.length === 0) return

    // Debounce: accumula le mutazioni e traduci in batch
    if (mutationTimer) clearTimeout(mutationTimer)
    mutationTimer = setTimeout(() => translateNewNodes(addedNodes), 150)
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

export function stopObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (mutationTimer) {
    clearTimeout(mutationTimer)
    mutationTimer = null
  }
  currentLang = null
}
