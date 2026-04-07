'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, RotateCcw, Send, Plane, Globe } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { StepIndicator } from './StepIndicatorGeneric'
import { useTranslations } from 'next-intl'

export function ConfiguratoreRimpatrio() {
  const t = useTranslations('configRimpatrio')
  const { impostazioni } = useSitoStore()
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState<'rimpatrio'|'espatrio'|''>('')
  const [zonaId, setZonaId] = useState('')
  const [paese, setPaese] = useState('')
  const [extras, setExtras] = useState<string[]>([])
  const [inviato, setInviato] = useState(false)
  const [tempoAttesa, setTempoAttesa] = useState('')
  const [mostraOrario, setMostraOrario] = useState(false)

  const STEPS = [t('step1'), t('step2'), t('step3'), t('step4'), t('step5'), t('step6')]

  const zone = [
    { id: 'europa', label: t('zona_europa'), base: 2500, paesi: ['Germania','Francia','Svizzera','Belgio','Olanda','Regno Unito','Spagna','Portogallo','Romania','Albania','Ucraina','Polonia','Grecia','Austria','Svezia','Norvegia','Danimarca','Irlanda','Rep. Ceca','Ungheria','Bulgaria','Croazia','Serbia','Bosnia','Montenegro','Kosovo','Macedonia del Nord','Moldavia','Bielorussia','Lituania','Lettonia','Estonia','Finlandia','Islanda','Lussemburgo','Malta','Cipro','Slovenia','Slovacchia'] },
    { id: 'nordafrica', label: t('zona_nordafrica'), base: 3500, paesi: ['Marocco','Tunisia','Egitto','Algeria','Libia','Turchia','Israele','Giordania','Libano','Iraq','Iran','Arabia Saudita','Emirati Arabi','Qatar','Kuwait','Oman','Bahrain','Yemen','Siria'] },
    { id: 'americhe', label: t('zona_americhe'), base: 6000, paesi: ['USA','Canada','Messico','Brasile','Argentina','Venezuela','Colombia','Perù','Cile','Ecuador','Bolivia','Uruguay','Paraguay','Cuba','Rep. Dominicana','Porto Rico','Guatemala','Honduras','El Salvador','Costa Rica','Panama','Haiti','Giamaica','Trinidad e Tobago'] },
    { id: 'asia', label: t('zona_asia'), base: 7000, paesi: ['Cina','India','Pakistan','Bangladesh','Filippine','Vietnam','Thailandia','Indonesia','Malesia','Giappone','Corea del Sud','Sri Lanka','Nepal','Myanmar','Cambogia','Laos','Mongolia','Afghanistan','Uzbekistan','Kazakhstan','Australia','Nuova Zelanda'] },
    { id: 'africa', label: t('zona_africa'), base: 5500, paesi: ['Nigeria','Senegal','Ghana','Costa d\'Avorio','Camerun','Congo','Etiopia','Kenya','Tanzania','Uganda','Mozambico','Angola','Sudafrica','Madagascar','Mali','Burkina Faso','Niger','Guinea','Sierra Leone','Liberia','Togo','Benin','Gabon','Ruanda','Somalia','Sudan','Eritrea'] },
  ]

  const serviziExtra = [
    { id: 'tanatoprassi', label: t('extra_tanatoprassi'), prezzo: 500 },
    { id: 'traduzione', label: t('extra_traduzione'), prezzo: 300 },
    { id: 'accompagnamento', label: t('extra_accompagnamento'), prezzo: 200 },
    { id: 'cerimonia', label: t('extra_cerimonia'), prezzo: 400 },
    { id: 'cofano_zinco', label: t('extra_cofano_zinco'), prezzo: 800 },
    { id: 'assicurazione', label: t('extra_assicurazione'), prezzo: 150 },
  ]

  const zonaObj = zone.find(z => z.id === zonaId)
  const totExtras = extras.reduce((s, id) => s + (serviziExtra.find(e => e.id === id)?.prezzo || 0), 0)
  const totale = (zonaObj?.base || 0) + totExtras
  const toggleExtra = (id: string) => setExtras(p => p.includes(id) ? p.filter(e => e !== id) : [...p, id])

  const next = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => Math.min(STEPS.length, s + 1)) }
  const prev = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => Math.max(1, s - 1)) }
  const reset = () => { setStep(1); setDir(''); setZonaId(''); setPaese(''); setExtras([]) }

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
      `Direzione: ${dir === 'rimpatrio' ? 'Rimpatrio in Italia' : 'Espatrio dall\'Italia'}`,
      `Zona: ${zonaObj?.label} — €${zonaObj?.base}`,
      `Paese: ${paese}`,
      ...extras.map(id => { const e = serviziExtra.find(x => x.id === id); return e ? `Extra: ${e.label} — €${e.prezzo}` : '' }),
    ].filter(Boolean).join('\n')

    await useSitoStore.getState().aggiungiRichiesta({
      nome, telefono: tel, email, modalita, orario,
      note: `${dir === 'rimpatrio' ? 'RIMPATRIO' : 'ESPATRIO'} — ${paese}`,
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
      <p className="font-[family-name:var(--font-serif)] text-xl text-primary font-bold mt-3">{t('stima')}&euro; {totale.toLocaleString('it-IT')}</p>
    </div>
  )

  return (
    <>
      {/* Hero mini */}
      <div className="relative bg-primary rounded-2xl overflow-hidden mb-8">
        <Image src="/images/config-rimpatri-hero.jpg" alt="" fill className="object-cover opacity-25" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 to-primary/60" />
        <div className="relative text-center py-10 px-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Plane size={24} className="text-secondary-light" />
            <Globe size={24} className="text-secondary-light" />
          </div>
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
                  <div onClick={() => { setDir('rimpatrio'); next() }} className={dir==='rimpatrio'?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <Plane size={36} className="mx-auto mb-3 text-secondary" /><span className="block font-medium text-primary text-sm md:text-lg">{t('rimpatrioLabel')}</span>
                    <span className="block text-text-muted text-sm mt-1">{t('rimpatrioDesc')}</span></div>
                  <div onClick={() => { setDir('espatrio'); next() }} className={dir==='espatrio'?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <Globe size={36} className="mx-auto mb-3 text-secondary" /><span className="block font-medium text-primary text-sm md:text-lg">{t('espatrioLabel')}</span>
                    <span className="block text-text-muted text-sm mt-1">{t('espatrioDesc')}</span></div>
                </div></div>
              )}

              {step === 2 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{dir==='rimpatrio'?t('step2TitoloRimpatrio'):t('step2TitoloEspatrio')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{zone.map(z => (
                  <div key={z.id} onClick={() => setZonaId(z.id)} className={zonaId===z.id?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <h3 className="font-[family-name:var(--font-serif)] text-sm md:text-lg text-primary mb-1">{z.label}</h3>
                    <p className="text-text-light text-[10px] md:text-sm">{t('da')} &euro; {z.base.toLocaleString('it-IT')}</p>
                    <span className="block text-text-muted text-[10px] mt-1">{z.paesi.length} {t('paesi')}</span>
                  </div>))}</div></div>
              )}

              {step === 3 && zonaObj && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('step3Titolo')}</h2>
                <select className="input-field text-lg" value={paese} onChange={e => setPaese(e.target.value)}>
                  <option value="">{t('selezionatePaese')}</option>
                  {zonaObj.paesi.sort().map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {paese && <p className="mt-4 text-text-light text-sm">{t('costBaseTrasp')} {dir==='rimpatrio'?t('da'):t('verso')} <strong>{paese}</strong>: <strong>&euro; {zonaObj.base.toLocaleString('it-IT')}</strong></p>}
                </div>
              )}

              {step === 4 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">{t('step4Titolo')}</h2>
                <p className="text-text-light text-sm mb-6">{t('step4Desc')}</p>
                <div className="space-y-3">{serviziExtra.map(s => (
                  <div key={s.id} onClick={() => toggleExtra(s.id)}
                    className={extras.includes(s.id)?'product-card-selected':'product-card'}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-primary text-sm">{s.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-[family-name:var(--font-serif)] text-primary font-semibold">&euro; {s.prezzo}</span>
                        {extras.includes(s.id)&&<Check size={16} className="text-accent" />}
                      </div>
                    </div></div>))}</div></div>
              )}

              {step === 5 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{t('step5Titolo')}</h2>
                <div className="space-y-3">
                  <Row label={t('step5LabelDirezione')} value={dir==='rimpatrio'?t('rimpatrioInItalia'):t('espatrio')} onEdit={()=>setStep(1)} />
                  <Row label={t('step5LabelZona')} value={zonaObj?.label} prezzo={zonaObj?.base} onEdit={()=>setStep(2)} />
                  <Row label={t('step5LabelPaese')} value={paese} onEdit={()=>setStep(3)} />
                  {extras.map(id=>{const e=serviziExtra.find(x=>x.id===id);return e?<Row key={id} label={t('step5LabelExtra')} value={e.label} prezzo={e.prezzo} onEdit={()=>setStep(4)} />:null})}
                  <div className="border-t-2 border-primary pt-4 flex justify-between items-center">
                    <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-bold">{t('totaleIndicativo')}</span>
                    <span className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">&euro; {totale.toLocaleString('it-IT')}</span>
                  </div>
                  <p className="text-xs text-text-muted">{t('costoDefinitivo')}</p>
                </div></div>
              )}

              {step === 6 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">{t('step6Titolo')}</h2>
                <p className="text-text-light mb-6">{t('step6Desc')}</p>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div><label className="block text-sm font-medium text-text mb-3">{t('modalitaContatto')}</label>
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
                    <p className="text-primary font-medium text-sm">{t('urgenze247')}</p>
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
              {dir && <SItem label={t('tipo')} value={dir==='rimpatrio'?t('rimpatrioSidebar'):t('espatrioSidebar')} />}
              {zonaObj && <SItem label={t('zona')} value={zonaObj.label} prezzo={zonaObj.base} />}
              {paese && <SItem label={t('paese')} value={paese} />}
              {extras.map(id=>{const e=serviziExtra.find(x=>x.id===id);return e?<SItem key={id} label={t('extra')} value={e.label} prezzo={e.prezzo} />:null})}
              {totale > 0 && <div className="border-t border-border pt-3 flex justify-between font-semibold text-primary">
                <span>{t('totale')}</span><span className="font-[family-name:var(--font-serif)] text-lg">&euro; {totale.toLocaleString('it-IT')}</span></div>}
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
    <div className="flex items-center gap-4">{prezzo!=null&&<span className="font-[family-name:var(--font-serif)] text-lg text-primary">&euro; {prezzo.toLocaleString('it-IT')}</span>}
    {onEdit&&<button onClick={onEdit} className="text-secondary text-sm hover:underline">Modifica</button>}</div></div>
}

function SItem({ label, value, prezzo }: { label: string; value: string; prezzo?: number }) {
  return <div className="flex justify-between items-start gap-2">
    <div className="min-w-0"><span className="text-text-muted text-xs">{label}</span><p className="text-text truncate">{value}</p></div>
    {prezzo!=null&&<span className="text-primary font-medium whitespace-nowrap">&euro; {prezzo.toLocaleString('it-IT')}</span>}</div>
}
