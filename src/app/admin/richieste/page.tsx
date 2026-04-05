'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, Phone, Mail, Eye, MessageCircle, FileText, Download, CheckCircle2, Circle, Loader2, User } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { getSupabase } from '@/lib/supabase-client'
import { useAdminUser } from '@/lib/useAdminUser'
import { useState, useEffect } from 'react'

interface ClienteInfo {
  id: string
  nome: string
  documenti_checklist: { nome: string; completato: boolean }[]
  documenti_files: { nome: string; file: string; data: string }[]
  messaggi_chat: { autore: string; testo: string; data: string }[]
  stato_servizio: string
}

const statoColori: Record<string, string> = {
  nuova: 'bg-blue-100 text-blue-800',
  in_lavorazione: 'bg-yellow-100 text-yellow-800',
  confermata: 'bg-green-100 text-green-800',
  completata: 'bg-gray-100 text-gray-600',
}

export default function RichiestePage() {
  const { richieste, aggiornaStatoRichiesta, impostazioni } = useSitoStore()
  const { user, canSeeAll } = useAdminUser()
  // Consulente vede solo le sue pratiche
  const mieRichieste = canSeeAll ? richieste : richieste.filter(r => (r as unknown as Record<string, string>).consulente_id === user?.id)
  const [filtroStato, setFiltroStato] = useState<string>('tutti')
  const [dettaglio, setDettaglio] = useState<string | null>(null)
  const [consulentiMap, setConsulentiMap] = useState<Record<string, string>>({})

  // Carica nomi consulenti
  useEffect(() => {
    getSupabase().from('admin_users').select('id, nome').eq('attivo', true)
      .then(({ data }: { data: unknown[] | null }) => {
        const map: Record<string, string> = {}
        ;(data || []).forEach((c: unknown) => { const u = c as { id: string; nome: string }; map[u.id] = u.nome })
        setConsulentiMap(map)
      })
  }, [])
  const [clienteInfo, setClienteInfo] = useState<ClienteInfo | null>(null)
  const [loadingCliente, setLoadingCliente] = useState(false)

  // Carica info cliente quando si seleziona una richiesta
  useEffect(() => {
    if (!dettaglio) { setClienteInfo(null); return }
    setLoadingCliente(true)
    const sb = getSupabase()
    sb.from('clienti')
      .select('id, nome, documenti_checklist, documenti_files, messaggi_chat, stato_servizio')
      .eq('richiesta_id', dettaglio)
      .single()
      .then(({ data }: { data: ClienteInfo | null }) => {
        setClienteInfo(data as ClienteInfo | null)
        setLoadingCliente(false)
      })
  }, [dettaglio])

  const richiesteFiltrate = filtroStato === 'tutti'
    ? mieRichieste
    : mieRichieste.filter(r => r.stato === filtroStato)

  const richiestaDettaglio = richieste.find(r => r.id === dettaglio)

  const inviaWhatsApp = (r: typeof richieste[0]) => {
    const whatsappNum = impostazioni.whatsapp.replace(/\s/g, '')
    let msg = `🔔 RICHIESTA: ${r.id}\n\n`
    msg += `👤 ${r.nome}\n📞 ${r.telefono}\n`
    if (r.email) msg += `✉️ ${r.email}\n`
    msg += `📋 Modalità: ${r.modalita}\n🕐 ${r.orario}\n\n`
    msg += `--- CONFIGURAZIONE ---\n${r.configurazione}\n\n`
    msg += `💰 TOTALE: €${r.totale.toLocaleString('it-IT')}\n`
    if (r.note) msg += `\n📝 Note: ${r.note}`
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-text-muted hover:text-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Richieste</h1>
            <p className="text-text-light text-sm">{mieRichieste.length} richieste</p>
          </div>
        </div>

        {mieRichieste.length === 0 ? (
          <div className="card text-center py-16">
            <Eye size={32} className="mx-auto mb-4 text-text-muted opacity-30" />
            <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-2">Nessuna richiesta</h3>
            <p className="text-text-muted">Le richieste dei clienti dal configuratore appariranno qui.</p>
          </div>
        ) : (
          <>
            {/* Filtri */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['tutti', 'nuova', 'in_lavorazione', 'confermata', 'completata'].map(stato => (
                <button
                  key={stato}
                  onClick={() => setFiltroStato(stato)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filtroStato === stato ? 'bg-primary text-white' : 'bg-surface text-text-light border border-border'
                  }`}
                >
                  {stato === 'tutti' ? `Tutti (${mieRichieste.length})` : `${stato.replace('_', ' ')} (${mieRichieste.filter(r => r.stato === stato).length})`}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista */}
              <div className="lg:col-span-2 space-y-3">
                {richiesteFiltrate.map(r => (
                  <Link
                    key={r.id}
                    href={`/admin/richieste/${r.id}`}
                    className="card block cursor-pointer hover:border-secondary"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-xs text-text-muted">{r.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statoColori[r.stato]}`}>
                            {r.stato.replace('_', ' ')}
                          </span>
                          {r.stato === 'nuova' && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <h3 className="font-medium text-primary">{r.nome}</h3>
                        <div className="flex items-center gap-4 mt-1 text-xs text-text-muted">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {new Date(r.createdAt).toLocaleString('it-IT')}
                          </span>
                          <span>{r.modalita}</span>
                          <span>{r.orario}</span>
                          {(r as unknown as Record<string, string>).consulente_id && consulentiMap[(r as unknown as Record<string, string>).consulente_id] && (
                            <span className="flex items-center gap-1 text-secondary">
                              <User size={10} /> {consulentiMap[(r as unknown as Record<string, string>).consulente_id]}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-[family-name:var(--font-serif)] text-lg font-semibold text-primary">
                          &euro; {r.totale.toLocaleString('it-IT')}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Dettaglio */}
              <div>
                {richiestaDettaglio ? (
                  <div className="card sticky top-24">
                    <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">
                      {richiestaDettaglio.nome}
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex gap-3">
                        <a href={`tel:${richiestaDettaglio.telefono}`} className="btn-secondary text-xs py-2 px-3 flex-1">
                          <Phone size={14} className="mr-1" /> {richiestaDettaglio.telefono}
                        </a>
                        <button onClick={() => inviaWhatsApp(richiestaDettaglio)} className="btn-secondary text-xs py-2 px-3 flex-1 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white">
                          <MessageCircle size={14} className="mr-1" /> WhatsApp
                        </button>
                      </div>
                      {richiestaDettaglio.email && (
                        <a href={`mailto:${richiestaDettaglio.email}`} className="flex items-center gap-2 text-secondary hover:underline">
                          <Mail size={14} /> {richiestaDettaglio.email}
                        </a>
                      )}
                      <div>
                        <span className="text-text-muted">Modalit&agrave; contatto</span>
                        <p className="text-primary font-medium">{richiestaDettaglio.modalita}</p>
                      </div>
                      <div>
                        <span className="text-text-muted">Preferenza</span>
                        <p className="text-primary font-medium">{richiestaDettaglio.orario}</p>
                      </div>
                      <div>
                        <span className="text-text-muted">Configurazione</span>
                        <pre className="text-text-light text-xs mt-1 whitespace-pre-wrap bg-background rounded-lg p-3">
                          {richiestaDettaglio.configurazione}
                        </pre>
                      </div>
                      <div>
                        <span className="text-text-muted">Totale preventivo</span>
                        <p className="font-[family-name:var(--font-serif)] text-xl font-bold text-primary">
                          &euro; {richiestaDettaglio.totale.toLocaleString('it-IT')}
                        </p>
                      </div>
                      {richiestaDettaglio.note && (
                        <div>
                          <span className="text-text-muted">Note cliente</span>
                          <p className="text-text-light">{richiestaDettaglio.note}</p>
                        </div>
                      )}
                      <div className="pt-4 border-t border-border space-y-2">
                        <span className="text-text-muted text-xs">Cambia stato:</span>
                        <div className="grid grid-cols-2 gap-2">
                          {(['nuova', 'in_lavorazione', 'confermata', 'completata'] as const).map(stato => (
                            <button
                              key={stato}
                              onClick={() => aggiornaStatoRichiesta(richiestaDettaglio.id, stato)}
                              className={`text-xs py-2 px-3 rounded-lg font-medium transition-colors ${
                                richiestaDettaglio.stato === stato
                                  ? 'bg-primary text-white'
                                  : 'bg-background text-text-light hover:bg-background-dark'
                              }`}
                            >
                              {stato.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Crea account cliente */}
                      {richiestaDettaglio.email && (
                        <div className="pt-4 border-t border-border">
                          <button
                            onClick={async () => {
                              const res = await fetch('/api/cliente', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  richiestaId: richiestaDettaglio.id,
                                  nome: richiestaDettaglio.nome,
                                  email: richiestaDettaglio.email,
                                  telefono: richiestaDettaglio.telefono,
                                }),
                              })
                              const data = await res.json()
                              if (data.success) {
                                const link = `${window.location.origin}/cliente?token=${data.token}`
                                try { await navigator.clipboard.writeText(link) } catch {}
                                prompt('Account cliente creato! Copia il link e invialo al cliente via WhatsApp o email:', link)
                              } else {
                                alert('Errore: ' + (data.error || 'Sconosciuto'))
                              }
                            }}
                            className="btn-accent text-xs w-full"
                          >
                            Crea area riservata cliente
                          </button>
                          <p className="text-[10px] text-text-muted mt-1 text-center">
                            Genera un link di accesso personale per il cliente
                          </p>
                        </div>
                      )}

                      {/* Documenti cliente */}
                      {loadingCliente && (
                        <div className="pt-4 border-t border-border text-center">
                          <Loader2 size={16} className="animate-spin mx-auto text-text-muted" />
                        </div>
                      )}

                      {clienteInfo && (
                        <div className="pt-4 border-t border-border space-y-3">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-accent" />
                            <span className="text-xs font-medium text-accent">Area cliente attiva</span>
                          </div>

                          {/* Documenti caricati */}
                          <div>
                            <span className="text-text-muted text-xs font-medium">Documenti ({(clienteInfo.documenti_files || []).length}/{(clienteInfo.documenti_checklist || []).length})</span>
                            <div className="mt-2 space-y-1.5">
                              {(clienteInfo.documenti_checklist || []).map((doc, i) => {
                                const file = (clienteInfo.documenti_files || []).find(f => f.nome === doc.nome)
                                return (
                                  <div key={i} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5">
                                      {doc.completato ? (
                                        <CheckCircle2 size={12} className="text-accent" />
                                      ) : (
                                        <Circle size={12} className="text-border" />
                                      )}
                                      <span className={doc.completato ? 'text-text' : 'text-text-muted'}>{doc.nome}</span>
                                    </div>
                                    {file && (
                                      <button
                                        onClick={async () => {
                                          const sb = getSupabase()
                                          const { data } = await sb.storage
                                            .from('documenti-clienti')
                                            .createSignedUrl(file.file, 3600)
                                          if (data?.signedUrl) window.open(data.signedUrl, '_blank')
                                        }}
                                        className="text-secondary hover:underline flex items-center gap-1"
                                      >
                                        <Download size={10} /> Scarica
                                      </button>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Chat recente */}
                          {(clienteInfo.messaggi_chat || []).length > 0 && (
                            <div>
                              <span className="text-text-muted text-xs font-medium">Ultimi messaggi</span>
                              <div className="mt-1.5 space-y-1.5 max-h-32 overflow-y-auto">
                                {(clienteInfo.messaggi_chat || []).slice(-3).map((msg, i) => (
                                  <div key={i} className="bg-background rounded p-2 text-xs">
                                    <span className="font-medium text-primary">{msg.autore}:</span>
                                    <span className="text-text-light ml-1">{msg.testo}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="card text-center text-text-muted py-12">
                    <Eye size={24} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Seleziona una richiesta per vederne i dettagli</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
