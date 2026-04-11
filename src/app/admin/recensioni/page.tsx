'use client'

import { Star, Plus, Trash2, X, CheckCircle, XCircle } from 'lucide-react'
import { getSupabase } from '@/lib/supabase-client'
import { useState, useEffect } from 'react'

interface Recensione {
  id: string
  nome: string
  citta: string
  testo: string
  stelle: number
  attivo: boolean
  created_at: string
}

export default function AdminRecensioni() {
  const [recensioni, setRecensioni] = useState<Recensione[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome: '', citta: '', testo: '', stelle: 5 })
  const [saving, setSaving] = useState(false)

  const load = () => {
    const sb = getSupabase()
    sb.from('testimonianze').select('*').order('created_at', { ascending: false })
      .then(({ data }: { data: unknown[] | null }) => {
        setRecensioni((data || []) as Recensione[])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ nome: '', citta: '', testo: '', stelle: 5 })
    setShowForm(false)
  }

  const salva = async () => {
    if (!form.nome || !form.testo) return
    setSaving(true)
    const sb = getSupabase()
    const { data } = await sb.from('testimonianze').insert({ ...form, attivo: true }).select().single()
    if (data) setRecensioni([data as unknown as Recensione, ...recensioni])
    resetForm()
    setSaving(false)
  }

  const toggleAttivo = async (id: string, attuale: boolean) => {
    const sb = getSupabase()
    await sb.from('testimonianze').update({ attivo: !attuale }).eq('id', id)
    setRecensioni(recensioni.map(r => r.id === id ? { ...r, attivo: !attuale } : r))
  }

  const elimina = async (id: string) => {
    if (!confirm('Eliminare questa recensione?')) return
    const sb = getSupabase()
    await sb.from('testimonianze').delete().eq('id', id)
    setRecensioni(recensioni.filter(r => r.id !== id))
  }

  const approvate = recensioni.filter(r => r.attivo).length
  const inAttesa = recensioni.filter(r => !r.attivo).length

  const renderStelle = (n: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} className={i <= n ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
      ))}
    </div>
  )

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl text-primary">Recensioni</h1>
          <p className="text-text-muted text-sm">
            {recensioni.length} totali — {approvate} approvate, {inAttesa} in attesa
          </p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
          <Plus size={16} className="mr-1" /> Nuova
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card py-4">
          <p className="text-text-muted text-xs">Totali</p>
          <p className="text-2xl text-primary font-bold">{recensioni.length}</p>
        </div>
        <div className="card py-4">
          <p className="text-text-muted text-xs">Approvate</p>
          <p className="text-2xl text-green-600 font-bold">{approvate}</p>
        </div>
        <div className="card py-4">
          <p className="text-text-muted text-xs">In attesa</p>
          <p className="text-2xl text-yellow-600 font-bold">{inAttesa}</p>
        </div>
      </div>

      {/* Form nuova recensione */}
      {showForm && (
        <div className="card p-4 mb-6 border-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-primary">Nuova recensione</h3>
            <button onClick={resetForm}><X size={18} className="text-text-muted" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nome"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              className="input-field text-sm"
            />
            <input
              type="text"
              placeholder="Città"
              value={form.citta}
              onChange={e => setForm({ ...form, citta: e.target.value })}
              className="input-field text-sm"
            />
            <textarea
              placeholder="Testo della recensione..."
              rows={3}
              value={form.testo}
              onChange={e => setForm({ ...form, testo: e.target.value })}
              className="input-field text-sm md:col-span-2"
            />
            <div>
              <label className="block text-sm font-medium text-text mb-1">Stelle</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setForm({ ...form, stelle: i })}
                    className="p-1"
                  >
                    <Star size={20} className={i <= form.stelle ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={resetForm} className="btn-secondary text-sm">Annulla</button>
            <button onClick={salva} disabled={saving || !form.nome || !form.testo} className="btn-primary text-sm">
              {saving ? 'Salvo...' : 'Crea'}
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="card p-8 text-center">
          <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : recensioni.length === 0 ? (
        <div className="card p-8 text-center">
          <Star size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessuna recensione. Clicca &quot;Nuova&quot; per aggiungerne una.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recensioni.map(r => (
            <div key={r.id} className={`card p-4 ${!r.attivo ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-primary">{r.nome}</p>
                    {r.citta && <p className="text-text-muted text-xs">{r.citta}</p>}
                    {renderStelle(r.stelle)}
                  </div>
                  <p className="text-text-light text-sm leading-relaxed">{r.testo}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.attivo ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.attivo ? 'Approvata' : 'In attesa'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => toggleAttivo(r.id, r.attivo)}
                    className="p-1.5 hover:bg-background rounded"
                    title={r.attivo ? 'Disattiva' : 'Approva'}
                  >
                    {r.attivo
                      ? <XCircle size={16} className="text-yellow-500" />
                      : <CheckCircle size={16} className="text-green-500" />
                    }
                  </button>
                  <button
                    onClick={() => elimina(r.id)}
                    className="p-1.5 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
