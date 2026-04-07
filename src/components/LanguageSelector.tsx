'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, Loader2 } from 'lucide-react'
import { translatePage, saveOriginals, restoreOriginals } from '@/lib/translate'

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

function getCountryFromCookie(): string | null {
  const match = document.cookie.match(/funerix-country=([A-Z]{2})/)
  return match ? match[1] : null
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('it')
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  // Applica traduzione
  const applyLanguage = async (lang: string) => {
    if (lang === 'it') {
      restoreOriginals()
      return
    }
    setLoading(true)
    saveOriginals()
    await translatePage(lang)
    setLoading(false)
  }

  // Init: leggi lingua salvata o rileva IP
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Aspetta che la pagina sia completamente renderizzata
    const timer = setTimeout(async () => {
      const saved = localStorage.getItem('funerix-lang')

      if (saved && saved !== 'it') {
        setCurrent(saved)
        await applyLanguage(saved)
        return
      }

      if (saved === 'it') return

      // Prima visita: rileva paese
      let country = getCountryFromCookie()
      if (!country) {
        try {
          const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
          const data = await res.json()
          country = data?.country_code || null
        } catch { /* ignore */ }
      }

      if (country && country !== 'IT') {
        const lang = COUNTRY_MAP[country]
        if (lang) {
          localStorage.setItem('funerix-lang', lang)
          setCurrent(lang)
          await applyLanguage(lang)
          return
        }
      }
      localStorage.setItem('funerix-lang', 'it')
    }, 1000) // 1s delay per lasciare React renderizzare

    return () => clearTimeout(timer)
  }, [])

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
      // Torna italiano: ripristina originali
      restoreOriginals()
      return
    }

    // Traduci in nuova lingua
    setLoading(true)
    // Prima ripristina originali (se era già tradotto in altra lingua)
    restoreOriginals()
    // Poi salva nuovi originali e traduci
    await new Promise(r => setTimeout(r, 100)) // breve pausa per DOM update
    saveOriginals()
    await translatePage(code)
    setLoading(false)
  }

  const flag = LINGUE.find(l => l.code === current)?.flag || '🇮🇹'

  return (
    <div ref={ref} className="relative notranslate">
      <button
        onClick={() => !loading && setOpen(!open)}
        className="flex items-center gap-1.5 text-primary/70 hover:text-primary transition-colors"
        aria-label="Lingua"
      >
        {loading ? <Loader2 size={16} className="animate-spin text-secondary" /> : <Globe size={16} />}
        <span className="text-sm hidden md:inline">{flag}</span>
      </button>

      {open && !loading && (
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
