'use client'

import { useEffect, useState } from 'react'
import { CreditCard, Plus, Pencil, Trash2, X } from 'lucide-react'

const specieOptions = ['cane', 'gatto', 'coniglio', 'uccello', 'rettile', 'altro']
const tagliaOptions = ['piccolo', 'medio', 'grande']
const tipoOptions = ['individuale', 'collettiva']

export default function AdminPetPrezzi() {
  const [prezzi, setPrezzi] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ specie: 'cane', taglia: 'piccolo', tipo_cremazione: 'individuale', prezzo: '', ritiro_domicilio_prezzo: '60', impronta_zampa_prezzo: '40' })
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/pet/prezzi').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setPrezzi(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => { setForm({ specie: 'cane', taglia: 'piccolo', tipo_cremazione: 'individuale', prezzo: '', ritiro_domicilio_prezzo: '60', impronta_zampa_prezzo: '40' }); setEditing(null); setShowForm(false) }

  const openEdit = (p: any) => {
    setForm({ specie: p.specie, taglia: p.taglia, tipo_cremazione: p.tipo_cremazione, prezzo: String(p.prezzo), ritiro_domicilio_prezzo: String(p.ritiro_domicilio_prezzo), impronta_zampa_prezzo: String(p.impronta_zampa_prezzo) })
    setEditing(p)
    setShowForm(true)
  }

  const save = async () => {
    setSaving(true)
    const body = { ...form, prezzo: parseFloat(form.prezzo) || 0, ritiro_domicilio_prezzo: parseFloat(form.ritiro_domicilio_prezzo) || 0, impronta_zampa_prezzo: parseFloat(form.impronta_zampa_prezzo) || 0 }
    if (editing) {
      await fetch('/api/pet/prezzi', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...body }) })
    } else {
      await fetch('/api/pet/prezzi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    load()
    resetForm()
    setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Eliminare questo prezzo?')) return
    await fetch('/api/pet/prezzi', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  // Raggruppa per specie
  const grouped = prezzi.reduce((acc: Record<string, any[]>, p) => {
    if (!acc[p.specie]) acc[p.specie] = []
    acc[p.specie].push(p)
    return acc
  }, {})

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Prezzi Pet</h1>
          <p className="text-text-muted text-sm">Listino per specie, taglia e tipo cremazione</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
          <Plus size={16} className="mr-1" /> Aggiungi
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-4 mb-6 border-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-primary">{editing ? 'Modifica prezzo' : 'Nuovo prezzo'}</h3>
            <button onClick={resetForm}><X size={18} className="text-text-muted" /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <select value={form.specie} onChange={e => setForm({ ...form, specie: e.target.value })} className="input-field text-sm">
              {specieOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <select value={form.taglia} onChange={e => setForm({ ...form, taglia: e.target.value })} className="input-field text-sm">
              {tagliaOptions.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <select value={form.tipo_cremazione} onChange={e => setForm({ ...form, tipo_cremazione: e.target.value })} className="input-field text-sm">
              {tipoOptions.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <div>
              <label className="text-xs text-text-muted">Prezzo cremazione (&euro;)</label>
              <input type="number" value={form.prezzo} onChange={e => setForm({ ...form, prezzo: e.target.value })} className="input-field text-sm w-full" />
            </div>
            <div>
              <label className="text-xs text-text-muted">Ritiro domicilio (&euro;)</label>
              <input type="number" value={form.ritiro_domicilio_prezzo} onChange={e => setForm({ ...form, ritiro_domicilio_prezzo: e.target.value })} className="input-field text-sm w-full" />
            </div>
            <div>
              <label className="text-xs text-text-muted">Impronta zampa (&euro;)</label>
              <input type="number" value={form.impronta_zampa_prezzo} onChange={e => setForm({ ...form, impronta_zampa_prezzo: e.target.value })} className="input-field text-sm w-full" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={resetForm} className="btn-secondary text-sm">Annulla</button>
            <button onClick={save} disabled={saving || !form.prezzo} className="btn-primary text-sm">
              {saving ? 'Salvo...' : editing ? 'Salva' : 'Crea'}
            </button>
          </div>
        </div>
      )}

      {/* Lista raggruppata */}
      {loading ? (
        <div className="card p-8 text-center"><p className="text-text-muted">Caricamento...</p></div>
      ) : prezzi.length === 0 ? (
        <div className="card p-8 text-center">
          <CreditCard size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun prezzo configurato. Esegui lo SQL per caricare i dati iniziali.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([specie, items]) => (
            <div key={specie}>
              <h3 className="font-medium text-primary capitalize mb-2">{specie}</h3>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-4 text-text-muted font-medium">Taglia</th>
                      <th className="text-left py-2 px-4 text-text-muted font-medium">Tipo</th>
                      <th className="text-right py-2 px-4 text-text-muted font-medium">Cremazione</th>
                      <th className="text-right py-2 px-4 text-text-muted font-medium hidden md:table-cell">Ritiro</th>
                      <th className="text-right py-2 px-4 text-text-muted font-medium hidden md:table-cell">Impronta</th>
                      <th className="w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(items as any[]).map((p: any) => (
                      <tr key={p.id} className="border-b border-border/50">
                        <td className="py-2 px-4 capitalize font-medium">{p.taglia}</td>
                        <td className="py-2 px-4 capitalize">{p.tipo_cremazione}</td>
                        <td className="py-2 px-4 text-right font-bold text-primary">&euro; {p.prezzo}</td>
                        <td className="py-2 px-4 text-right text-text-light hidden md:table-cell">&euro; {p.ritiro_domicilio_prezzo}</td>
                        <td className="py-2 px-4 text-right text-text-light hidden md:table-cell">&euro; {p.impronta_zampa_prezzo}</td>
                        <td className="py-2 px-4">
                          <div className="flex gap-1 justify-end">
                            <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-background rounded"><Pencil size={14} className="text-text-muted" /></button>
                            <button onClick={() => remove(p.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-400" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
