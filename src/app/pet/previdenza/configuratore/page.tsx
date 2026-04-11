'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, RotateCcw, Send, Dog, Cat, Rabbit, Bird, PawPrint, Shield, CreditCard, Building2 } from 'lucide-react'
import { StepIndicator } from '@/components/configuratore/StepIndicatorGeneric'

const STEPS = ['Animale', 'Taglia', 'Cremazione', 'Urna', 'Extra', 'Rate', 'Riepilogo', 'Dati e Pagamento']

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

const specieSingolaAlpha = ['gatto', 'coniglio', 'uccello']

export default function ConfiguratorePrevidenzaPet() {
  const [step, setStep] = useState(1)
  const [animale, setAnimale] = useState('')
  const [animaleNome, setAnimaleNome] = useState('')
  const [taglia, setTaglia] = useState('')
  const [tipo, setTipo] = useState('individuale')
  const [urnaId, setUrnaId] = useState('')
  const [improntaZampa, setImprontaZampa] = useState(false)
  const [ritiroDomicilio, setRitiroDomicilio] = useState(true)
  const [numRate, setNumRate] = useState(12)
  const [metodoPagamento, setMetodoPagamento] = useState<'carta' | 'iban'>('carta')
  const [indirizzo, setIndirizzo] = useState('')
  const [citta, setCitta] = useState('')
  const [modalitaAttivazione, setModalitaAttivazione] = useState<'subito' | 'consulente'>('subito')
  const [inviato, setInviato] = useState(false)

  // DB data
  const [prezziDb, setPrezziDb] = useState<any[]>([])
  const [prodottiDb, setProdottiDb] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/pet/prezzi').then(r => r.json()),
      fetch('/api/pet/prodotti').then(r => r.json()),
    ]).then(([prezzi, prodotti]) => {
      if (Array.isArray(prezzi)) setPrezziDb(prezzi)
      if (Array.isArray(prodotti)) setProdottiDb(prodotti)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Calcoli
  const specieDb = animale === 'cane' ? 'cane' : animale === 'gatto' ? 'gatto' : 'altro'
  const tagliaDb = taglia || 'piccolo'
  const prezzoObj = prezziDb.find(p => p.specie === specieDb && p.taglia === tagliaDb && p.tipo_cremazione === tipo)
  const prezzoCremazione = prezzoObj ? Number(prezzoObj.prezzo) : 0
  const prezzoRitiroDom = prezzoObj ? Number(prezzoObj.ritiro_domicilio_prezzo) : 60
  const prezzoImpronta = prezzoObj ? Number(prezzoObj.impronta_zampa_prezzo) : 40

  const urne = prodottiDb.filter(p => p.categoria === 'urna' || p.categoria === 'cofanetto')
  const urnaObj = prodottiDb.find(p => p.id === urnaId)

  const totale = prezzoCremazione + (urnaObj?.prezzo || 0) + (ritiroDomicilio ? prezzoRitiroDom : 0) + (improntaZampa ? prezzoImpronta : 0)
  const rataMensile = numRate === 1 ? totale : Math.ceil((totale / numRate) * 100) / 100

  const taglieDisponibili = [...new Set(prezziDb.filter(p => p.specie === specieDb).map(p => p.taglia))]

  const next = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => Math.min(STEPS.length, s + 1)) }
  const prev = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => Math.max(1, s - 1)) }
  const reset = () => { setStep(1); setAnimale(''); setAnimaleNome(''); setTaglia(''); setTipo('individuale'); setUrnaId(''); setImprontaZampa(false); setRitiroDomicilio(true); setNumRate(12) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const nome = (form.querySelector('[name=nome]') as HTMLInputElement).value
    const telefono = (form.querySelector('[name=telefono]') as HTMLInputElement).value
    const email = (form.querySelector('[name=email]') as HTMLInputElement).value

    // Crea piano previdenza pet
    await fetch('/api/pet/previdenza', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_nome: nome, cliente_telefono: telefono, cliente_email: email,
        animale_nome: animaleNome || animale, specie: animale, taglia,
        tipo_cremazione: tipo, urna_id: urnaId || null,
        totale, num_rate: numRate,
        note: `Metodo: ${metodoPagamento}, Impronta: ${improntaZampa ? 'Si' : 'No'}, Ritiro: ${ritiroDomicilio ? 'Domicilio' : 'Struttura'}`,
      }),
    })

    // Anche nel sistema richieste per notifica admin
    await fetch('/api/richieste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome, telefono, email, modalita: 'previdenza_pet', orario: 'Quando possibile',
        note: `PREVIDENZA PET — ${animaleNome || animale} (${animale}/${taglia}) — ${numRate} rate da €${rataMensile} — Metodo: ${metodoPagamento}`,
        configurazione: `Piano Previdenza Pet\nAnimale: ${animaleNome || animale} (${animale})\nTaglia: ${taglieInfo[taglia]?.label || taglia}\nCremazione: ${tipo}\n${urnaObj ? `Urna: ${urnaObj.nome} — €${urnaObj.prezzo}` : 'Nessuna urna'}\n${improntaZampa ? `Impronta zampa: €${prezzoImpronta}` : ''}\nRitiro: ${ritiroDomicilio ? `Domicilio — €${prezzoRitiroDom}` : 'Struttura'}\n\nTotale: €${totale}\nRate: ${numRate} x €${rataMensile}/mese\nMetodo: ${metodoPagamento === 'carta' ? 'Carta di credito' : 'Addebito IBAN'}`,
        totale, stato: 'nuova', createdAt: new Date().toISOString(),
      }),
    })

    setInviato(true)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (inviato) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="card text-center py-12 max-w-lg mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center"><Check size={32} className="text-accent" /></div>
        <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">Piano Previdenza Attivato!</h2>
        <p className="text-text-light mb-4">Un consulente vi contatter&agrave; per confermare il piano e attivare il pagamento.</p>
        <div className="bg-secondary/10 rounded-xl p-4 mb-4">
          <p className="text-secondary font-medium">{numRate} rate da &euro; {rataMensile}/mese</p>
          <p className="text-text-muted text-sm">Totale: &euro; {totale} — Zero interessi</p>
        </div>
        <p className="text-text-muted text-xs">Riceverete un&apos;email con il riepilogo del piano e le istruzioni per il pagamento.</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero mini */}
      <div className="relative bg-primary rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 to-primary/60" />
        <div className="relative text-center py-8 px-6">
          <Shield size={24} className="mx-auto mb-2 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-xl md:text-2xl text-white">Piano Previdenza Pet</h1>
          <p className="mt-1 text-white/80 text-sm">Configurate il servizio e scegliete come pagare. Zero interessi.</p>
        </div>
      </div>

      <StepIndicator steps={STEPS} current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {/* Step 1: Animale */}
              {step === 1 && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Per quale animale volete pianificare?</h2>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
                    {animali.map(a => (
                      <div key={a.id} onClick={() => { setAnimale(a.id); if (specieSingolaAlpha.includes(a.id)) { setTaglia('piccolo'); setStep(3) } else next() }}
                        className={animale === a.id ? 'product-card-selected text-center py-5' : 'product-card text-center py-5'}>
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

              {/* Step 2: Taglia */}
              {step === 2 && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Taglia</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {taglieDisponibili.map(t => {
                      const info = taglieInfo[t] || { label: t, desc: '' }
                      const prezzo = prezziDb.find(p => p.specie === specieDb && p.taglia === t && p.tipo_cremazione === 'individuale')
                      return (
                        <div key={t} onClick={() => setTaglia(t)}
                          className={taglia === t ? 'product-card-selected text-center py-6' : 'product-card text-center py-6'}>
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
                      const prezzo = prezziDb.find(p => p.specie === specieDb && p.taglia === tagliaDb && p.tipo_cremazione === t)
                      return (
                        <div key={t} onClick={() => { setTipo(t); if (t === 'collettiva') setUrnaId('') }}
                          className={tipo === t ? 'product-card-selected text-center py-6' : 'product-card text-center py-6'}>
                          <span className="block font-medium text-primary capitalize">{t === 'individuale' ? 'Cremazione individuale' : 'Cremazione collettiva'}</span>
                          <p className="text-text-light text-xs">{t === 'individuale' ? 'Con restituzione ceneri' : 'Senza restituzione ceneri'}</p>
                          {prezzo && <span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">&euro; {prezzo.prezzo}</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Urna */}
              {step === 4 && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{tipo === 'individuale' ? 'Scelta urna' : 'Nessuna urna necessaria'}</h2>
                  {tipo === 'individuale' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        {urne.map(u => (
                          <div key={u.id} onClick={() => setUrnaId(u.id)}
                            className={urnaId === u.id ? 'product-card-selected text-center py-5' : 'product-card text-center py-5'}>
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
                      {prezzoImpronta > 0 && (
                        <label className="flex items-center gap-3 mt-6 card p-4 cursor-pointer">
                          <input type="checkbox" checked={improntaZampa} onChange={e => setImprontaZampa(e.target.checked)} className="w-5 h-5 rounded" />
                          <div className="flex-1">
                            <span className="font-medium text-primary">Impronta della zampa</span>
                            <p className="text-text-muted text-xs">Calco in ceramica</p>
                          </div>
                          <span className="font-[family-name:var(--font-serif)] text-primary font-semibold">+ &euro; {prezzoImpronta}</span>
                        </label>
                      )}
                    </>
                  ) : (
                    <p className="text-text-light text-center py-8">Cremazione collettiva: nessuna urna necessaria.</p>
                  )}
                </div>
              )}

              {/* Step 5: Ritiro + Indirizzo */}
              {step === 5 && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Ritiro e indirizzo</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div onClick={() => setRitiroDomicilio(true)}
                      className={ritiroDomicilio ? 'product-card-selected text-center py-6' : 'product-card text-center py-6'}>
                      <span className="block font-medium text-primary">Ritiro a domicilio</span>
                      <p className="text-text-light text-xs">Veniamo noi quando il momento arriva</p>
                      <span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">&euro; {prezzoRitiroDom}</span>
                    </div>
                    <div onClick={() => setRitiroDomicilio(false)}
                      className={!ritiroDomicilio ? 'product-card-selected text-center py-6' : 'product-card text-center py-6'}>
                      <span className="block font-medium text-primary">Presso struttura</span>
                      <p className="text-text-light text-xs">Portate voi o il veterinario</p>
                      <span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">Gratuito</span>
                    </div>
                  </div>
                  <div className="card p-4">
                    <p className="text-sm font-medium text-primary mb-3">Dove vive il vostro animale?</p>
                    <p className="text-xs text-text-muted mb-3">Ci serve per organizzare il ritiro e trovare il veterinario partner più vicino.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-text-muted">Indirizzo</label>
                        <input type="text" value={indirizzo} onChange={e => setIndirizzo(e.target.value)} placeholder="Via Roma 123" className="input-field text-sm mt-1" />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted">Citta</label>
                        <input type="text" value={citta} onChange={e => setCitta(e.target.value)} placeholder="Napoli" className="input-field text-sm mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Rate — SCELTA LIBERA */}
              {step === 6 && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">Come volete pagare?</h2>
                  <p className="text-text-light mb-6">Scegliete il numero di rate. Zero interessi, zero maggiorazioni.</p>

                  <div className="card p-6 mb-6">
                    <div className="text-center mb-6">
                      <p className="text-text-muted text-sm">Totale servizio</p>
                      <p className="font-[family-name:var(--font-serif)] text-3xl text-primary font-bold">&euro; {totale}</p>
                    </div>

                    {/* Slider rate */}
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-text-muted mb-2">
                        <span>1 (subito)</span>
                        <span className="font-medium text-primary">{numRate === 1 ? 'Pagamento unico' : `${numRate} mesi`}</span>
                        <span>24 mesi</span>
                      </div>
                      <input type="range" min={1} max={24} step={1} value={numRate}
                        onChange={e => setNumRate(Number(e.target.value))}
                        className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-secondary" />
                    </div>

                    {/* Risultato */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-background rounded-xl p-4">
                        <p className="text-text-muted text-xs">{numRate === 1 ? 'Pagamento' : 'Rate'}</p>
                        <p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">{numRate}</p>
                        <p className="text-text-muted text-xs">{numRate === 1 ? 'unico' : 'mesi'}</p>
                      </div>
                      <div className="bg-secondary/10 rounded-xl p-4">
                        <p className="text-secondary text-xs font-medium">{numRate === 1 ? 'Totale' : 'Al mese'}</p>
                        <p className="font-[family-name:var(--font-serif)] text-2xl text-secondary font-bold">&euro; {rataMensile}</p>
                        <p className="text-secondary/60 text-xs">{numRate === 1 ? 'una tantum' : 'al mese'}</p>
                      </div>
                      <div className="bg-background rounded-xl p-4">
                        <p className="text-text-muted text-xs">Interessi</p>
                        <p className="font-[family-name:var(--font-serif)] text-2xl text-accent font-bold">0%</p>
                        <p className="text-text-muted text-xs">zero</p>
                      </div>
                    </div>

                    {/* Piano pagamento dettagliato con date */}
                    {numRate > 1 && (
                      <div className="mt-6 pt-4 border-t border-border">
                        <p className="text-xs text-text-muted font-medium mb-2">Piano di pagamento</p>
                        <div className="grid grid-cols-1 gap-y-0.5 text-xs max-h-48 overflow-y-auto">
                          {Array.from({ length: numRate }, (_, i) => {
                            const isLast = i === numRate - 1
                            const importoRata = isLast ? Math.round((totale - rataMensile * (numRate - 1)) * 100) / 100 : rataMensile
                            const dataRata = new Date()
                            dataRata.setMonth(dataRata.getMonth() + i)
                            const meseAnno = dataRata.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
                            return (
                              <div key={i} className={`flex items-center justify-between py-1.5 px-2 rounded ${i === 0 ? 'bg-secondary/10' : i % 2 === 0 ? 'bg-background' : ''}`}>
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-border flex items-center justify-center text-[10px] font-bold text-text-muted">{i + 1}</span>
                                  <span className="text-text capitalize">{meseAnno}</span>
                                  {i === 0 && <span className="text-[9px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full font-medium">Attivazione</span>}
                                </div>
                                <span className="font-medium text-primary">&euro; {importoRata.toFixed(2)}</span>
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-border text-xs font-medium">
                          <span className="text-text-muted">Totale {numRate} rate</span>
                          <span className="text-primary">&euro; {totale.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metodo pagamento */}
                  <h3 className="font-medium text-primary mb-3">Metodo di pagamento</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div onClick={() => setMetodoPagamento('carta')}
                      className={metodoPagamento === 'carta' ? 'product-card-selected text-center py-5' : 'product-card text-center py-5'}>
                      <CreditCard size={24} className="mx-auto mb-2 text-secondary" />
                      <span className="block font-medium text-primary">Carta di credito</span>
                      <p className="text-text-muted text-xs">Addebito automatico mensile</p>
                    </div>
                    <div onClick={() => setMetodoPagamento('iban')}
                      className={metodoPagamento === 'iban' ? 'product-card-selected text-center py-5' : 'product-card text-center py-5'}>
                      <Building2 size={24} className="mx-auto mb-2 text-secondary" />
                      <span className="block font-medium text-primary">Addebito IBAN</span>
                      <p className="text-text-muted text-xs">SDD su conto corrente</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Riepilogo */}
              {step === 7 && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Riepilogo piano</h2>
                  <div className="space-y-3">
                    <Row label="Animale" value={`${animaleNome || animale} (${animale})`} />
                    <Row label="Taglia" value={taglieInfo[taglia]?.label || taglia} onEdit={() => setStep(2)} />
                    <Row label="Cremazione" value={tipo === 'individuale' ? 'Individuale (con ceneri)' : 'Collettiva'} prezzo={prezzoCremazione} onEdit={() => setStep(3)} />
                    {tipo === 'individuale' && urnaObj && <Row label="Urna" value={urnaObj.nome} prezzo={urnaObj.prezzo} onEdit={() => setStep(4)} />}
                    {improntaZampa && <Row label="Impronta zampa" value="Si" prezzo={prezzoImpronta} onEdit={() => setStep(4)} />}
                    <Row label="Ritiro" value={ritiroDomicilio ? 'A domicilio' : 'Presso struttura'} prezzo={ritiroDomicilio ? prezzoRitiroDom : 0} onEdit={() => setStep(5)} />
                    <div className="border-t-2 border-primary pt-4 flex justify-between items-center">
                      <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-bold">Totale</span>
                      <span className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">&euro; {totale}</span>
                    </div>
                    <div className="bg-secondary/10 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <span className="text-secondary font-medium">{numRate === 1 ? 'Pagamento unico' : `${numRate} rate mensili`}</span>
                        <p className="text-xs text-text-muted">Metodo: {metodoPagamento === 'carta' ? 'Carta di credito' : 'Addebito IBAN'}</p>
                      </div>
                      <span className="font-[family-name:var(--font-serif)] text-xl text-secondary font-bold">&euro; {rataMensile}/mese</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 8: Dati + Invio */}
              {step === 8 && (
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">I vostri dati</h2>
                  <p className="text-text-light mb-6">Compilate i dati per attivare il piano.</p>
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-text mb-1">Nome e Cognome *</label><input name="nome" required className="input-field" /></div>
                      <div><label className="block text-sm font-medium text-text mb-1">Telefono *</label><input name="telefono" type="tel" required className="input-field" /></div>
                      <div><label className="block text-sm font-medium text-text mb-1">Email *</label><input name="email" type="email" required className="input-field" /></div>
                    </div>

                    {/* Scelta: attiva subito o consulente */}
                    <div>
                      <p className="text-sm font-medium text-text mb-3">Come volete procedere?</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div onClick={() => setModalitaAttivazione('subito')}
                          className={modalitaAttivazione === 'subito' ? 'product-card-selected py-4 text-center' : 'product-card py-4 text-center'}>
                          <CreditCard size={20} className="mx-auto mb-1 text-secondary" />
                          <span className="block font-medium text-primary text-sm">Attiva subito</span>
                          <p className="text-text-muted text-[10px]">Paga la prima rata e attiva il piano</p>
                        </div>
                        <div onClick={() => setModalitaAttivazione('consulente')}
                          className={modalitaAttivazione === 'consulente' ? 'product-card-selected py-4 text-center' : 'product-card py-4 text-center'}>
                          <PawPrint size={20} className="mx-auto mb-1 text-secondary" />
                          <span className="block font-medium text-primary text-sm">Parla con noi</span>
                          <p className="text-text-muted text-[10px]">Un consulente vi chiamerà per confermare</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-secondary/10 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-primary">{modalitaAttivazione === 'subito' ? 'Prima rata (attivazione)' : 'Piano da attivare'}</p>
                          <p className="text-xs text-text-muted">{numRate === 1 ? 'Pagamento unico' : `${numRate} rate da €${rataMensile}`} — {metodoPagamento === 'carta' ? 'Carta' : 'IBAN'}</p>
                        </div>
                        <span className="font-[family-name:var(--font-serif)] text-2xl text-secondary font-bold">&euro; {rataMensile}{numRate > 1 ? '/mese' : ''}</span>
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" required className="w-5 h-5 mt-0.5 rounded" />
                      <span className="text-sm text-text-light">Acconsento al trattamento dei dati personali e alle condizioni del servizio. Prezzo bloccato. Annullabile con rimborso del versato (meno 5% spese). *</span>
                    </label>
                    <button type="submit" className="btn-accent w-full py-4 text-base">
                      {modalitaAttivazione === 'subito' ? (
                        <><CreditCard size={18} className="mr-2" /> Attiva Piano — &euro; {rataMensile}{numRate > 1 ? '/mese' : ''}</>
                      ) : (
                        <><PawPrint size={18} className="mr-2" /> Richiedi Chiamata Consulente</>
                      )}
                    </button>
                    <p className="text-[10px] text-text-muted text-center">
                      {modalitaAttivazione === 'subito'
                        ? 'La prima rata viene addebitata immediatamente. Zero interessi.'
                        : 'Un consulente vi contattara entro 30 minuti per confermare il piano.'}
                    </p>
                  </form>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-10">
            <button onClick={prev} disabled={step === 1} className="btn-secondary disabled:opacity-30"><ChevronLeft size={18} className="mr-1" /> Indietro</button>
            <button onClick={reset} className="text-text-muted hover:text-error text-sm flex items-center gap-1"><RotateCcw size={14} /> Ricomincia</button>
            {step < STEPS.length && step !== 1 && <button onClick={next} className="btn-primary">Avanti <ChevronRight size={18} className="ml-1" /></button>}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24 card">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-secondary" />
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary">Il tuo piano</h3>
            </div>
            <div className="space-y-3 text-sm">
              {animale && <SItem label="Animale" value={animaleNome || animale} />}
              {taglia && <SItem label="Taglia" value={taglieInfo[taglia]?.label || taglia} />}
              {tipo && <SItem label="Cremazione" value={tipo} prezzo={prezzoCremazione} />}
              {urnaObj && <SItem label="Urna" value={urnaObj.nome} prezzo={urnaObj.prezzo} />}
              {improntaZampa && <SItem label="Impronta" value="Si" prezzo={prezzoImpronta} />}
              {ritiroDomicilio && <SItem label="Ritiro" value="Domicilio" prezzo={prezzoRitiroDom} />}
              {totale > 0 && (
                <>
                  <div className="border-t border-border pt-3 flex justify-between font-semibold text-primary">
                    <span>Totale</span>
                    <span className="font-[family-name:var(--font-serif)] text-lg">&euro; {totale}</span>
                  </div>
                  {numRate > 1 && (
                    <div className="bg-secondary/10 rounded-lg p-2 text-center">
                      <p className="text-secondary font-bold">&euro; {rataMensile}/mese</p>
                      <p className="text-[10px] text-text-muted">{numRate} rate — zero interessi</p>
                    </div>
                  )}
                </>
              )}
              {totale === 0 && <p className="text-text-muted text-xs italic">Le scelte appariranno qui.</p>}
              <p className="text-[10px] text-text-muted mt-4 border-t border-border pt-3">Prezzo bloccato. Annullabile con rimborso.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, prezzo, onEdit }: { label: string; value?: string | null; prezzo?: number; onEdit?: () => void }) {
  return <div className="flex items-center justify-between py-3 border-b border-border">
    <div><span className="text-xs text-text-muted uppercase tracking-wider">{label}</span><p className="text-text font-medium capitalize">{value || '—'}</p></div>
    <div className="flex items-center gap-4">{prezzo != null && prezzo > 0 && <span className="font-[family-name:var(--font-serif)] text-lg text-primary">&euro; {prezzo}</span>}
      {onEdit && <button onClick={onEdit} className="text-secondary text-sm hover:underline">Modifica</button>}</div></div>
}

function SItem({ label, value, prezzo }: { label: string; value: string; prezzo?: number }) {
  return <div className="flex justify-between items-start gap-2">
    <div className="min-w-0"><span className="text-text-muted text-xs">{label}</span><p className="text-text truncate capitalize">{value}</p></div>
    {prezzo != null && prezzo > 0 && <span className="text-primary font-medium whitespace-nowrap">&euro; {prezzo}</span>}</div>
}
