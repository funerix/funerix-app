'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Globe } from 'lucide-react'

const LINGUE = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'sq', label: 'Shqip', flag: '🇦🇱' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
  { code: 'tl', label: 'Filipino', flag: '🇵🇭' },
]

const COUNTRY_MAP: Record<string, string> = {
  GB: 'en', US: 'en', AU: 'en', CA: 'en', IE: 'en',
  FR: 'fr', BE: 'fr', ES: 'es', MX: 'es', AR: 'es',
  DE: 'de', AT: 'de', CH: 'de', PT: 'pt', BR: 'pt',
  RO: 'ro', MD: 'ro', SA: 'ar', EG: 'ar', MA: 'ar',
  RU: 'ru', CN: 'zh-CN', TW: 'zh-CN', UA: 'uk',
  PL: 'pl', AL: 'sq', IN: 'hi', BD: 'bn', PH: 'tl',
}

/**
 * Triggera Google Translate in modo affidabile.
 * Google usa sel.onchange = fn (NON addEventListener),
 * quindi dispatchEvent da solo non basta.
 */
function triggerGoogleTranslate(code: string): boolean {
  const sel = document.querySelector<HTMLSelectElement>('select.goog-te-combo')
  if (!sel) return false

  const value = code === 'it' ? '' : code

  // Usa il setter nativo per bypassare framework
  const nativeSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set
  if (nativeSetter) nativeSetter.call(sel, value)
  else sel.value = value

  // Chiama onchange direttamente (Google lo setta così)
  if (typeof sel.onchange === 'function') {
    sel.onchange(new Event('change') as unknown as Event)
  }

  // Belt-and-suspenders: dispatcha anche l'evento DOM
  sel.dispatchEvent(new Event('change', { bubbles: true }))

  return true
}

/** Aspetta che Google crei il select nel DOM */
function waitForSelect(): Promise<boolean> {
  return new Promise(resolve => {
    // Già pronto?
    const sel = document.querySelector<HTMLSelectElement>('select.goog-te-combo')
    if (sel && sel.options.length > 1) { resolve(true); return }

    // Osserva il DOM
    let done = false
    const target = document.getElementById('google_translate_element') || document.body
    const observer = new MutationObserver(() => {
      const s = document.querySelector<HTMLSelectElement>('select.goog-te-combo')
      if (s && s.options.length > 1 && !done) {
        done = true
        observer.disconnect()
        resolve(true)
      }
    })
    observer.observe(target, { childList: true, subtree: true })

    // Timeout 10s
    setTimeout(() => { if (!done) { done = true; observer.disconnect(); resolve(false) } }, 10000)
  })
}

/** Pulisce cookie googtrans e ricarica per tornare a italiano */
function restoreItalian() {
  const h = window.location.hostname
  for (const domain of ['', h, `.${h}`]) {
    const d = domain ? `; domain=${domain}` : ''
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${d}`
  }
  window.location.reload()
}

/** Legge country dal cookie Vercel middleware */
function getCountryFromCookie(): string | null {
  const match = document.cookie.match(/funerix-country=([A-Z]{2})/)
  return match ? match[1] : null
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('it')
  const ref = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  const init = useCallback(async () => {
    if (initialized.current) return
    initialized.current = true

    const saved = localStorage.getItem('funerix-lang')

    if (saved && saved !== 'it') {
      // Lingua salvata → applica
      setCurrent(saved)
      const ready = await waitForSelect()
      if (ready) triggerGoogleTranslate(saved)
      return
    }

    if (saved === 'it') return // Già italiano, niente da fare

    // Prima visita: rileva paese
    const country = getCountryFromCookie() // Da Vercel middleware
    if (country) {
      const lang = COUNTRY_MAP[country]
      if (lang && country !== 'IT') {
        localStorage.setItem('funerix-lang', lang)
        setCurrent(lang)
        const ready = await waitForSelect()
        if (ready) triggerGoogleTranslate(lang)
      } else {
        localStorage.setItem('funerix-lang', 'it')
      }
      return
    }

    // Fallback: ipapi.co
    try {
      const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
      const data = await res.json()
      const lang = COUNTRY_MAP[data?.country_code]
      if (lang && data.country_code !== 'IT') {
        localStorage.setItem('funerix-lang', lang)
        setCurrent(lang)
        const ready = await waitForSelect()
        if (ready) triggerGoogleTranslate(lang)
      } else {
        localStorage.setItem('funerix-lang', 'it')
      }
    } catch {
      localStorage.setItem('funerix-lang', 'it')
    }
  }, [])

  useEffect(() => { init() }, [init])

  // Chiudi dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = async (code: string) => {
    setOpen(false)
    if (code === current) return

    localStorage.setItem('funerix-lang', code)
    setCurrent(code)

    if (code === 'it') {
      restoreItalian()
      return
    }

    const ready = await waitForSelect()
    if (ready) triggerGoogleTranslate(code)
  }

  const flag = LINGUE.find(l => l.code === current)?.flag || '🇮🇹'

  return (
    <div ref={ref} className="relative notranslate">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-primary/70 hover:text-primary transition-colors"
        aria-label="Lingua"
      >
        <Globe size={16} />
        <span className="text-sm hidden md:inline">{flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-surface rounded-xl border border-border shadow-xl py-2 min-w-[160px] max-h-72 overflow-y-auto z-[9999]">
          {LINGUE.map(l => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 transition-colors ${
                l.code === current ? 'bg-secondary/10 text-primary font-medium' : 'text-text-light hover:bg-background'
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
