'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react'
import { getSupabase } from '@/lib/supabase-client'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { useState, useEffect } from 'react'

interface Post { id: string; titolo: string; slug: string; contenuto: string; excerpt: string; immagine: string; pubblicato: boolean; created_at: string }

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ titolo: '', contenuto: '', excerpt: '', immagine: '', pubblicato: false })
  const [salvato, setSalvato] = useState(false)

  useEffect(() => {
    getSupabase().from('blog_posts').select('*').order('created_at', { ascending: false })
      .then(({ data }: { data: unknown[] | null }) => setPosts((data || []) as Post[]))
  }, [])

  const salva = async () => {
    const sb = getSupabase()
    const slug = form.titolo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    if (editId) {
      await sb.from('blog_posts').update({ ...form, slug, updated_at: new Date().toISOString() }).eq('id', editId)
      setPosts(posts.map(p => p.id === editId ? { ...p, ...form, slug } : p))
    } else {
      const { data } = await sb.from('blog_posts').insert({ ...form, slug }).select().single()
      if (data) setPosts([data as Post, ...posts])
    }
    setShowEditor(false)
    setEditId(null)
    setSalvato(true)
    setTimeout(() => setSalvato(false), 2000)
  }

  const elimina = async (id: string) => {
    if (!confirm('Eliminare questo articolo?')) return
    await getSupabase().from('blog_posts').delete().eq('id', id)
    setPosts(posts.filter(p => p.id !== id))
  }

  const togglePubblicato = async (id: string) => {
    const p = posts.find(x => x.id === id)
    if (!p) return
    await getSupabase().from('blog_posts').update({ pubblicato: !p.pubblicato }).eq('id', id)
    setPosts(posts.map(x => x.id === id ? { ...x, pubblicato: !x.pubblicato } : x))
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Blog</h1>
          </div>
          <button onClick={() => { setForm({ titolo: '', contenuto: '', excerpt: '', immagine: '', pubblicato: false }); setEditId(null); setShowEditor(true) }} className="btn-accent text-sm">
            <Plus size={16} className="mr-2" /> Nuovo Articolo
          </button>
        </div>

        {showEditor && (
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary">{editId ? 'Modifica' : 'Nuovo'} articolo</h2>
              <button onClick={() => setShowEditor(false)}><X size={18} className="text-text-muted" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text mb-1">Titolo *</label>
                <input type="text" className="input-field" placeholder="Es. Cosa fare quando muore un familiare"
                  value={form.titolo} onChange={e => setForm({ ...form, titolo: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Estratto (anteprima)</label>
                <textarea rows={2} className="input-field text-sm" placeholder="Breve riassunto per la card..."
                  value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Contenuto</label>
                <textarea rows={12} className="input-field text-sm font-mono" placeholder="Scrivi il contenuto dell'articolo..."
                  value={form.contenuto} onChange={e => setForm({ ...form, contenuto: e.target.value })} />
                <p className="text-[10px] text-text-muted mt-1">Usa una riga vuota per separare i paragrafi</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-text mb-1">Immagine di copertina</label>
                <ImageUpload value={form.immagine} onChange={url => setForm({ ...form, immagine: url })} bucket="prodotti-immagini" folder="blog" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.pubblicato} onChange={e => setForm({ ...form, pubblicato: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-sm text-text">Pubblicato</span>
              </label>
              <div className="flex gap-2">
                <button onClick={salva} className="btn-accent text-sm"><Save size={14} className="mr-1" /> {salvato ? 'Salvato!' : 'Salva'}</button>
                <button onClick={() => setShowEditor(false)} className="btn-secondary text-sm">Annulla</button>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-text-muted font-medium">Articolo</th>
                <th className="text-left py-3 px-3 text-text-muted font-medium">Data</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Stato</th>
                <th className="text-right py-3 px-3 text-text-muted font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-background">
                  <td className="py-3 px-3">
                    <p className="font-medium text-primary">{p.titolo}</p>
                    <p className="text-xs text-text-muted truncate max-w-xs">{p.excerpt}</p>
                  </td>
                  <td className="py-3 px-3 text-text-light text-xs">{new Date(p.created_at).toLocaleDateString('it-IT')}</td>
                  <td className="py-3 px-3 text-center">
                    <button onClick={() => togglePubblicato(p.id)}>
                      {p.pubblicato ? <span className="text-xs text-accent flex items-center justify-center gap-1"><Eye size={12} /> Pubblicato</span>
                        : <span className="text-xs text-text-muted flex items-center justify-center gap-1"><EyeOff size={12} /> Bozza</span>}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button onClick={() => { setForm({ titolo: p.titolo, contenuto: p.contenuto, excerpt: p.excerpt, immagine: p.immagine, pubblicato: p.pubblicato }); setEditId(p.id); setShowEditor(true) }}
                      className="p-2 text-text-muted hover:text-secondary"><Edit2 size={14} /></button>
                    <button onClick={() => elimina(p.id)} className="p-2 text-text-muted hover:text-error"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-text-muted">Nessun articolo</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
