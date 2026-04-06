'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from '@/i18n/provider'

const serverCache = new Map<string, Map<string, string>>()
const MIN_TEXT_LENGTH = 3

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'INPUT', 'TEXTAREA',
  'SELECT', 'OPTION', 'NOSCRIPT', 'IMG', 'VIDEO', 'AUDIO', 'IFRAME',
])

function collectTextNodes(root: HTMLElement): { node: Text; text: string }[] {
  const nodes: { node: Text; text: string }[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const el = node.parentElement
      if (!el) return NodeFilter.FILTER_REJECT
      if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT
      if (el.closest('[data-admin]') || el.closest('[data-no-translate]')) return NodeFilter.FILTER_REJECT
      const txt = node.textContent?.trim()
      if (!txt || txt.length < MIN_TEXT_LENGTH) return NodeFilter.FILTER_REJECT
      if (/^[\d\s€$%.,+\-/:()#@&<>]+$/.test(txt)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  while (walker.nextNode()) {
    const t = walker.currentNode as Text
    nodes.push({ node: t, text: t.textContent || '' })
  }
  return nodes
}

function getLangCache(lang: string): Map<string, string> {
  if (!serverCache.has(lang)) serverCache.set(lang, new Map())
  return serverCache.get(lang)!
}

export function TranslatePage({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const isTranslating = useRef(false)
  const originals = useRef<Map<Text, string>>(new Map())
  const observerRef = useRef<MutationObserver | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restore all text nodes to original Italian
  const restoreAll = () => {
    originals.current.forEach((originalText, node) => {
      if (node.isConnected) {
        node.textContent = originalText
      }
    })
    originals.current.clear()
  }

  const doTranslate = async () => {
    if (!containerRef.current || isTranslating.current || locale === 'it') return
    isTranslating.current = true

    // Pause observer
    observerRef.current?.disconnect()

    try {
      const langCache = getLangCache(locale)
      const textNodes = collectTextNodes(containerRef.current)

      // Store originals & apply cache
      const toFetch: { idx: number; text: string }[] = []

      textNodes.forEach(({ node, text }, i) => {
        // Save original if not already saved
        if (!originals.current.has(node)) {
          originals.current.set(node, text)
        }
        const original = originals.current.get(node)!
        const cached = langCache.get(original)
        if (cached) {
          node.textContent = cached
        } else {
          toFetch.push({ idx: i, text: original })
        }
      })

      // Fetch missing translations
      if (toFetch.length > 0) {
        const BATCH = 50
        for (let i = 0; i < toFetch.length; i += BATCH) {
          const batch = toFetch.slice(i, i + BATCH)
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
            if (res.ok) {
              const data = await res.json()
              if (data.translations) {
                const arr = Array.isArray(data.translations) ? data.translations : [data.translations]
                batch.forEach((b, j) => {
                  const translated = arr[j] || b.text
                  langCache.set(b.text, translated)
                  const tn = textNodes[b.idx]
                  if (tn?.node?.isConnected) {
                    tn.node.textContent = translated
                  }
                })
              }
            }
          } catch { /* ignore */ }
        }
      }
    } finally {
      isTranslating.current = false
      // Resume observer
      if (containerRef.current) {
        observerRef.current?.observe(containerRef.current, {
          childList: true, subtree: true,
        })
      }
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    if (locale === 'it') {
      restoreAll()
      return
    }

    // Translate after React finishes rendering
    const timer = setTimeout(doTranslate, 600)

    // Watch for new content (route changes, dynamic loads)
    observerRef.current = new MutationObserver(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(doTranslate, 1000)
    })
    observerRef.current.observe(containerRef.current, {
      childList: true, subtree: true,
    })

    return () => {
      clearTimeout(timer)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      observerRef.current?.disconnect()
    }
  }, [locale])

  return (
    <div ref={containerRef} style={{ display: 'contents' }}>
      {children}
    </div>
  )
}
