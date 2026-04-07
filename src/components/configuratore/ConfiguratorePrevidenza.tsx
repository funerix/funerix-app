'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, RotateCcw, Send, Shield, Heart, Lock, Euro, Calendar } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { ProductSelector } from './ProductSelector'
import { StepIndicator } from './StepIndicatorGeneric'
import { useTranslations } from 'next-intl'

export function ConfiguratorePrevidenza() {
  const t = useTranslations('configPrevidenza')
  const { prodotti, categorie, impostazioni } = useSitoStore()
  const [step, setStep] = useState(1)
  const [beneficiario, setBeneficiario] = useState<'se_stesso' | 'familiare' | ''>('')
  const [beneficiarioNome, setBeneficiarioNome] = useState('')
  const [beneficiarioEta, setBeneficiarioEta] = useState('')
  const [beneficiarioRelazione, setBeneficiarioRelazione] = useState('')
  const [tipoServizio, setTipoServizio] = useState('')
  const [bara, setBara] = useState<string | null>(null)
  const [fioriSel, setFioriSel] = useState<string[]>([])
  const [extraSel, setExtraSel] = useState<string[]>([])
  const [numRate, setNumRate] = useState(36)
  const [inviato, setInviato] = useState(false)
  const [tempoAttesa, setTempoAttesa] = useState('')
  const [mostraOrario, setMostraOrario] = useState(false)

  const STEPS = [t('step1'), t('step2'), t('step3'), t('step4'), t('step5'), t('step6'), t('step7'), t('step8')]

  const catId = (slug: string) => categorie.find(c => c.slug === slug)?.id || ''
  const attivi = prodotti.filter(p => p.attivo)
  const bare = attivi.filter(p => p.categoriaId === catId('bare'))
  const fiori = attivi.filter(p => p.categoriaId === catId('fiori'))
  const servizi = attivi.filter(p => p.categoriaId === catId('servizi'))

  const baraObj = bare.find(b => b.id === bara)
  const fioriTot = fioriSel.reduce((s, id) => s + (attivi.find(p => p.id === id)?.prezzo || 0), 0)
  const extraTot = extraSel.reduce((s, id) => s + (attivi.find(p => p.id === id)?.prezzo || 0), 0)
  const totale = (baraObj?.prezzo || 0) + fioriTot + extraTot
  const rataMensile = totale > 0 ? Math.ceil(totale / numRate) : 0

  const next = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => Math.min(STEPS.length, s + 1)) }
  const prev = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => Math.max(1, s - 1)) }
  const reset = () => { setStep(1); setBeneficiario(''); setBara(null); setFioriSel([]); setExtraSel([]) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const nome = (form.querySelector('[name=nome]') as HTMLInputElement)?.value
    const tel = (form.querySelector('[name=telefono]') as HTMLInputElement)?.value
    const email = (form.querySelector('[name=email]') as HTMLInputElement)?.value || ''
    let orario = (form.querySelector('[name=orario]') as HTMLSelectElement)?.value || ''
    if (orario === 'orario_specifico') orario = `Alle ore ${(form.querySelector('[name=orario_spec]') as HTMLInputElement)?.value || ''}`
    const modalita = (form.querySelector('input[name=modalita]:checked') as HTMLInputElement)?.value || 'telefonata'

    const config = [
      `PIANO PREVIDENZA FUNERIX`,
      `Beneficiario: ${beneficiario === 'se_stesso' ? 'Per sé stesso' : `${beneficiarioNome} (${beneficiarioRelazione}, ${beneficiarioEta} anni)`}`,
      `Tipo: ${tipoServizio}`,
      baraObj ? `Bara: ${baraObj.nome} — €${baraObj.prezzo}` : '',
      ...fioriSel.map(id => { const p = attivi.find(x => x.id === id); return p ? `Fiori: ${p.nome} — €${p.prezzo}` : '' }),
      ...extraSel.map(id => { const p = attivi.find(x => x.id === id); return p ? `Extra: ${p.nome} — €${p.prezzo}` : '' }),
      ``,
      `Piano: ${numRate} rate da €${rataMensile}/mese`,
      `Totale: €${totale}`,
    ].filter(Boolean).join('\n')

    await useSitoStore.getState().aggiungiRichiesta({
      nome, telefono: tel, email, modalita, orario,
      note: `PREVIDENZA — ${numRate} rate — Beneficiario: ${beneficiario === 'se_stesso' ? 'sé stesso' : beneficiarioNome}`,
      configurazione: config, totale, stato: 'nuova', createdAt: new Date().toISOString(),
    })
    setTempoAttesa(orario)
    setInviato(true)
  }

  if (inviato) return (
    <div className="card text-center py-12 max-w-lg mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center"><Check size={32} className="text-accent" /></div>
      <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">{t('richiestaInviata')}</h2>
      <p className="text-text-light">{t('consulenteContatteraTime')}<strong>{tempoAttesa.toLowerCase()}</strong>{t('perFinalizzare')}</p>
      <div className="mt-4 bg-secondary/10 rounded-xl p-4">
        <p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">&euro; {rataMensile}/mese</p>
        <p className="text-text-muted text-sm">{numRate} {t('rate')} — {t('totaleLabel')} &euro; {totale.toLocaleString('it-IT')}</p>
      </div>
    </div>
  )

  return (
    <>
      <div className="relative bg-primary rounded-2xl overflow-hidden mb-8">
        <Image src="/images/hero-principale.png" alt="" fill className="object-cover opacity-15" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 to-primary/60" />
        <div className="relative text-center py-10 px-6">
          <Shield size={28} className="mx-auto mb-3 text-secondary-light" />
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
                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => { setBeneficiario('se_stesso'); next() }} className={beneficiario==='se_stesso'?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <Heart size={32} className="mx-auto mb-3 text-secondary" /><span className="block font-medium text-primary text-sm md:text-lg">{t('perMeLabel')}</span>
                    <span className="block text-text-muted text-[10px] md:text-sm mt-1">{t('perMeDesc')}</span></div>
                  <div onClick={() => setBeneficiario('familiare')} className={beneficiario==='familiare'?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <Shield size={32} className="mx-auto mb-3 text-secondary" /><span className="block font-medium text-primary text-sm md:text-lg">{t('perFamiliareLabel')}</span>
                    <span className="block text-text-muted text-[10px] md:text-sm mt-1">{t('perFamiliareDesc')}</span></div>
                </div>
                {beneficiario === 'familiare' && (
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div><label className="text-xs font-medium text-text">{t('nomeFamilare')}</label><input className="input-field text-sm mt-1" value={beneficiarioNome} onChange={e=>setBeneficiarioNome(e.target.value)} /></div>
                    <div><label className="text-xs font-medium text-text">{t('etaLabel')}</label><input className="input-field text-sm mt-1" value={beneficiarioEta} onChange={e=>setBeneficiarioEta(e.target.value)} /></div>
                    <div><label className="text-xs font-medium text-text">{t('relazioneLabel')}</label>
                    <select className="input-field text-sm mt-1" value={beneficiarioRelazione} onChange={e=>setBeneficiarioRelazione(e.target.value)}>
                      <option value="">{t('seleziona')}</option><option>{t('genitore')}</option><option>{t('coniuge')}</option><option>{t('fratelloSorella')}</option><option>{t('nonno')}</option><option>{t('altro')}</option>
                    </select></div>
                  </div>
                )}</div>
              )}

              {step === 2 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('step2Titolo')}</h2>
                <div className="grid grid-cols-3 gap-2 md:gap-4">{[
                  {v:t('inumazioneTipo'),d:t('inumazioneTipoDesc')},
                  {v:t('tumulazioneTipo'),d:t('tumulazioneTipoDesc')},
                  {v:t('cremazioneTipo'),d:t('cremazioneTipoDesc')},
                ].map(x=>(
                  <div key={x.v} onClick={() => setTipoServizio(x.v)} className={tipoServizio===x.v?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <h3 className="font-[family-name:var(--font-serif)] text-sm md:text-lg text-primary mb-1">{x.v}</h3>
                    <p className="text-text-light text-[10px] md:text-sm">{x.d}</p></div>))}</div></div>
              )}

              {step === 3 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('step3Titolo')}</h2>
                <ProductSelector prodotti={bare} selected={bare.find(b=>b.id===bara)||null} onSelect={p=>setBara(p.id)} /></div>
              )}

              {step === 4 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">{t('step4Titolo')}</h2>
                <p className="text-text-light text-sm mb-6">{t('step4Desc')}</p>
                <ProductSelector prodotti={fiori} selected={fiori.filter(f=>fioriSel.includes(f.id))} onToggle={p=>setFioriSel(prev=>prev.includes(p.id)?prev.filter(x=>x!==p.id):[...prev,p.id])} multiple /></div>
              )}

              {step === 5 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">{t('step5Titolo')}</h2>
                <p className="text-text-light text-sm mb-6">{t('step5Desc')}</p>
                <ProductSelector prodotti={servizi} selected={servizi.filter(s=>extraSel.includes(s.id))} onToggle={p=>setExtraSel(prev=>prev.includes(p.id)?prev.filter(x=>x!==p.id):[...prev,p.id])} multiple /></div>
              )}

              {step === 6 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('step6Titolo')}</h2>
                <div className="card p-6 mb-6">
                  <div className="text-center mb-6">
                    <p className="text-text-muted text-sm">{t('totaleServizio')}</p>
                    <p className="font-[family-name:var(--font-serif)] text-4xl text-primary font-bold">&euro; {totale.toLocaleString('it-IT')}</p>
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-text-muted mb-2"><span>{t('mesi12')}</span><span>{numRate} {t('step1')}</span><span>{t('mesi60')}</span></div>
                    <input type="range" min={12} max={60} step={6} value={numRate} onChange={e=>setNumRate(Number(e.target.value))}
                      className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-secondary" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-background rounded-xl p-4"><p className="text-text-muted text-xs">{t('rateLabel')}</p><p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">{numRate}</p></div>
                    <div className="bg-secondary/10 rounded-xl p-4"><p className="text-secondary text-xs font-medium">{t('alMese')}</p><p className="font-[family-name:var(--font-serif)] text-2xl text-secondary font-bold">&euro; {rataMensile}</p></div>
                    <div className="bg-background rounded-xl p-4"><p className="text-text-muted text-xs">{t('durataLabel')}</p><p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">{Math.ceil(numRate/12)} {numRate<=12?t('anno'):t('anni')}</p></div>
                  </div>
                </div>
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
                  <Lock size={18} className="text-accent mt-0.5 flex-shrink-0" />
                  <div><p className="text-sm font-medium text-primary">{t('fondiProtetti')}</p>
                  <p className="text-xs text-text-muted">{t('fondiProtettiDesc')}</p></div>
                </div></div>
              )}

              {step === 7 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('step7Titolo')}</h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-text-muted text-sm">{t('beneficiarioLabel')}</span><span className="text-primary font-medium text-sm">{beneficiario==='se_stesso'?t('perSeStesSo'):beneficiarioNome}</span></div>
                  <div className="flex justify-between py-2 border-b border-border"><span className="text-text-muted text-sm">{t('tipoServizioLabel')}</span><span className="text-primary font-medium text-sm">{tipoServizio}</span></div>
                  {baraObj&&<div className="flex justify-between py-2 border-b border-border"><span className="text-text-muted text-sm">{t('baraLabel')}</span><span className="text-primary font-medium text-sm">{baraObj.nome} — &euro; {baraObj.prezzo}</span></div>}
                  {fioriSel.map(id=>{const p=attivi.find(x=>x.id===id);return p?<div key={id} className="flex justify-between py-2 border-b border-border"><span className="text-text-muted text-sm">{t('fioriLabel')}</span><span className="text-primary font-medium text-sm">{p.nome} — &euro; {p.prezzo}</span></div>:null})}
                  {extraSel.map(id=>{const p=attivi.find(x=>x.id===id);return p?<div key={id} className="flex justify-between py-2 border-b border-border"><span className="text-text-muted text-sm">{t('extraLabel')}</span><span className="text-primary font-medium text-sm">{p.nome} — &euro; {p.prezzo}</span></div>:null})}
                  <div className="pt-4 border-t-2 border-primary">
                    <div className="flex justify-between items-center mb-2"><span className="font-bold text-primary">{t('totaleLabel')}</span><span className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">&euro; {totale.toLocaleString('it-IT')}</span></div>
                    <div className="bg-secondary/10 rounded-xl p-4 text-center">
                      <p className="text-secondary font-medium">{numRate} {t('rateMensiliDa')}</p>
                      <p className="font-[family-name:var(--font-serif)] text-3xl text-secondary font-bold">&euro; {rataMensile}/mese</p>
                    </div>
                  </div>
                </div></div>
              )}

              {step === 8 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">{t('step8Titolo')}</h2>
                <p className="text-text-light mb-6">{t('step8Desc')}</p>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div><label className="block text-sm font-medium text-text mb-3">{t('modalitaContatto')}</label>
                  <div className="grid grid-cols-3 gap-3">{[{v:'telefonata',l:t('chiamata')},{v:'videochiamata',l:t('videochiamata')},{v:'whatsapp',l:t('whatsapp')}].map(o=>(
                    <label key={o.v} className="cursor-pointer"><input type="radio" name="modalita" value={o.v} className="peer sr-only" required />
                    <div className="product-card py-3 text-center peer-checked:border-secondary peer-checked:border-2 peer-checked:bg-secondary/5"><span className="text-sm font-medium text-primary">{o.l}</span></div></label>))}</div></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-text mb-1">{t('nomeLabel')}</label><input name="nome" required className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">{t('telefonoLabel')}</label><input name="telefono" required className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">{t('emailLabel')}</label><input name="email" type="email" className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">{t('quandoContattarvi')}</label>
                      <select name="orario" required className="input-field" onChange={e=>setMostraOrario(e.target.value==='orario_specifico')}>
                        <option value="">{t('selezionate')}</option><option value="Entro 30 minuti">{t('entro30min')}</option><option value="Entro 1 ora">{t('entro1ora')}</option><option value="Entro 2 ore">{t('entro2ore')}</option><option value="orario_specifico">{t('orarioSpecifico')}</option>
                      </select></div>
                    {mostraOrario&&<div><label className="block text-sm font-medium text-text mb-1">{t('orarioLabel')}</label><input name="orario_spec" type="time" required className="input-field" /></div>}
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" required className="w-5 h-5 mt-0.5 rounded" /><span className="text-sm text-text-light">{t('gdpr')}</span></label>
                  <button type="submit" className="btn-accent w-full py-4"><Send size={16} className="mr-2" /> {t('inviaRichiesta')}</button>
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-center">
                    <p className="text-primary font-medium text-sm">{t('consulenteInfo')}</p>
                    <p className="text-text-muted text-xs mt-1">{t('primoAddebito')}</p>
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

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24 card">
            <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">{t('preventivo')}</h3>
            <div className="space-y-3 text-sm">
              {beneficiario && <div className="flex justify-between"><span className="text-text-muted">{t('per')}</span><span className="text-primary">{beneficiario==='se_stesso'?t('meStesso'):beneficiarioNome||t('familiare')}</span></div>}
              {tipoServizio && <div className="flex justify-between"><span className="text-text-muted">{t('servizio')}</span><span className="text-primary">{tipoServizio}</span></div>}
              {baraObj && <div className="flex justify-between"><span className="text-text-muted">{t('bara')}</span><span className="text-primary">&euro; {baraObj.prezzo}</span></div>}
              {fioriSel.length > 0 && <div className="flex justify-between"><span className="text-text-muted">{t('fiori')}</span><span className="text-primary">&euro; {fioriTot}</span></div>}
              {extraSel.length > 0 && <div className="flex justify-between"><span className="text-text-muted">{t('extra')}</span><span className="text-primary">&euro; {extraTot}</span></div>}
              {totale > 0 && (<>
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-primary"><span>{t('totale')}</span><span className="font-[family-name:var(--font-serif)] text-lg">&euro; {totale.toLocaleString('it-IT')}</span></div>
                <div className="bg-secondary/10 rounded-lg p-3 text-center">
                  <p className="text-secondary text-xs">{t('piano')} {numRate} {t('rate')}</p>
                  <p className="font-[family-name:var(--font-serif)] text-xl text-secondary font-bold">&euro; {rataMensile}/mese</p>
                </div>
              </>)}
              {totale === 0 && <p className="text-text-muted text-xs italic">{t('sceltaAppariranno')}</p>}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <Lock size={12} className="text-accent" /><p className="text-[10px] text-text-muted">{t('fondiProtettiSidebar')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
