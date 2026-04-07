'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MessageCircle, FileCheck, Clock, CheckCircle2, Circle, ChevronRight, Send, Heart, Upload, FileText, Loader2, PenTool } from 'lucide-react'
import { FirmaDigitale } from '@/components/FirmaDigitale'
import { useAutoTranslate } from '@/lib/useAutoTranslate'
import { useTranslations } from 'next-intl'

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
  const [cliente, setCliente] = useState<ClienteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [errore, setErrore] = useState('')
  const [nuovoMessaggio, setNuovoMessaggio] = useState('')
  const [uploading, setUploading] = useState<string | null>(null)
  const t = useTranslations('cliente')
  const userLang = typeof window !== 'undefined' ? (localStorage.getItem('funerix-lang') || 'it') : 'it'

  const statiTimeline = [
    { key: 'richiesta', label: t('statoRichiesta'), desc: t('statoRichiestaDesc') },
    { key: 'confermata', label: t('statoConfermata'), desc: t('statoConfermataDesc') },
    { key: 'in_corso', label: t('statoInCorso'), desc: t('statoInCorsoDesc') },
    { key: 'completata', label: t('statoCompletata'), desc: t('statoCompletataDesc') },
  ]

  // Auto-translate consultant messages to user's language
  const consulenteMessages = (cliente?.messaggi_chat || [])
    .filter(m => m.autore !== cliente?.nome)
    .map(m => m.testo)
  const translatedConsulente = useAutoTranslate(consulenteMessages, userLang)

  useEffect(() => {
    if (!token) { setErrore(t('linkNonValido')); setLoading(false); return }

    fetch(`/api/cliente?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setCliente(data.cliente)
        else setErrore(t('accessoNonAutorizzato'))
        setLoading(false)
      })
      .catch(() => { setErrore(t('erroreConnessione')); setLoading(false) })
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">{t('caricamentoInCorso')}</p>
        </div>
      </div>
    )
  }

  if (errore || !cliente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="card max-w-md w-full text-center">
          <Heart size={40} className="mx-auto mb-4 text-secondary" />
          <h1 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-3">{t('areaRiservata')}</h1>
          <p className="text-text-light mb-6">{errore || t('accessoNonValido')}</p>
          <Link href="/contatti" className="btn-primary">{t('contattaci')}</Link>
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
      <section className="bg-primary py-10 relative overflow-hidden">
        <Image src="/images/candele.jpg" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-5xl mx-auto px-4">
          <p className="text-white/60 text-sm mb-1">{t('areaRiservataBadge')}</p>
          <h1 className="font-[family-name:var(--font-serif)] text-3xl text-white">
            {t('benvenuti')} {cliente.nome.split(' ').pop()}
          </h1>
          <p className="text-white/80 mt-2">
            {t('seguitoStato')}
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
                {t('statoServizio')}
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
                  {t('riepilogoServizio')}
                </h2>
                <pre className="text-text-light text-sm whitespace-pre-wrap bg-background rounded-lg p-4 mb-4">
                  {richiesta.configurazione}
                </pre>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-text-muted">{t('preventivoIndicativo')}</span>
                  <span className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">
                    &euro; {Number(richiesta.totale).toLocaleString('it-IT')}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-2">
                  {t('prezzoDefinitoDesc')}
                </p>
              </div>
            )}

            {/* Chat con consulente */}
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">
                {t('messaggiConsulente')}
              </h2>
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {(!cliente.messaggi_chat || cliente.messaggi_chat.length === 0) ? (
                  <p className="text-text-muted text-sm text-center py-8">
                    {t('nessunMessaggio')}
                  </p>
                ) : (
                  cliente.messaggi_chat.map((msg, i) => {
                    const isCliente = msg.autore === cliente.nome
                    // Find translated version for consultant messages
                    let displayText = msg.testo
                    if (!isCliente && userLang !== 'it') {
                      const cIdx = (cliente.messaggi_chat || [])
                        .filter(m => m.autore !== cliente.nome)
                        .indexOf(msg)
                      if (cIdx >= 0 && translatedConsulente[cIdx]) {
                        displayText = translatedConsulente[cIdx]
                      }
                    }
                    return (
                    <div key={i} className={`p-3 rounded-lg text-sm ${
                      isCliente
                        ? 'bg-primary/5 border border-primary/10 ml-8'
                        : 'bg-secondary/5 border border-secondary/10 mr-8'
                    }`}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-primary text-xs">{msg.autore}</span>
                        <span className="text-text-muted text-xs">
                          {new Date(msg.data).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-text-light">{displayText}</p>
                    </div>
                  )})
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input-field flex-1"
                  placeholder={t('scriveciMessaggio')}
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
                {t('documentiNecessari')}
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
                          <span>{t('caricatoIl')} {new Date(fileCaricato.data).toLocaleDateString('it-IT')}</span>
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
                                <Loader2 size={12} className="animate-spin" /> {t('caricamentoInCorso')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-secondary-dark cursor-pointer">
                                <Upload size={12} /> {t('caricaDocumento')}
                              </span>
                            )}
                          </label>
                          <p className="text-[10px] text-text-muted mt-1">{t('formatiAccettati')}</p>
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
                      <span>{completati} {t('documentiCaricati')} {totali} {t('documentiCaricatiSuffix')}</span>
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
                {t('firmaMandate')}
              </h2>
              {cliente.dati_defunto && (cliente.dati_defunto as Record<string,string>).firma ? (
                <div className="text-center">
                  <img src={(cliente.dati_defunto as Record<string,string>).firma} alt="Firma" className="mx-auto border border-border rounded h-16" />
                  <p className="text-xs text-accent mt-2 flex items-center justify-center gap-1"><CheckCircle2 size={12} /> {t('firmato')}</p>
                </div>
              ) : (
                <FirmaDigitale onSave={async (dataUrl) => {
                  await fetch('/api/cliente/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, messaggio: '[FIRMA DIGITALE RICEVUTA]', autore: 'Sistema' }),
                  })
                  // Salva nel localStorage per ora (in prod va nel DB)
                  alert(t('firmaSalvata'))
                }} />
              )}
            </div>

            {/* Contatto rapido */}
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">
                {t('contattoRapido')}
              </h2>
              <div className="space-y-3">
                <a href="tel:0815551234" className="flex items-center gap-2 text-sm text-text-light hover:text-primary transition-colors">
                  <Phone size={16} className="text-secondary" /> {t('chiamaConsulente')}
                </a>
                <a href="https://wa.me/393331234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-light hover:text-primary transition-colors">
                  <MessageCircle size={16} className="text-[#25D366]" /> WhatsApp
                </a>
                <a href="mailto:info@funerix.com" className="flex items-center gap-2 text-sm text-text-light hover:text-primary transition-colors">
                  <Mail size={16} className="text-secondary" /> {t('scriveciEmail')}
                </a>
              </div>
            </div>

            {/* Info richiesta */}
            {richiesta && (
              <div className="card">
                <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-3">{t('dettagli')}</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">{t('richiestaDel')}</span>
                    <span className="text-text">{new Date(richiesta.created_at).toLocaleDateString('it-IT')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">{t('modalita')}</span>
                    <span className="text-text">{richiesta.modalita}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">{t('stato')}</span>
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
