'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, RotateCcw, Send, Dog, Cat, Rabbit, PawPrint } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { StepIndicator } from './StepIndicatorGeneric'

const STEPS = ['Animale', 'Taglia', 'Servizio', 'Urna', 'Ritiro', 'Riepilogo', 'Contatto']

const animali = [
  { id: 'cane', label: 'Cane', icon: Dog },
  { id: 'gatto', label: 'Gatto', icon: Cat },
  { id: 'altro', label: 'Altro', icon: Rabbit },
]
const taglie = [
  { id: 'piccola', label: 'Piccola taglia', desc: 'Fino a 10 kg', prezzo: 150 },
  { id: 'media', label: 'Media taglia', desc: '10 — 25 kg', prezzo: 250 },
  { id: 'grande', label: 'Grande taglia', desc: 'Oltre 25 kg', prezzo: 380 },
]
const tipiCrema = [
  { id: 'individuale', label: 'Cremazione individuale', desc: 'Con restituzione ceneri', extra: 0 },
  { id: 'collettiva', label: 'Cremazione collettiva', desc: 'Senza restituzione ceneri', extra: -80 },
]
const urneList = [
  { id: 'standard', label: 'Urna standard', desc: 'Ceramica semplice', prezzo: 30 },
  { id: 'legno', label: 'Urna in legno', desc: 'Con incisione nome', prezzo: 60 },
  { id: 'marmo', label: 'Urna in marmo', desc: 'Marmo pregiato', prezzo: 120 },
  { id: 'nessuna', label: 'Nessuna urna', desc: 'Contenitore base', prezzo: 0 },
]
const ritiroList = [
  { id: 'domicilio', label: 'Ritiro a domicilio', desc: 'Veniamo noi', prezzo: 60 },
  { id: 'consegna', label: 'Portate voi', desc: 'Consegna nella nostra struttura', prezzo: 0 },
]

export function ConfiguratoreAnimale() {
  const { impostazioni } = useSitoStore()
  const [step, setStep] = useState(1)
  const [animale, setAnimale] = useState('')
  const [taglia, setTaglia] = useState('')
  const [tipo, setTipo] = useState('')
  const [urna, setUrna] = useState('')
  const [ritiro, setRitiro] = useState('')
  const [inviato, setInviato] = useState(false)
  const [tempoAttesa, setTempoAttesa] = useState('')
  const [mostraOrario, setMostraOrario] = useState(false)

  const tagliaObj = taglie.find(t => t.id === taglia)
  const tipoObj = tipiCrema.find(t => t.id === tipo)
  const urnaObj = urneList.find(u => u.id === urna)
  const ritiroObj = ritiroList.find(r => r.id === ritiro)
  const totale = (tagliaObj?.prezzo || (animale === 'gatto' ? 150 : 0)) + (tipoObj?.extra || 0) + (urnaObj?.prezzo || 0) + (ritiroObj?.prezzo || 0)

  const next = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => Math.min(STEPS.length, s + 1)) }
  const prev = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => Math.max(1, s - 1)) }
  const reset = () => { setStep(1); setAnimale(''); setTaglia(''); setTipo(''); setUrna(''); setRitiro('') }

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

    const config = [
      `Animale: ${animale}`, `Taglia: ${tagliaObj?.label || 'Gatto'} — €${tagliaObj?.prezzo || 150}`,
      `Tipo: ${tipoObj?.label}`, tipo === 'individuale' && urnaObj ? `Urna: ${urnaObj.label} — €${urnaObj.prezzo}` : '',
      `Ritiro: ${ritiroObj?.label} — €${ritiroObj?.prezzo}`,
    ].filter(Boolean).join('\n')

    await useSitoStore.getState().aggiungiRichiesta({
      nome, telefono: tel, email, modalita, orario, note: 'Cremazione animale',
      configurazione: config, totale, stato: 'nuova', createdAt: new Date().toISOString(),
    })
    setTempoAttesa(orario)
    setInviato(true)
  }

  if (inviato) return (
    <div className="card text-center py-12 max-w-lg mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center"><Check size={32} className="text-accent" /></div>
      <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">Richiesta inviata</h2>
      <p className="text-text-light">Un nostro consulente vi contatter&agrave; <strong>{tempoAttesa.toLowerCase()}</strong>.</p>
      <p className="font-[family-name:var(--font-serif)] text-xl text-primary font-bold mt-3">&euro; {totale}</p>
    </div>
  )

  return (
    <>
      {/* Hero mini */}
      <div className="relative bg-primary rounded-2xl overflow-hidden mb-8">
        <Image src="/images/config-animali-hero.jpg" alt="" fill className="object-cover opacity-25" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 to-primary/60" />
        <div className="relative text-center py-10 px-6">
          <PawPrint size={28} className="mx-auto mb-3 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-white">Cremazione Animale Domestico</h1>
          <p className="mt-2 text-white/80 text-sm max-w-lg mx-auto">Un ultimo saluto dignitoso per il vostro compagno di vita. Vi accompagniamo con rispetto e delicatezza.</p>
        </div>
      </div>

      <StepIndicator steps={STEPS} current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {step === 1 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Tipo di animale</h2>
                <div className="grid grid-cols-3 gap-2 md:gap-4">{animali.map(a => (
                  <div key={a.id} onClick={() => { setAnimale(a.id); if(a.id==='gatto')setTaglia('gatto'); next() }}
                    className={animale===a.id?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <a.icon size={32} className="mx-auto mb-2 text-secondary" /><span className="font-medium text-primary">{a.label}</span>
                  </div>))}</div></div>
              )}

              {step === 2 && animale !== 'gatto' && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Taglia</h2>
                <div className="grid grid-cols-3 gap-4">{taglie.map(t => (
                  <div key={t.id} onClick={() => setTaglia(t.id)}
                    className={taglia===t.id?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <span className="block font-medium text-primary">{t.label}</span>
                    <p className="text-text-light text-[10px] md:text-sm">{t.desc}</p>
                    <span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">&euro; {t.prezzo}</span>
                  </div>))}</div></div>
              )}
              {step === 2 && animale === 'gatto' && (
                <div className="text-center py-8"><p className="text-text-light mb-4">Costo base cremazione gatto: <strong>&euro; 150</strong></p>
                <button onClick={next} className="btn-primary">Avanti</button></div>
              )}

              {step === 3 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Tipo di cremazione</h2>
                <div className="grid grid-cols-2 gap-4">{tipiCrema.map(t => (
                  <div key={t.id} onClick={() => setTipo(t.id)}
                    className={tipo===t.id?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <span className="block font-medium text-primary">{t.label}</span>
                    <p className="text-text-light text-[10px] md:text-sm">{t.desc}</p>
                  </div>))}</div></div>
              )}

              {step === 4 && tipo === 'individuale' && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Scelta urna</h2>
                <div className="grid grid-cols-2 gap-4">{urneList.map(u => (
                  <div key={u.id} onClick={() => setUrna(u.id)}
                    className={urna===u.id?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <span className="block font-medium text-primary">{u.label}</span>
                    <p className="text-text-light text-[10px] md:text-sm">{u.desc}</p>
                    {u.prezzo>0&&<span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">&euro; {u.prezzo}</span>}
                  </div>))}</div></div>
              )}
              {step === 4 && tipo === 'collettiva' && (
                <div className="text-center py-8"><p className="text-text-light">Cremazione collettiva senza urna.</p></div>
              )}

              {step === 5 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Ritiro</h2>
                <div className="grid grid-cols-2 gap-2 md:gap-4">{ritiroList.map(r => (
                  <div key={r.id} onClick={() => setRitiro(r.id)}
                    className={ritiro===r.id?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <span className="block font-medium text-primary">{r.label}</span>
                    <p className="text-text-light text-[10px] md:text-sm">{r.desc}</p>
                    {r.prezzo>0&&<span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">&euro; {r.prezzo}</span>}
                  </div>))}</div></div>
              )}

              {step === 6 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Riepilogo</h2>
                <div className="space-y-3">
                  <Row label="Animale" value={animale} />
                  <Row label="Taglia" value={tagliaObj?.label || 'Gatto'} prezzo={tagliaObj?.prezzo || 150} onEdit={() => setStep(2)} />
                  <Row label="Cremazione" value={tipoObj?.label} onEdit={() => setStep(3)} />
                  {tipo==='individuale'&&urnaObj&&<Row label="Urna" value={urnaObj.label} prezzo={urnaObj.prezzo} onEdit={() => setStep(4)} />}
                  <Row label="Ritiro" value={ritiroObj?.label} prezzo={ritiroObj?.prezzo} onEdit={() => setStep(5)} />
                  <div className="border-t-2 border-primary pt-4 flex justify-between items-center">
                    <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-bold">Totale indicativo</span>
                    <span className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">&euro; {totale}</span>
                  </div>
                </div></div>
              )}

              {step === 7 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">Richiesta di contatto</h2>
                <p className="text-text-light mb-6">Un consulente vi accompagner&agrave; con delicatezza in ogni fase.</p>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div><label className="block text-sm font-medium text-text mb-3">Come preferite essere contattati? *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[{v:'telefonata',l:'Chiamata'},{v:'videochiamata',l:'Videochiamata'},{v:'whatsapp',l:'WhatsApp'}].map(o=>(
                      <label key={o.v} className="cursor-pointer"><input type="radio" name="modalita" value={o.v} className="peer sr-only" required />
                      <div className="product-card py-3 text-center peer-checked:border-secondary peer-checked:border-2 peer-checked:bg-secondary/5">
                        <span className="text-sm font-medium text-primary">{o.l}</span></div></label>))}
                  </div></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-text mb-1">Nome *</label><input name="nome" required className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Telefono *</label><input name="telefono" required className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Email</label><input name="email" type="email" className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Quando contattarvi? *</label>
                      <select name="orario" required className="input-field" onChange={e=>setMostraOrario(e.target.value==='orario_specifico')}>
                        <option value="">Selezionate...</option><option value="Entro 30 minuti">Entro 30 minuti</option>
                        <option value="Entro 1 ora">Entro 1 ora</option><option value="Entro 2 ore">Entro 2 ore</option>
                        <option value="orario_specifico">Orario specifico</option>
                      </select></div>
                    {mostraOrario&&<div><label className="block text-sm font-medium text-text mb-1">Orario</label><input name="orario_spec" type="time" required className="input-field" /></div>}
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" required className="w-5 h-5 mt-0.5 rounded" />
                    <span className="text-sm text-text-light">Acconsento al trattamento dei dati personali ai sensi del GDPR. *</span></label>
                  <button type="submit" className="btn-accent w-full py-4"><Send size={16} className="mr-2" /> Invia Richiesta</button>
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-center">
                    <p className="text-primary font-medium text-sm">Un consulente vi contatter&agrave; nei tempi scelti. Disponibili 24/7.</p>
                  </div>
                </form></div>
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
              {animale && <SItem label="Animale" value={animale} />}
              {taglia && <SItem label="Taglia" value={tagliaObj?.label||'Gatto'} prezzo={tagliaObj?.prezzo||150} />}
              {tipo && <SItem label="Cremazione" value={tipoObj?.label||''} />}
              {urna && tipo==='individuale' && <SItem label="Urna" value={urnaObj?.label||''} prezzo={urnaObj?.prezzo} />}
              {ritiro && <SItem label="Ritiro" value={ritiroObj?.label||''} prezzo={ritiroObj?.prezzo} />}
              {totale > 0 && <div className="border-t border-border pt-3 flex justify-between font-semibold text-primary">
                <span>Totale</span><span className="font-[family-name:var(--font-serif)] text-lg">&euro; {totale}</span></div>}
              {totale === 0 && <p className="text-text-muted text-xs italic">Le scelte appariranno qui.</p>}
              <p className="text-[10px] text-text-muted mt-4 border-t border-border pt-3">Preventivo indicativo. Non costituisce proposta contrattuale.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Row({ label, value, prezzo, onEdit }: { label: string; value?: string|null; prezzo?: number; onEdit?: ()=>void }) {
  return <div className="flex items-center justify-between py-3 border-b border-border">
    <div><span className="text-xs text-text-muted uppercase tracking-wider">{label}</span><p className="text-text font-medium">{value||'—'}</p></div>
    <div className="flex items-center gap-4">{prezzo!=null&&<span className="font-[family-name:var(--font-serif)] text-lg text-primary">&euro; {prezzo}</span>}
    {onEdit&&<button onClick={onEdit} className="text-secondary text-sm hover:underline">Modifica</button>}</div></div>
}

function SItem({ label, value, prezzo }: { label: string; value: string; prezzo?: number }) {
  return <div className="flex justify-between items-start gap-2">
    <div className="min-w-0"><span className="text-text-muted text-xs">{label}</span><p className="text-text truncate">{value}</p></div>
    {prezzo!=null&&<span className="text-primary font-medium whitespace-nowrap">&euro; {prezzo}</span>}</div>
}
