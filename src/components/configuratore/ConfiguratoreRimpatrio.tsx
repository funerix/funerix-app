'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, RotateCcw, Send, Plane, Globe } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { StepIndicator } from './StepIndicatorGeneric'
import { useConfiguratorSteps } from '@/hooks/useConfiguratorSteps'

const STEPS = ['Direzione', 'Zona', 'Paese', 'Servizi', 'Riepilogo', 'Contatto']

const zone = [
  { id: 'europa', label: 'Europa', base: 2500, paesi: ['Germania','Francia','Svizzera','Belgio','Olanda','Regno Unito','Spagna','Portogallo','Romania','Albania','Ucraina','Polonia','Grecia','Austria','Svezia','Norvegia','Danimarca','Irlanda','Rep. Ceca','Ungheria','Bulgaria','Croazia','Serbia','Bosnia','Montenegro','Kosovo','Macedonia del Nord','Moldavia','Bielorussia','Lituania','Lettonia','Estonia','Finlandia','Islanda','Lussemburgo','Malta','Cipro','Slovenia','Slovacchia'] },
  { id: 'nordafrica', label: 'Nord Africa e Medio Oriente', base: 3500, paesi: ['Marocco','Tunisia','Egitto','Algeria','Libia','Turchia','Israele','Giordania','Libano','Iraq','Iran','Arabia Saudita','Emirati Arabi','Qatar','Kuwait','Oman','Bahrain','Yemen','Siria'] },
  { id: 'americhe', label: 'Americhe', base: 6000, paesi: ['USA','Canada','Messico','Brasile','Argentina','Venezuela','Colombia','Perù','Cile','Ecuador','Bolivia','Uruguay','Paraguay','Cuba','Rep. Dominicana','Porto Rico','Guatemala','Honduras','El Salvador','Costa Rica','Panama','Haiti','Giamaica','Trinidad e Tobago'] },
  { id: 'asia', label: 'Asia e Oceania', base: 7000, paesi: ['Cina','India','Pakistan','Bangladesh','Filippine','Vietnam','Thailandia','Indonesia','Malesia','Giappone','Corea del Sud','Sri Lanka','Nepal','Myanmar','Cambogia','Laos','Mongolia','Afghanistan','Uzbekistan','Kazakhstan','Australia','Nuova Zelanda'] },
  { id: 'africa', label: 'Africa Sub-Sahariana', base: 5500, paesi: ['Nigeria','Senegal','Ghana','Costa d\'Avorio','Camerun','Congo','Etiopia','Kenya','Tanzania','Uganda','Mozambico','Angola','Sudafrica','Madagascar','Mali','Burkina Faso','Niger','Guinea','Sierra Leone','Liberia','Togo','Benin','Gabon','Ruanda','Somalia','Sudan','Eritrea'] },
]

const serviziExtra = [
  { id: 'tanatoprassi', label: 'Trattamento conservativo (tanatoprassi)', prezzo: 500 },
  { id: 'traduzione', label: 'Traduzione e legalizzazione documenti', prezzo: 300 },
  { id: 'accompagnamento', label: 'Accompagnamento familiare in aeroporto', prezzo: 200 },
  { id: 'cerimonia', label: 'Cerimonia prima della partenza', prezzo: 400 },
  { id: 'cofano_zinco', label: 'Cofano zincato IATA per trasporto aereo', prezzo: 800 },
  { id: 'assicurazione', label: 'Assicurazione trasporto', prezzo: 150 },
]

export function ConfiguratoreRimpatrio({ embedded = false }: { embedded?: boolean } = {}) {
  const { impostazioni } = useSitoStore()
  const { step, setStep, next, prev } = useConfiguratorSteps(STEPS.length)
  const [dir, setDir] = useState<'rimpatrio'|'espatrio'|''>('')
  const [zonaId, setZonaId] = useState('')
  const [paese, setPaese] = useState('')
  const [extras, setExtras] = useState<string[]>([])
  const [inviato, setInviato] = useState(false)
  const [tempoAttesa, setTempoAttesa] = useState('')
  const [mostraOrario, setMostraOrario] = useState(false)

  const zonaObj = zone.find(z => z.id === zonaId)
  const totExtras = extras.reduce((s, id) => s + (serviziExtra.find(e => e.id === id)?.prezzo || 0), 0)
  const totale = (zonaObj?.base || 0) + totExtras
  const toggleExtra = (id: string) => setExtras(p => p.includes(id) ? p.filter(e => e !== id) : [...p, id])

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
    <div className={embedded ? '' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'}>
      <div className="card text-center py-12 max-w-lg mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center"><Check size={32} className="text-accent" /></div>
        <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">Richiesta inviata</h2>
        <p className="text-text-light">Un consulente specializzato vi contatter&agrave; <strong>{tempoAttesa.toLowerCase()}</strong>.</p>
        <p className="font-[family-name:var(--font-serif)] text-xl text-primary font-bold mt-3">Stima: &euro; {totale.toLocaleString('it-IT')}</p>
      </div>
    </div>
  )

  return (
    <div className={embedded ? '' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'}>
      {/* Hero mini */}
      <div className="relative bg-primary rounded-2xl overflow-hidden mb-8">
        <Image src="/images/config-rimpatri-hero.jpg" alt="" fill className="object-cover opacity-25" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 to-primary/60" />
        <div className="relative text-center py-10 px-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Plane size={24} className="text-secondary-light" />
            <Globe size={24} className="text-secondary-light" />
          </div>
          <h1 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-white">Rimpatrio e Espatrio Salme</h1>
          <p className="mt-2 text-white/80 text-sm max-w-lg mx-auto">Trasporto internazionale in tutto il mondo. Assistenza completa 24 ore su 24, 7 giorni su 7.</p>
        </div>
      </div>

      <StepIndicator steps={STEPS} current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

              {step === 1 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Di cosa avete bisogno?</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => { setDir('rimpatrio'); next() }} className={dir==='rimpatrio'?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <Plane size={36} className="mx-auto mb-3 text-secondary" /><span className="block font-medium text-primary text-sm md:text-lg">Rimpatrio</span>
                    <span className="block text-text-muted text-sm mt-1">Decesso all&apos;estero</span></div>
                  <div onClick={() => { setDir('espatrio'); next() }} className={dir==='espatrio'?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <Globe size={36} className="mx-auto mb-3 text-secondary" /><span className="block font-medium text-primary text-sm md:text-lg">Espatrio dall&apos;Italia</span>
                    <span className="block text-text-muted text-sm mt-1">Trasporto verso l&apos;estero</span></div>
                </div></div>
              )}

              {step === 2 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">{dir==='rimpatrio'?'Da quale zona?':'Verso quale zona?'}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{zone.map(z => (
                  <div key={z.id} onClick={() => setZonaId(z.id)} className={zonaId===z.id?'product-card-selected text-center py-5 md:py-8':'product-card text-center py-5 md:py-8'}>
                    <h3 className="font-[family-name:var(--font-serif)] text-sm md:text-lg text-primary mb-1">{z.label}</h3>
                    <p className="text-text-light text-[10px] md:text-sm">da &euro; {z.base.toLocaleString('it-IT')}</p>
                    <span className="block text-text-muted text-[10px] mt-1">{z.paesi.length} paesi</span>
                  </div>))}</div></div>
              )}

              {step === 3 && zonaObj && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Paese</h2>
                <select className="input-field text-lg" value={paese} onChange={e => setPaese(e.target.value)}>
                  <option value="">Selezionate il paese...</option>
                  {zonaObj.paesi.sort().map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {paese && <p className="mt-4 text-text-light text-sm">Costo base trasporto {dir==='rimpatrio'?'da':'verso'} <strong>{paese}</strong>: <strong>&euro; {zonaObj.base.toLocaleString('it-IT')}</strong></p>}
                </div>
              )}

              {step === 4 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">Servizi aggiuntivi</h2>
                <p className="text-text-light text-sm mb-6">Selezionate i servizi necessari</p>
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
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">Riepilogo</h2>
                <div className="space-y-3">
                  <Row label="Direzione" value={dir==='rimpatrio'?'Rimpatrio in Italia':'Espatrio'} onEdit={()=>setStep(1)} />
                  <Row label="Zona" value={zonaObj?.label} prezzo={zonaObj?.base} onEdit={()=>setStep(2)} />
                  <Row label="Paese" value={paese} onEdit={()=>setStep(3)} />
                  {extras.map(id=>{const e=serviziExtra.find(x=>x.id===id);return e?<Row key={id} label="Extra" value={e.label} prezzo={e.prezzo} onEdit={()=>setStep(4)} />:null})}
                  <div className="border-t-2 border-primary pt-4 flex justify-between items-center">
                    <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-bold">Totale indicativo</span>
                    <span className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">&euro; {totale.toLocaleString('it-IT')}</span>
                  </div>
                  <p className="text-xs text-text-muted">Il costo definitivo sar&agrave; concordato dopo valutazione del caso specifico.</p>
                </div></div>
              )}

              {step === 6 && (
                <div><h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">Richiesta di contatto</h2>
                <p className="text-text-light mb-6">Un consulente specializzato in trasporti internazionali vi accompagner&agrave;.</p>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div><label className="block text-sm font-medium text-text mb-3">Modalit&agrave; di contatto *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[{v:'telefonata',l:'Chiamata'},{v:'videochiamata',l:'Videochiamata'},{v:'whatsapp',l:'WhatsApp'}].map(o=>(
                      <label key={o.v} className="cursor-pointer"><input type="radio" name="modalita" value={o.v} className="peer sr-only" required />
                      <div className="product-card py-3 text-center peer-checked:border-secondary peer-checked:border-2 peer-checked:bg-secondary/5">
                        <span className="text-sm font-medium text-primary">{o.l}</span></div></label>))}
                  </div></div>
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
                    {mostraOrario&&<div><label className="block text-sm font-medium text-text mb-1">Orario</label><input name="orario_spec" type="time" required className="input-field" /></div>}
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" required className="w-5 h-5 mt-0.5 rounded" />
                    <span className="text-sm text-text-light">Acconsento al trattamento dei dati personali ai sensi del GDPR. *</span></label>
                  <button type="submit" className="btn-accent w-full py-4"><Send size={16} className="mr-2" /> Invia Richiesta Urgente</button>
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-center">
                    <p className="text-primary font-medium text-sm">Servizio urgenze 24/7. Un consulente specializzato vi contatter&agrave; nei tempi scelti.</p>
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

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24 card">
            <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">Il tuo preventivo</h3>
            <div className="space-y-3 text-sm">
              {dir && <SItem label="Tipo" value={dir==='rimpatrio'?'Rimpatrio':'Espatrio'} />}
              {zonaObj && <SItem label="Zona" value={zonaObj.label} prezzo={zonaObj.base} />}
              {paese && <SItem label="Paese" value={paese} />}
              {extras.map(id=>{const e=serviziExtra.find(x=>x.id===id);return e?<SItem key={id} label="Extra" value={e.label} prezzo={e.prezzo} />:null})}
              {totale > 0 && <div className="border-t border-border pt-3 flex justify-between font-semibold text-primary">
                <span>Totale</span><span className="font-[family-name:var(--font-serif)] text-lg">&euro; {totale.toLocaleString('it-IT')}</span></div>}
              {totale === 0 && <p className="text-text-muted text-xs italic">Le scelte appariranno qui.</p>}
              <p className="text-[10px] text-text-muted mt-4 border-t border-border pt-3">Preventivo indicativo. Il costo definitivo dipende dal caso specifico.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
