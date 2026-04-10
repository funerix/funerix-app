'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, RotateCcw, Send, Dog, Cat, Rabbit, Bird, PawPrint } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { StepIndicator } from './StepIndicatorGeneric'

const STEPS = ['Animale', 'Taglia', 'Servizio', 'Urna', 'Ritiro', 'Riepilogo', 'Contatto']

const animali = [
  { id: 'cane', label: 'Cane', icon: Dog },
  { id: 'gatto', label: 'Gatto', icon: Cat },
  { id: 'coniglio', label: 'Coniglio', icon: Rabbit },
  { id: 'uccello', label: 'Uccello', icon: Bird },
  { id: 'altro', label: 'Altro', icon: PawPrint },
]

const taglieInfo: Record<string, { label: string; desc: string }> = {
  piccolo: { label: 'Piccola taglia', desc: 'Fino a 10 kg' },
  medio: { label: 'Media taglia', desc: '10 — 25 kg' },
  grande: { label: 'Grande taglia', desc: 'Oltre 25 kg' },
}

// Specie con una sola taglia (auto-selezionata come piccolo)
const specieSingolaAlpha = ['gatto', 'coniglio', 'uccello']

export function ConfiguratoreAnimale({ embedded = false }: { embedded?: boolean } = {}) {
  const { impostazioni } = useSitoStore()
  const [step, setStep] = useState(1)
  const [animale, setAnimale] = useState('')
  const [taglia, setTaglia] = useState('')
  const [tipo, setTipo] = useState('')
  const [urnaId, setUrnaId] = useState('')
  const [improntaZampa, setImprontaZampa] = useState(false)
  const [ritiro, setRitiro] = useState('')
  const [inviato, setInviato] = useState(false)
  const [tempoAttesa, setTempoAttesa] = useState('')
  const [mostraOrario, setMostraOrario] = useState(false)
  const [animaleNome, setAnimaleNome] = useState('')

  // Dati dal DB
  const [prezziDb, setPrezziDb] = useState<any[]>([])
  const [prodottiDb, setProdottiDb] = useState<any[]>([])
  const [loadingDb, setLoadingDb] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/pet/prezzi').then(r => r.json()),
      fetch('/api/pet/prodotti').then(r => r.json()),
    ]).then(([prezzi, prodotti]) => {
      if (Array.isArray(prezzi)) setPrezziDb(prezzi)
      if (Array.isArray(prodotti)) setProdottiDb(prodotti)
      setLoadingDb(false)
    }).catch(() => setLoadingDb(false))
  }, [])

  // Trova prezzo corrente
  const getPrezzo = (specie: string, tag: string, tipoCrem: string) => {
    return prezziDb.find(p => p.specie === specie && p.taglia === tag && p.tipo_cremazione === tipoCrem)
  }

  const prezzoCorrente = getPrezzo(animale, taglia, tipo)
  const prezzoCremazione = prezzoCorrente?.prezzo || 0
  const prezzoRitiroDom = prezzoCorrente?.ritiro_domicilio_prezzo || 60
  const prezzoImpronta = prezzoCorrente?.impronta_zampa_prezzo || 40

  const urne = prodottiDb.filter(p => p.categoria === 'urna' || p.categoria === 'cofanetto')
  const urnaObj = prodottiDb.find(p => p.id === urnaId)

  const ritiroPrezzo = ritiro === 'domicilio' ? prezzoRitiroDom : 0
  const improntaPrezzo = improntaZampa ? prezzoImpronta : 0
  const totale = prezzoCremazione + (urnaObj?.prezzo || 0) + ritiroPrezzo + improntaPrezzo

  // Taglie disponibili per la specie selezionata
  const taglieDisponibili = [...new Set(prezziDb.filter(p => p.specie === animale).map(p => p.taglia))]

  const next = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => Math.min(STEPS.length, s + 1)) }
  const prev = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => Math.max(1, s - 1)) }
  const reset = () => { setStep(1); setAnimale(''); setTaglia(''); setTipo(''); setUrnaId(''); setRitiro(''); setImprontaZampa(false); setAnimaleNome('') }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const nome = (form.querySelector('[name=nome]') as HTMLInputElement)?.value
    const tel = (form.querySelector('[name=telefono]') as HTMLInputElement)?.value
    const email = (form.querySelector('[name=email]') as HTMLInputElement)?.value || ''
    let orario = (form.querySelector('[name=orario]') as HTMLSelectElement)?.value || ''
    if (orario === 'orario_specifico') {
      orario = `Alle ore ${(form.querySelector('[name=orario_spec]') as HTMLInputElement)?.value || ''}`
    }
    const modalita = (form.querySelector('input[name=modalita]:checked') as HTMLInputElement)?.value || 'telefonata'

    // Crea ordine via API
    await fetch('/api/pet/ordini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente: { nome, telefono: tel, email },
        animale_nome: animaleNome || animale,
        specie: animale,
        taglia,
        tipo_cremazione: tipo,
        urna_id: urnaId || null,
        impronta_zampa: improntaZampa,
        ritiro_tipo: ritiro === 'domicilio' ? 'domicilio' : 'struttura',
        totale,
        note_cliente: `Modalita: ${modalita}, Orario: ${orario}`,
      }),
    })

    // Anche nel vecchio sistema richieste per compatibilita notifiche
    const config = [
      `🐾 CREMAZIONE ANIMALE`,
      `Animale: ${animaleNome || animale} (${animale})`,
      `Taglia: ${taglieInfo[taglia]?.label || taglia}`,
      `Cremazione: ${tipo}`,
      tipo === 'individuale' && urnaObj ? `Urna: ${urnaObj.nome} — €${urnaObj.prezzo}` : '',
      improntaZampa ? `Impronta zampa: Sì — €${prezzoImpronta}` : '',
      `Ritiro: ${ritiro === 'domicilio' ? `A domicilio — €${prezzoRitiroDom}` : 'Presso struttura'}`,
      'Pagamento: immediato',
    ].filter(Boolean).join('\n')

    await useSitoStore.getState().aggiungiRichiesta({
      nome, telefono: tel, email, modalita, orario, note: 'Cremazione animale',
      configurazione: config, totale, stato: 'nuova', createdAt: new Date().toISOString(),
    })

    setTempoAttesa(orario)
    setInviato(true)
  }

  if (loadingDb) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (inviato) return (
    <div className={embedded ? '' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'}>
      <div className="card text-center py-12 max-w-lg mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center"><Check size={32} className="text-accent" /></div>
        <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">Richiesta inviata</h2>
        <p className="text-text-light">Un nostro consulente vi contatter&agrave; <strong>{tempoAttesa.toLowerCase()}</strong>.</p>
        <p className="font-[family-name:var(--font-serif)] text-xl text-primary font-bold mt-3">&euro; {totale}</p>
      </div>
    </div>
  )

  return (
    <div className={embedded ? '' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'}>
      {/* Hero mini */}
      <div className="relative bg-primary rounded-2xl overflow-hidden mb-8">
        <Image src="/images/config-animali-hero.jpg" alt="" fill className="object-cover opacity-25" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 to-primary/60" />
        <div className="relative text-center py-10 px-6">
          <PawPrint size={28} className="mx-auto mb-3 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-white">Cremazione Animale Domestico</h1>
          <p className="mt-2 text-white/80 text-sm max-w-lg mx-auto">Un ultimo saluto dignitoso per il vostro compagno di vita.</p>
        </div>
      </div>

      <StepIndicator steps={STEPS} current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {/* Step 1: Tipo animale */}
              {step === 1 && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Tipo di animale</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
                    {animali.map(a => (
                      <div key={a.id} onClick={() => {
                        setAnimale(a.id)
                        if (specieSingolaAlpha.includes(a.id)) { setTaglia('piccolo'); setStep(3) }
                        else next()
                      }}
                        className={animale===a.id ? 'product-card-selected text-center py-5' : 'product-card text-center py-5'}>
                        <a.icon size={28} className="mx-auto mb-2 text-secondary" />
                        <span className="font-medium text-primary text-sm">{a.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="text-sm text-text-muted">Nome del vostro animale (opzionale)</label>
                    <input type="text" value={animaleNome} onChange={e => setAnimaleNome(e.target.value)} placeholder="Es. Luna, Rex..." className="input-field mt-1" />
                  </div>
                </div>
              )}

              {/* Step 2: Taglia (solo per specie con piu taglie) */}
              {step === 2 && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Taglia</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {taglieDisponibili.map(t => {
                      const info = taglieInfo[t] || { label: t, desc: '' }
                      const prezzo = getPrezzo(animale, t, 'individuale')
                      return (
                        <div key={t} onClick={() => setTaglia(t)}
                          className={taglia===t ? 'product-card-selected text-center py-5 md:py-8' : 'product-card text-center py-5 md:py-8'}>
                          <span className="block font-medium text-primary">{info.label}</span>
                          <p className="text-text-light text-xs">{info.desc}</p>
                          {prezzo && <span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">da &euro; {prezzo.prezzo}</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Tipo cremazione */}
              {step === 3 && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Tipo di cremazione</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {['individuale', 'collettiva'].map(t => {
                      const prezzo = getPrezzo(animale, taglia, t)
                      return (
                        <div key={t} onClick={() => { setTipo(t); if (t === 'collettiva') setUrnaId('') }}
                          className={tipo===t ? 'product-card-selected text-center py-5 md:py-8' : 'product-card text-center py-5 md:py-8'}>
                          <span className="block font-medium text-primary capitalize">{t === 'individuale' ? 'Cremazione individuale' : 'Cremazione collettiva'}</span>
                          <p className="text-text-light text-xs">{t === 'individuale' ? 'Con restituzione ceneri' : 'Senza restituzione ceneri'}</p>
                          {prezzo && <span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">&euro; {prezzo.prezzo}</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Urna (solo individuale) */}
              {step === 4 && tipo === 'individuale' && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Scelta urna</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {urne.map(u => (
                      <div key={u.id} onClick={() => setUrnaId(u.id)}
                        className={urnaId===u.id ? 'product-card-selected text-center py-5' : 'product-card text-center py-5'}>
                        <span className="block font-medium text-primary">{u.nome}</span>
                        <p className="text-text-light text-xs">{u.materiale || u.descrizione}</p>
                        <span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">&euro; {u.prezzo}</span>
                      </div>
                    ))}
                    <div onClick={() => setUrnaId('')}
                      className={!urnaId ? 'product-card-selected text-center py-5' : 'product-card text-center py-5'}>
                      <span className="block font-medium text-primary">Nessuna urna</span>
                      <p className="text-text-light text-xs">Contenitore standard</p>
                      <span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">Incluso</span>
                    </div>
                  </div>
                  {/* Impronta zampa */}
                  {prezzoImpronta > 0 && (
                    <label className="flex items-center gap-3 mt-6 card p-4 cursor-pointer">
                      <input type="checkbox" checked={improntaZampa} onChange={e => setImprontaZampa(e.target.checked)} className="w-5 h-5 rounded" />
                      <div className="flex-1">
                        <span className="font-medium text-primary">Impronta della zampa</span>
                        <p className="text-text-muted text-xs">Calco in ceramica della zampa del vostro compagno</p>
                      </div>
                      <span className="font-[family-name:var(--font-serif)] text-primary font-semibold">+ &euro; {prezzoImpronta}</span>
                    </label>
                  )}
                </div>
              )}
              {step === 4 && tipo === 'collettiva' && (
                <div className="text-center py-8">
                  <p className="text-text-light mb-4">Cremazione collettiva: nessuna urna necessaria.</p>
                  <button onClick={next} className="btn-primary">Avanti</button>
                </div>
              )}

              {/* Step 5: Ritiro */}
              {step === 5 && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Ritiro</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div onClick={() => setRitiro('domicilio')}
                      className={ritiro==='domicilio' ? 'product-card-selected text-center py-5 md:py-8' : 'product-card text-center py-5 md:py-8'}>
                      <span className="block font-medium text-primary">Ritiro a domicilio</span>
                      <p className="text-text-light text-xs">Veniamo noi a casa vostra</p>
                      <span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">&euro; {prezzoRitiroDom}</span>
                    </div>
                    <div onClick={() => setRitiro('struttura')}
                      className={ritiro==='struttura' ? 'product-card-selected text-center py-5 md:py-8' : 'product-card text-center py-5 md:py-8'}>
                      <span className="block font-medium text-primary">Portate voi</span>
                      <p className="text-text-light text-xs">Consegna presso la nostra struttura</p>
                      <span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">Gratuito</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Riepilogo */}
              {step === 6 && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Riepilogo</h2>
                  <div className="space-y-3">
                    <Row label="Animale" value={`${animaleNome || animale} (${animale})`} />
                    <Row label="Taglia" value={taglieInfo[taglia]?.label || taglia} onEdit={() => setStep(2)} />
                    <Row label="Cremazione" value={tipo} prezzo={prezzoCremazione} onEdit={() => setStep(3)} />
                    {tipo==='individuale' && urnaObj && <Row label="Urna" value={urnaObj.nome} prezzo={urnaObj.prezzo} onEdit={() => setStep(4)} />}
                    {improntaZampa && <Row label="Impronta zampa" value="Sì" prezzo={prezzoImpronta} onEdit={() => setStep(4)} />}
                    <Row label="Ritiro" value={ritiro === 'domicilio' ? 'A domicilio' : 'Presso struttura'} prezzo={ritiroPrezzo} onEdit={() => setStep(5)} />
                    <div className="border-t-2 border-primary pt-4 flex justify-between items-center">
                      <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-bold">Totale indicativo</span>
                      <span className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">&euro; {totale}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Contatto */}
              {step === 7 && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">Richiesta di contatto</h2>
                  <p className="text-text-light mb-6">Un consulente vi accompagner&agrave; con delicatezza in ogni fase.</p>
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-text mb-3">Come preferite essere contattati? *</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[{v:'telefonata',l:'Chiamata'},{v:'videochiamata',l:'Videochiamata'},{v:'whatsapp',l:'WhatsApp'}].map(o=>(
                          <label key={o.v} className="cursor-pointer"><input type="radio" name="modalita" value={o.v} className="peer sr-only" required />
                          <div className="product-card py-3 text-center peer-checked:border-secondary peer-checked:border-2 peer-checked:bg-secondary/5">
                            <span className="text-sm font-medium text-primary">{o.l}</span></div></label>))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-text mb-1">Nome *</label><input name="nome" required className="input-field" /></div>
                      <div><label className="block text-sm font-medium text-text mb-1">Telefono *</label><input name="telefono" required className="input-field" /></div>
                      <div><label className="block text-sm font-medium text-text mb-1">Email</label><input name="email" type="email" className="input-field" /></div>
                      <div><label className="block text-sm font-medium text-text mb-1">Quando contattarvi? *</label>
                        <select name="orario" required className="input-field" onChange={e=>setMostraOrario(e.target.value==='orario_specifico')}>
                          <option value="">Selezionate...</option><option value="Entro 30 minuti">Entro 30 minuti</option>
                          <option value="Entro 1 ora">Entro 1 ora</option><option value="Entro 2 ore">Entro 2 ore</option>
                          <option value="orario_specifico">Orario specifico</option>
                        </select></div>
                      {mostraOrario && <div><label className="block text-sm font-medium text-text mb-1">Orario</label><input name="orario_spec" type="time" required className="input-field" /></div>}
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" required className="w-5 h-5 mt-0.5 rounded" />
                      <span className="text-sm text-text-light">Acconsento al trattamento dei dati personali ai sensi del GDPR. *</span></label>
                    <button type="submit" className="btn-accent w-full py-4"><Send size={16} className="mr-2" /> Invia Richiesta</button>
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-center">
                      <p className="text-primary font-medium text-sm">Un consulente vi contatter&agrave; nei tempi scelti. Disponibili 24/7.</p>
                    </div>
                  </form>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-10">
            <button onClick={prev} disabled={step===1} className="btn-secondary disabled:opacity-30"><ChevronLeft size={18} className="mr-1" /> Indietro</button>
            <button onClick={reset} className="text-text-muted hover:text-error text-sm flex items-center gap-1"><RotateCcw size={14} /> Ricomincia</button>
            {step < STEPS.length && step !== 1 && <button onClick={next} className="btn-primary">Avanti <ChevronRight size={18} className="ml-1" /></button>}
          </div>
        </div>

        {/* Sidebar riepilogo */}
        <div className="hidden lg:block">
          <div className="sticky top-24 card">
            <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">Il tuo preventivo</h3>
            <div className="space-y-3 text-sm">
              {animale && <SItem label="Animale" value={animaleNome || animale} />}
              {taglia && <SItem label="Taglia" value={taglieInfo[taglia]?.label || taglia} />}
              {tipo && <SItem label="Cremazione" value={tipo} prezzo={prezzoCremazione} />}
              {urnaObj && <SItem label="Urna" value={urnaObj.nome} prezzo={urnaObj.prezzo} />}
              {improntaZampa && <SItem label="Impronta zampa" value="Sì" prezzo={prezzoImpronta} />}
              {ritiro && <SItem label="Ritiro" value={ritiro === 'domicilio' ? 'A domicilio' : 'Struttura'} prezzo={ritiroPrezzo} />}
              {totale > 0 && <div className="border-t border-border pt-3 flex justify-between font-semibold text-primary">
                <span>Totale</span><span className="font-[family-name:var(--font-serif)] text-lg">&euro; {totale}</span></div>}
              {totale === 0 && <p className="text-text-muted text-xs italic">Le scelte appariranno qui.</p>}
              <p className="text-[10px] text-text-muted mt-4 border-t border-border pt-3">Preventivo indicativo. Non costituisce proposta contrattuale.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, prezzo, onEdit }: { label: string; value?: string|null; prezzo?: number; onEdit?: ()=>void }) {
  return <div className="flex items-center justify-between py-3 border-b border-border">
    <div><span className="text-xs text-text-muted uppercase tracking-wider">{label}</span><p className="text-text font-medium capitalize">{value||'—'}</p></div>
    <div className="flex items-center gap-4">{prezzo!=null && prezzo > 0 && <span className="font-[family-name:var(--font-serif)] text-lg text-primary">&euro; {prezzo}</span>}
    {onEdit&&<button onClick={onEdit} className="text-secondary text-sm hover:underline">Modifica</button>}</div></div>
}

function SItem({ label, value, prezzo }: { label: string; value: string; prezzo?: number }) {
  return <div className="flex justify-between items-start gap-2">
    <div className="min-w-0"><span className="text-text-muted text-xs">{label}</span><p className="text-text truncate capitalize">{value}</p></div>
    {prezzo!=null && prezzo > 0 && <span className="text-primary font-medium whitespace-nowrap">&euro; {prezzo}</span>}</div>
}
