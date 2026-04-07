'use client'

import { useState, useRef, useEffect } from 'react'
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

const COUNTRY_TO_LANG: Record<string, string> = {
  GB: 'en', US: 'en', AU: 'en', CA: 'en', IE: 'en', NZ: 'en',
  FR: 'fr', BE: 'fr', ES: 'es', MX: 'es', AR: 'es', CO: 'es',
  DE: 'de', AT: 'de', CH: 'de', PT: 'pt', BR: 'pt',
  RO: 'ro', MD: 'ro', SA: 'ar', EG: 'ar', MA: 'ar', DZ: 'ar',
  TN: 'ar', AE: 'ar', RU: 'ru', CN: 'zh-CN', TW: 'zh-CN',
  UA: 'uk', PL: 'pl', AL: 'sq', XK: 'sq', IN: 'hi', BD: 'bn', PH: 'tl',
}

function clearCookies() {
  const d = window.location.hostname
  const exp = 'expires=Thu, 01 Jan 1970 00:00:00 UTC'
  document.cookie = `googtrans=; ${exp}; path=/`
  document.cookie = `googtrans=; ${exp}; path=/; domain=${d}`
  document.cookie = `googtrans=; ${exp}; path=/; domain=.${d}`
}

function setLangCookie(lang: string) {
  const d = window.location.hostname
  document.cookie = `googtrans=/it/${lang}; path=/`
  document.cookie = `googtrans=/it/${lang}; path=/; domain=.${d}`
}

function getCurrentLang(): string {
  // Prima controlla localStorage (scelta utente)
  const saved = localStorage.getItem('funerix-lang')
  if (saved) return saved
  // Poi cookie
  const match = document.cookie.match(/googtrans=\/it\/([^;]+)/)
  if (match) return match[1]
  return 'it'
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('it')
  const ref = useRef<HTMLDivElement>(null)

  // On mount: leggi lingua salvata o rileva da IP
  useEffect(() => {
    const lang = getCurrentLang()
    setCurrentLang(lang)

    // Se non c'è scelta salvata, rileva da IP (una sola volta)
    if (!localStorage.getItem('funerix-lang')) {
      fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
        .then(r => r.json())
        .then(data => {
          const countryLang = COUNTRY_TO_LANG[data?.country_code]
          if (countryLang && data.country_code !== 'IT') {
            localStorage.setItem('funerix-lang', countryLang)
            setLangCookie(countryLang)
            window.location.reload()
          } else {
            localStorage.setItem('funerix-lang', 'it')
          }
        })
        .catch(() => localStorage.setItem('funerix-lang', 'it'))
    }
  }, [])

  // Chiudi dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (lang: string) => {
    setOpen(false)
    if (lang === currentLang) return

    // Salva scelta
    localStorage.setItem('funerix-lang', lang)

    // Pulisci cookie vecchi
    clearCookies()

    // Se non italiano, setta cookie Google Translate
    if (lang !== 'it') {
      setLangCookie(lang)
    }

    // Ricarica
    window.location.reload()
  }

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
