'use client'

import Link from 'next/link'
import { ArrowLeft, Users, Search, Phone, Mail, FileText, PawPrint, Shield, Plane, Flower2, Heart } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { useState } from 'react'

// Estrae clienti unici dalle richieste (per telefono)
function getClienti(richieste: any[]) {
  const map = new Map<string, { nome: string; telefono: string; email: string; richieste: any[] }>()

  richieste.forEach(r => {
    const key = r.telefono?.replace(/\s/g, '') || r.nome
    if (!key) return

    if (map.has(key)) {
      const c = map.get(key)!
      c.richieste.push(r)
      if (!c.email && r.email) c.email = r.email
      if (r.nome && r.nome.length > c.nome.length) c.nome = r.nome
    } else {
      map.set(key, {
        nome: r.nome || '',
        telefono: r.telefono || '',
        email: r.email || '',
        richieste: [r],
      })
    }
  })

  return Array.from(map.values()).sort((a, b) => {
    const lastA = a.richieste[0]?.createdAt || ''
    const lastB = b.richieste[0]?.createdAt || ''
    return lastB.localeCompare(lastA)
  })
}

function getTipoTag(note: string) {
  if (note?.includes('INVIO FIORI')) return { label: 'Fiori', icon: Flower2, color: 'bg-green-100 text-green-700' }
  if (note?.includes('CONDOGLIANZE')) return { label: 'Condoglianze', icon: Heart, color: 'bg-pink-100 text-pink-700' }
  if (note?.includes('SUCCESSIONE')) return { label: 'Successione', icon: FileText, color: 'bg-purple-100 text-purple-700' }
  if (note?.includes('PREVIDENZA')) return { label: 'Previdenza', icon: Shield, color: 'bg-blue-100 text-blue-700' }
  if (note?.includes('RIMPATRIO') || note?.includes('ESPATRIO')) return { label: 'Rimpatri', icon: Plane, color: 'bg-orange-100 text-orange-700' }
  if (note?.includes('PET') || note?.includes('Cremazione')) return { label: 'Pet', icon: PawPrint, color: 'bg-amber-100 text-amber-700' }
  return { label: 'Funebre', icon: FileText, color: 'bg-primary/10 text-primary' }
}

function getStatoColor(stato: string) {
  switch (stato) {
    case 'nuova': return 'bg-blue-100 text-blue-700'
    case 'in_lavorazione': return 'bg-yellow-100 text-yellow-700'
    case 'confermata': return 'bg-green-100 text-green-700'
    case 'completata': return 'bg-accent/10 text-accent'
    case 'annullata': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export default function AdminClientiPage() {
  const { richieste } = useSitoStore()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const clienti = getClienti(richieste)
  const filtered = search
    ? clienti.filter(c =>
        c.nome.toLowerCase().includes(search.toLowerCase()) ||
        c.telefono.includes(search) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      )
    : clienti

  const clienteSelezionato = selected ? clienti.find(c => c.telefono === selected || c.nome === selected) : null

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Clienti</h1>
            <p className="text-text-light text-sm">{clienti.length} clienti unici — {richieste.length} richieste totali</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista clienti */}
          <div className="lg:col-span-1">
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text" placeholder="Cerca per nome, telefono o email..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 text-sm"
              />
            </div>

            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
              {filtered.map(c => {
                const isActive = (c.telefono === selected || c.nome === selected)
                return (
                  <div key={c.telefono || c.nome}
                    onClick={() => setSelected(c.telefono || c.nome)}
                    className={`card cursor-pointer transition-all ${isActive ? 'border-secondary border-2' : 'hover:border-secondary/30'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="font-[family-name:var(--font-serif)] text-primary font-bold text-sm">
                          {c.nome.charAt(0)}{c.nome.split(' ').pop()?.charAt(0) || ''}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-primary text-sm truncate">{c.nome}</p>
                        <p className="text-text-muted text-xs truncate">{c.telefono}</p>
                      </div>
                      <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-medium">
                        {c.richieste.length}
                      </span>
                    </div>
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <p className="text-text-muted text-center py-8">Nessun cliente trovato.</p>
              )}
            </div>
          </div>

          {/* Dettaglio cliente */}
          <div className="lg:col-span-2">
            {clienteSelezionato ? (
              <div>
                {/* Header cliente */}
                <div className="card mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-[family-name:var(--font-serif)] text-primary font-bold text-lg">
                        {clienteSelezionato.nome.charAt(0)}{clienteSelezionato.nome.split(' ').pop()?.charAt(0) || ''}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary">{clienteSelezionato.nome}</h2>
                      <div className="flex items-center gap-4 text-sm text-text-muted mt-1">
                        {clienteSelezionato.telefono && (
                          <a href={`tel:${clienteSelezionato.telefono}`} className="flex items-center gap-1 hover:text-primary">
                            <Phone size={12} /> {clienteSelezionato.telefono}
                          </a>
                        )}
                        {clienteSelezionato.email && (
                          <a href={`mailto:${clienteSelezionato.email}`} className="flex items-center gap-1 hover:text-primary">
                            <Mail size={12} /> {clienteSelezionato.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {clienteSelezionato.richieste.length} richieste
                    </span>
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      Totale: &euro; {clienteSelezionato.richieste.reduce((s: number, r: any) => s + (Number(r.totale) || 0), 0).toLocaleString('it-IT')}
                    </span>
                  </div>
                </div>

                {/* Storia richieste */}
                <h3 className="font-medium text-primary text-sm mb-3">Storico richieste</h3>
                <div className="space-y-2">
                  {clienteSelezionato.richieste.map((r: any) => {
                    const tipo = getTipoTag(r.note)
                    return (
                      <Link key={r.id} href={`/admin/richieste/${r.id}`} className="card block hover:border-secondary/30 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tipo.color}`}>{tipo.label}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatoColor(r.stato)}`}>{r.stato}</span>
                          </div>
                          <span className="text-xs text-text-muted">
                            {new Date(r.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-text-light text-xs truncate flex-1 mr-4">
                            {r.note?.substring(0, 100) || r.configurazione?.substring(0, 100) || 'Richiesta preventivo'}
                          </p>
                          {Number(r.totale) > 0 && (
                            <span className="text-primary font-bold text-sm">&euro; {Number(r.totale).toLocaleString('it-IT')}</span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="card text-center py-16">
                <Users size={40} className="mx-auto mb-4 text-text-muted" />
                <p className="text-text-muted">Selezionate un cliente per vedere il dettaglio.</p>
                <p className="text-text-muted text-sm mt-1">Lo storico mostra tutte le richieste raggruppate per cliente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
