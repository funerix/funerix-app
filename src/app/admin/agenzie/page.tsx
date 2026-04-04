'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react'
import { getSupabase } from '@/lib/supabase-client'
import { useState, useEffect } from 'react'

interface Agenzia {
  id: string
  nome: string
  logo: string
  telefono: string
  indirizzo: string
  email: string
  attiva: boolean
}

export default function AgenzieAdminPage() {
  const [agenzie, setAgenzie] = useState<Agenzia[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ nome: '', telefono: '', email: '', indirizzo: '', logo: '' })

  useEffect(() => {
    const sb = getSupabase()
    sb.from('agenzie').select('*').order('created_at').then(({ data }: { data: unknown[] | null }) => {
      setAgenzie((data || []) as Agenzia[])
    })
  }, [])

  const salva = async () => {
    const sb = getSupabase()
    if (editId) {
      await sb.from('agenzie').update(form).eq('id', editId)
      setAgenzie(agenzie.map(a => a.id === editId ? { ...a, ...form } : a))
    } else {
      const { data } = await sb.from('agenzie').insert({ ...form, attiva: true }).select().single()
      if (data) setAgenzie([...agenzie, data as unknown as Agenzia])
    }
    setShowForm(false)
    setEditId(null)
    setForm({ nome: '', telefono: '', email: '', indirizzo: '', logo: '' })
  }

  const elimina = async (id: string) => {
    if (!confirm('Eliminare questa agenzia?')) return
    const sb = getSupabase()
    await sb.from('agenzie').delete().eq('id', id)
    setAgenzie(agenzie.filter(a => a.id !== id))
  }

  const toggleAttiva = async (id: string) => {
    const a = agenzie.find(x => x.id === id)
    if (!a) return
    const sb = getSupabase()
    await sb.from('agenzie').update({ attiva: !a.attiva }).eq('id', id)
    setAgenzie(agenzie.map(x => x.id === id ? { ...x, attiva: !x.attiva } : x))
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Agenzie Partner</h1>
              <p className="text-text-light text-sm">Gestisci le agenzie che operano con Funerix</p>
            </div>
          </div>
          <button onClick={() => { setForm({ nome: '', telefono: '', email: '', indirizzo: '', logo: '' }); setEditId(null); setShowForm(true) }} className="btn-accent text-sm">
            <Plus size={16} className="mr-2" /> Nuova Agenzia
          </button>
        </div>

        {showForm && (
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary">{editId ? 'Modifica' : 'Nuova'} agenzia</h2>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-primary"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text mb-1">Nome agenzia *</label>
                <input type="text" className="input-field text-sm" placeholder="Es. Onoranze Funebri Rossi"
                  value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Telefono</label>
                <input type="tel" className="input-field text-sm" placeholder="081..."
                  value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Email</label>
                <input type="email" className="input-field text-sm" placeholder="info@..."
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Indirizzo</label>
                <input type="text" className="input-field text-sm" placeholder="Via..."
                  value={form.indirizzo} onChange={e => setForm({ ...form, indirizzo: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={salva} className="btn-accent text-xs"><Save size={14} className="mr-1" /> Salva</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary text-xs">Annulla</button>
            </div>
          </div>
        )}

        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-text-muted font-medium">Agenzia</th>
                <th className="text-left py-3 px-3 text-text-muted font-medium">Telefono</th>
                <th className="text-left py-3 px-3 text-text-muted font-medium">Email</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Stato</th>
                <th className="text-right py-3 px-3 text-text-muted font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {agenzie.map(a => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-background">
                  <td className="py-3 px-3 font-medium text-primary">{a.nome}</td>
                  <td className="py-3 px-3 text-text-light">{a.telefono || '—'}</td>
                  <td className="py-3 px-3 text-text-light">{a.email || '—'}</td>
                  <td className="py-3 px-3 text-center">
                    <button onClick={() => toggleAttiva(a.id)} className="cursor-pointer">
                      {a.attiva ? (
                        <span className="inline-flex items-center gap-1 text-xs text-accent"><Eye size={12} /> Attiva</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-text-muted"><EyeOff size={12} /> Disattiva</span>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => {
                        setForm({ nome: a.nome, telefono: a.telefono, email: a.email, indirizzo: a.indirizzo, logo: a.logo })
                        setEditId(a.id)
                        setShowForm(true)
                      }} className="p-2 text-text-muted hover:text-secondary"><Edit2 size={14} /></button>
                      <button onClick={() => elimina(a.id)} className="p-2 text-text-muted hover:text-error"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {agenzie.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-text-muted">Nessuna agenzia. Aggiungi la prima.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
