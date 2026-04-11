'use client'

import Link from 'next/link'
import { ArrowLeft, Euro, Clock, User, Eye } from 'lucide-react'
import { getSupabase } from '@/lib/supabase-client'
import { useState, useEffect } from 'react'

interface Piano { id: string; cliente_nome: string; cliente_telefono: string; beneficiario: string; beneficiario_nome: string; totale: number; num_rate: number; importo_rata: number; rate_pagate: number; saldo_versato: number; saldo_residuo: number; stato: string; created_at: string }

const statoColori: Record<string, string> = { attivo: 'bg-green-100 text-green-800', sospeso: 'bg-yellow-100 text-yellow-800', completato: 'bg-blue-100 text-blue-800', deceduto: 'bg-gray-100 text-gray-600', annullato: 'bg-red-100 text-red-800' }

export default function AdminPrevidenzaPage() {
  const [piani, setPiani] = useState<Piano[]>([])
  useEffect(() => { getSupabase().from('piani_previdenza').select('*').order('created_at', { ascending: false }).then(({ data }: { data: unknown[] | null }) => setPiani((data || []) as Piano[])) }, [])

  const totaleIncassi = piani.reduce((s, p) => s + p.saldo_versato, 0)
  const pianiAttivi = piani.filter(p => p.stato === 'attivo').length

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
          <div><h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Piani Previdenza</h1>
          <p className="text-text-light text-sm">{piani.length} piani totali — {pianiAttivi} attivi</p></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card py-4"><p className="text-text-muted text-xs">Piani attivi</p><p className="text-2xl text-primary font-bold">{pianiAttivi}</p></div>
          <div className="card py-4"><p className="text-text-muted text-xs">Totale incassato</p><p className="text-2xl text-primary font-bold">&euro; {totaleIncassi.toLocaleString('it-IT')}</p></div>
          <div className="card py-4"><p className="text-text-muted text-xs">Rata media</p><p className="text-2xl text-primary font-bold">&euro; {piani.length > 0 ? Math.round(piani.reduce((s, p) => s + p.importo_rata, 0) / piani.length) : 0}</p></div>
          <div className="card py-4"><p className="text-text-muted text-xs">Valore totale</p><p className="text-2xl text-primary font-bold">&euro; {piani.reduce((s, p) => s + p.totale, 0).toLocaleString('it-IT')}</p></div>
        </div>

        {piani.length === 0 ? (
          <div className="card text-center py-16"><Euro size={32} className="mx-auto mb-3 text-text-muted opacity-30" /><p className="text-text-muted">Nessun piano previdenza attivato.</p><p className="text-text-muted text-sm mt-1">I piani arriveranno dal configuratore Previdenza Funerix.</p></div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-text-muted font-medium">Cliente</th>
                <th className="text-left py-3 px-3 text-text-muted font-medium">Beneficiario</th>
                <th className="text-right py-3 px-3 text-text-muted font-medium">Totale</th>
                <th className="text-right py-3 px-3 text-text-muted font-medium">Rata</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Progresso</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Stato</th>
              </tr></thead>
              <tbody>{piani.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-background">
                  <td className="py-3 px-3"><p className="font-medium text-primary">{p.cliente_nome}</p><p className="text-[10px] text-text-muted">{p.cliente_telefono}</p></td>
                  <td className="py-3 px-3 text-text-light">{p.beneficiario === 'se_stesso' ? 'Sé stesso' : p.beneficiario_nome}</td>
                  <td className="py-3 px-3 text-right font-semibold text-primary">&euro; {p.totale.toLocaleString('it-IT')}</td>
                  <td className="py-3 px-3 text-right">&euro; {p.importo_rata}/mese</td>
                  <td className="py-3 px-3 text-center"><span className="text-xs">{p.rate_pagate}/{p.num_rate}</span>
                    <div className="w-full h-1.5 bg-border rounded-full mt-1"><div className="h-full bg-accent rounded-full" style={{ width: `${(p.rate_pagate / p.num_rate) * 100}%` }} /></div></td>
                  <td className="py-3 px-3 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statoColori[p.stato]}`}>{p.stato}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
