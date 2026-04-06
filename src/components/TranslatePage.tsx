'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from '@/i18n/provider'

const cache = new Map<string, string>()
const MIN_TEXT_LENGTH = 3

// Load cache from localStorage
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('funerix-page-translations')
    if (saved) {
      Object.entries(JSON.parse(saved)).forEach(([k, v]) => cache.set(k, v as string))
    }
  } catch { /* ignore */ }
}

function saveCache() {
  if (typeof window === 'undefined') return
  const obj: Record<string, string> = {}
  cache.forEach((v, k) => { obj[k] = v })
  try { localStorage.setItem('funerix-page-translations', JSON.stringify(obj)) } catch { /* ignore */ }
}

function cKey(text: string, lang: string) {
  return `${lang}:${text.slice(0, 150)}`
}

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'NOSCRIPT', 'BUTTON'])

function collectTextNodes(root: HTMLElement): { node: Text; original: string }[] {
  const nodes: { node: Text; original: string }[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const el = node.parentElement
      if (!el) return NodeFilter.FILTER_REJECT
      if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT
      if (el.closest('[data-admin]') || el.closest('[data-no-translate]')) return NodeFilter.FILTER_REJECT
      // Skip already-translated nodes
      if (el.hasAttribute('data-translated')) return NodeFilter.FILTER_REJECT
      const txt = node.textContent?.trim()
      if (!txt || txt.length < MIN_TEXT_LENGTH) return NodeFilter.FILTER_REJECT
      if (/^[\d\s€$%.,+\-/:()#@&]+$/.test(txt)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  while (walker.nextNode()) {
    const t = walker.currentNode as Text
    nodes.push({ node: t, original: t.textContent || '' })
  }
  return nodes
}

export function TranslatePage({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const isTranslating = useRef(false)
  const observerRef = useRef<MutationObserver | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (locale === 'it' || !containerRef.current) {
      // Restore: just reload page to get originals back (simplest, avoids stale node issues)
      return
    }

    const doTranslate = async () => {
      if (isTranslating.current || !containerRef.current) return
      isTranslating.current = true

      // Pause observer while we modify DOM
      observerRef.current?.disconnect()

      const textNodes = collectTextNodes(containerRef.current)

      // Apply cached translations immediately
      const toFetch: { idx: number; text: string }[] = []
      textNodes.forEach(({ node, original }, i) => {
        const key = cKey(original, locale)
        if (cache.has(key)) {
          node.textContent = cache.get(key)!
          node.parentElement?.setAttribute('data-translated', '1')
        } else {
          toFetch.push({ idx: i, text: original })
        }
      })

      // Fetch missing from API in batches
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
            const data = await res.json()
            if (data.translations) {
              const arr = Array.isArray(data.translations) ? data.translations : [data.translations]
              batch.forEach((b, j) => {
                const translated = arr[j] || b.text
                cache.set(cKey(b.text, locale), translated)
                const tn = textNodes[b.idx]
                if (tn?.node?.isConnected) {
                  tn.node.textContent = translated
                  tn.node.parentElement?.setAttribute('data-translated', '1')
                }
              })
            }
          } catch { /* ignore */ }
        }
        saveCache()
      }

      isTranslating.current = false

      // Re-enable observer
      if (containerRef.current) {
        observerRef.current?.observe(containerRef.current, {
          childList: true,
          subtree: true,
        })
      }
    }

    // Initial translate after render
    const initTimer = setTimeout(doTranslate, 500)

    // Observe new content (route changes, lazy loads)
    observerRef.current = new MutationObserver(() => {
      // Debounce to avoid rapid fire
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(doTranslate, 800)
    })
    observerRef.current.observe(containerRef.current, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearTimeout(initTimer)
      if (timerRef.current) clearTimeout(timerRef.current)
      observerRef.current?.disconnect()
    }
  }, [locale])

  // Don't wrap in extra div - use a fragment-like approach
  // But we need a ref, so use a transparent div
  return (
    <div ref={containerRef} style={{ display: 'contents' }}>
      {children}
    </div>
  )
}
