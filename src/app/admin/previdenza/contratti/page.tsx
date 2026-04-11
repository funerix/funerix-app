'use client'

import { FileSignature, Download, Info } from 'lucide-react'
import { getSupabase } from '@/lib/supabase-client'
import { useState, useEffect } from 'react'

interface Contratto {
  id: string
  cliente_nome: string
  tipo_piano_nome: string
  stato: string
  totale: number
  note: string
  contrato_firmato: boolean
  contrato_url: string | null
  data_firma: string | null
  created_at: string
}

const statoColori: Record<string, string> = {
  attivo: 'bg-green-100 text-green-800',
  sospeso: 'bg-yellow-100 text-yellow-800',
  completato: 'bg-blue-100 text-blue-800',
  deceduto: 'bg-gray-100 text-gray-600',
  annullato: 'bg-red-100 text-red-800',
}

export default function AdminPrevidenzaContratti() {
  const [contratti, setContratti] = useState<Contratto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = getSupabase()
    sb.from('piani_previdenza')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }: { data: unknown[] | null }) => {
        const tutti = (data || []) as Contratto[]
        setContratti(tutti)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const firmati = contratti.filter(c => c.contrato_firmato || c.contrato_url)
  const inAttesa = contratti.filter(c => !c.contrato_firmato && !c.contrato_url)

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl text-primary">Contratti</h1>
          <p className="text-text-muted text-sm">Gestione contratti e documenti previdenziali</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="card p-4 mb-6 bg-blue-50 border-blue-200 flex items-start gap-3">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          La generazione contratti con firma digitale sara disponibile a breve. Al momento questa sezione mostra lo stato dei contratti esistenti.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card py-4">
          <p className="text-text-muted text-xs">Totale contratti</p>
          <p className="text-2xl text-primary font-bold">{contratti.length}</p>
        </div>
        <div className="card py-4">
          <p className="text-text-muted text-xs">Firmati</p>
          <p className="text-2xl text-green-600 font-bold">{firmati.length}</p>
        </div>
        <div className="card py-4">
          <p className="text-text-muted text-xs">In attesa firma</p>
          <p className="text-2xl text-yellow-600 font-bold">{inAttesa.length}</p>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="card p-8 text-center">
          <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : contratti.length === 0 ? (
        <div className="card p-8 text-center">
          <FileSignature size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun contratto. I contratti appariranno quando i clienti attiveranno piani previdenziali.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">Cliente</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Piano</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">Totale</th>
                <th className="text-center py-3 px-4 text-text-muted font-medium">Stato</th>
                <th className="text-center py-3 px-4 text-text-muted font-medium">Contratto</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium hidden md:table-cell">Data</th>
              </tr>
            </thead>
            <tbody>
              {contratti.map(c => (
                <tr key={c.id} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-primary">{c.cliente_nome || 'N/D'}</p>
                    {c.note && <p className="text-text-muted text-xs truncate max-w-xs">{c.note}</p>}
                  </td>
                  <td className="py-3 px-4 text-text-light">{c.tipo_piano_nome || '—'}</td>
                  <td className="py-3 px-4 text-right font-semibold">&euro; {(c.totale || 0).toLocaleString('it-IT')}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statoColori[c.stato] || 'bg-gray-100 text-gray-600'}`}>
                      {c.stato || 'n/d'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {c.contrato_firmato || c.contrato_url ? (
                      c.contrato_url ? (
                        <a href={c.contrato_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-accent hover:underline">
                          <Download size={12} /> Scarica
                        </a>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">Firmato</span>
                      )
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">In attesa</span>
                    )}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-text-muted text-xs">
                    {c.data_firma
                      ? new Date(c.data_firma).toLocaleDateString('it-IT')
                      : new Date(c.created_at).toLocaleDateString('it-IT')
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
