'use client'

import Link from 'next/link'
import { ArrowLeft, Plus, Heart, MessageCircle, Eye, EyeOff, Trash2, Edit2, QrCode } from 'lucide-react'
import { useSitoStore, MemorialEntry } from '@/store/sito'
import { useState } from 'react'

export default function AdminMemorialPage() {
  const { memorial: memorials, aggiungiMemorial, eliminaMemorial, modificaMemorial } = useSitoStore()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Gestione Memorial</h1>
              <p className="text-text-light text-sm">Crea e gestisci le pagine memorial visibili sul sito</p>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-accent text-sm">
            <Plus size={16} className="mr-2" />
            Nuovo Memorial
          </button>
        </div>

        {/* Form nuovo memorial */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Crea nuovo Memorial</h2>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              await aggiungiMemorial({
                nome: fd.get('nome') as string,
                foto: '',
                dataNascita: fd.get('dataNascita') as string,
                dataMorte: fd.get('dataMorte') as string,
                comune: fd.get('comune') as string || '',
                biografia: fd.get('biografia') as string || '',
                luogoSepoltura: fd.get('luogoSepoltura') as string || '',
                donazioneUrl: fd.get('donazioneUrl') as string || '',
                donazioneDescrizione: fd.get('donazioneDescrizione') as string || '',
                attivo: true,
              })
              setShowForm(false)
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Nome del defunto *</label>
                  <input type="text" name="nome" required className="input-field" placeholder="Nome e Cognome" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Data di nascita *</label>
                  <input type="date" name="dataNascita" required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Data di morte *</label>
                  <input type="date" name="dataMorte" required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Comune</label>
                  <input type="text" name="comune" className="input-field" placeholder="Es. Napoli" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Luogo di sepoltura</label>
                  <input type="text" name="luogoSepoltura" className="input-field" placeholder="Cimitero, indirizzo..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Foto</label>
                  <input type="file" accept="image/*" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Biografia / Necrologio</label>
                <textarea rows={4} name="biografia" className="input-field" placeholder="Scrivi una breve biografia o necrologio..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">URL donazione (opzionale)</label>
                  <input type="url" name="donazioneUrl" className="input-field" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Descrizione donazione</label>
                  <input type="text" name="donazioneDescrizione" className="input-field" placeholder="In memoria di..., devolvere a..." />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-accent text-sm">Crea Memorial</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Annulla</button>
              </div>
            </form>
          </div>
        )}

        {/* Lista memorial */}
        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-text-muted font-medium">Defunto</th>
                <th className="text-left py-3 px-3 text-text-muted font-medium">Data decesso</th>
                <th className="text-left py-3 px-3 text-text-muted font-medium">Comune</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Messaggi</th>
                <th className="text-center py-3 px-3 text-text-muted font-medium">Stato</th>
                <th className="text-right py-3 px-3 text-text-muted font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {memorials.map(m => (
                <tr key={m.id} className="border-b border-border/50 hover:bg-background transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Heart size={14} className="text-secondary" />
                      </div>
                      <span className="font-medium text-primary">{m.nome}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-text-light">{new Date(m.dataMorte).toLocaleDateString('it-IT')}</td>
                  <td className="py-3 px-3 text-text-light">{m.comune}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-text-light">
                      <MessageCircle size={14} /> {m.messaggi.length}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {m.attivo ? (
                      <span className="inline-flex items-center gap-1 text-xs text-accent"><Eye size={12} /> Pubblico</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-text-muted"><EyeOff size={12} /> Nascosto</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/memorial/${m.id}`} target="_blank" className="p-2 text-text-muted hover:text-primary transition-colors" title="Vedi pagina">
                        <Eye size={14} />
                      </Link>
                      <button className="p-2 text-text-muted hover:text-secondary transition-colors" title="QR Code">
                        <QrCode size={14} />
                      </button>
                      <button onClick={() => modificaMemorial(m.id, { attivo: !m.attivo })} className="p-2 text-text-muted hover:text-secondary transition-colors" title={m.attivo ? 'Nascondi' : 'Pubblica'}>
                        {m.attivo ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => { if (confirm('Eliminare questo memorial?')) eliminaMemorial(m.id) }} className="p-2 text-text-muted hover:text-error transition-colors" title="Elimina">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
