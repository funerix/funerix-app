'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Globe } from 'lucide-react'

const lingue = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹', google: '' },
  { code: 'en', label: 'English', flag: '🇬🇧', google: 'en' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', google: 'fr' },
  { code: 'es', label: 'Español', flag: '🇪🇸', google: 'es' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', google: 'de' },
  { code: 'pt', label: 'Português', flag: '🇧🇷', google: 'pt' },
  { code: 'ro', label: 'Română', flag: '🇷🇴', google: 'ro' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', google: 'ar' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺', google: 'ru' },
  { code: 'zh', label: '中文', flag: '🇨🇳', google: 'zh-CN' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦', google: 'uk' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱', google: 'pl' },
  { code: 'sq', label: 'Shqip', flag: '🇦🇱', google: 'sq' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳', google: 'hi' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩', google: 'bn' },
  { code: 'tl', label: 'Filipino', flag: '🇵🇭', google: 'tl' },
]

function clearGoogleCookies() {
  const domain = window.location.hostname
  const expiry = 'expires=Thu, 01 Jan 1970 00:00:00 UTC'
  // Cancella su tutti i possibili domini
  document.cookie = `googtrans=; ${expiry}; path=/`
  document.cookie = `googtrans=; ${expiry}; path=/; domain=${domain}`
  document.cookie = `googtrans=; ${expiry}; path=/; domain=.${domain}`
}

function setGoogleCookie(langCode: string) {
  const domain = window.location.hostname
  document.cookie = `googtrans=/it/${langCode}; path=/`
  document.cookie = `googtrans=/it/${langCode}; path=/; domain=.${domain}`
}

function getCurrentGoogleLang(): string | null {
  const match = document.cookie.match(/googtrans=\/it\/([^;]+)/)
  return match ? match[1] : null
}

const countryToLang: Record<string, string> = {
  GB: 'en', US: 'en', AU: 'en', CA: 'en', IE: 'en', NZ: 'en',
  FR: 'fr', BE: 'fr',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
  DE: 'de', AT: 'de', CH: 'de',
  PT: 'pt', BR: 'pt',
  RO: 'ro', MD: 'ro',
  SA: 'ar', EG: 'ar', MA: 'ar', DZ: 'ar', TN: 'ar', LY: 'ar', AE: 'ar', IQ: 'ar', JO: 'ar',
  RU: 'ru',
  CN: 'zh-CN', TW: 'zh-CN', HK: 'zh-CN',
  UA: 'uk',
  PL: 'pl',
  AL: 'sq', XK: 'sq',
  IN: 'hi',
  BD: 'bn',
  PH: 'tl',
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(lingue[0])
  const ref = useRef<HTMLDivElement>(null)

  // Detect current language on mount
  useEffect(() => {
    const googleLang = getCurrentGoogleLang()
    if (googleLang) {
      const found = lingue.find(l => l.google === googleLang)
      if (found) setCurrent(found)
      return
    }

    // First visit: auto-detect from IP
    if (localStorage.getItem('funerix-lang-detected')) return
    localStorage.setItem('funerix-lang-detected', '1')

    fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(data => {
        if (data.country_code === 'IT' || !data.country_code) return
        const lang = countryToLang[data.country_code]
        if (lang) {
          setGoogleCookie(lang)
          window.location.reload()
        }
      })
      .catch(() => {})
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = useCallback((l: typeof lingue[0]) => {
    setCurrent(l)
    setOpen(false)

    if (!l.google) {
      // Reset to Italian
      clearGoogleCookies()
      // Force Google Translate to restore original
      const iframe = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement
      if (iframe) {
        const btn = iframe.contentDocument?.querySelector('.goog-close-link') as HTMLElement
        if (btn) { btn.click(); return }
      }
      // Fallback: reload without cookie
      window.location.href = window.location.pathname
      return
    }

    // Switch language
    clearGoogleCookies()
    setGoogleCookie(l.google)
    window.location.reload()
  }, [])

  return (
    <div ref={ref} className="relative notranslate">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-primary/70 hover:text-primary transition-colors"
        aria-label="Lingua"
      >
        <Globe size={16} />
        <span className="text-sm hidden md:inline">{current.flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-surface rounded-xl border border-border shadow-xl py-2 min-w-[160px] max-h-72 overflow-y-auto z-[9999]">
          {lingue.map(l => (
            <button
              key={l.code}
              onClick={() => handleChange(l)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 transition-colors ${
                l.code === current.code ? 'bg-secondary/10 text-primary font-medium' : 'text-text-light hover:bg-background'
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
