'use client'

import { useEffect, useState } from 'react'
import { Package, RefreshCw } from 'lucide-react'

interface Servizio {
  id: string
  nome: string
  categoria: string
  prezzo_min: number
  prezzo_max: number
  attivo: boolean
}

interface Richiesta {
  id: string
  cliente_nome: string
  servizio: string
  stato: string
  totale: number
  created_at: string
}

export default function AdminServiziExtraPage() {
  const [tab, setTab] = useState<'servizi' | 'richieste'>('servizi')
  const [servizi, setServizi] = useState<Servizio[]>([])
  const [richieste, setRichieste] = useState<Richiesta[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      fetch('/api/servizi-extra').then(r => r.json()).catch(() => []),
      fetch('/api/servizi-extra?tipo=richieste').then(r => r.json()).catch(() => []),
    ]).then(([s, r]) => {
      if (Array.isArray(s)) setServizi(s)
      if (Array.isArray(r)) setRichieste(r)
      setLoading(false)
    })
  }

  useEffect(() => { fetchData() }, [])

  const toggleAttivo = async (id: string, attivo: boolean) => {
    await fetch('/api/servizi-extra', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, attivo: !attivo }),
    })
    setServizi(prev => prev.map(s => s.id === id ? { ...s, attivo: !attivo } : s))
  }

  const cambiaStato = async (id: string, stato: string) => {
    await fetch('/api/servizi-extra?tipo=richieste', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stato }),
    })
    setRichieste(prev => prev.map(r => r.id === id ? { ...r, stato } : r))
  }

  const statiRichiesta = ['nuova', 'in_lavorazione', 'completata', 'annullata']

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package size={24} className="text-secondary" />
          <h1 className="font-[family-name:var(--font-serif)] text-2xl text-primary">Servizi Aggiuntivi</h1>
        </div>
        <button onClick={fetchData} className="btn-secondary text-sm flex items-center gap-2">
          <RefreshCw size={14} /> Aggiorna
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('servizi')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'servizi' ? 'bg-primary text-white' : 'bg-surface text-text-light border border-border'}`}>
          Servizi
        </button>
        <button onClick={() => setTab('richieste')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'richieste' ? 'bg-primary text-white' : 'bg-surface text-text-light border border-border'}`}>
          Richieste
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'servizi' ? (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Nome</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Prezzo Min</th>
                <th className="py-3 px-4">Prezzo Max</th>
                <th className="py-3 px-4">Attivo</th>
              </tr>
            </thead>
            <tbody>
              {servizi.map(s => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-background-dark/50">
                  <td className="py-3 px-4 font-medium text-primary">{s.nome}</td>
                  <td className="py-3 px-4 capitalize">{s.categoria}</td>
                  <td className="py-3 px-4">&euro; {s.prezzo_min}</td>
                  <td className="py-3 px-4">&euro; {s.prezzo_max}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleAttivo(s.id, s.attivo)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${s.attivo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {s.attivo ? 'Attivo' : 'Disattivo'}
                    </button>
                  </td>
                </tr>
              ))}
              {servizi.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-text-muted">Nessun servizio trovato</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Servizio</th>
                <th className="py-3 px-4">Stato</th>
                <th className="py-3 px-4">Totale</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {richieste.map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-background-dark/50">
                  <td className="py-3 px-4 font-medium text-primary">{r.cliente_nome}</td>
                  <td className="py-3 px-4">{r.servizio}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.stato === 'completata' ? 'bg-green-100 text-green-700' :
                      r.stato === 'in_lavorazione' ? 'bg-yellow-100 text-yellow-700' :
                      r.stato === 'annullata' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {r.stato.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">&euro; {r.totale}</td>
                  <td className="py-3 px-4 text-text-muted">{new Date(r.created_at).toLocaleDateString('it-IT')}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {statiRichiesta.filter(s => s !== r.stato).map(s => (
                        <button key={s} onClick={() => cambiaStato(r.id, s)}
                          className="px-2 py-0.5 rounded text-[10px] border border-border hover:bg-background-dark capitalize">
                          {s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {richieste.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-text-muted">Nessuna richiesta trovata</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
