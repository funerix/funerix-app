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

// Overlay di caricamento
function showOverlay() {
  if (document.getElementById('ft-overlay')) return
  const div = document.createElement('div')
  div.id = 'ft-overlay'
  div.style.cssText = 'position:fixed;inset:0;background:rgba(255,255,255,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;'
  div.innerHTML = '<div style="text-align:center"><div style="width:40px;height:40px;border:3px solid #8B7355;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 12px"></div><p style="color:#2C3E50;font-size:14px;font-family:sans-serif">Translating...</p></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>'
  document.body.appendChild(div)
}

function hideOverlay() {
  document.getElementById('ft-overlay')?.remove()
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('it')
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  const applyLanguage = async (lang: string) => {
    if (lang === 'it') {
      restoreOriginals()
      hideOverlay()
      return
    }
    showOverlay()
    setLoading(true)
    saveOriginals()
    await translatePage(lang)
    hideOverlay()
    setLoading(false)
  }

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const timer = setTimeout(async () => {
      const saved = localStorage.getItem('funerix-lang')

      if (saved && saved !== 'it') {
        setCurrent(saved)
        showOverlay()
        saveOriginals()
        await translatePage(saved)
        hideOverlay()
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
          showOverlay()
          saveOriginals()
          await translatePage(lang)
          hideOverlay()
          return
        }
      }
      localStorage.setItem('funerix-lang', 'it')
    }, 500)

    return () => clearTimeout(timer)
  }, [])

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
      restoreOriginals()
      return
    }

    // Se era già in un'altra lingua, ripristina prima
    restoreOriginals()
    await new Promise(r => setTimeout(r, 50))
    await applyLanguage(code)
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
