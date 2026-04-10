'use client'

import { useEffect, useState } from 'react'
import { Shield, RefreshCw } from 'lucide-react'

interface PianoPet {
  id: string
  cliente_nome: string
  animale_nome: string
  specie: string
  totale: number
  importo_rata: number
  rate_pagate: number
  num_rate: number
  stato: string
  created_at: string
}

export default function AdminPrevidenzaPetPage() {
  const [piani, setPiani] = useState<PianoPet[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    setLoading(true)
    fetch('/api/pet/previdenza')
      .then(r => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPiani(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield size={24} className="text-secondary" />
          <h1 className="font-[family-name:var(--font-serif)] text-2xl text-primary">Previdenza Pet</h1>
        </div>
        <button onClick={fetchData} className="btn-secondary text-sm flex items-center gap-2">
          <RefreshCw size={14} /> Aggiorna
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Animale</th>
                <th className="py-3 px-4">Specie</th>
                <th className="py-3 px-4">Totale</th>
                <th className="py-3 px-4">Rata</th>
                <th className="py-3 px-4">Rate</th>
                <th className="py-3 px-4">Stato</th>
                <th className="py-3 px-4">Data</th>
              </tr>
            </thead>
            <tbody>
              {piani.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-background-dark/50">
                  <td className="py-3 px-4 font-medium text-primary">{p.cliente_nome}</td>
                  <td className="py-3 px-4">{p.animale_nome}</td>
                  <td className="py-3 px-4 capitalize">{p.specie}</td>
                  <td className="py-3 px-4">&euro; {p.totale}</td>
                  <td className="py-3 px-4">&euro; {p.importo_rata}/mese</td>
                  <td className="py-3 px-4">
                    <span className="font-medium">{p.rate_pagate}</span>
                    <span className="text-text-muted">/{p.num_rate}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.stato === 'attivo' ? 'bg-green-100 text-green-700' :
                      p.stato === 'completato' ? 'bg-blue-100 text-blue-700' :
                      p.stato === 'sospeso' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {p.stato}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-muted">{new Date(p.created_at).toLocaleDateString('it-IT')}</td>
                </tr>
              ))}
              {piani.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-text-muted">Nessun piano previdenza pet trovato</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
