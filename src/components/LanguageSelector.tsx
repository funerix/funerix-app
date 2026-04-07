'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, Loader2 } from 'lucide-react'

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

const COUNTRY_TO_LANG: Record<string, string> = {
  GB: 'en', US: 'en', AU: 'en', CA: 'en', IE: 'en',
  FR: 'fr', BE: 'fr', ES: 'es', MX: 'es', AR: 'es',
  DE: 'de', AT: 'de', CH: 'de', PT: 'pt', BR: 'pt',
  RO: 'ro', MD: 'ro', SA: 'ar', EG: 'ar', MA: 'ar',
  RU: 'ru', CN: 'zh-CN', TW: 'zh-CN', UA: 'uk',
  PL: 'pl', AL: 'sq', IN: 'hi', BD: 'bn', PH: 'tl',
}

// Aspetta che il select di Google Translate sia nel DOM, poi esegui callback
function waitForGoogleSelect(cb: (sel: HTMLSelectElement) => void) {
  let tries = 0
  const interval = setInterval(() => {
    const sel = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (sel) {
      clearInterval(interval)
      cb(sel)
    }
    if (++tries > 30) clearInterval(interval) // max 15 secondi
  }, 500)
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('it')
  const [ready, setReady] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Al mount: aspetta Google, poi rileva lingua o applica IP
  useEffect(() => {
    waitForGoogleSelect((sel) => {
      setReady(true)

      // Se Google ha già una lingua attiva (da cookie precedente)
      if (sel.value) {
        setCurrentLang(sel.value)
        localStorage.setItem('funerix-lang', sel.value)
        return
      }

      // Controlla scelta salvata
      const saved = localStorage.getItem('funerix-lang')
      if (saved && saved !== 'it') {
        sel.value = saved
        sel.dispatchEvent(new Event('change'))
        setCurrentLang(saved)
        return
      }

      // Prima visita: IP detection
      if (!saved) {
        fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
          .then(r => r.json())
          .then(data => {
            if (data?.country_code && data.country_code !== 'IT') {
              const lang = COUNTRY_TO_LANG[data.country_code]
              if (lang) {
                localStorage.setItem('funerix-lang', lang)
                setCurrentLang(lang)
                sel.value = lang
                sel.dispatchEvent(new Event('change'))
                return
              }
            }
            localStorage.setItem('funerix-lang', 'it')
          })
          .catch(() => localStorage.setItem('funerix-lang', 'it'))
      }
    })
  }, [])

  // Chiudi dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (langCode: string) => {
    setOpen(false)
    if (langCode === currentLang) return

    localStorage.setItem('funerix-lang', langCode)
    setCurrentLang(langCode)

    const sel = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (!sel) return

    if (langCode === 'it') {
      // Per tornare a italiano: svuota il select e triggera change
      sel.value = ''
      sel.dispatchEvent(new Event('change'))
    } else {
      sel.value = langCode
      sel.dispatchEvent(new Event('change'))
    }
  }

  const current = LINGUE.find(l => l.code === currentLang) || LINGUE[0]

  return (
    <div ref={ref} className="relative notranslate">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-primary/70 hover:text-primary transition-colors"
        aria-label="Lingua"
      >
        {ready ? <Globe size={16} /> : <Loader2 size={16} className="animate-spin" />}
        <span className="text-sm hidden md:inline">{current.flag}</span>
      </button>

      {open && ready && (
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
