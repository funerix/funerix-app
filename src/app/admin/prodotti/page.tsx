'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, X, Save } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { useState } from 'react'
import { Prodotto, TipoServizio } from '@/types'

const emptyProdotto: Omit<Prodotto, 'id'> = {
  categoriaId: '1',
  nome: '',
  slug: '',
  descrizione: '',
  descrizioneBreve: '',
  materiale: '',
  dimensioni: '',
  prezzo: 0,
  immagini: [],
  attivo: true,
  tipoServizio: 'tutti',
}

export default function ProdottiAdminPage() {
  const { prodotti: listaProdotti, categorie, aggiungiProdotto, modificaProdotto, eliminaProdotto: rimuoviProdotto, toggleProdottoAttivo } = useSitoStore()
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyProdotto)
  const [salvato, setSalvato] = useState(false)

  const prodottiFiltrati = categoriaFiltro
    ? listaProdotti.filter(p => p.categoriaId === categoriaFiltro)
    : listaProdotti

  const apriNuovo = () => {
    setForm(emptyProdotto)
    setEditingId(null)
    setShowForm(true)
  }

  const apriModifica = (p: Prodotto) => {
    setForm({
      categoriaId: p.categoriaId,
      nome: p.nome,
      slug: p.slug,
      descrizione: p.descrizione,
      descrizioneBreve: p.descrizioneBreve,
      materiale: p.materiale || '',
      dimensioni: p.dimensioni || '',
      prezzo: p.prezzo,
      immagini: p.immagini,
      attivo: p.attivo,
      tipoServizio: p.tipoServizio,
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  const salvaProdotto = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = form.nome.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    if (editingId) {
      await modificaProdotto(editingId, { ...form, slug })
    } else {
      await aggiungiProdotto({ ...form, slug })
    }

    setShowForm(false)
    setEditingId(null)
    setSalvato(true)
    setTimeout(() => setSalvato(false), 3000)
  }

  const eliminaProdotto = async (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      await rimuoviProdotto(id)
    }
  }

  const toggleAttivo = async (id: string) => {
    await toggleProdottoAttivo(id)
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Gestione Prodotti</h1>
              <p className="text-text-light text-sm">{listaProdotti.length} prodotti nel catalogo</p>
            </div>
          </div>
          <div className="flex gap-3">
            {salvato && (
              <span className="text-accent text-sm font-medium self-center">Salvato!</span>
            )}
            <button onClick={apriNuovo} className="btn-accent text-sm">
              <Plus size={16} className="mr-2" />
              Nuovo Prodotto
            </button>
          </div>
        </div>

        {/* Form Crea/Modifica */}
        {showForm && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary">
                {editingId ? 'Modifica prodotto' : 'Nuovo prodotto'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-text-muted hover:text-primary">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={salvaProdotto} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Nome prodotto *</label>
                  <input
                    type="text" required className="input-field"
                    placeholder="Es. Cofano in Rovere Massello"
                    value={form.nome}
                    onChange={e => setForm({ ...form, nome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Categoria *</label>
                  <select
                    className="input-field"
                    value={form.categoriaId}
                    onChange={e => setForm({ ...form, categoriaId: e.target.value })}
                  >
                    {categorie.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Prezzo (&euro;) *</label>
                  <input
                    type="number" required min="0" step="10" className="input-field"
                    value={form.prezzo || ''}
                    onChange={e => setForm({ ...form, prezzo: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Materiale</label>
                  <input
                    type="text" className="input-field"
                    placeholder="Es. Rovere massello"
                    value={form.materiale || ''}
                    onChange={e => setForm({ ...form, materiale: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Dimensioni</label>
                  <input
                    type="text" className="input-field"
                    placeholder="Es. 195x65x55 cm"
                    value={form.dimensioni || ''}
                    onChange={e => setForm({ ...form, dimensioni: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Tipo servizio</label>
                  <select
                    className="input-field"
                    value={form.tipoServizio}
                    onChange={e => setForm({ ...form, tipoServizio: e.target.value as TipoServizio | 'tutti' })}
                  >
                    <option value="tutti">Tutti i servizi</option>
                    <option value="inumazione">Solo inumazione</option>
                    <option value="tumulazione">Solo tumulazione</option>
                    <option value="cremazione">Solo cremazione</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Descrizione breve *</label>
                <input
                  type="text" required className="input-field"
                  placeholder="Una riga di descrizione per le card"
                  value={form.descrizioneBreve}
                  onChange={e => setForm({ ...form, descrizioneBreve: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Descrizione completa</label>
                <textarea
                  rows={4} className="input-field"
                  placeholder="Descrizione dettagliata del prodotto/servizio..."
                  value={form.descrizione}
                  onChange={e => setForm({ ...form, descrizione: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Immagine</label>
                <ImageUpload
                  value={form.immagini[0] || ''}
                  onChange={(url) => setForm({ ...form, immagini: url ? [url] : [] })}
                  folder="prodotti"
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.attivo}
                    onChange={e => setForm({ ...form, attivo: e.target.checked })}
                    className="w-5 h-5 rounded border-border"
                  />
                  <span className="text-sm text-text">Visibile sul sito</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-accent text-sm">
                  <Save size={16} className="mr-2" />
                  {editingId ? 'Salva modifiche' : 'Crea prodotto'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">
                  Annulla
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtri categoria */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategoriaFiltro(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !categoriaFiltro ? 'bg-primary text-white' : 'bg-surface text-text-light border border-border'
            }`}
          >
            Tutti ({listaProdotti.length})
          </button>
          {categorie.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaFiltro(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoriaFiltro === cat.id ? 'bg-primary text-white' : 'bg-surface text-text-light border border-border'
              }`}
            >
              {cat.nome} ({listaProdotti.filter(p => p.categoriaId === cat.id).length})
            </button>
          ))}
        </div>

        {/* Tabella prodotti */}
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-text-muted font-medium">Prodotto</th>
                <th className="text-left py-3 px-3 text-text-muted font-medium">Categoria</th>
                <th className="text-left py-3 px-3 text-text-muted font-medium">Materiale</th>
                <th className="text-right py-3 px-3 text-text-muted font-medium">Prezzo</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Stato</th>
                <th className="text-right py-3 px-3 text-text-muted font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {prodottiFiltrati.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-background transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-background-dark rounded flex-shrink-0 relative overflow-hidden">
                        {p.immagini[0] ? (
                          <Image src={p.immagini[0]} alt={p.nome} fill className="object-cover" sizes="40px" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-[8px] text-text-muted">IMG</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-primary">{p.nome}</p>
                        <p className="text-xs text-text-muted truncate max-w-[200px]">{p.descrizioneBreve}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-text-light">
                    {categorie.find(c => c.id === p.categoriaId)?.nome}
                  </td>
                  <td className="py-3 px-3 text-text-light">{p.materiale || '—'}</td>
                  <td className="py-3 px-3 text-right font-semibold text-primary">
                    &euro; {p.prezzo.toLocaleString('it-IT')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button onClick={() => toggleAttivo(p.id)} className="cursor-pointer">
                      {p.attivo ? (
                        <span className="inline-flex items-center gap-1 text-xs text-accent">
                          <Eye size={12} /> Attivo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                          <EyeOff size={12} /> Nascosto
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => apriModifica(p)}
                        className="p-2 text-text-muted hover:text-secondary transition-colors" title="Modifica"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => eliminaProdotto(p.id)}
                        className="p-2 text-text-muted hover:text-error transition-colors" title="Elimina"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {prodottiFiltrati.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              <p>Nessun prodotto in questa categoria.</p>
              <button onClick={apriNuovo} className="text-secondary hover:underline mt-2 text-sm">
                Aggiungi il primo prodotto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
