'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useLocale } from '@/i18n/provider'

const cache = new Map<string, string>()
const BATCH_DELAY = 300
const MIN_TEXT_LENGTH = 2

// Load cache
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('funerix-page-translations')
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
  try { localStorage.setItem('funerix-page-translations', JSON.stringify(obj)) } catch { /* ignore */ }
}

function cacheKey(text: string, lang: string) {
  return `${lang}:${text.slice(0, 150)}`
}

// Skip elements that shouldn't be translated
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'NOSCRIPT'])
const SKIP_ATTRS = ['data-no-translate']

function getTextNodes(root: HTMLElement): { node: Text; original: string }[] {
  const nodes: { node: Text; original: string }[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT
      if (SKIP_ATTRS.some(a => parent.closest(`[${a}]`))) return NodeFilter.FILTER_REJECT
      // Skip admin panel
      if (parent.closest('[data-admin]')) return NodeFilter.FILTER_REJECT
      const text = node.textContent?.trim()
      if (!text || text.length < MIN_TEXT_LENGTH) return NodeFilter.FILTER_REJECT
      // Skip pure numbers/symbols
      if (/^[\d\s€$%.,+\-/:()]+$/.test(text)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  while (walker.nextNode()) {
    const textNode = walker.currentNode as Text
    nodes.push({ node: textNode, original: textNode.textContent || '' })
  }
  return nodes
}

/**
 * Wrapper component that automatically translates all visible text on the page
 * when the locale is not Italian. Uses DeepL API with aggressive caching.
 */
export function TranslatePage({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const originalTexts = useRef<Map<Text, string>>(new Map())
  const translating = useRef(false)

  const translatePage = useCallback(async () => {
    if (locale === 'it' || !containerRef.current || translating.current) return
    translating.current = true

    const textNodes = getTextNodes(containerRef.current)

    // Store originals
    textNodes.forEach(({ node, original }) => {
      if (!originalTexts.current.has(node)) {
        originalTexts.current.set(node, original)
      }
    })

    // Find texts needing translation
    const toTranslate: { index: number; text: string }[] = []
    textNodes.forEach(({ node }, i) => {
      const original = originalTexts.current.get(node) || node.textContent || ''
      const key = cacheKey(original, locale)
      if (cache.has(key)) {
        node.textContent = cache.get(key)!
      } else {
        toTranslate.push({ index: i, text: original })
      }
    })

    if (toTranslate.length === 0) {
      translating.current = false
      return
    }

    // Batch translate (max 50 per call)
    const BATCH = 50
    for (let i = 0; i < toTranslate.length; i += BATCH) {
      const batch = toTranslate.slice(i, i + BATCH)
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            texts: batch.map(b => b.text),
            targetLang: locale,
            sourceLang: 'it',
          }),
        })
        const data = await res.json()
        if (data.translations) {
          const arr = Array.isArray(data.translations) ? data.translations : [data.translations]
          batch.forEach((b, j) => {
            const translated = arr[j] || b.text
            cache.set(cacheKey(b.text, locale), translated)
            if (textNodes[b.index]?.node) {
              textNodes[b.index].node.textContent = translated
            }
          })
        }
      } catch { /* ignore batch errors */ }
    }

    saveCache()
    translating.current = false
  }, [locale])

  // Restore originals when switching back to Italian
  const restoreOriginals = useCallback(() => {
    originalTexts.current.forEach((original, node) => {
      if (node.isConnected) {
        node.textContent = original
      }
    })
  }, [])

  useEffect(() => {
    if (locale === 'it') {
      restoreOriginals()
      return
    }

    // Delay to let React render first
    const timer = setTimeout(translatePage, BATCH_DELAY)
    return () => clearTimeout(timer)
  }, [locale, translatePage, restoreOriginals])

  // Observe DOM changes to translate dynamically added content
  useEffect(() => {
    if (locale === 'it' || !containerRef.current) return

    const observer = new MutationObserver(() => {
      setTimeout(translatePage, BATCH_DELAY)
    })

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      characterData: false,
    })

    return () => observer.disconnect()
  }, [locale, translatePage])

  return <div ref={containerRef}>{children}</div>
}
