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

// Legge la lingua corrente dal cookie googtrans
function readCurrentLang(): string {
  const match = document.cookie.match(/googtrans=\/it\/([^;]+)/)
  return match ? match[1] : 'it'
}

// Setta la lingua via cookie e ricarica
function switchLanguage(googleCode: string) {
  const domain = window.location.hostname

  // Pulisci TUTTI i cookie googtrans
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`

  if (googleCode !== 'it') {
    // Setta nuovo cookie
    document.cookie = `googtrans=/it/${googleCode}; path=/`
    document.cookie = `googtrans=/it/${googleCode}; path=/; domain=.${domain}`
  }

  // Salva scelta utente
  localStorage.setItem('funerix-lang', googleCode)

  // Ricarica pagina
  window.location.href = window.location.pathname + window.location.search
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('it')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Leggi lingua dal cookie Google Translate
    const cookieLang = readCurrentLang()

    // 2. Se l'utente ha già scelto manualmente, usa quella
    const savedLang = localStorage.getItem('funerix-lang')

    if (savedLang) {
      setCurrentLang(savedLang)
      // Se il cookie non corrisponde alla scelta salvata, correggi
      if (savedLang !== cookieLang && savedLang !== 'it') {
        switchLanguage(savedLang)
        return
      }
      if (savedLang === 'it' && cookieLang !== 'it') {
        switchLanguage('it')
        return
      }
      return
    }

    // 3. Se c'è già un cookie, usalo
    if (cookieLang !== 'it') {
      setCurrentLang(cookieLang)
      localStorage.setItem('funerix-lang', cookieLang)
      return
    }

    // 4. Prima visita: rileva lingua da IP
    fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(data => {
        if (!data.country_code || data.country_code === 'IT') {
          localStorage.setItem('funerix-lang', 'it')
          return
        }
        const detectedLang = COUNTRY_TO_LANG[data.country_code]
        if (detectedLang) {
          localStorage.setItem('funerix-lang', detectedLang)
          switchLanguage(detectedLang)
        } else {
          localStorage.setItem('funerix-lang', 'it')
        }
      })
      .catch(() => {
        localStorage.setItem('funerix-lang', 'it')
      })
  }, [])

  // Chiudi dropdown al click fuori
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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
              onClick={() => {
                setOpen(false)
                if (l.google === currentLang) return // già selezionata
                switchLanguage(l.google)
              }}
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
