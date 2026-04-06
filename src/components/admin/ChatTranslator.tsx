'use client'

import { useState } from 'react'
import { Languages, ArrowRightLeft, Loader2, Copy, Check } from 'lucide-react'

const lingue = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'sq', label: 'Shqip', flag: '🇦🇱' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
]

export function ChatTranslator() {
  const [sourceLang, setSourceLang] = useState('it')
  const [targetLang, setTargetLang] = useState('en')
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const swap = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setInputText(translatedText)
    setTranslatedText(inputText)
  }

  const translate = async () => {
    if (!inputText.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: inputText,
          targetLang,
          sourceLang,
        }),
      })
      const data = await res.json()
      setTranslatedText(data.translations || 'Errore nella traduzione')
    } catch {
      setTranslatedText('Errore di connessione')
    }
    setLoading(false)
  }

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(translatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  // Traduci in tempo reale dopo 500ms di inattività
  const handleInput = (text: string) => {
    setInputText(text)
    if (text.trim().length < 2) { setTranslatedText(''); return }

    // Debounce
    clearTimeout((window as unknown as Record<string, ReturnType<typeof setTimeout>>).__translateTimer)
    ;(window as unknown as Record<string, ReturnType<typeof setTimeout>>).__translateTimer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: text, targetLang, sourceLang }),
        })
        const data = await res.json()
        setTranslatedText(data.translations || '')
      } catch { /* ignore */ }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Languages size={18} className="text-secondary" />
        <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary">Traduttore Chat</h3>
      </div>

      {/* Language selectors */}
      <div className="flex items-center gap-2 mb-4">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"
        >
          {lingue.map(l => (
            <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
          ))}
        </select>

        <button onClick={swap} className="p-2 hover:bg-background rounded-lg transition-colors" title="Inverti lingue">
          <ArrowRightLeft size={16} className="text-text-muted" />
        </button>

        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"
        >
          {lingue.map(l => (
            <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
          ))}
        </select>
      </div>

      {/* Input */}
      <div className="relative mb-3">
        <textarea
          value={inputText}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Scrivi o incolla il messaggio da tradurre..."
          rows={3}
          className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-secondary"
        />
        {loading && (
          <Loader2 size={14} className="absolute top-3 right-3 animate-spin text-secondary" />
        )}
      </div>

      {/* Output */}
      {translatedText && (
        <div className="relative bg-secondary/5 border border-secondary/20 rounded-lg p-3">
          <p className="text-sm text-primary pr-8" dir={targetLang === 'ar' ? 'rtl' : 'ltr'}>
            {translatedText}
          </p>
          <button
            onClick={copyText}
            className="absolute top-2 right-2 p-1.5 hover:bg-white/50 rounded transition-colors"
            title="Copia traduzione"
          >
            {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} className="text-text-muted" />}
          </button>
        </div>
      )}

      {/* Quick actions */}
      {translatedText && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => {
              const waNum = prompt('Numero WhatsApp del cliente (es. +393331234567):')
              if (waNum) {
                window.open(`https://wa.me/${waNum.replace(/\s/g, '')}?text=${encodeURIComponent(translatedText)}`, '_blank')
              }
            }}
            className="text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-lg hover:bg-[#20bd5a] transition-colors"
          >
            Invia via WhatsApp
          </button>
          <button onClick={copyText} className="text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-background transition-colors text-text-light">
            {copied ? 'Copiato!' : 'Copia'}
          </button>
        </div>
      )}
    </div>
  )
}
