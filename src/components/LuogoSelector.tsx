'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Search, Church, X } from 'lucide-react'

interface Luogo {
  id: string
  nome: string
  comune: string
  provincia: string
  indirizzo?: string
  cap?: string
}

interface LuogoSelectorProps {
  tipo: 'cimitero' | 'chiesa'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export function LuogoSelector({ tipo, value, onChange, placeholder, required }: LuogoSelectorProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Luogo[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [manual, setManual] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const Icon = tipo === 'chiesa' ? Church : MapPin

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/luoghi?tipo=${tipo}&q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
        setOpen(true)
      } catch { setResults([]) }
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, tipo])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectLuogo = (l: Luogo) => {
    const label = `${l.nome}, ${l.comune} (${l.provincia})${l.indirizzo ? ` — ${l.indirizzo}` : ''}`
    onChange(label)
    setQuery(label)
    setOpen(false)
    setManual(false)
  }

  const handleManual = () => {
    setManual(true)
    setOpen(false)
    setQuery('')
    onChange('')
  }

  if (manual) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-text">
            {tipo === 'cimitero' ? 'Cimitero' : 'Chiesa'} (inserimento manuale) *
          </label>
          <button type="button" onClick={() => { setManual(false); setQuery('') }} className="text-secondary text-xs hover:underline">
            Cerca dalla lista
          </button>
        </div>
        <input
          type="text"
          required={required}
          className="input-field"
          placeholder={`Scrivi il nome del ${tipo} e l'indirizzo completo`}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    )
  }

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-text mb-1">
        {tipo === 'cimitero' ? 'Cimitero' : 'Chiesa'} *
      </label>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          className="input-field pl-9 pr-8"
          placeholder={placeholder || `Cerca ${tipo} per nome o comune...`}
          value={query || value}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value) }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          required={required}
        />
        {(query || value) && (
          <button type="button" onClick={() => { setQuery(''); onChange(''); setResults([]) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary">
            <X size={14} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-surface border border-border rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {results.map(l => (
            <button key={l.id} type="button" onClick={() => selectLuogo(l)}
              className="w-full text-left px-3 py-2.5 hover:bg-background transition-colors flex items-start gap-2 border-b border-border/50 last:border-0">
              <Icon size={14} className="text-secondary mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-primary truncate">{l.nome}</p>
                <p className="text-xs text-text-muted">{l.comune} ({l.provincia}){l.indirizzo ? ` — ${l.indirizzo}` : ''}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-surface border border-border rounded-xl shadow-xl p-3 text-center">
          <p className="text-text-muted text-sm mb-2">Nessun risultato per &ldquo;{query}&rdquo;</p>
          <button type="button" onClick={handleManual} className="text-secondary text-sm font-medium hover:underline">
            Inserisci manualmente
          </button>
        </div>
      )}

      {!open && !value && (
        <button type="button" onClick={handleManual} className="text-text-muted text-xs mt-1 hover:text-secondary">
          Non trovi il {tipo}? Inserisci manualmente
        </button>
      )}
    </div>
  )
}
