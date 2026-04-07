'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, RotateCcw, Send, Dog, Cat, Rabbit, PawPrint } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { StepIndicator } from './StepIndicatorGeneric'
import { useTranslations } from 'next-intl'

export function ConfiguratoreAnimale() {
  const t = useTranslations('configAnimale')
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

  const STEPS = [t('step1'), t('step2'), t('step3'), t('step4'), t('step5'), t('step6'), t('step7')]

  const animali = [
    { id: 'cane', label: t('animale_cane'), icon: Dog },
    { id: 'gatto', label: t('animale_gatto'), icon: Cat },
    { id: 'altro', label: t('animale_altro'), icon: Rabbit },
  ]
  const taglie = [
    { id: 'piccola', label: t('taglia_piccola_label'), desc: t('taglia_piccola_desc'), prezzo: 150 },
    { id: 'media', label: t('taglia_media_label'), desc: t('taglia_media_desc'), prezzo: 250 },
    { id: 'grande', label: t('taglia_grande_label'), desc: t('taglia_grande_desc'), prezzo: 380 },
  ]
  const tipiCrema = [
    { id: 'individuale', label: t('crema_individuale_label'), desc: t('crema_individuale_desc'), extra: 0 },
    { id: 'collettiva', label: t('crema_collettiva_label'), desc: t('crema_collettiva_desc'), extra: -80 },
  ]
  const urneList = [
    { id: 'standard', label: t('urna_standard_label'), desc: t('urna_standard_desc'), prezzo: 30 },
    { id: 'legno', label: t('urna_legno_label'), desc: t('urna_legno_desc'), prezzo: 60 },
    { id: 'marmo', label: t('urna_marmo_label'), desc: t('urna_marmo_desc'), prezzo: 120 },
    { id: 'nessuna', label: t('urna_nessuna_label'), desc: t('urna_nessuna_desc'), prezzo: 0 },
  ]
  const ritiroList = [
    { id: 'domicilio', label: t('ritiro_domicilio_label'), desc: t('ritiro_domicilio_desc'), prezzo: 60 },
    { id: 'consegna', label: t('ritiro_consegna_label'), desc: t('ritiro_consegna_desc'), prezzo: 0 },
  ]

  const tagliaObj = taglie.find(x => x.id === taglia)
  const tipoObj = tipiCrema.find(x => x.id === tipo)
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
      `Animale: ${animale}`, `Taglia: ${tagliaObj?.label || t('gatto')} — €${tagliaObj?.prezzo || 150}`,
      `Tipo: ${tipoObj?.label}`, tipo === 'individuale' && urnaObj ? `Urna: ${urnaObj.label} — €${urnaObj.prezzo}` : '',
      `Ritiro: ${ritiroObj?.label} — €${ritiroObj?.prezzo}`,
    ].filter(Boolean).join('\n')

    await useSitoStore.getState().aggiungiRichiesta({
      nome, telefono: tel, email, modalita, orario, note: t('noteCremazioneAnimale'),
      configurazione: config, totale, stato: 'nuova', createdAt: new Date().toISOString(),
    })
    setTempoAttesa(orario)
    setInviato(true)
  }

  if (inviato) return (
    <div className="card text-center py-12 max-w-lg mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center"><Check size={32} className="text-accent" /></div>
      <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">{t('richiestaInviata')}</h2>
      <p className="text-text-light">{t('consulenteContatteraTime')}<strong>{tempoAttesa.toLowerCase()}</strong>.</p>
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
          <h1 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-white">{t('heroTitolo')}</h1>
          <p className="mt-2 text-white/80 text-sm max-w-lg mx-auto">{t('heroDesc')}</p>
        </div>
      </div>

      <StepIndicator steps={STEPS} current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {step === 1 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('step1Titolo')}</h2>
                <div className="grid grid-cols-3 gap-2 md:gap-4">{animali.map(a => (
                  <div key={a.id} onClick={() => { setAnimale(a.id); if(a.id==='gatto')setTaglia('gatto'); next() }}
                    className={animale===a.id?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <a.icon size={32} className="mx-auto mb-2 text-secondary" /><span className="font-medium text-primary">{a.label}</span>
                  </div>))}</div></div>
              )}

              {step === 2 && animale !== 'gatto' && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('step2Titolo')}</h2>
                <div className="grid grid-cols-3 gap-4">{taglie.map(x => (
                  <div key={x.id} onClick={() => setTaglia(x.id)}
                    className={taglia===x.id?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <span className="block font-medium text-primary">{x.label}</span>
                    <p className="text-text-light text-[10px] md:text-sm">{x.desc}</p>
                    <span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">&euro; {x.prezzo}</span>
                  </div>))}</div></div>
              )}
              {step === 2 && animale === 'gatto' && (
                <div className="text-center py-8"><p className="text-text-light mb-4">{t('step2GattoCosto')}<strong>&euro; 150</strong></p>
                <button onClick={next} className="btn-primary">{t('step2GattoAvanti')}</button></div>
              )}

              {step === 3 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('step3Titolo')}</h2>
                <div className="grid grid-cols-2 gap-4">{tipiCrema.map(x => (
                  <div key={x.id} onClick={() => setTipo(x.id)}
                    className={tipo===x.id?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <span className="block font-medium text-primary">{x.label}</span>
                    <p className="text-text-light text-[10px] md:text-sm">{x.desc}</p>
                  </div>))}</div></div>
              )}

              {step === 4 && tipo === 'individuale' && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('step4Titolo')}</h2>
                <div className="grid grid-cols-2 gap-4">{urneList.map(u => (
                  <div key={u.id} onClick={() => setUrna(u.id)}
                    className={urna===u.id?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <span className="block font-medium text-primary">{u.label}</span>
                    <p className="text-text-light text-[10px] md:text-sm">{u.desc}</p>
                    {u.prezzo>0&&<span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">&euro; {u.prezzo}</span>}
                  </div>))}</div></div>
              )}
              {step === 4 && tipo === 'collettiva' && (
                <div className="text-center py-8"><p className="text-text-light">{t('step4CollettivaMsg')}</p></div>
              )}

              {step === 5 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('step5Titolo')}</h2>
                <div className="grid grid-cols-2 gap-2 md:gap-4">{ritiroList.map(r => (
                  <div key={r.id} onClick={() => setRitiro(r.id)}
                    className={ritiro===r.id?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <span className="block font-medium text-primary">{r.label}</span>
                    <p className="text-text-light text-[10px] md:text-sm">{r.desc}</p>
                    {r.prezzo>0&&<span className="block font-[family-name:var(--font-serif)] text-primary font-semibold mt-2">&euro; {r.prezzo}</span>}
                  </div>))}</div></div>
              )}

              {step === 6 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('step6Titolo')}</h2>
                <div className="space-y-3">
                  <Row label={t('step6LabelAnimale')} value={animale} />
                  <Row label={t('step6LabelTaglia')} value={tagliaObj?.label || t('gatto')} prezzo={tagliaObj?.prezzo || 150} onEdit={() => setStep(2)} />
                  <Row label={t('step6LabelCremazione')} value={tipoObj?.label} onEdit={() => setStep(3)} />
                  {tipo==='individuale'&&urnaObj&&<Row label={t('step6LabelUrna')} value={urnaObj.label} prezzo={urnaObj.prezzo} onEdit={() => setStep(4)} />}
                  <Row label={t('step6LabelRitiro')} value={ritiroObj?.label} prezzo={ritiroObj?.prezzo} onEdit={() => setStep(5)} />
                  <div className="border-t-2 border-primary pt-4 flex justify-between items-center">
                    <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-bold">{t('totaleIndicativo')}</span>
                    <span className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">&euro; {totale}</span>
                  </div>
                </div></div>
              )}

              {step === 7 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">{t('step7Titolo')}</h2>
                <p className="text-text-light mb-6">{t('step7Desc')}</p>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div><label className="block text-sm font-medium text-text mb-3">{t('comeContattati')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[{v:'telefonata',l:t('chiamata')},{v:'videochiamata',l:t('videochiamata')},{v:'whatsapp',l:t('whatsapp')}].map(o=>(
                      <label key={o.v} className="cursor-pointer"><input type="radio" name="modalita" value={o.v} className="peer sr-only" required />
                      <div className="product-card py-3 text-center peer-checked:border-secondary peer-checked:border-2 peer-checked:bg-secondary/5">
                        <span className="text-sm font-medium text-primary">{o.l}</span></div></label>))}
                  </div></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-text mb-1">{t('nomeLabel')}</label><input name="nome" required className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">{t('telefonoLabel')}</label><input name="telefono" required className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">{t('emailLabel')}</label><input name="email" type="email" className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">{t('quandoContattarvi')}</label>
                      <select name="orario" required className="input-field" onChange={e=>setMostraOrario(e.target.value==='orario_specifico')}>
                        <option value="">{t('selezionate')}</option><option value="Entro 30 minuti">{t('entro30min')}</option>
                        <option value="Entro 1 ora">{t('entro1ora')}</option><option value="Entro 2 ore">{t('entro2ore')}</option>
                        <option value="orario_specifico">{t('orarioSpecifico')}</option>
                      </select></div>
                    {mostraOrario&&<div><label className="block text-sm font-medium text-text mb-1">{t('orarioLabel')}</label><input name="orario_spec" type="time" required className="input-field" /></div>}
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" required className="w-5 h-5 mt-0.5 rounded" />
                    <span className="text-sm text-text-light">{t('gdpr')}</span></label>
                  <button type="submit" className="btn-accent w-full py-4"><Send size={16} className="mr-2" /> {t('inviaRichiesta')}</button>
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-center">
                    <p className="text-primary font-medium text-sm">{t('consulenteCiContatta')}</p>
                  </div>
                </form></div>
              )}

            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-10">
            <button onClick={prev} disabled={step===1} className="btn-secondary disabled:opacity-30"><ChevronLeft size={18} className="mr-1" /> {t('indietro')}</button>
            <button onClick={reset} className="text-text-muted hover:text-error text-sm flex items-center gap-1"><RotateCcw size={14} /> {t('ricomincia')}</button>
            {step < STEPS.length && step !== 1 && <button onClick={next} className="btn-primary">{t('avanti')} <ChevronRight size={18} className="ml-1" /></button>}
          </div>
        </div>

        {/* Sidebar riepilogo */}
        <div className="hidden lg:block">
          <div className="sticky top-24 card">
            <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">{t('preventivo')}</h3>
            <div className="space-y-3 text-sm">
              {animale && <SItem label={t('step6LabelAnimale')} value={animale} />}
              {taglia && <SItem label={t('step6LabelTaglia')} value={tagliaObj?.label||t('gatto')} prezzo={tagliaObj?.prezzo||150} />}
              {tipo && <SItem label={t('step6LabelCremazione')} value={tipoObj?.label||''} />}
              {urna && tipo==='individuale' && <SItem label={t('step6LabelUrna')} value={urnaObj?.label||''} prezzo={urnaObj?.prezzo} />}
              {ritiro && <SItem label={t('step6LabelRitiro')} value={ritiroObj?.label||''} prezzo={ritiroObj?.prezzo} />}
              {totale > 0 && <div className="border-t border-border pt-3 flex justify-between font-semibold text-primary">
                <span>{t('totale')}</span><span className="font-[family-name:var(--font-serif)] text-lg">&euro; {totale}</span></div>}
              {totale === 0 && <p className="text-text-muted text-xs italic">{t('sceltaAppariranno')}</p>}
              <p className="text-[10px] text-text-muted mt-4 border-t border-border pt-3">{t('preventivoIndicativo')}</p>
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
