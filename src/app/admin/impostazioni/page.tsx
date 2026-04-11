'use client'

import Link from 'next/link'
import { ArrowLeft, Save, MessageCircle, Globe, Loader2, Check } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { useState } from 'react'

export default function AdminImpostazioniPage() {
  const { impostazioni, salvaImpostazioni } = useSitoStore()
  const [form, setForm] = useState(impostazioni)
  const [salvato, setSalvato] = useState(false)

  const handleSalva = () => {
    salvaImpostazioni(form)
    setSalvato(true)
    setTimeout(() => setSalvato(false), 3000)
  }

  const set = (key: string, value: string | number | boolean) => setForm({ ...form, [key]: value })

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Impostazioni</h1>
              <p className="text-text-light text-sm">Dati aziendali e configurazione generale</p>
            </div>
          </div>
          <button onClick={handleSalva} className="btn-accent text-sm">
            <Save size={16} className="mr-2" />
            {salvato ? 'Salvato!' : 'Salva'}
          </button>
        </div>

        <div className="space-y-6">
          {/* WhatsApp — in evidenza */}
          <div className="card border-[#25D366]/30 bg-[#25D366]/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary">WhatsApp Consulente</h2>
                <p className="text-text-muted text-sm">Le richieste dal configuratore verranno inviate a questo numero</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Numero WhatsApp *</label>
                <input
                  type="tel" className="input-field text-lg font-medium"
                  placeholder="393331234567"
                  value={form.whatsapp}
                  onChange={e => set('whatsapp', e.target.value)}
                />
                <p className="text-xs text-text-muted mt-1">
                  Formato internazionale senza +, es: <strong>393331234567</strong> (39 = Italia, poi il numero)
                </p>
              </div>
              <div className="flex items-end">
                <a
                  href={`https://wa.me/${form.whatsapp.replace(/\s/g, '')}?text=Test%20da%20Funerix%20Admin`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm w-full justify-center"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Testa WhatsApp
                </a>
              </div>
            </div>

            {/* WhatsApp Business API */}
            <div className="mt-6 pt-6 border-t border-[#25D366]/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-primary">WhatsApp Business API</h3>
                  <p className="text-text-muted text-xs">
                    Invio automatico senza aprire WhatsApp. Richiede un account Meta Business.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.whatsappBusinessEnabled}
                    onChange={e => set('whatsappBusinessEnabled', e.target.checked)}
                    className="w-5 h-5 rounded border-border"
                  />
                  <span className="text-sm font-medium text-text">
                    {form.whatsappBusinessEnabled ? 'Attiva' : 'Disattiva'}
                  </span>
                </label>
              </div>

              {form.whatsappBusinessEnabled && (
                <div className="space-y-4">
                  <div className="bg-background rounded-lg p-4 text-xs text-text-light leading-relaxed">
                    <p className="font-medium text-primary mb-2">Come configurare:</p>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>Vai su <strong>developers.facebook.com</strong> e crea un&apos;app Business</li>
                      <li>Aggiungi il prodotto <strong>WhatsApp</strong></li>
                      <li>In WhatsApp &gt; Configurazione API, trova il <strong>Phone Number ID</strong></li>
                      <li>Genera un <strong>Token di accesso permanente</strong> con permesso <code>whatsapp_business_messaging</code></li>
                      <li>Incolla i valori qui sotto</li>
                    </ol>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Phone Number ID</label>
                    <input
                      type="text" className="input-field font-mono text-sm"
                      placeholder="Es. 123456789012345"
                      value={form.whatsappBusinessPhoneId}
                      onChange={e => set('whatsappBusinessPhoneId', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Access Token</label>
                    <input
                      type="password" className="input-field font-mono text-sm"
                      placeholder="EAAxxxxxxx..."
                      value={form.whatsappBusinessToken}
                      onChange={e => set('whatsappBusinessToken', e.target.value)}
                    />
                    <p className="text-xs text-text-muted mt-1">Il token non viene mai mostrato per sicurezza</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/whatsapp', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            to: form.whatsapp.replace(/\s/g, ''),
                            message: '✅ Test Funerix — WhatsApp Business API configurata correttamente!',
                            token: form.whatsappBusinessToken,
                            phoneId: form.whatsappBusinessPhoneId,
                          }),
                        })
                        const data = await res.json()
                        if (data.success && !data.fallback) {
                          alert('Messaggio di test inviato con successo!')
                        } else {
                          alert('Errore: ' + JSON.stringify(data.details || data.error))
                        }
                      } catch {
                        alert('Errore di connessione')
                      }
                    }}
                    className="btn-secondary text-sm"
                  >
                    Invia messaggio di test
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dati azienda */}
          <div className="card">
            <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Dati Aziendali</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Ragione sociale</label>
                <input type="text" className="input-field" value={form.ragioneSociale} onChange={e => set('ragioneSociale', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Partita IVA</label>
                <input type="text" className="input-field" placeholder="IT 12345678901" value={form.partitaIva} onChange={e => set('partitaIva', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Telefono</label>
                <input type="tel" className="input-field" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text mb-1">Indirizzo sede</label>
                <input type="text" className="input-field" value={form.indirizzo} onChange={e => set('indirizzo', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">N. Registro Regionale</label>
                <input type="text" className="input-field" placeholder="Iscrizione Registro Campania" value={form.registroRegionale} onChange={e => set('registroRegionale', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">N. Autorizzazione Comunale</label>
                <input type="text" className="input-field" placeholder="Aut. n. XXX/2020" value={form.autorizzazioneComunale} onChange={e => set('autorizzazioneComunale', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Notifiche */}
          <div className="card">
            <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Notifiche</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Email per ricezione richieste</label>
                <input type="email" className="input-field" value={form.emailRichieste} onChange={e => set('emailRichieste', e.target.value)} />
                <p className="text-xs text-text-muted mt-1">Le nuove richieste dal configuratore verranno inviate a questo indirizzo</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Email per notifiche memorial</label>
                <input type="email" className="input-field" value={form.emailMemorial} onChange={e => set('emailMemorial', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Configurazione servizio */}
          <div className="card">
            <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Configurazione Servizio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Km inclusi nel trasporto</label>
                <input type="number" className="input-field" value={form.kmInclusi} onChange={e => set('kmInclusi', Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Costo per km extra</label>
                <input type="number" className="input-field" value={form.costoKmExtra} onChange={e => set('costoKmExtra', Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Comuni serviti</label>
                <textarea rows={2} className="input-field" value={form.comuniServiti} onChange={e => set('comuniServiti', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Orari ufficio</label>
                <input type="text" className="input-field" value={form.orari} onChange={e => set('orari', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Traduzioni */}
          <TraduzioniSection />

          {/* Cosa riceve il consulente */}
          <div className="card bg-primary/5 border-primary/20">
            <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Cosa riceve il consulente?</h2>
            <p className="text-text-light text-sm leading-relaxed mb-4">
              Quando un cliente completa il configuratore e invia la richiesta, si apre automaticamente
              WhatsApp con un messaggio pre-compilato contenente:
            </p>
            <ul className="space-y-2 text-sm text-text-light">
              <li className="flex items-start gap-2"><span className="text-secondary font-bold">1.</span> Nome, telefono ed email del cliente</li>
              <li className="flex items-start gap-2"><span className="text-secondary font-bold">2.</span> Modalit&agrave; di contatto preferita (chiamata, videochiamata, WhatsApp)</li>
              <li className="flex items-start gap-2"><span className="text-secondary font-bold">3.</span> Preferenza orario per essere ricontattato</li>
              <li className="flex items-start gap-2"><span className="text-secondary font-bold">4.</span> Tipo di servizio scelto (inumazione, tumulazione, cremazione)</li>
              <li className="flex items-start gap-2"><span className="text-secondary font-bold">5.</span> Tutti i prodotti selezionati con prezzi (bara, urna, auto, fiori, extra)</li>
              <li className="flex items-start gap-2"><span className="text-secondary font-bold">6.</span> Percorso e dettagli cerimonia</li>
              <li className="flex items-start gap-2"><span className="text-secondary font-bold">7.</span> Totale indicativo del preventivo</li>
              <li className="flex items-start gap-2"><span className="text-secondary font-bold">8.</span> Note aggiuntive del cliente</li>
              <li className="flex items-start gap-2"><span className="text-secondary font-bold">9.</span> Data e ora della richiesta</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function TraduzioniSection() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ testi_totali: number; lingue: { lingua: string; count: number }[] } | null>(null)
  const [error, setError] = useState('')

  const handleAggiorna = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/traduzioni', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Errore durante l\'aggiornamento')
        return
      }
      const data = await res.json()
      setResult(data)
    } catch {
      setError('Errore di connessione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
          <Globe size={20} className="text-secondary" />
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary">Traduzioni</h2>
          <p className="text-text-muted text-sm">Pre-traduci tutte le pagine in 15 lingue</p>
        </div>
      </div>

      <p className="text-text-light text-sm mb-4">
        Cliccate per aggiornare la cache delle traduzioni. Il sistema visiterà tutte le pagine pubbliche,
        estrarrà i testi e li tradurrà in 15 lingue usando Google Translate. Le traduzioni verranno salvate
        nel database per un caricamento istantaneo.
      </p>

      <button
        onClick={handleAggiorna}
        disabled={loading}
        className="btn-primary text-sm disabled:opacity-50"
      >
        {loading ? (
          <><Loader2 size={16} className="mr-2 animate-spin" /> Traduzione in corso... (può richiedere 2-3 minuti)</>
        ) : (
          <><Globe size={16} className="mr-2" /> Aggiorna tutte le traduzioni</>
        )}
      </button>

      {error && (
        <div className="mt-4 bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error">{error}</div>
      )}

      {result && (
        <div className="mt-4 space-y-3">
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 flex items-center gap-2">
            <Check size={16} className="text-accent" />
            <span className="text-sm text-primary font-medium">Completato — {result.testi_totali} testi estratti</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {result.lingue.map(l => (
              <div key={l.lingua} className={`rounded-lg p-2 text-center text-xs ${l.count >= 0 ? 'bg-accent/10' : 'bg-error/10'}`}>
                <p className="font-medium text-primary">{l.lingua.toUpperCase()}</p>
                <p className="text-text-muted">{l.count >= 0 ? `${l.count} nuove` : 'errore'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
