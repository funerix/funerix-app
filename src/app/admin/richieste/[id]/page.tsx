'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase-client'
import { corniciManifesto, fontManifesto } from '@/lib/cornici-manifesto'
import { MappaCimiteri } from '@/components/MappaCimiteri'
import {
  ArrowLeft, Phone, Mail, MessageCircle, Clock, CheckCircle2, Circle,
  FileText, Download, Upload, Send, User, Calendar, MapPin, Euro,
  Loader2, Eye, Edit2, Save, Plus, Trash2, X, Heart
} from 'lucide-react'
import { ChatTranslator } from '@/components/admin/ChatTranslator'

// Auto-translate client messages to Italian for the consultant
function AutoTranslateMessage({ text }: { text: string }) {
  const [translated, setTranslated] = useState<string | null>(null)

  useEffect(() => {
    // Skip if already Italian-looking (simple heuristic)
    const italianChars = /[àèéìòùç]/
    if (/^[a-zA-Z0-9\s.,!?'"àèéìòùç()-]+$/.test(text) && !italianChars.test(text)) {
      // Might be foreign, try translating
      fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: text, targetLang: 'it' }),
      })
        .then(r => r.json())
        .then(d => {
          if (d.translations && d.translations !== text) setTranslated(d.translations)
        })
        .catch(() => {})
    } else if (/[^\x00-\x7F]/.test(text) && !/[àèéìòùç]/.test(text)) {
      // Non-ASCII and not Italian accents → likely foreign script
      fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: text, targetLang: 'it' }),
      })
        .then(r => r.json())
        .then(d => {
          if (d.translations) setTranslated(d.translations)
        })
        .catch(() => {})
    }
  }, [text])

  if (!translated) return null
  return (
    <p className="text-xs text-secondary/70 mt-1 italic border-t border-border/30 pt-1">
      🇮🇹 {translated}
    </p>
  )
}

// Types
interface Richiesta {
  id: string; nome: string; telefono: string; email: string; modalita: string;
  orario: string; note: string; configurazione: string; totale: number;
  stato: string; created_at: string; updated_at: string;
}

interface Cliente {
  id: string; nome: string; email: string; telefono: string; stato_servizio: string;
  dettagli_cerimonia: Record<string, string>;
  documenti_checklist: { nome: string; completato: boolean }[];
  documenti_files: { nome: string; file: string; data: string }[];
  messaggi_chat: { autore: string; testo: string; data: string }[];
  token_accesso: string;
}

interface Comunicazione {
  id: string; tipo: string; contenuto: string; admin_nome: string; created_at: string;
}

const tabs = [
  { id: 'panoramica', label: 'Panoramica', icon: User },
  { id: 'defunto', label: 'Persona cara', icon: Heart },
  { id: 'preventivo', label: 'Preventivo', icon: Euro },
  { id: 'documenti', label: 'Documenti', icon: FileText },
  { id: 'cerimonia', label: 'Cerimonia', icon: Calendar },
  { id: 'comunicazioni', label: 'Comunicazioni', icon: MessageCircle },
]

const statoColori: Record<string, string> = {
  nuova: 'bg-blue-100 text-blue-800',
  in_lavorazione: 'bg-yellow-100 text-yellow-800',
  confermata: 'bg-green-100 text-green-800',
  completata: 'bg-gray-100 text-gray-600',
}

const statiServizio = [
  { key: 'richiesta', label: 'Richiesta ricevuta' },
  { key: 'confermata', label: 'Confermata' },
  { key: 'in_corso', label: 'In preparazione' },
  { key: 'completata', label: 'Completata' },
]

export default function RichiestaDettaglioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [tab, setTab] = useState('panoramica')
  const [richiesta, setRichiesta] = useState<Richiesta | null>(null)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [comunicazioni, setComunicazioni] = useState<Comunicazione[]>([])
  const [loading, setLoading] = useState(true)
  const [nuovaNota, setNuovaNota] = useState('')
  const [nuovoMessaggioChat, setNuovoMessaggioChat] = useState('')
  const [salvato, setSalvato] = useState(false)
  const [dettagliCerimonia, setDettagliCerimonia] = useState<Record<string, string>>({})
  const [vociPreventivo, setVociPreventivo] = useState<{ categoria: string; descrizione: string; prezzo: number }[]>([])
  const [preventivoInizializzato, setPreventivoInizializzato] = useState(false)
  const [datiDefunto, setDatiDefunto] = useState<Record<string, string>>({})
  const [consulenti, setConsulenti] = useState<{ id: string; nome: string }[]>([])
  const [consulenteAssegnato, setConsulenteAssegnato] = useState<string>('')

  // Inizializza voci preventivo dal testo configurazione
  useEffect(() => {
    if (!richiesta || preventivoInizializzato) return
    const righe = richiesta.configurazione.split('\n').filter(Boolean)
    const voci = righe.map(riga => {
      const match = riga.match(/(.+?):\s*(.+?)(?:\s*—\s*€(.+))?$/)
      if (match) return { categoria: match[1].trim(), descrizione: match[2].trim(), prezzo: Number(match[3]) || 0 }
      return { categoria: '', descrizione: riga.trim(), prezzo: 0 }
    })
    setVociPreventivo(voci)
    setPreventivoInizializzato(true)
  }, [richiesta, preventivoInizializzato])

  useEffect(() => {
    const sb = getSupabase()
    Promise.all([
      sb.from('richieste').select('*').eq('id', id).single(),
      sb.from('clienti').select('*').eq('richiesta_id', id).single(),
      sb.from('comunicazioni').select('*').eq('richiesta_id', id).order('created_at', { ascending: false }),
      sb.from('admin_users').select('id, nome').eq('attivo', true).order('nome'),
    ]).then(([reqRes, clienteRes, comRes, consRes]) => {
      if (reqRes.data) {
        setRichiesta(reqRes.data as unknown as Richiesta)
        setConsulenteAssegnato((reqRes.data as unknown as Record<string, string>).consulente_id || '')
      }
      if (consRes.data) setConsulenti((consRes.data as unknown as { id: string; nome: string }[]))
      if (clienteRes.data) {
        setCliente(clienteRes.data as unknown as Cliente)
        setDettagliCerimonia((clienteRes.data as unknown as Cliente).dettagli_cerimonia || {})
        setDatiDefunto(((clienteRes.data as unknown as Record<string, unknown>).dati_defunto as Record<string, string>) || {})
      }
      setComunicazioni((comRes.data || []) as unknown as Comunicazione[])
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark">
      <Loader2 size={24} className="animate-spin text-secondary" />
    </div>
  )

  if (!richiesta) return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark">
      <div className="text-center">
        <p className="text-text-muted mb-4">Richiesta non trovata</p>
        <Link href="/admin/richieste" className="btn-secondary text-sm">Torna alle richieste</Link>
      </div>
    </div>
  )

  const aggiornaStato = async (stato: string) => {
    const sb = getSupabase()
    await sb.from('richieste').update({ stato, updated_at: new Date().toISOString() }).eq('id', id)
    setRichiesta({ ...richiesta, stato })
    // Notifica automatica al cliente se ha email
    if (richiesta.email && cliente) {
      fetch('/api/notifica-stato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ richiestaId: id, stato, email: richiesta.email, nome: richiesta.nome }),
      }).catch(() => {})
    }
  }

  const assegnaPratica = async (consulenteId: string) => {
    const sb = getSupabase()
    await sb.from('richieste').update({ consulente_id: consulenteId || null, updated_at: new Date().toISOString() }).eq('id', id)
    setConsulenteAssegnato(consulenteId)
    const nomeConsulente = consulenti.find(c => c.id === consulenteId)?.nome || 'nessuno'
    // Log attività
    await sb.from('log_attivita').insert({
      user_nome: 'Admin', azione: 'assegna_pratica',
      dettaglio: `Pratica ${richiesta.nome} assegnata a ${nomeConsulente}`,
      richiesta_id: id,
    })
    // Notifica consulente via WhatsApp (se configurato)
    if (consulenteId) {
      fetch('/api/notifica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ richiestaId: id }),
      }).catch(() => {})
    }
  }

  const aggiornaStatoServizio = async (stato: string) => {
    if (!cliente) return
    const sb = getSupabase()
    await sb.from('clienti').update({ stato_servizio: stato }).eq('id', cliente.id)
    setCliente({ ...cliente, stato_servizio: stato })
  }

  const salvaDatiDefunto = async () => {
    if (!cliente) return
    const sb = getSupabase()
    await sb.from('clienti').update({ dati_defunto: datiDefunto }).eq('id', cliente.id)
    setSalvato(true)
    setTimeout(() => setSalvato(false), 2000)
  }

  const salvaDettagliCerimonia = async () => {
    if (!cliente) return
    const sb = getSupabase()
    await sb.from('clienti').update({ dettagli_cerimonia: dettagliCerimonia }).eq('id', cliente.id)
    setSalvato(true)
    setTimeout(() => setSalvato(false), 2000)
  }

  const totalePreventivo = vociPreventivo.reduce((sum, v) => sum + (v.prezzo || 0), 0)

  const salvaPreventivo = async () => {
    const sb = getSupabase()
    const configurazione = vociPreventivo
      .map(v => v.prezzo > 0 ? `${v.categoria}: ${v.descrizione} — €${v.prezzo}` : `${v.categoria}: ${v.descrizione}`)
      .join('\n')
    await sb.from('richieste').update({
      configurazione,
      totale: totalePreventivo,
      updated_at: new Date().toISOString(),
    }).eq('id', id)
    setRichiesta({ ...richiesta!, configurazione, totale: totalePreventivo })
    setSalvato(true)
    setTimeout(() => setSalvato(false), 2000)
  }

  const aggiungiNota = async () => {
    if (!nuovaNota.trim()) return
    const sb = getSupabase()
    const { data } = await sb.from('comunicazioni').insert({
      richiesta_id: id, tipo: 'nota', contenuto: nuovaNota, admin_nome: 'Consulente',
    }).select().single()
    if (data) setComunicazioni([data as unknown as Comunicazione, ...comunicazioni])
    setNuovaNota('')
  }

  const inviaMessaggioChat = async () => {
    if (!nuovoMessaggioChat.trim() || !cliente) return
    const sb = getSupabase()
    const nuoviMsg = [...(cliente.messaggi_chat || []), {
      autore: 'Consulente Funerix', testo: nuovoMessaggioChat, data: new Date().toISOString(),
    }]
    await sb.from('clienti').update({ messaggi_chat: nuoviMsg }).eq('id', cliente.id)
    setCliente({ ...cliente, messaggi_chat: nuoviMsg })
    setNuovoMessaggioChat('')
  }

  const creaAccountCliente = async () => {
    const res = await fetch('/api/cliente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        richiestaId: id, nome: richiesta.nome,
        email: richiesta.email || prompt('Inserisci email del cliente:'),
        telefono: richiesta.telefono,
      }),
    })
    const data = await res.json()
    if (data.success) {
      const link = `${window.location.origin}/cliente?token=${data.token}`
      try { await navigator.clipboard.writeText(link) } catch {}
      prompt('Account creato! Invia questo link al cliente:', link)
      // Ricarica
      const sb = getSupabase()
      const { data: cl } = await sb.from('clienti').select('*').eq('richiesta_id', id).single()
      if (cl) {
        setCliente(cl as unknown as Cliente)
        setDettagliCerimonia((cl as unknown as Cliente).dettagli_cerimonia || {})
      }
    }
  }

  const scaricaDocumento = async (filePath: string) => {
    const sb = getSupabase()
    const { data } = await sb.storage.from('documenti-clienti').createSignedUrl(filePath, 3600)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/richieste" className="text-text-muted hover:text-primary">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-[family-name:var(--font-serif)] text-2xl text-primary">{richiesta.nome}</h1>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statoColori[richiesta.stato]}`}>
                  {richiesta.stato.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-text-muted">
                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(richiesta.created_at).toLocaleString('it-IT')}</span>
                <span className="flex items-center gap-1"><Euro size={14} /> &euro; {richiesta.totale.toLocaleString('it-IT')}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <a href={`tel:${richiesta.telefono}`} className="btn-secondary text-xs py-2 px-3">
              <Phone size={14} className="mr-1" /> {richiesta.telefono}
            </a>
            {richiesta.email && (
              <a href={`mailto:${richiesta.email}`} className="btn-secondary text-xs py-2 px-3">
                <Mail size={14} className="mr-1" /> Email
              </a>
            )}
          </div>
        </div>

        {/* Stato rapido */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['nuova', 'in_lavorazione', 'confermata', 'completata'] as const).map(stato => (
            <button
              key={stato}
              onClick={() => aggiornaStato(stato)}
              className={`text-xs py-2 px-4 rounded-lg font-medium transition-colors ${
                richiesta.stato === stato ? 'bg-primary text-white' : 'bg-surface text-text-light border border-border hover:bg-background'
              }`}
            >
              {stato.replace('_', ' ')}
            </button>
          ))}
          <div className="flex-1" />

          {/* Assegnazione consulente */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Consulente:</span>
            <select
              value={consulenteAssegnato}
              onChange={(e) => assegnaPratica(e.target.value)}
              className="input-field text-xs py-1.5 w-40"
            >
              <option value="">Non assegnato</option>
              {consulenti.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {!cliente && (
            <button onClick={creaAccountCliente} className="btn-accent text-xs py-2 px-4">
              <Plus size={14} className="mr-1" /> Crea area cliente
            </button>
          )}
        </div>

        {/* Area cliente — link e invio */}
        {cliente && (
          <div className="card mb-6 border-accent/20 bg-accent/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-accent" /> Area cliente attiva
                  </p>
                  <code className="text-[10px] text-text-muted bg-surface px-2 py-0.5 rounded mt-0.5 inline-block">
                    {typeof window !== 'undefined' ? window.location.origin : ''}/cliente?token={cliente.token_accesso?.slice(0, 12)}...
                  </code>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const link = `${window.location.origin}/cliente?token=${cliente.token_accesso}`
                    const msg = `Gentile ${richiesta.nome},\n\nEcco il link per accedere alla vostra area riservata Funerix dove potrete seguire lo stato del servizio, caricare i documenti e comunicare con il consulente:\n\n${link}\n\nSiamo a vostra disposizione.\nFunerix`
                    window.open(`https://wa.me/${richiesta.telefono.replace(/\s/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
                  }}
                  className="btn-secondary text-xs py-2 px-3 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                >
                  <MessageCircle size={14} className="mr-1" /> Invia via WhatsApp
                </button>
                {richiesta.email && (
                  <button
                    onClick={() => {
                      const link = `${window.location.origin}/cliente?token=${cliente.token_accesso}`
                      const subject = encodeURIComponent('Funerix — Accesso alla vostra area riservata')
                      const body = encodeURIComponent(`Gentile ${richiesta.nome},\n\nEcco il link per accedere alla vostra area riservata Funerix:\n\n${link}\n\nDa qui potrete:\n- Seguire lo stato del servizio\n- Caricare i documenti necessari\n- Comunicare con il consulente\n- Visualizzare il preventivo\n\nSiamo a vostra disposizione.\nFunerix`)
                      window.open(`mailto:${richiesta.email}?subject=${subject}&body=${body}`, '_blank')
                    }}
                    className="btn-secondary text-xs py-2 px-3"
                  >
                    <Mail size={14} className="mr-1" /> Invia via Email
                  </button>
                )}
                <button
                  onClick={() => {
                    const link = `${window.location.origin}/cliente?token=${cliente.token_accesso}`
                    const msg = encodeURIComponent(`Funerix — Area riservata: ${link}`)
                    window.open(`sms:${richiesta.telefono}?body=${msg}`, '_blank')
                  }}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  <Phone size={14} className="mr-1" /> Invia via SMS
                </button>
                <button
                  onClick={() => {
                    const link = `${window.location.origin}/cliente?token=${cliente.token_accesso}`
                    navigator.clipboard.writeText(link).catch(() => {})
                    prompt('Link copiato! Incollalo dove preferisci:', link)
                  }}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  <Eye size={14} className="mr-1" /> Copia link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-secondary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-light'
              }`}
            >
              <t.icon size={16} />
              {t.label}
              {t.id === 'documenti' && cliente && (
                <span className="ml-1 text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded-full">
                  {(cliente.documenti_files || []).length}/{(cliente.documenti_checklist || []).length}
                </span>
              )}
              {t.id === 'comunicazioni' && comunicazioni.length > 0 && (
                <span className="ml-1 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  {comunicazioni.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab: Panoramica */}
        {tab === 'panoramica' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Colonna sinistra — Info + Configurazione + Totale */}
            <div className="lg:col-span-2 space-y-4">
              {/* Info cliente — compatto */}
              <div className="card py-4">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div><span className="text-text-muted text-xs">Nome</span><p className="font-medium text-primary">{richiesta.nome}</p></div>
                  <div><span className="text-text-muted text-xs">Telefono</span><p className="font-medium text-primary">{richiesta.telefono}</p></div>
                  <div><span className="text-text-muted text-xs">Email</span><p className="font-medium text-primary">{richiesta.email || '—'}</p></div>
                  <div><span className="text-text-muted text-xs">Modalit&agrave;</span><p className="font-medium text-primary">{richiesta.modalita}</p></div>
                  <div><span className="text-text-muted text-xs">Preferenza</span><p className="font-medium text-primary">{richiesta.orario}</p></div>
                  <div><span className="text-text-muted text-xs">Data</span><p className="font-medium text-primary">{new Date(richiesta.created_at).toLocaleDateString('it-IT')}</p></div>
                </div>
                {richiesta.note && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <span className="text-text-muted text-xs">Note</span>
                    <p className="text-text-light text-sm">{richiesta.note}</p>
                  </div>
                )}
              </div>

              {/* Configurazione con scroll */}
              <div className="card py-4">
                <h3 className="text-sm font-medium text-primary mb-2">Configurazione servizio</h3>
                <div className="max-h-48 overflow-y-auto">
                  <pre className="text-text-light text-sm whitespace-pre-wrap bg-background rounded-lg p-3">{richiesta.configurazione}</pre>
                </div>
              </div>

              {/* Totale — sotto la configurazione */}
              <div className="card py-4 bg-primary/5 border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-primary font-bold">Totale preventivo</span>
                  <span className="text-3xl text-primary font-bold">
                    &euro; {richiesta.totale.toLocaleString('it-IT')}
                  </span>
                </div>
              </div>
            </div>

            {/* Colonna destra — Stato + Azioni */}
            <div className="space-y-4">
              {/* Stato servizio */}
              {cliente && (
                <div className="card py-4">
                  <h3 className="text-sm font-medium text-primary mb-3">Stato servizio</h3>
                  <div className="space-y-2">
                    {statiServizio.map((s, i) => {
                      const idx = statiServizio.findIndex(x => x.key === cliente.stato_servizio)
                      const completato = i <= idx
                      return (
                        <button key={s.key} onClick={() => aggiornaStatoServizio(s.key)}
                          className="flex items-center gap-2 w-full text-left py-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            completato ? 'bg-accent text-white' : 'bg-border text-text-muted'
                          }`}>
                            {completato ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                          </div>
                          <span className={`text-xs ${completato ? 'text-primary font-medium' : 'text-text-muted'}`}>{s.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Azioni rapide */}
              <div className="card py-4">
                <h3 className="text-sm font-medium text-primary mb-3">Azioni rapide</h3>
                <div className="space-y-1.5">
                  <a href={`https://wa.me/${richiesta.telefono.replace(/\s/g, '')}?text=Buongiorno ${richiesta.nome.split(' ')[0]}, sono il consulente Funerix.`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-[#25D366] hover:underline py-1">
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                  <a href={`tel:${richiesta.telefono}`} className="flex items-center gap-2 text-xs text-secondary hover:underline py-1">
                    <Phone size={14} /> Chiama
                  </a>
                  {richiesta.email && (
                    <a href={`mailto:${richiesta.email}`} className="flex items-center gap-2 text-xs text-secondary hover:underline py-1">
                      <Mail size={14} /> Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Persona cara */}
        {tab === 'defunto' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary">Dati della persona cara</h2>
              <button onClick={salvaDatiDefunto} className="btn-accent text-xs">
                <Save size={14} className="mr-1" /> {salvato ? 'Salvato!' : 'Salva'}
              </button>
            </div>
            {!cliente ? (
              <p className="text-text-muted text-sm text-center py-8">Crea l&apos;area cliente per registrare i dati</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'nome_defunto', label: 'Nome e Cognome', type: 'text', placeholder: 'Nome completo', span: 'lg:col-span-2' },
                  { key: 'codice_fiscale', label: 'Codice Fiscale', type: 'text', placeholder: 'RSSMRA40C15F839X' },
                  { key: 'data_nascita', label: 'Data di nascita', type: 'date' },
                  { key: 'luogo_nascita', label: 'Luogo di nascita', type: 'text', placeholder: 'Comune e provincia' },
                  { key: 'data_decesso', label: 'Data del decesso', type: 'date' },
                  { key: 'ora_decesso', label: 'Ora del decesso', type: 'time' },
                  { key: 'luogo_decesso', label: 'Luogo del decesso', type: 'text', placeholder: 'Ospedale, abitazione, RSA...' },
                  { key: 'indirizzo_residenza', label: 'Residenza', type: 'text', placeholder: 'Ultimo indirizzo di residenza' },
                  { key: 'comune_residenza', label: 'Comune di residenza', type: 'text', placeholder: 'Comune' },
                  { key: 'stato_civile', label: 'Stato civile', type: 'select', options: ['', 'Celibe/Nubile', 'Coniugato/a', 'Vedovo/a', 'Divorziato/a', 'Separato/a'] },
                  { key: 'nome_coniuge', label: 'Nome coniuge/ex', type: 'text', placeholder: 'Se applicabile' },
                  { key: 'professione', label: 'Professione', type: 'text', placeholder: 'Ultima professione' },
                ].map(campo => (
                  <div key={campo.key} className={campo.span || ''}>
                    <label className="block text-xs font-medium text-text mb-1">{campo.label}</label>
                    {campo.type === 'select' ? (
                      <select
                        className="input-field text-sm"
                        value={datiDefunto[campo.key] || ''}
                        onChange={e => setDatiDefunto({ ...datiDefunto, [campo.key]: e.target.value })}
                      >
                        {campo.options!.map(opt => (
                          <option key={opt} value={opt}>{opt || 'Seleziona...'}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={campo.type}
                        className="input-field text-sm"
                        placeholder={campo.placeholder || ''}
                        value={datiDefunto[campo.key] || ''}
                        onChange={e => setDatiDefunto({ ...datiDefunto, [campo.key]: e.target.value })}
                      />
                    )}
                  </div>
                ))}

                {/* Soprannome / Detto */}
                <div className="md:col-span-2 lg:col-span-3 pt-4 border-t border-border mt-2">
                  <h3 className="text-sm font-medium text-primary mb-3">Per il manifesto funebre</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text mb-1">Soprannome / Detto</label>
                      <input type="text" className="input-field text-sm" placeholder="Es. detto 'o scienziat"
                        value={datiDefunto.soprannome || ''}
                        onChange={e => setDatiDefunto({ ...datiDefunto, soprannome: e.target.value })}
                      />
                      <p className="text-[10px] text-text-muted mt-1">Apparir&agrave; sul manifesto come &ldquo;detto...&rdquo;</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text mb-1">Et&agrave;</label>
                      <input type="text" className="input-field text-sm" placeholder="Es. 86 anni"
                        value={datiDefunto.eta || ''}
                        onChange={e => setDatiDefunto({ ...datiDefunto, eta: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text mb-1">Titolo/Appellativo</label>
                      <input type="text" className="input-field text-sm" placeholder="Es. Cav., Dott., Prof."
                        value={datiDefunto.titolo || ''}
                        onChange={e => setDatiDefunto({ ...datiDefunto, titolo: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Manifesto funebre */}
                <div className="md:col-span-2 lg:col-span-3 pt-4 border-t border-border mt-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-primary">Manifesto funebre</h3>
                    <div className="flex gap-2">
                      {cliente && (
                        <>
                          <button onClick={() => {
                            const url = `${window.location.origin}/manifesto/${cliente.id}`
                            const nome = datiDefunto.nome_defunto || richiesta.nome
                            const msg = `In ricordo di ${nome}.\nVedi il manifesto: ${url}`
                            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
                          }} className="text-[10px] py-1 px-2 border border-[#25D366] text-[#25D366] rounded hover:bg-[#25D366] hover:text-white transition-colors inline-flex items-center gap-1">
                            <MessageCircle size={10} /> WhatsApp
                          </button>
                          <button onClick={() => {
                            const url = `${window.location.origin}/manifesto/${cliente.id}`
                            const nome = datiDefunto.nome_defunto || richiesta.nome
                            window.open(`mailto:?subject=${encodeURIComponent(`In ricordo di ${nome}`)}&body=${encodeURIComponent(`Manifesto funebre: ${url}`)}`, '_blank')
                          }} className="text-[10px] py-1 px-2 border border-border text-text-light rounded hover:bg-background transition-colors inline-flex items-center gap-1">
                            <Mail size={10} /> Email
                          </button>
                          <button onClick={() => window.open(`/manifesto/${cliente.id}`, '_blank')}
                            className="text-[10px] py-1 px-2 border border-border text-text-light rounded hover:bg-background transition-colors inline-flex items-center gap-1">
                            <Eye size={10} /> Vedi
                          </button>
                          <button onClick={() => {
                            import('@/lib/genera-pdf').then(({ generaPDFManifesto }) => generaPDFManifesto(datiDefunto))
                          }} className="text-[10px] py-1 px-2 border border-border text-text-light rounded hover:bg-background transition-colors inline-flex items-center gap-1">
                            <Download size={10} /> PDF
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Scelta cornice immagine */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-text mb-2">Cornice manifesto</label>
                    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 max-h-40 overflow-y-auto p-1">
                      {corniciManifesto.map(c => (
                        <button key={c.id} onClick={() => setDatiDefunto({ ...datiDefunto, manifesto_cornice: c.id })}
                          className={`p-1 rounded-lg text-center transition-all ${
                            (datiDefunto.manifesto_cornice || '01') === c.id
                              ? 'ring-2 ring-secondary bg-secondary/5'
                              : 'hover:bg-background border border-border'
                          }`}>
                          <img src={c.img} alt={c.nome} className="w-full aspect-[10/7] object-contain rounded" />
                          <span className="text-[8px] text-text-muted leading-tight block mt-0.5">{c.nome}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font + Dimensione + Agenzia */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-text mb-1">Font</label>
                      <select className="input-field text-xs" value={datiDefunto.manifesto_font || 'serif'}
                        onChange={e => setDatiDefunto({ ...datiDefunto, manifesto_font: e.target.value })}>
                        {fontManifesto.map(f => (
                          <option key={f.id} value={f.id} style={{ fontFamily: f.family }}>{f.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text mb-1">Dimensione testo</label>
                      <select className="input-field text-xs" value={datiDefunto.manifesto_size || 'normal'}
                        onChange={e => setDatiDefunto({ ...datiDefunto, manifesto_size: e.target.value })}>
                        <option value="small">Piccolo</option>
                        <option value="normal">Normale</option>
                        <option value="large">Grande</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text mb-1">Agenzia</label>
                      <input type="text" className="input-field text-xs" placeholder="Funerix"
                        value={datiDefunto.agenzia_nome || 'Funerix'}
                        onChange={e => setDatiDefunto({ ...datiDefunto, agenzia_nome: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Anteprima con cornice immagine */}
                  {(() => {
                    const cornice = corniciManifesto.find(c => c.id === (datiDefunto.manifesto_cornice || '01')) || corniciManifesto[0]
                    const font = fontManifesto.find(f => f.id === (datiDefunto.manifesto_font || 'serif')) || fontManifesto[0]
                    const sizeMap: Record<string, string> = { small: '0.75rem', normal: '0.875rem', large: '1rem' }
                    const nameSize: Record<string, string> = { small: '1.1rem', normal: '1.35rem', large: '1.6rem' }
                    const sz = datiDefunto.manifesto_size || 'normal'
                    return (
                      <div className="relative mb-4" style={{ aspectRatio: '10/7' }}>
                        <img src={cornice.img} alt="" className="absolute inset-0 w-full h-full" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 md:p-16 text-center"
                          style={{ fontFamily: font.family }}>
                          <p style={{ fontSize: '1.2rem' }}>&#x271D;</p>
                          <p style={{ fontSize: nameSize[sz], fontWeight: 700, color: '#2C3E50', lineHeight: 1.3, marginTop: 4 }}>
                            {datiDefunto.titolo && <span>{datiDefunto.titolo} </span>}
                            {datiDefunto.nome_defunto || 'Nome Cognome'}
                          </p>
                          {datiDefunto.soprannome && (
                            <p style={{ fontSize: sizeMap[sz], color: '#8B7355', fontStyle: 'italic', marginTop: 2 }}>
                              detto &ldquo;{datiDefunto.soprannome}&rdquo;
                            </p>
                          )}
                          {datiDefunto.eta && <p style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: 2 }}>di anni {datiDefunto.eta}</p>}
                          <div style={{ width: 40, height: 1, background: '#8B7355', margin: '8px 0' }} />
                          <p style={{ fontSize: sizeMap[sz], color: '#333', lineHeight: 1.5 }}>
                            {datiDefunto.manifesto_testo || 'I familiari tutti ne danno il triste annuncio.'}
                          </p>
                          {datiDefunto.manifesto_familiari && (
                            <p style={{ fontSize: sizeMap[sz], color: '#6B7280', fontStyle: 'italic', marginTop: 6, lineHeight: 1.4 }}>
                              {datiDefunto.manifesto_familiari}
                            </p>
                          )}
                          {datiDefunto.manifesto_cerimonia && (
                            <p style={{ fontSize: sizeMap[sz], color: '#2C3E50', fontWeight: 500, marginTop: 8 }}>
                              {datiDefunto.manifesto_cerimonia}
                            </p>
                          )}
                          {/* Agenzia in basso a destra */}
                          <p style={{ position: 'absolute', bottom: 12, right: 16, fontSize: '0.55rem', color: '#9CA3AF' }}>
                            {datiDefunto.agenzia_nome || 'Funerix'}
                          </p>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Campi testo */}
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text mb-1">Testo principale</label>
                      <textarea rows={2} className="input-field text-sm"
                        placeholder="Es. I familiari tutti ne danno il triste annuncio."
                        value={datiDefunto.manifesto_testo || ''}
                        onChange={e => setDatiDefunto({ ...datiDefunto, manifesto_testo: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text mb-1">Elenco familiari (per il manifesto)</label>
                      <textarea rows={2} className="input-field text-sm"
                        placeholder="Es. Lo piangono la moglie Maria, i figli Giuseppe e Anna..."
                        value={datiDefunto.manifesto_familiari || ''}
                        onChange={e => setDatiDefunto({ ...datiDefunto, manifesto_familiari: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text mb-1">Info cerimonia (per il manifesto)</label>
                      <textarea rows={2} className="input-field text-sm"
                        placeholder="Es. I funerali avranno luogo il giorno 5 aprile alle ore 10:00..."
                        value={datiDefunto.manifesto_cerimonia || ''}
                        onChange={e => setDatiDefunto({ ...datiDefunto, manifesto_cerimonia: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Familiari — dinamici */}
                <div className="md:col-span-2 lg:col-span-3 pt-4 border-t border-border mt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-primary">Familiari di riferimento</h3>
                    <button
                      onClick={() => {
                        const n = parseInt(datiDefunto.familiari_count || '0') + 1
                        setDatiDefunto({ ...datiDefunto, familiari_count: String(n) })
                      }}
                      className="text-secondary text-xs hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> Aggiungi familiare
                    </button>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {Array.from({ length: Math.max(2, parseInt(datiDefunto.familiari_count || '2')) }).map((_, i) => (
                      <div key={i} className="grid grid-cols-4 gap-2 items-end">
                        <div>
                          <label className="block text-[10px] text-text-muted mb-0.5">{i === 0 ? 'Nome' : ''}</label>
                          <input type="text" className="input-field text-xs py-1.5" placeholder="Nome e Cognome"
                            value={datiDefunto[`fam_${i}_nome`] || ''}
                            onChange={e => setDatiDefunto({ ...datiDefunto, [`fam_${i}_nome`]: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-text-muted mb-0.5">{i === 0 ? 'Parentela' : ''}</label>
                          <input type="text" className="input-field text-xs py-1.5" placeholder="Figlio, moglie..."
                            value={datiDefunto[`fam_${i}_parentela`] || ''}
                            onChange={e => setDatiDefunto({ ...datiDefunto, [`fam_${i}_parentela`]: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-text-muted mb-0.5">{i === 0 ? 'Telefono' : ''}</label>
                          <input type="tel" className="input-field text-xs py-1.5" placeholder="333..."
                            value={datiDefunto[`fam_${i}_tel`] || ''}
                            onChange={e => setDatiDefunto({ ...datiDefunto, [`fam_${i}_tel`]: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-text-muted mb-0.5">{i === 0 ? 'Email' : ''}</label>
                          <input type="email" className="input-field text-xs py-1.5" placeholder="email@..."
                            value={datiDefunto[`fam_${i}_email`] || ''}
                            onChange={e => setDatiDefunto({ ...datiDefunto, [`fam_${i}_email`]: e.target.value })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div className="md:col-span-2 lg:col-span-3 pt-4 border-t border-border mt-2">
                  <label className="block text-xs font-medium text-text mb-1">Note e informazioni aggiuntive</label>
                  <textarea rows={2} className="input-field text-sm"
                    placeholder="Patologie, indicazioni per la vestizione, oggetti personali..."
                    value={datiDefunto.note_defunto || ''}
                    onChange={e => setDatiDefunto({ ...datiDefunto, note_defunto: e.target.value })}
                  />
                </div>

                {/* Memorial + Donazioni */}
                <div className="md:col-span-2 lg:col-span-3 pt-4 border-t border-border mt-2">
                  <h3 className="text-sm font-medium text-primary mb-3">Memorial e Donazioni</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text mb-1">Breve biografia (per il memorial)</label>
                      <textarea rows={3} className="input-field text-sm"
                        placeholder="Una breve descrizione della vita e della personalità..."
                        value={datiDefunto.biografia || ''}
                        onChange={e => setDatiDefunto({ ...datiDefunto, biografia: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-text mb-1">Luogo di sepoltura</label>
                        <input type="text" className="input-field text-sm" placeholder="Cimitero, sezione, lotto..."
                          value={datiDefunto.luogo_sepoltura || ''}
                          onChange={e => setDatiDefunto({ ...datiDefunto, luogo_sepoltura: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text mb-1">Descrizione donazione</label>
                        <input type="text" className="input-field text-sm"
                          placeholder="Es. In memoria di Maria, devolvere alla Fondazione..."
                          value={datiDefunto.donazione_descrizione || ''}
                          onChange={e => setDatiDefunto({ ...datiDefunto, donazione_descrizione: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text mb-1">URL / IBAN donazioni</label>
                        <input type="text" className="input-field text-sm" placeholder="https://... o IBAN"
                          value={datiDefunto.donazione_url || ''}
                          onChange={e => setDatiDefunto({ ...datiDefunto, donazione_url: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Condivisione donazione */}
                  {datiDefunto.donazione_url && (
                    <div className="mt-4 p-3 bg-secondary/5 border border-secondary/20 rounded-lg">
                      <p className="text-xs font-medium text-primary mb-2">Condividi link donazione</p>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => {
                          const msg = `In memoria di ${datiDefunto.nome_defunto || richiesta.nome}, ${datiDefunto.donazione_descrizione || 'la famiglia chiede di devolvere eventuali offerte'}.\n\n${datiDefunto.donazione_url}`
                          window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
                        }} className="btn-secondary text-[10px] py-1.5 px-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white">
                          <MessageCircle size={12} className="mr-1" /> WhatsApp
                        </button>
                        <button onClick={() => {
                          const subject = encodeURIComponent(`In memoria di ${datiDefunto.nome_defunto || richiesta.nome}`)
                          const body = encodeURIComponent(`${datiDefunto.donazione_descrizione || 'La famiglia chiede di devolvere eventuali offerte in memoria del caro defunto.'}.\n\n${datiDefunto.donazione_url}`)
                          window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
                        }} className="btn-secondary text-[10px] py-1.5 px-2">
                          <Mail size={12} className="mr-1" /> Email
                        </button>
                        <button onClick={() => {
                          navigator.clipboard.writeText(datiDefunto.donazione_url || '').catch(() => {})
                          prompt('Link donazione copiato:', datiDefunto.donazione_url)
                        }} className="btn-secondary text-[10px] py-1.5 px-2">
                          <Eye size={12} className="mr-1" /> Copia link
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Preventivo */}
        {tab === 'preventivo' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary">Dettaglio preventivo</h2>
                <button onClick={salvaPreventivo} className="btn-accent text-xs">
                  <Save size={14} className="mr-1" /> {salvato ? 'Salvato!' : 'Salva modifiche'}
                </button>
              </div>

              {/* Voci editabili */}
              <div className="space-y-2">
                {vociPreventivo.map((voce, i) => (
                  <div key={i} className="flex items-center gap-2 bg-background rounded-lg p-3">
                    <input
                      type="text"
                      className="input-field text-xs py-2 w-28 flex-shrink-0"
                      placeholder="Categoria"
                      value={voce.categoria}
                      onChange={e => {
                        const copia = [...vociPreventivo]
                        copia[i] = { ...copia[i], categoria: e.target.value }
                        setVociPreventivo(copia)
                      }}
                    />
                    <input
                      type="text"
                      className="input-field text-xs py-2 flex-1"
                      placeholder="Descrizione prodotto/servizio"
                      value={voce.descrizione}
                      onChange={e => {
                        const copia = [...vociPreventivo]
                        copia[i] = { ...copia[i], descrizione: e.target.value }
                        setVociPreventivo(copia)
                      }}
                    />
                    <div className="relative flex-shrink-0 w-24">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">&euro;</span>
                      <input
                        type="number"
                        className="input-field text-xs py-2 pl-7 text-right"
                        placeholder="0"
                        value={voce.prezzo || ''}
                        onChange={e => {
                          const copia = [...vociPreventivo]
                          copia[i] = { ...copia[i], prezzo: Number(e.target.value) || 0 }
                          setVociPreventivo(copia)
                        }}
                      />
                    </div>
                    <button
                      onClick={() => setVociPreventivo(vociPreventivo.filter((_, j) => j !== i))}
                      className="p-2 text-text-muted hover:text-error transition-colors flex-shrink-0"
                      title="Rimuovi"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Aggiungi voce */}
              <button
                onClick={() => setVociPreventivo([...vociPreventivo, { categoria: '', descrizione: '', prezzo: 0 }])}
                className="mt-3 flex items-center gap-1.5 text-secondary text-sm hover:underline"
              >
                <Plus size={14} /> Aggiungi voce al preventivo
              </button>

              {/* Totale */}
              <div className="mt-6 pt-4 border-t-2 border-primary flex justify-between items-center">
                <span className="text-xl text-primary font-bold">Totale</span>
                <span className="text-2xl text-primary font-bold">
                  &euro; {totalePreventivo.toLocaleString('it-IT')}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-3">
                Preventivo indicativo. Le modifiche vengono salvate nel database e il cliente le vedr&agrave; nella sua area riservata.
              </p>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-3">Riepilogo</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Voci</span>
                    <span className="text-primary font-medium">{vociPreventivo.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Totale originale</span>
                    <span className="text-text-light">&euro; {richiesta.totale.toLocaleString('it-IT')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-text-muted font-medium">Totale attuale</span>
                    <span className="text-primary font-bold">&euro; {totalePreventivo.toLocaleString('it-IT')}</span>
                  </div>
                  {totalePreventivo !== richiesta.totale && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Differenza</span>
                      <span className={`font-medium ${totalePreventivo > richiesta.totale ? 'text-error' : 'text-accent'}`}>
                        {totalePreventivo > richiesta.totale ? '+' : ''}&euro; {(totalePreventivo - richiesta.totale).toLocaleString('it-IT')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="card text-center">
                  <FileText size={24} className="mx-auto mb-2 text-secondary" />
                  <h3 className="text-sm font-medium text-primary mb-2">Esporta PDF</h3>
                  <button onClick={() => {
                    import('@/lib/genera-pdf').then(({ generaPDFPreventivo }) => {
                      generaPDFPreventivo({
                        nomeCliente: richiesta.nome,
                        configurazione: richiesta.configurazione,
                        totale: totalePreventivo,
                        data: new Date(richiesta.created_at).toLocaleDateString('it-IT'),
                        agenzia: datiDefunto.agenzia_nome,
                      })
                    })
                  }} className="btn-secondary text-xs w-full">
                    Scarica preventivo PDF
                  </button>
                </div>
                <div className="card text-center">
                  <Euro size={24} className="mx-auto mb-2 text-secondary" />
                  <h3 className="text-sm font-medium text-primary mb-2">Pagamento</h3>
                  <p className="text-text-muted text-[10px] mb-2">Stripe in arrivo</p>
                  <button disabled className="btn-secondary text-xs w-full opacity-50 cursor-not-allowed">
                    Crea link pagamento
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Documenti */}
        {tab === 'documenti' && (
          <div className="card">
            <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-6">Documenti cliente</h2>
            {!cliente ? (
              <div className="text-center py-12">
                <FileText size={32} className="mx-auto mb-3 text-text-muted opacity-30" />
                <p className="text-text-muted mb-4">Crea prima l&apos;area cliente per gestire i documenti</p>
                <button onClick={creaAccountCliente} className="btn-accent text-sm">Crea area cliente</button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {(cliente.documenti_checklist || []).map((doc, i) => {
                  const file = (cliente.documenti_files || []).find(f => f.nome === doc.nome)
                  return (
                    <div key={i} className={`border rounded-lg p-4 ${doc.completato ? 'border-accent/30 bg-accent/5' : 'border-border'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {doc.completato ? (
                            <CheckCircle2 size={20} className="text-accent" />
                          ) : (
                            <Circle size={20} className="text-border" />
                          )}
                          <div>
                            <p className="font-medium text-primary">{doc.nome}</p>
                            {file && (
                              <p className="text-xs text-text-muted mt-0.5">
                                Caricato dal cliente il {new Date(file.data).toLocaleString('it-IT')}
                              </p>
                            )}
                            {!file && <p className="text-xs text-text-muted mt-0.5">In attesa di caricamento dal cliente</p>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {file && (
                            <button onClick={() => scaricaDocumento(file.file)} className="btn-secondary text-xs py-1.5 px-3">
                              <Download size={14} className="mr-1" /> Scarica
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Progresso */}
                {(() => {
                  const docs = cliente.documenti_checklist || []
                  const completati = docs.filter(d => d.completato).length
                  return (
                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="flex justify-between text-sm text-text-muted mb-2">
                        <span>{completati} di {docs.length} documenti ricevuti</span>
                        <span>{docs.length > 0 ? Math.round((completati / docs.length) * 100) : 0}%</span>
                      </div>
                      <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${docs.length > 0 ? (completati / docs.length) * 100 : 0}%` }} />
                      </div>
                    </div>
                  )
                })()}

                {/* Link area cliente */}
                {cliente.token_accesso && (
                  <div className="mt-4 p-3 bg-background rounded-lg text-xs text-text-muted">
                    Link area cliente: <code className="bg-surface px-2 py-1 rounded text-[10px]">
                      {window.location.origin}/cliente?token={cliente.token_accesso}
                    </code>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab: Comunicazioni */}
        {tab === 'comunicazioni' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Note interne */}
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">Note interne</h2>
              <div className="flex gap-2 mb-4">
                <input type="text" className="input-field flex-1 text-sm" placeholder="Aggiungi nota..."
                  value={nuovaNota} onChange={e => setNuovaNota(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && aggiungiNota()}
                />
                <button onClick={aggiungiNota} className="btn-primary text-sm px-4"><Plus size={16} /></button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {comunicazioni.length === 0 ? (
                  <p className="text-text-muted text-sm text-center py-6">Nessuna nota ancora</p>
                ) : comunicazioni.map(c => (
                  <div key={c.id} className="bg-background rounded-lg p-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-primary text-xs">{c.admin_nome}</span>
                      <span className="text-text-muted text-xs">{new Date(c.created_at).toLocaleString('it-IT')}</span>
                    </div>
                    <p className="text-text-light">{c.contenuto}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat con cliente */}
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">
                Chat con il cliente
              </h2>
              {!cliente ? (
                <p className="text-text-muted text-sm text-center py-6">Crea l&apos;area cliente per attivare la chat</p>
              ) : (
                <>
                  <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                    {(cliente.messaggi_chat || []).length === 0 ? (
                      <p className="text-text-muted text-sm text-center py-6">Nessun messaggio</p>
                    ) : (cliente.messaggi_chat || []).map((msg, i) => {
                      const isConsulente = msg.autore.includes('Consulente') || msg.autore.includes('Funerix')
                      return (
                      <div key={i} className={`p-3 rounded-lg text-sm ${
                        isConsulente ? 'bg-secondary/5 border border-secondary/10 ml-6' : 'bg-background mr-6'
                      }`}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-primary text-xs">{msg.autore}</span>
                          <span className="text-text-muted text-[10px]">
                            {new Date(msg.data).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-text-light">{msg.testo}</p>
                        {!isConsulente && <AutoTranslateMessage text={msg.testo} />}
                      </div>
                    )})}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" className="input-field flex-1 text-sm" placeholder="Scrivi al cliente..."
                      value={nuovoMessaggioChat} onChange={e => setNuovoMessaggioChat(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && inviaMessaggioChat()}
                    />
                    <button onClick={inviaMessaggioChat} className="btn-accent text-sm px-4"><Send size={16} /></button>
                  </div>
                </>
              )}
            </div>

            {/* Traduttore */}
            <ChatTranslator />
          </div>
        )}

        {/* Tab: Cerimonia */}
        {tab === 'cerimonia' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary">Dettagli cerimonia</h2>
              <button onClick={salvaDettagliCerimonia} className="btn-accent text-xs">
                <Save size={14} className="mr-1" /> {salvato ? 'Salvato!' : 'Salva'}
              </button>
            </div>
            {!cliente ? (
              <p className="text-text-muted text-sm text-center py-8">Crea l&apos;area cliente per gestire i dettagli cerimonia</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'data_cerimonia', label: 'Data cerimonia', type: 'date' },
                  { key: 'ora_cerimonia', label: 'Orario', type: 'time' },
                  { key: 'luogo_cerimonia', label: 'Luogo cerimonia', type: 'text', placeholder: 'Chiesa, cappella, sala...' },
                  { key: 'indirizzo_cerimonia', label: 'Indirizzo', type: 'text', placeholder: 'Via...' },
                  { key: 'cimitero', label: 'Cimitero/Crematorio', type: 'text', placeholder: 'Nome e indirizzo' },
                  { key: 'tipo_cerimonia', label: 'Tipo cerimonia', type: 'text', placeholder: 'Cattolica, laica, altra...' },
                  { key: 'celebrante', label: 'Celebrante', type: 'text', placeholder: 'Nome sacerdote/celebrante' },
                  { key: 'musica', label: 'Musica', type: 'text', placeholder: 'Brani scelti, organista...' },
                  { key: 'partenza', label: 'Luogo partenza corteo', type: 'text', placeholder: 'Abitazione, ospedale...' },
                  { key: 'note_cerimonia', label: 'Note aggiuntive', type: 'text', placeholder: 'Richieste particolari...' },
                ].map(campo => (
                  <div key={campo.key}>
                    <label className="block text-sm font-medium text-text mb-1">{campo.label}</label>
                    <input
                      type={campo.type}
                      className="input-field text-sm"
                      placeholder={(campo as { placeholder?: string }).placeholder || ''}
                      value={dettagliCerimonia[campo.key] || ''}
                      onChange={e => setDettagliCerimonia({ ...dettagliCerimonia, [campo.key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-text-muted mt-4">
              Questi dettagli saranno visibili al cliente nella sua area riservata.
            </p>

            {/* Mappa cimiteri — strumento per il consulente */}
            <div className="mt-6 pt-4 border-t border-border">
              <h3 className="text-sm font-medium text-primary mb-3">Mappa cimiteri e crematori</h3>
              <div className="h-64 rounded-lg overflow-hidden">
                <MappaCimiteri />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
