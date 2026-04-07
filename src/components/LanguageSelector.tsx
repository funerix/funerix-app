'use client'

import { useState, useRef, useEffect } from 'react'
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
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'sq', label: 'Shqip', flag: '🇦🇱' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
  { code: 'tl', label: 'Filipino', flag: '🇵🇭' },
]

const COUNTRY_TO_LANG: Record<string, string> = {
  GB: 'en', US: 'en', AU: 'en', CA: 'en', IE: 'en', NZ: 'en',
  FR: 'fr', BE: 'fr', ES: 'es', MX: 'es', AR: 'es', CO: 'es',
  DE: 'de', AT: 'de', CH: 'de', PT: 'pt', BR: 'pt',
  RO: 'ro', MD: 'ro', SA: 'ar', EG: 'ar', MA: 'ar', DZ: 'ar',
  TN: 'ar', AE: 'ar', RU: 'ru', CN: 'zh', TW: 'zh',
  UA: 'uk', PL: 'pl', AL: 'sq', XK: 'sq', IN: 'hi', BD: 'bn', PH: 'tl',
}

function navigate(lang: string) {
  const base = window.location.origin
  const path = window.location.pathname

  if (lang === 'it') {
    // Torna al sito originale senza traduzione
    window.location.href = base + path
  } else {
    // Vai al sito tradotto da Google
    window.location.href = `https://translate.google.com/translate?sl=it&tl=${lang}&u=${encodeURIComponent(base + path)}`
  }
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('it')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Rileva se siamo dentro Google Translate (il dominio sarà translate.goog)
    const isTranslated = window.location.hostname.includes('translate.goog')
    if (isTranslated) {
      // Estrai lingua dalla URL
      const params = new URLSearchParams(window.location.search)
      const tl = params.get('_x_tr_tl')
      if (tl) {
        setCurrentLang(tl)
        localStorage.setItem('funerix-lang', tl)
        return
      }
    }

    const saved = localStorage.getItem('funerix-lang')
    if (saved && saved !== 'it') {
      setCurrentLang(saved)
      // Se non siamo già tradotti, vai a tradurre
      if (!isTranslated) {
        navigate(saved)
        return
      }
    }

    // Prima visita: IP detection
    if (!saved && !isTranslated) {
      fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
        .then(r => r.json())
        .then(data => {
          if (data?.country_code && data.country_code !== 'IT') {
            const lang = COUNTRY_TO_LANG[data.country_code]
            if (lang) {
              localStorage.setItem('funerix-lang', lang)
              navigate(lang)
              return
            }
          }
          localStorage.setItem('funerix-lang', 'it')
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
    localStorage.setItem('funerix-lang', lang)
    navigate(lang)
  }

  const current = LINGUE.find(l => l.code === currentLang) || LINGUE[0]

  return (
    <div ref={ref} className="relative">
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
              onClick={() => handleSelect(l.code)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 transition-colors ${
                l.code === currentLang ? 'bg-secondary/10 text-primary font-medium' : 'text-text-light hover:bg-background'
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
