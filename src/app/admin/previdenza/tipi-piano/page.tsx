'use client'

import { useEffect, useState } from 'react'
import { Layers, Plus, Pencil, Trash2, X, CheckCircle, XCircle } from 'lucide-react'

export default function AdminPrevidenzaTipiPiano() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nome: '', slug: '', descrizione: '', prezzo_base: '', durata_min_mesi: '', durata_max_mesi: '', servizi_inclusi: '', attivo: true
  })

  const load = () => {
    fetch('/api/previdenza/tipi-piano').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setItems(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ nome: '', slug: '', descrizione: '', prezzo_base: '', durata_min_mesi: '', durata_max_mesi: '', servizi_inclusi: '', attivo: true })
    setEditing(null); setShowForm(false)
  }

  const openEdit = (item: any) => {
    setForm({
      nome: item.nome || '', slug: item.slug || '',
      descrizione: item.descrizione || '',
      prezzo_base: String(item.prezzo_base || ''),
      durata_min_mesi: String(item.durata_min_mesi || ''),
      durata_max_mesi: String(item.durata_max_mesi || ''),
      servizi_inclusi: item.servizi_inclusi ? JSON.stringify(item.servizi_inclusi, null, 2) : '',
      attivo: item.attivo !== false
    })
    setEditing(item); setShowForm(true)
  }

  const save = async () => {
    setSaving(true)
    let servizi_inclusi = null
    try { servizi_inclusi = form.servizi_inclusi ? JSON.parse(form.servizi_inclusi) : null } catch { /* ignore */ }
    const body = {
      nome: form.nome, slug: form.slug || form.nome.toLowerCase().replace(/\s+/g, '-'),
      descrizione: form.descrizione, prezzo_base: parseFloat(form.prezzo_base) || 0,
      durata_min_mesi: parseInt(form.durata_min_mesi) || null, durata_max_mesi: parseInt(form.durata_max_mesi) || null,
      servizi_inclusi, attivo: form.attivo
    }
    if (editing) {
      await fetch('/api/previdenza/tipi-piano', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...body }) })
    } else {
      await fetch('/api/previdenza/tipi-piano', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    load(); resetForm(); setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Eliminare questo tipo piano?')) return
    await fetch('/api/previdenza/tipi-piano', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const toggleAttivo = async (item: any) => {
    await fetch('/api/previdenza/tipi-piano', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, attivo: !item.attivo }) })
    load()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tipi Piano</h1>
          <p className="text-text-muted text-sm">{items.length} tipologie di piano</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
          <Plus size={16} className="mr-1" /> Aggiungi
        </button>
      </div>

      {showForm && (
        <div className="card p-4 mb-6 border-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-primary">{editing ? 'Modifica tipo piano' : 'Nuovo tipo piano'}</h3>
            <button onClick={resetForm}><X size={18} className="text-text-muted" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Nome *" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="input-field text-sm" />
            <input type="number" placeholder="Prezzo base (EUR)" value={form.prezzo_base} onChange={e => setForm({ ...form, prezzo_base: e.target.value })} className="input-field text-sm" />
            <input type="number" placeholder="Durata min (mesi)" value={form.durata_min_mesi} onChange={e => setForm({ ...form, durata_min_mesi: e.target.value })} className="input-field text-sm" />
            <input type="number" placeholder="Durata max (mesi)" value={form.durata_max_mesi} onChange={e => setForm({ ...form, durata_max_mesi: e.target.value })} className="input-field text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.attivo} onChange={e => setForm({ ...form, attivo: e.target.checked })} />
              Attivo
            </label>
            <input type="text" placeholder="Descrizione" value={form.descrizione} onChange={e => setForm({ ...form, descrizione: e.target.value })} className="input-field text-sm md:col-span-3" />
            <div className="md:col-span-3">
              <label className="text-xs text-text-muted mb-1 block">Servizi inclusi (JSON array)</label>
              <textarea placeholder='["Trasporto", "Cerimonia base", ...]' value={form.servizi_inclusi} onChange={e => setForm({ ...form, servizi_inclusi: e.target.value })} className="input-field text-sm w-full h-24 font-mono" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={resetForm} className="btn-secondary text-sm">Annulla</button>
            <button onClick={save} disabled={saving || !form.nome || !form.prezzo_base} className="btn-primary text-sm">
              {saving ? 'Salvo...' : editing ? 'Salva' : 'Crea'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card p-8 text-center"><p className="text-text-muted">Caricamento...</p></div>
      ) : items.length === 0 ? (
        <div className="card p-8 text-center">
          <Layers size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun tipo piano. Clicca Aggiungi per iniziare.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-muted font-medium">Nome</th>
                <th className="text-right py-3 px-4 text-text-muted font-medium">Prezzo base</th>
                <th className="text-left py-3 px-4 text-text-muted font-medium">Durata (mesi)</th>
                <th className="text-center py-3 px-4 text-text-muted font-medium">Attivo</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-primary">{item.nome}</p>
                    {item.descrizione && <p className="text-text-muted text-xs truncate max-w-xs">{item.descrizione}</p>}
                    {item.servizi_inclusi && Array.isArray(item.servizi_inclusi) && item.servizi_inclusi.length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {item.servizi_inclusi.map((s: string, i: number) => (
                          <li key={i} className="text-xs text-text-muted flex items-center gap-1">
                            <CheckCircle size={10} className="text-green-500 shrink-0" /> {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-medium">&euro; {item.prezzo_base}</td>
                  <td className="py-3 px-4 text-text-muted">{item.durata_min_mesi || '—'} - {item.durata_max_mesi || '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => toggleAttivo(item)}>
                      {item.attivo ? <CheckCircle size={18} className="text-green-500 mx-auto" /> : <XCircle size={18} className="text-red-400 mx-auto" />}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-background rounded"><Pencil size={14} className="text-text-muted" /></button>
                      <button onClick={() => remove(item.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-400" /></button>
                    </div>
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
