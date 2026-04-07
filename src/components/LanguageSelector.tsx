'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Globe } from 'lucide-react'

const LINGUE = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹', google: 'it' },
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

const COUNTRY_TO_GOOGLE: Record<string, string> = {
  GB: 'en', US: 'en', AU: 'en', CA: 'en', IE: 'en', NZ: 'en',
  FR: 'fr', BE: 'fr', ES: 'es', MX: 'es', AR: 'es', CO: 'es',
  DE: 'de', AT: 'de', CH: 'de', PT: 'pt', BR: 'pt',
  RO: 'ro', MD: 'ro', SA: 'ar', EG: 'ar', MA: 'ar', DZ: 'ar',
  TN: 'ar', AE: 'ar', RU: 'ru', CN: 'zh-CN', TW: 'zh-CN',
  UA: 'uk', PL: 'pl', AL: 'sq', XK: 'sq', IN: 'hi', BD: 'bn', PH: 'tl',
}

function getGoogleSelect(): HTMLSelectElement | null {
  return document.querySelector('.goog-te-combo') as HTMLSelectElement | null
}

function applyLanguage(langCode: string, retries = 0) {
  const select = getGoogleSelect()
  if (!select) {
    if (retries < 10) setTimeout(() => applyLanguage(langCode, retries + 1), 500)
    return
  }

  if (langCode === 'it') {
    // Restore originale: Google Translate usa stringa vuota per la lingua originale
    select.value = ''
    select.dispatchEvent(new Event('change'))
    // Backup: se change non funziona, forza restore via iframe
    try {
      const frame = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement
      const btn = frame?.contentDocument?.querySelector('.goog-close-link') as HTMLElement
      btn?.click()
    } catch { /* ok */ }
    // Pulisci cookie come ulteriore fallback
    const h = window.location.hostname
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${h}`
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${h}`
    return
  }

  select.value = langCode
  select.dispatchEvent(new Event('change'))
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('it')
  const ref = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  // Init: leggi lingua salvata, applica, rileva IP se prima visita
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const saved = localStorage.getItem('funerix-lang')

    if (saved) {
      setCurrentLang(saved)
      if (saved !== 'it') {
        applyLanguage(saved)
      }
      return
    }

    // Prima visita: rileva da IP
    fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(data => {
        if (data?.country_code && data.country_code !== 'IT') {
          const lang = COUNTRY_TO_GOOGLE[data.country_code]
          if (lang) {
            localStorage.setItem('funerix-lang', lang)
            setCurrentLang(lang)
            applyLanguage(lang)
            return
          }
        }
        localStorage.setItem('funerix-lang', 'it')
      })
      .catch(() => localStorage.setItem('funerix-lang', 'it'))
  }, [])

  // Chiudi dropdown al click fuori
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = useCallback((googleCode: string) => {
    setOpen(false)
    if (googleCode === currentLang) return

    setCurrentLang(googleCode)
    localStorage.setItem('funerix-lang', googleCode)
    applyLanguage(googleCode)
  }, [currentLang])

  const current = LINGUE.find(l => l.google === currentLang) || LINGUE[0]

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
          {LINGUE.map(l => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.google)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 transition-colors ${
                l.google === currentLang ? 'bg-secondary/10 text-primary font-medium' : 'text-text-light hover:bg-background'
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
