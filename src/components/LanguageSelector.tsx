'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'

const lingue = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹', google: '' },
  { code: 'en', label: 'English', flag: '🇬🇧', google: 'en' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', google: 'ar' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', google: 'fr' },
  { code: 'es', label: 'Español', flag: '🇪🇸', google: 'es' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', google: 'de' },
  { code: 'pt', label: 'Português', flag: '🇧🇷', google: 'pt' },
  { code: 'ro', label: 'Română', flag: '🇷🇴', google: 'ro' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦', google: 'uk' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱', google: 'pl' },
  { code: 'sq', label: 'Shqip', flag: '🇦🇱', google: 'sq' },
  { code: 'zh', label: '中文', flag: '🇨🇳', google: 'zh-CN' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳', google: 'hi' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩', google: 'bn' },
  { code: 'tl', label: 'Filipino', flag: '🇵🇭', google: 'tl' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺', google: 'ru' },
]

function triggerGoogleTranslate(googleCode: string) {
  const domain = window.location.hostname

  if (!googleCode) {
    // Torna a italiano
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`
    window.location.reload()
    return
  }

  // Setta cookie e ricarica
  document.cookie = `googtrans=/it/${googleCode}; path=/`
  document.cookie = `googtrans=/it/${googleCode}; path=/; domain=.${domain}`
  window.location.reload()
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(lingue[0])
  const ref = useRef<HTMLDivElement>(null)

  // Detect current language from cookie OR auto-detect from IP (first visit only)
  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/it\/([^;]+)/)
    if (match) {
      const found = lingue.find(l => l.google === match[1])
      if (found) setCurrent(found)
      return
    }

    // First visit: detect country from IP and set language
    const alreadyDetected = localStorage.getItem('funerix-lang-detected')
    if (alreadyDetected) return

    fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(data => {
        localStorage.setItem('funerix-lang-detected', '1')
        const countryToLang: Record<string, string> = {
          GB: 'en', US: 'en', AU: 'en', CA: 'en', IE: 'en',
          FR: 'fr', BE: 'fr', CH: 'fr',
          ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es',
          DE: 'de', AT: 'de',
          PT: 'pt', BR: 'pt',
          RO: 'ro', MD: 'ro',
          SA: 'ar', EG: 'ar', MA: 'ar', DZ: 'ar', TN: 'ar', LY: 'ar', AE: 'ar',
          RU: 'ru',
          CN: 'zh-CN', TW: 'zh-CN',
          UA: 'uk',
          PL: 'pl',
          AL: 'sq', XK: 'sq',
          IN: 'hi',
          BD: 'bn',
          PH: 'tl',
        }
        const lang = countryToLang[data.country_code]
        if (lang && data.country_code !== 'IT') {
          const found = lingue.find(l => l.google === lang)
          if (found) {
            setCurrent(found)
            triggerGoogleTranslate(found.google)
          }
        }
      })
      .catch(() => { /* timeout or error, stay in Italian */ })
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = (l: typeof lingue[0]) => {
    setCurrent(l)
    setOpen(false)
    localStorage.setItem('funerix-lang', l.code)
    triggerGoogleTranslate(l.google)
  }

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
        <div className="absolute right-0 top-full mt-2 bg-surface rounded-xl border border-border shadow-xl py-2 min-w-[160px] max-h-72 overflow-y-auto z-50">
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
