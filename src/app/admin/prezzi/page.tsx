'use client'

import Link from 'next/link'
import { ArrowLeft, Euro, Plus, Save, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase-client'

export default function AdminPrezziPage() {
  const [aree, setAree] = useState<any[]>([])
  const [servizi, setServizi] = useState<any[]>([])
  const [tab, setTab] = useState<'aree' | 'servizi'>('aree')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/prezzi').then(r => r.json()),
      fetch('/api/prezzi?categoria=servizi').then(r => r.json()),
    ]).then(([a, s]) => {
      if (Array.isArray(a)) setAree(a)
      if (Array.isArray(s)) setServizi(s)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSalvaArea = async (area: any) => {
    const sb = getSupabase()
    await sb.from('prezzi_aree').upsert(area, { onConflict: 'id' })
  }

  const handleEliminaArea = async (id: string) => {
    if (!confirm('Eliminare questa voce?')) return
    const sb = getSupabase()
    await sb.from('prezzi_aree').delete().eq('id', id)
    setAree(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Prezzi Comparatore</h1>
            <p className="text-text-light text-sm">Gestisci i prezzi per regione, paese e servizio</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {(['aree', 'servizi'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-primary text-white' : 'bg-surface text-text-muted hover:text-primary'}`}>
              {t === 'aree' ? `Regioni e Paesi (${aree.length})` : `Servizi (${servizi.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20"><div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : tab === 'aree' ? (
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background-dark/50">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Nome</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Zona</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Base Min</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Base Max</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Standard Min</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Standard Max</th>
                  <th className="text-center py-3 px-4 text-text-muted font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {aree.map(a => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-background transition-colors">
                    <td className="py-3 px-4 font-medium text-primary">{a.nome}</td>
                    <td className="py-3 px-4 text-text-muted text-xs capitalize">{a.tipo}</td>
                    <td className="py-3 px-4 text-text-muted text-xs capitalize">{a.zona}</td>
                    <td className="py-3 px-4 text-right">&euro; {Number(a.funerale_base_min).toLocaleString('it-IT')}</td>
                    <td className="py-3 px-4 text-right">&euro; {Number(a.funerale_base_max).toLocaleString('it-IT')}</td>
                    <td className="py-3 px-4 text-right">&euro; {Number(a.funerale_standard_min).toLocaleString('it-IT')}</td>
                    <td className="py-3 px-4 text-right">&euro; {Number(a.funerale_standard_max).toLocaleString('it-IT')}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => handleEliminaArea(a.id)} className="text-text-muted hover:text-error"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {aree.length === 0 && <p className="text-text-muted text-center py-8">Nessuna area. Esegui lo SQL prezzi-comparatore.sql in Supabase.</p>}
          </div>
        ) : (
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background-dark/50">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Servizio</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Categoria</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Fascia</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Prezzo Min</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Prezzo Max</th>
                </tr>
              </thead>
              <tbody>
                {servizi.map((s: any) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-background transition-colors">
                    <td className="py-3 px-4 font-medium text-primary">{s.nome}</td>
                    <td className="py-3 px-4 text-text-muted text-xs capitalize">{s.categoria}</td>
                    <td className="py-3 px-4 text-text-muted text-xs capitalize">{s.fascia}</td>
                    <td className="py-3 px-4 text-right">&euro; {Number(s.prezzo_min).toLocaleString('it-IT')}</td>
                    <td className="py-3 px-4 text-right">&euro; {Number(s.prezzo_max).toLocaleString('it-IT')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {servizi.length === 0 && <p className="text-text-muted text-center py-8">Nessun servizio.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
