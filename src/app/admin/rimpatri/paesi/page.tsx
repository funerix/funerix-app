'use client'

import { useEffect, useState } from 'react'
import { Globe, Plus, Pencil, Trash2, X } from 'lucide-react'

const zoneLabel: Record<string, string> = {
  europa: 'Europa',
  nord_africa: 'Nord Africa/Medio Oriente',
  americhe: 'Americhe',
  asia: 'Asia',
  africa_subsahariana: 'Africa Sub-Sahariana',
  oceania: 'Oceania',
}
const zoneOptions = Object.keys(zoneLabel)

export default function AdminRimpatriPaesi() {
  const [paesi, setPaesi] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nome: '', codice_iso: '', zona: 'europa', prezzo_base: '', tempo_medio_giorni: '',
    bandiera_emoji: '', documenti_richiesti: '[]',
  })

  const load = () => {
    fetch('/api/rimpatri/paesi?all=1').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setPaesi(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setForm({ nome: '', codice_iso: '', zona: 'europa', prezzo_base: '', tempo_medio_giorni: '', bandiera_emoji: '', documenti_richiesti: '[]' })
    setEditing(null); setShowForm(false)
  }

  const openEdit = (p: any) => {
    setForm({
      nome: p.nome, codice_iso: p.codice_iso || '', zona: p.zona || 'europa',
      prezzo_base: String(p.prezzo_base || ''), tempo_medio_giorni: String(p.tempo_medio_giorni || ''),
      bandiera_emoji: p.bandiera_emoji || '',
      documenti_richiesti: JSON.stringify(p.documenti_richiesti || [], null, 2),
    })
    setEditing(p); setShowForm(true)
  }

  const save = async () => {
    setSaving(true)
    let docRichiesti: any = []
    try { docRichiesti = JSON.parse(form.documenti_richiesti) } catch { /* keep empty */ }
    const body = {
      nome: form.nome, codice_iso: form.codice_iso, zona: form.zona,
      prezzo_base: parseFloat(form.prezzo_base) || 0,
      tempo_medio_giorni: parseInt(form.tempo_medio_giorni) || 0,
      bandiera_emoji: form.bandiera_emoji,
      documenti_richiesti: docRichiesti,
    }
    if (editing) {
      await fetch('/api/rimpatri/paesi', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, ...body }) })
    } else {
      await fetch('/api/rimpatri/paesi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    load(); resetForm(); setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Eliminare questo paese?')) return
    await fetch('/api/rimpatri/paesi', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  // Group by zona
  const grouped = paesi.reduce((acc: Record<string, any[]>, p) => {
    const z = p.zona || 'europa'
    if (!acc[z]) acc[z] = []
    acc[z].push(p)
    return acc
  }, {})

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">Paesi e Zone</h1>
          <p className="text-text-muted text-sm">{paesi.length} paesi configurati</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
          <Plus size={16} className="mr-1" /> Aggiungi
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-4 mb-6 border-secondary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-primary">{editing ? 'Modifica paese' : 'Nuovo paese'}</h3>
            <button onClick={resetForm}><X size={18} className="text-text-muted" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Nome paese *" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="input-field text-sm" />
            <input type="text" placeholder="Codice ISO (es. MA)" value={form.codice_iso} onChange={e => setForm({ ...form, codice_iso: e.target.value })} className="input-field text-sm" />
            <select value={form.zona} onChange={e => setForm({ ...form, zona: e.target.value })} className="input-field text-sm">
              {zoneOptions.map(z => <option key={z} value={z}>{zoneLabel[z]}</option>)}
            </select>
            <div>
              <label className="text-xs text-text-muted">Prezzo base (&euro;)</label>
              <input type="number" value={form.prezzo_base} onChange={e => setForm({ ...form, prezzo_base: e.target.value })} className="input-field text-sm w-full" />
            </div>
            <div>
              <label className="text-xs text-text-muted">Tempo medio (giorni)</label>
              <input type="number" value={form.tempo_medio_giorni} onChange={e => setForm({ ...form, tempo_medio_giorni: e.target.value })} className="input-field text-sm w-full" />
            </div>
            <input type="text" placeholder="Bandiera emoji (es. \uD83C\uDDF2\uD83C\uDDE6)" value={form.bandiera_emoji} onChange={e => setForm({ ...form, bandiera_emoji: e.target.value })} className="input-field text-sm" />
          </div>
          <div className="mt-3">
            <label className="text-xs text-text-muted">Documenti richiesti (JSON array)</label>
            <textarea rows={4} value={form.documenti_richiesti} onChange={e => setForm({ ...form, documenti_richiesti: e.target.value })}
              className="input-field text-sm w-full font-mono" placeholder='["Certificato di morte", "Passaporto"]' />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={resetForm} className="btn-secondary text-sm">Annulla</button>
            <button onClick={save} disabled={saving || !form.nome} className="btn-primary text-sm">
              {saving ? 'Salvo...' : editing ? 'Salva' : 'Crea'}
            </button>
          </div>
        </div>
      )}

      {/* Lista raggruppata per zona */}
      {loading ? (
        <div className="card p-8 text-center"><p className="text-text-muted">Caricamento...</p></div>
      ) : paesi.length === 0 ? (
        <div className="card p-8 text-center">
          <Globe size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun paese configurato. Clicca Aggiungi per iniziare.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {zoneOptions.filter(z => grouped[z]?.length).map(zona => (
            <div key={zona}>
              <h3 className="font-medium text-primary mb-2">{zoneLabel[zona]}</h3>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-4 text-text-muted font-medium">Paese</th>
                      <th className="text-left py-2 px-4 text-text-muted font-medium">Codice</th>
                      <th className="text-right py-2 px-4 text-text-muted font-medium">Prezzo base</th>
                      <th className="text-right py-2 px-4 text-text-muted font-medium hidden md:table-cell">Tempo medio</th>
                      <th className="w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[zona].map((p: any) => (
                      <tr key={p.id} className="border-b border-border/50">
                        <td className="py-2 px-4 font-medium">{p.bandiera_emoji} {p.nome}</td>
                        <td className="py-2 px-4 text-text-muted">{p.codice_iso || '—'}</td>
                        <td className="py-2 px-4 text-right font-bold text-primary">&euro; {p.prezzo_base || 0}</td>
                        <td className="py-2 px-4 text-right text-text-light hidden md:table-cell">{p.tempo_medio_giorni || '—'} gg</td>
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
