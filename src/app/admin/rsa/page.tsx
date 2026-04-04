'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Copy, Building2 } from 'lucide-react'
import { getSupabase } from '@/lib/supabase-client'
import { useState, useEffect } from 'react'

interface RSA { id: string; nome: string; indirizzo: string; citta: string; provincia: string; telefono: string; email: string; referente_nome: string; commissione_percentuale: number; codice_convenzione: string; piani_attivi: number; attiva: boolean }

export default function AdminRSAPage() {
  const [rsaList, setRsaList] = useState<RSA[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome: '', indirizzo: '', citta: '', provincia: '', telefono: '', email: '', referente_nome: '', commissione_percentuale: 5 })

  useEffect(() => { getSupabase().from('rsa_convenzionate').select('*').order('created_at').then(({ data }: { data: unknown[] | null }) => setRsaList((data || []) as RSA[])) }, [])

  const salva = async () => {
    const codice = 'RSA-' + form.nome.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
    const { data } = await getSupabase().from('rsa_convenzionate').insert({ ...form, codice_convenzione: codice, attiva: true }).select().single()
    if (data) setRsaList([...rsaList, data as unknown as RSA])
    setShowForm(false)
    setForm({ nome: '', indirizzo: '', citta: '', provincia: '', telefono: '', email: '', referente_nome: '', commissione_percentuale: 5 })
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
            <div><h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">RSA Convenzionate</h1>
            <p className="text-text-light text-sm">{rsaList.length} strutture partner</p></div>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-accent text-sm"><Plus size={16} className="mr-1" /> Nuova RSA</button>
        </div>

        {showForm && (
          <div className="card mb-6">
            <div className="flex justify-between mb-4"><h2 className="font-[family-name:var(--font-serif)] text-lg text-primary">Nuova RSA convenzionata</h2><button onClick={() => setShowForm(false)}><X size={18} className="text-text-muted" /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-text">Nome struttura *</label><input className="input-field text-sm mt-1" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
              <div><label className="text-xs font-medium text-text">Citt&agrave;</label><input className="input-field text-sm mt-1" value={form.citta} onChange={e => setForm({ ...form, citta: e.target.value })} /></div>
              <div><label className="text-xs font-medium text-text">Provincia</label><input className="input-field text-sm mt-1" placeholder="NA, CE, SA..." value={form.provincia} onChange={e => setForm({ ...form, provincia: e.target.value })} /></div>
              <div><label className="text-xs font-medium text-text">Indirizzo</label><input className="input-field text-sm mt-1" value={form.indirizzo} onChange={e => setForm({ ...form, indirizzo: e.target.value })} /></div>
              <div><label className="text-xs font-medium text-text">Telefono</label><input className="input-field text-sm mt-1" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} /></div>
              <div><label className="text-xs font-medium text-text">Email</label><input className="input-field text-sm mt-1" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div><label className="text-xs font-medium text-text">Referente</label><input className="input-field text-sm mt-1" value={form.referente_nome} onChange={e => setForm({ ...form, referente_nome: e.target.value })} /></div>
              <div><label className="text-xs font-medium text-text">Commissione %</label><input type="number" className="input-field text-sm mt-1" min={1} max={20} value={form.commissione_percentuale} onChange={e => setForm({ ...form, commissione_percentuale: Number(e.target.value) })} /></div>
            </div>
            <button onClick={salva} className="btn-accent text-xs mt-4"><Save size={14} className="mr-1" /> Salva</button>
          </div>
        )}

        {rsaList.length === 0 ? (
          <div className="card text-center py-16"><Building2 size={32} className="mx-auto mb-3 text-text-muted opacity-30" /><p className="text-text-muted">Nessuna RSA convenzionata.</p></div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-text-muted font-medium">Struttura</th>
                <th className="text-left py-3 px-3 text-text-muted font-medium">Citt&agrave;</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Commissione</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Piani</th>
                <th className="text-left py-3 px-3 text-text-muted font-medium">Codice</th>
                <th className="text-right py-3 px-3 text-text-muted font-medium">Azioni</th>
              </tr></thead>
              <tbody>{rsaList.map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-background">
                  <td className="py-3 px-3"><p className="font-medium text-primary">{r.nome}</p><p className="text-[10px] text-text-muted">{r.referente_nome}</p></td>
                  <td className="py-3 px-3 text-text-light">{r.citta} ({r.provincia})</td>
                  <td className="py-3 px-3 text-center font-bold text-accent">{r.commissione_percentuale}%</td>
                  <td className="py-3 px-3 text-center text-primary font-medium">{r.piani_attivi}</td>
                  <td className="py-3 px-3"><code className="text-xs bg-background px-2 py-1 rounded">{r.codice_convenzione}</code></td>
                  <td className="py-3 px-3 text-right">
                    <button onClick={() => { const link = `${window.location.origin}/previdenza?rsa=${r.codice_convenzione}`; navigator.clipboard.writeText(link).catch(() => {}); prompt('Link convenzione:', link) }}
                      className="p-1.5 text-text-muted hover:text-secondary"><Copy size={13} /></button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
