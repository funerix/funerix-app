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

// Attende che Google Translate sia pronto, poi chiama fn
function onGoogleReady(fn: () => void) {
  if ((window as any).__gtReady) { fn(); return }
  (window as any).__gtOnReady = fn
}

// Cambia lingua usando il select di Google Translate
function changeLanguage(code: string) {
  const sel = document.querySelector('.goog-te-combo') as HTMLSelectElement
  if (!sel) return false
  sel.value = code === 'it' ? '' : code
  sel.dispatchEvent(new Event('change'))
  return true
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('it')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Leggi lingua salvata
    const saved = localStorage.getItem('funerix-lang') || ''

    // Funzione da eseguire quando Google è pronto
    const init = () => {
      if (saved && saved !== 'it') {
        // Utente ha già scelto una lingua → applicala
        setCurrent(saved)
        changeLanguage(saved)
      } else if (!saved) {
        // Prima visita → rileva IP
        fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) })
          .then(r => r.json())
          .then(data => {
            const lang = COUNTRY_MAP[data?.country_code]
            if (lang && data.country_code !== 'IT') {
              localStorage.setItem('funerix-lang', lang)
              setCurrent(lang)
              changeLanguage(lang)
            } else {
              localStorage.setItem('funerix-lang', 'it')
            }
          })
          .catch(() => localStorage.setItem('funerix-lang', 'it'))
      } else {
        setCurrent('it')
      }

      // Precache: cicla tutte le lingue in background per popolare la cache Google
      const lingueToCache = LINGUE.filter(l => l.code !== 'it').map(l => l.code)
      let i = 0
      const precache = () => {
        if (i >= lingueToCache.length) {
          // Torna alla lingua corrente
          const cur = localStorage.getItem('funerix-lang') || 'it'
          changeLanguage(cur)
          return
        }
        changeLanguage(lingueToCache[i])
        i++
        setTimeout(precache, 300)
      }
      // Avvia precache dopo 5 secondi (non blocca l'utente)
      setTimeout(precache, 5000)
    }

    onGoogleReady(init)
  }, [])

  // Chiudi dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (code: string) => {
    setOpen(false)
    if (code === current) return
    localStorage.setItem('funerix-lang', code)
    setCurrent(code)
    changeLanguage(code)
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
