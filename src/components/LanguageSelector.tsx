'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useLocale } from '@/i18n/provider'
import { type Locale } from '@/i18n/config'

const lingue: { code: Locale; label: string; flag: string; google: string }[] = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹', google: 'it' },
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

// Trigger Google Translate programmatically
function triggerGoogleTranslate(langCode: string) {
  // Set cookie that Google Translate reads
  const domain = window.location.hostname
  if (langCode === 'it') {
    // Reset to original
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    window.location.reload()
    return
  }
  document.cookie = `googtrans=/it/${langCode}; path=/; domain=${domain}`
  document.cookie = `googtrans=/it/${langCode}; path=/`

  // Try to use the Google Translate API directly
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null
  if (select) {
    select.value = langCode
    select.dispatchEvent(new Event('change'))
  } else {
    // If widget not loaded yet, reload to pick up the cookie
    window.location.reload()
  }
}

export function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const { locale, setLocale } = useLocale()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = (l: typeof lingue[0]) => {
    setLocale(l.code)           // Update next-intl (for JSON-based translations)
    triggerGoogleTranslate(l.google)  // Trigger Google Translate (for DB content)
    setOpen(false)
  }

  const current = lingue.find(l => l.code === locale) || lingue[0]

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
                l.code === locale ? 'bg-secondary/10 text-primary font-medium' : 'text-text-light hover:bg-background'
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
