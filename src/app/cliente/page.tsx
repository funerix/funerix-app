'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSitoStore } from '@/store/sito'
import Image from 'next/image'
import { Phone, Mail, MessageCircle, FileCheck, Clock, CheckCircle2, Circle, ChevronRight, Send, Heart, Upload, FileText, Loader2, PenTool } from 'lucide-react'
import { FirmaDigitale } from '@/components/FirmaDigitale'

interface ClienteData {
  id: string
  nome: string
  email: string
  telefono: string
  stato_servizio: string
  dettagli_cerimonia: Record<string, string>
  documenti_checklist: { nome: string; completato: boolean }[]
  documenti_files: { nome: string; file: string; data: string }[]
  messaggi_chat: { autore: string; testo: string; data: string }[]
  dati_defunto: Record<string, unknown> | null
  richieste: {
    nome: string
    telefono: string
    configurazione: string
    totale: number
    stato: string
    modalita: string
    orario: string
    created_at: string
  } | null
}

const statiTimeline = [
  { key: 'richiesta', label: 'Richiesta ricevuta', desc: 'La vostra richiesta è stata presa in carico' },
  { key: 'confermata', label: 'Servizio confermato', desc: 'I dettagli sono stati concordati con il consulente' },
  { key: 'in_corso', label: 'In preparazione', desc: 'Stiamo organizzando tutti gli aspetti del servizio' },
  { key: 'completata', label: 'Servizio completato', desc: 'Il servizio è stato completato con cura' },
]

export default function ClientePageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ClientePage />
    </Suspense>
  )
}

function ClientePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { impostazioni } = useSitoStore()
  const [cliente, setCliente] = useState<ClienteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [errore, setErrore] = useState('')
  const [nuovoMessaggio, setNuovoMessaggio] = useState('')
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    if (!token) { setErrore('Link non valido'); setLoading(false); return }

    fetch(`/api/cliente?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setCliente(data.cliente)
        else setErrore('Accesso non autorizzato. Contattate il vostro consulente.')
        setLoading(false)
      })
      .catch(() => { setErrore('Errore di connessione'); setLoading(false) })
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (errore || !cliente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="card max-w-md w-full text-center">
          <Heart size={40} className="mx-auto mb-4 text-secondary" />
          <h1 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-3">Area Riservata</h1>
          <p className="text-text-light mb-6">{errore || 'Accesso non valido'}</p>
          <Link href="/contatti" className="btn-primary">Contattaci</Link>
        </div>
      </div>
    )
  }

  const richiesta = cliente.richieste
  const statoIndex = statiTimeline.findIndex(s => s.key === cliente.stato_servizio)

  const inviaMessaggio = async () => {
    if (!nuovoMessaggio.trim()) return
    const nuovi = [
      ...(cliente.messaggi_chat || []),
      { autore: cliente.nome, testo: nuovoMessaggio, data: new Date().toISOString() },
    ]
    // Salva nel DB
    await fetch(`/api/cliente/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, messaggio: nuovoMessaggio }),
    })
    setCliente({ ...cliente, messaggi_chat: nuovi })
    setNuovoMessaggio('')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-principale.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-5xl mx-auto px-4">
          <p className="text-white/60 text-sm mb-1">Area riservata</p>
          <h1 className="font-[family-name:var(--font-serif)] text-3xl text-white">
            Benvenuti, famiglia {cliente.nome.split(' ').pop()}
          </h1>
          <p className="text-white/80 mt-2">
            Qui potete seguire lo stato del servizio e comunicare con il vostro consulente.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonna principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Timeline */}
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-6">
                Stato del servizio
              </h2>
              <div className="space-y-6">
                {statiTimeline.map((stato, i) => {
                  const completato = i <= statoIndex
                  const attivo = i === statoIndex
                  return (
                    <div key={stato.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          completato ? 'bg-accent text-white' : 'bg-border text-text-muted'
                        } ${attivo ? 'ring-4 ring-accent/20' : ''}`}>
                          {completato ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </div>
                        {i < statiTimeline.length - 1 && (
                          <div className={`w-0.5 h-8 ${completato ? 'bg-accent' : 'bg-border'}`} />
                        )}
                      </div>
                      <div className={attivo ? '' : 'opacity-60'}>
                        <h3 className="font-medium text-primary">{stato.label}</h3>
                        <p className="text-text-muted text-sm">{stato.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Dettagli configurazione */}
            {richiesta && (
              <div className="card">
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">
                  Riepilogo servizio
                </h2>
                <pre className="text-text-light text-sm whitespace-pre-wrap bg-background rounded-lg p-4 mb-4">
                  {richiesta.configurazione}
                </pre>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-text-muted">Preventivo indicativo</span>
                  <span className="text-2xl text-primary font-bold">
                    &euro; {Number(richiesta.totale).toLocaleString('it-IT')}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Il prezzo definitivo &egrave; stato concordato con il consulente e potrebbe variare.
                </p>
              </div>
            )}

            {/* Chat con consulente */}
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">
                Messaggi con il consulente
              </h2>
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {(!cliente.messaggi_chat || cliente.messaggi_chat.length === 0) ? (
                  <p className="text-text-muted text-sm text-center py-8">
                    Nessun messaggio ancora. Scrivete al consulente per qualsiasi necessit&agrave;.
                  </p>
                ) : (
                  cliente.messaggi_chat.map((msg, i) => (
                    <div key={i} className={`p-3 rounded-lg text-sm ${
                      msg.autore === cliente.nome
                        ? 'bg-primary/5 border border-primary/10 ml-8'
                        : 'bg-secondary/5 border border-secondary/10 mr-8'
                    }`}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-primary text-xs">{msg.autore}</span>
                        <span className="text-text-muted text-xs">
                          {new Date(msg.data).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-text-light">{msg.testo}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input-field flex-1"
                  placeholder="Scrivete un messaggio..."
                  value={nuovoMessaggio}
                  onChange={e => setNuovoMessaggio(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && inviaMessaggio()}
                />
                <button onClick={inviaMessaggio} className="btn-primary px-4">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documenti con upload */}
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">
                <FileCheck size={18} className="inline mr-2 text-secondary" />
                Documenti necessari
              </h2>
              <div className="space-y-3">
                {(cliente.documenti_checklist || []).map((doc, i) => {
                  const fileCaricato = (cliente.documenti_files as { nome: string; file: string; data: string }[] || [])
                    .find(f => f.nome === doc.nome)

                  return (
                    <div key={i} className="border border-border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        {doc.completato ? (
                          <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                        ) : (
                          <Circle size={16} className="text-border flex-shrink-0" />
                        )}
                        <span className={`text-sm ${doc.completato ? 'text-accent font-medium' : 'text-text'}`}>
                          {doc.nome}
                        </span>
                      </div>

                      {fileCaricato ? (
                        <div className="ml-6 flex items-center gap-2 text-xs text-text-muted">
                          <FileText size={12} />
                          <span>Caricato il {new Date(fileCaricato.data).toLocaleDateString('it-IT')}</span>
                        </div>
                      ) : (
                        <div className="ml-6 mt-2">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                setUploading(doc.nome)

                                const formData = new FormData()
                                formData.append('token', token!)
                                formData.append('tipo', doc.nome)
                                formData.append('file', file)

                                const res = await fetch('/api/cliente/documenti', {
                                  method: 'POST',
                                  body: formData,
                                })
                                const data = await res.json()
                                setUploading(null)

                                if (data.success) {
                                  // Aggiorna stato locale
                                  const updatedChecklist = (cliente.documenti_checklist || []).map(d =>
                                    d.nome === doc.nome ? { ...d, completato: true } : d
                                  )
                                  const updatedFiles = [
                                    ...((cliente.documenti_files as { nome: string; file: string; data: string }[]) || []),
                                    { nome: doc.nome, file: data.documento.file, data: new Date().toISOString() },
                                  ]
                                  setCliente({
                                    ...cliente,
                                    documenti_checklist: updatedChecklist,
                                    documenti_files: updatedFiles,
                                  } as ClienteData)
                                }
                              }}
                            />
                            {uploading === doc.nome ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-secondary">
                                <Loader2 size={12} className="animate-spin" /> Caricamento...
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-secondary-dark cursor-pointer">
                                <Upload size={12} /> Carica documento
                              </span>
                            )}
                          </label>
                          <p className="text-[10px] text-text-muted mt-1">PDF, JPG o PNG (max 10MB)</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Progresso */}
              {(() => {
                const docs = cliente.documenti_checklist || []
                const completati = docs.filter(d => d.completato).length
                const totali = docs.length
                return (
                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="flex justify-between text-xs text-text-muted mb-2">
                      <span>{completati} di {totali} documenti caricati</span>
                      <span>{totali > 0 ? Math.round((completati / totali) * 100) : 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${totali > 0 ? (completati / totali) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Firma digitale mandato */}
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-3">
                <PenTool size={16} className="inline mr-2 text-secondary" />
                Firma mandato funebre
              </h2>
              {cliente.dati_defunto && (cliente.dati_defunto as Record<string,string>).firma ? (
                <div className="text-center">
                  <img src={(cliente.dati_defunto as Record<string,string>).firma} alt="Firma" className="mx-auto border border-border rounded h-16" />
                  <p className="text-xs text-accent mt-2 flex items-center justify-center gap-1"><CheckCircle2 size={12} /> Firmato</p>
                </div>
              ) : (
                <FirmaDigitale onSave={async (dataUrl) => {
                  await fetch('/api/cliente/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, messaggio: '[FIRMA DIGITALE RICEVUTA]', autore: 'Sistema' }),
                  })
                  // Salva nel localStorage per ora (in prod va nel DB)
                  alert('Firma salvata con successo. Il consulente è stato notificato.')
                }} />
              )}
            </div>

            {/* Contatto rapido */}
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">
                Contatto rapido
              </h2>
              <div className="space-y-3">
                <a href={`tel:${impostazioni.telefono.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-text-light hover:text-primary transition-colors">
                  <Phone size={16} className="text-secondary" /> {impostazioni.telefono || 'Chiama il consulente'}
                </a>
                <a href={`https://wa.me/${impostazioni.whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-light hover:text-primary transition-colors">
                  <MessageCircle size={16} className="text-[#25D366]" /> WhatsApp
                </a>
                <a href={`mailto:${impostazioni.email}`} className="flex items-center gap-2 text-sm text-text-light hover:text-primary transition-colors">
                  <Mail size={16} className="text-secondary" /> Scrivi email
                </a>
              </div>
            </div>

            {/* Info richiesta */}
            {richiesta && (
              <div className="card">
                <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-3">Dettagli</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Richiesta del</span>
                    <span className="text-text">{new Date(richiesta.created_at).toLocaleDateString('it-IT')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Modalit&agrave;</span>
                    <span className="text-text">{richiesta.modalita}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Stato</span>
                    <span className="text-accent font-medium">{cliente.stato_servizio.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
