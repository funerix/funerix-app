'use client'

import { useEffect, useState } from 'react'
import { FileText, ArrowLeft } from 'lucide-react'

const statiConfig: Record<string, { label: string; color: string; bg: string }> = {
  richiesta: { label: 'Richiesta', color: 'text-blue-700', bg: 'bg-blue-100' },
  in_lavorazione: { label: 'In Lavorazione', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  documenti: { label: 'Documenti', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  presso_notaio: { label: 'Presso Notaio', color: 'text-purple-700', bg: 'bg-purple-100' },
  completata: { label: 'Completata', color: 'text-green-700', bg: 'bg-green-100' },
  annullata: { label: 'Annullata', color: 'text-red-700', bg: 'bg-red-100' },
}
const statiKeys = Object.keys(statiConfig)

export default function AdminSuccessione() {
  const [pratiche, setPratiche] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/successione').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setPratiche(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const changeStato = async (id: string, stato: string) => {
    setSaving(true)
    await fetch('/api/successione', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stato }),
    })
    load()
    if (selected?.id === id) setSelected({ ...selected, stato })
    setSaving(false)
  }

  // Detail view
  if (selected) {
    const s = statiConfig[selected.stato] || statiConfig.richiesta
    return (
      <div className="p-4 md:p-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-text-muted hover:text-primary mb-4">
          <ArrowLeft size={16} /> Torna alla lista
        </button>

        <div className="card p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-primary">Pratica Successione</h1>
              <p className="text-text-muted text-sm mt-1">Cliente: {selected.cliente_nome}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.color}`}>
              {s.label}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs text-text-muted mb-1">Cliente</label>
              <p className="text-sm font-medium">{selected.cliente_nome || '-'}</p>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Defunto</label>
              <p className="text-sm font-medium">{selected.defunto_nome || '-'}</p>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Tipo Pratica</label>
              <p className="text-sm font-medium">{selected.tipo_pratica || '-'}</p>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Totale</label>
              <p className="text-sm font-medium">{selected.totale ? `${Number(selected.totale).toFixed(2)}` : '-'}</p>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Data Creazione</label>
              <p className="text-sm font-medium">{selected.created_at ? new Date(selected.created_at).toLocaleDateString('it-IT') : '-'}</p>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Stato</label>
              <p className="text-sm font-medium">{s.label}</p>
            </div>
            {selected.email && (
              <div>
                <label className="block text-xs text-text-muted mb-1">Email</label>
                <p className="text-sm font-medium">{selected.email}</p>
              </div>
            )}
            {selected.telefono && (
              <div>
                <label className="block text-xs text-text-muted mb-1">Telefono</label>
                <p className="text-sm font-medium">{selected.telefono}</p>
              </div>
            )}
            {selected.note && (
              <div className="md:col-span-2">
                <label className="block text-xs text-text-muted mb-1">Note</label>
                <p className="text-sm whitespace-pre-wrap">{selected.note}</p>
              </div>
            )}
          </div>

          {/* Stato change buttons */}
          <div className="border-t border-border pt-4">
            <p className="text-xs text-text-muted mb-3">Cambia stato:</p>
            <div className="flex flex-wrap gap-2">
              {statiKeys.map(stato => {
                const cfg = statiConfig[stato]
                const isCurrent = selected.stato === stato
                return (
                  <button
                    key={stato}
                    onClick={() => !isCurrent && changeStato(selected.id, stato)}
                    disabled={saving || isCurrent}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isCurrent ? `${cfg.bg} ${cfg.color} ring-2 ring-current` : `${cfg.bg} ${cfg.color} opacity-60 hover:opacity-100`
                    }`}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">Successione Ereditaria</h1>
          <p className="text-text-muted text-sm">{pratiche.length} pratiche totali</p>
        </div>
      </div>

      {loading ? (
        <div className="card p-8 text-center">
          <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : pratiche.length === 0 ? (
        <div className="card p-8 text-center">
          <FileText size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessuna pratica di successione</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-3 font-medium text-text-muted">Cliente</th>
                <th className="p-3 font-medium text-text-muted">Defunto</th>
                <th className="p-3 font-medium text-text-muted">Tipo Pratica</th>
                <th className="p-3 font-medium text-text-muted">Stato</th>
                <th className="p-3 font-medium text-text-muted">Totale</th>
                <th className="p-3 font-medium text-text-muted">Data</th>
              </tr>
            </thead>
            <tbody>
              {pratiche.map(p => {
                const cfg = statiConfig[p.stato] || statiConfig.richiesta
                return (
                  <tr key={p.id} onClick={() => setSelected(p)}
                    className="border-b border-border/50 hover:bg-background/50 cursor-pointer">
                    <td className="p-3 font-medium text-primary">{p.cliente_nome}</td>
                    <td className="p-3">{p.defunto_nome || '-'}</td>
                    <td className="p-3">{p.tipo_pratica || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="p-3">{p.totale ? `${Number(p.totale).toFixed(2)}` : '-'}</td>
                    <td className="p-3">{p.created_at ? new Date(p.created_at).toLocaleDateString('it-IT') : '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
