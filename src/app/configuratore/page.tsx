'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, RotateCcw, Cross } from 'lucide-react'
import Image from 'next/image'
import { useConfiguratoreStore, TOTAL_STEPS } from '@/store/configuratore'
import { StepIndicator } from '@/components/configuratore/StepIndicator'
import { ProductSelector } from '@/components/configuratore/ProductSelector'
import { ConfiguratoreAnimale } from '@/components/configuratore/ConfiguratoreAnimale'
import { ConfiguratoreRimpatrio } from '@/components/configuratore/ConfiguratoreRimpatrio'
import { ConfiguratorePrevidenza } from '@/components/configuratore/ConfiguratorePrevidenza'
import { useSitoStore } from '@/store/sito'
import { useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabase-client'
import { TipoServizio, TipoCerimonia } from '@/types'
import { useState, useEffect, Suspense } from 'react'
import { useTranslations } from 'next-intl'

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -200 : 200, opacity: 0 }),
}

export default function ConfiguratorePageWrapper() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" /></div>}><ConfiguratorePage /></Suspense>
}

function ConfiguratorePage() {
  const t = useTranslations('configuratore')
  const store = useConfiguratoreStore()
  const { prodotti, categorie } = useSitoStore()
  const totale = store.totale()
  const [mostraOrarioSpecifico, setMostraOrarioSpecifico] = useState(false)
  const [richiestaInviata, setRichiestaInviata] = useState(false)
  const [tempoAttesa, setTempoAttesa] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [referralSconto, setReferralSconto] = useState(0)

  // Leggi codice referral dall'URL
  const searchParams = useSearchParams()
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref && !referralCode) {
      getSupabase().from('referral').select('codice, sconto_percentuale, attivo').eq('codice', ref).eq('attivo', true).single()
        .then(({ data }: { data: unknown }) => {
          const r = data as { codice: string; sconto_percentuale: number } | null
          if (r) { setReferralCode(r.codice); setReferralSconto(r.sconto_percentuale) }
        })
    }
  }, [searchParams, referralCode])

  const totaleConSconto = referralSconto > 0 ? Math.round(totale * (1 - referralSconto / 100)) : totale
  const attivi = prodotti.filter((p) => p.attivo)
  const catId = (slug: string) => categorie.find(c => c.slug === slug)?.id || ''
  const bare = attivi.filter((p) => p.categoriaId === catId('bare'))
  const urne = attivi.filter((p) => p.categoriaId === catId('urne'))
  const auto = attivi.filter((p) => p.categoriaId === catId('auto-funebri'))
  const fiori = attivi.filter((p) => p.categoriaId === catId('fiori'))
  const servizi = attivi.filter((p) => p.categoriaId === catId('servizi'))

  const [tipoConfigurazione, setTipoConfigurazione] = useState<'funebre' | 'animale' | 'rimpatrio' | 'previdenza'>('funebre')

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Selettore tipo servizio */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-8">
          {([
            { id: 'funebre' as const, labelKey: 'tipoServizioFunebre', descKey: 'tipoServizioFunebreDesc' },
            { id: 'animale' as const, labelKey: 'tipoServizioAnimale', descKey: 'tipoServizioAnimaleDesc' },
            { id: 'rimpatrio' as const, labelKey: 'tipoServizioRimpatrio', descKey: 'tipoServizioRimpatrioDesc' },
            { id: 'previdenza' as const, labelKey: 'tipoServizioPrevidenza', descKey: 'tipoServizioPrevidenzaDesc' },
          ] as const).map(tab => (
            <button key={tab.id} onClick={() => setTipoConfigurazione(tab.id)}
              className={`px-3 md:px-5 py-3 rounded-xl text-center transition-all ${
                tipoConfigurazione === tab.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-surface border border-border text-text-light'
              }`}>
              <span className="block text-xs md:text-sm font-medium">{t(tab.labelKey)}</span>
              <span className={`block text-[9px] md:text-[10px] mt-0.5 ${tipoConfigurazione === tab.id ? 'text-white/70' : 'text-text-muted'}`}>{t(tab.descKey)}</span>
            </button>
          ))}
        </div>

        {/* Redirect per animale e rimpatrio */}
        {tipoConfigurazione === 'animale' && <ConfiguratoreAnimale />}
        {tipoConfigurazione === 'rimpatrio' && <ConfiguratoreRimpatrio />}
        {tipoConfigurazione === 'previdenza' && <ConfiguratorePrevidenza />}

        {tipoConfigurazione === 'funebre' && (<>
        {/* Hero card */}
        <div className="relative bg-primary rounded-2xl overflow-hidden mb-8">
          <Image src="/images/card-servizio-funebre.jpg" alt="" fill className="object-cover opacity-25" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 to-primary/60" />
          <div className="relative text-center py-10 px-6">
            <Cross size={28} className="mx-auto mb-3 text-secondary-light" />
            <h1 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-white">{t('configuraServizioFunebre')}</h1>
            <p className="mt-2 text-white/80 text-sm max-w-lg mx-auto">{t('nessunObbligo')}</p>
          </div>
        </div>

        <StepIndicator currentStep={store.step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait" custom={1}>
              <motion.div
                key={store.step}
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {/* STEP 1: Tipo Servizio */}
                {store.step === 1 && (
                  <div>
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">
                      {t('step1Titolo')}
                    </h2>
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                      {([
                        { value: 'inumazione', labelKey: 'inumazione', descKey: 'inumazioneDesc' },
                        { value: 'tumulazione', labelKey: 'tumulazione', descKey: 'tumuazioneDesc' },
                        { value: 'cremazione', labelKey: 'cremazione', descKey: 'cremazioneDesc' },
                      ] as const).map((tipo) => (
                        <div
                          key={tipo.value}
                          onClick={() => store.setTipoServizio(tipo.value as TipoServizio)}
                          className={
                            store.tipoServizio === tipo.value
                              ? 'product-card-selected text-center py-5 md:py-8'
                              : 'product-card text-center py-5 md:py-8'
                          }
                        >
                          <h3 className="font-[family-name:var(--font-serif)] text-sm md:text-lg text-primary mb-1">
                            {t(tipo.labelKey)}
                          </h3>
                          <p className="text-text-light text-[10px] md:text-sm">{t(tipo.descKey)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Bara / Urna */}
                {store.step === 2 && (
                  <div>
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">
                      {store.tipoServizio === 'cremazione' ? t('step2TitoloBaraUrna') : t('step2TitoloBara')}
                    </h2>
                    <ProductSelector
                      prodotti={bare}
                      selected={store.bara}
                      onSelect={store.setBara}
                    />
                    {store.tipoServizio === 'cremazione' && (
                      <div className="mt-10">
                        <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">
                          {t('urnaCineraria')}
                        </h3>
                        <ProductSelector
                          prodotti={urne}
                          selected={store.urna}
                          onSelect={store.setUrna}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: Trasporto */}
                {store.step === 3 && (
                  <div>
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">
                      {t('step3Titolo')}
                    </h2>
                    <ProductSelector
                      prodotti={auto}
                      selected={store.autoFunebre}
                      onSelect={store.setAutoFunebre}
                    />
                    <div className="mt-8 card">
                      <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">
                        {t('percorso')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder={t('partenzaPlaceholder')}
                          className="input-field"
                          value={store.percorso?.partenza || ''}
                          onChange={(e) =>
                            store.setPercorso({
                              partenza: e.target.value,
                              chiesa: store.percorso?.chiesa || '',
                              destinazione: store.percorso?.destinazione || '',
                              distanzaKm: store.percorso?.distanzaKm || 0,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder={t('chiesaPlaceholder')}
                          className="input-field"
                          value={store.percorso?.chiesa || ''}
                          onChange={(e) =>
                            store.setPercorso({
                              partenza: store.percorso?.partenza || '',
                              chiesa: e.target.value,
                              destinazione: store.percorso?.destinazione || '',
                              distanzaKm: store.percorso?.distanzaKm || 0,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder={t('destinazionePlaceholder')}
                          className="input-field"
                          value={store.percorso?.destinazione || ''}
                          onChange={(e) =>
                            store.setPercorso({
                              partenza: store.percorso?.partenza || '',
                              chiesa: store.percorso?.chiesa || '',
                              destinazione: e.target.value,
                              distanzaKm: store.percorso?.distanzaKm || 0,
                            })
                          }
                        />
                        <div>
                          <input
                            type="number"
                            placeholder={t('distanzaPlaceholder')}
                            className="input-field"
                            value={store.percorso?.distanzaKm || ''}
                            onChange={(e) =>
                              store.setPercorso({
                                partenza: store.percorso?.partenza || '',
                                chiesa: store.percorso?.chiesa || '',
                                destinazione: store.percorso?.destinazione || '',
                                distanzaKm: Number(e.target.value) || 0,
                              })
                            }
                          />
                          <p className="text-xs text-text-muted mt-1">
                            {t('kmInclusi')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Cerimonia */}
                {store.step === 4 && (
                  <div>
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">
                      {t('step4Titolo')}
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-text mb-3">{t('tipoCerimonia')}</label>
                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                          {([
                            { value: 'cattolica', labelKey: 'cattolica' },
                            { value: 'altra_confessione', labelKey: 'altraConfessione' },
                            { value: 'laica', labelKey: 'laica' },
                          ] as const).map((tipo) => (
                            <div
                              key={tipo.value}
                              onClick={() =>
                                store.setCerimonia({
                                  tipo: tipo.value as TipoCerimonia,
                                  luogo: store.cerimonia?.luogo || '',
                                  musica: store.cerimonia?.musica || false,
                                  libroFirme: store.cerimonia?.libroFirme || false,
                                })
                              }
                              className={
                                store.cerimonia?.tipo === tipo.value
                                  ? 'product-card-selected text-center py-5 md:py-8'
                                  : 'product-card text-center py-5 md:py-8'
                              }
                            >
                              <span className="font-medium text-primary">{t(tipo.labelKey)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text mb-2">{t('luogoCerimonia')}</label>
                        <input
                          type="text"
                          placeholder={t('luogoCerimoniaPlaceholder')}
                          className="input-field"
                          value={store.cerimonia?.luogo || ''}
                          onChange={(e) =>
                            store.setCerimonia({
                              tipo: store.cerimonia?.tipo || null,
                              luogo: e.target.value,
                              musica: store.cerimonia?.musica || false,
                              libroFirme: store.cerimonia?.libroFirme || false,
                            })
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={store.cerimonia?.musica || false}
                            onChange={(e) =>
                              store.setCerimonia({
                                tipo: store.cerimonia?.tipo || null,
                                luogo: store.cerimonia?.luogo || '',
                                musica: e.target.checked,
                                libroFirme: store.cerimonia?.libroFirme || false,
                              })
                            }
                            className="w-5 h-5 rounded border-border text-secondary focus:ring-secondary"
                          />
                          <span className="text-text">{t('musicaCerimonia')}</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={store.cerimonia?.libroFirme || false}
                            onChange={(e) =>
                              store.setCerimonia({
                                tipo: store.cerimonia?.tipo || null,
                                luogo: store.cerimonia?.luogo || '',
                                musica: store.cerimonia?.musica || false,
                                libroFirme: e.target.checked,
                              })
                            }
                            className="w-5 h-5 rounded border-border text-secondary focus:ring-secondary"
                          />
                          <span className="text-text">{t('libroFirme')}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Fiori */}
                {store.step === 5 && (
                  <div>
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">
                      {t('step5Titolo')}
                    </h2>
                    <p className="text-text-light text-sm mb-6">
                      {t('step5Desc')}
                    </p>
                    <ProductSelector
                      prodotti={fiori}
                      selected={store.fiori}
                      onToggle={store.toggleFiore}
                      multiple
                    />
                  </div>
                )}

                {/* STEP 6: Servizi Extra */}
                {store.step === 6 && (
                  <div>
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">
                      {t('step6Titolo')}
                    </h2>
                    <p className="text-text-light text-sm mb-6">
                      {t('step6Desc')}
                    </p>
                    <ProductSelector
                      prodotti={servizi}
                      selected={store.serviziExtra}
                      onToggle={store.toggleServizioExtra}
                      multiple
                    />
                  </div>
                )}

                {/* STEP 7: Riepilogo */}
                {store.step === 7 && (
                  <div>
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">
                      {t('step7Titolo')}
                    </h2>
                    <div className="space-y-4">
                      <RiepilogoRow label={t('tipoServizio')} value={store.tipoServizio || '—'} onEdit={() => store.setStep(1)} nonSelezionatoLabel={t('nonSelezionato')} />
                      <RiepilogoRow label={t('bara')} value={store.bara?.nome} prezzo={store.bara?.prezzo} onEdit={() => store.setStep(2)} nonSelezionatoLabel={t('nonSelezionato')} />
                      {store.tipoServizio === 'cremazione' && (
                        <RiepilogoRow label={t('urna')} value={store.urna?.nome} prezzo={store.urna?.prezzo} onEdit={() => store.setStep(2)} nonSelezionatoLabel={t('nonSelezionato')} />
                      )}
                      <RiepilogoRow label={t('autoFunebre')} value={store.autoFunebre?.nome} prezzo={store.autoFunebre?.prezzo} onEdit={() => store.setStep(3)} nonSelezionatoLabel={t('nonSelezionato')} />
                      {store.percorso && store.percorso.distanzaKm > 20 && (
                        <RiepilogoRow label={t('supplementoKm')} value={`${store.percorso.distanzaKm - 20} km extra`} prezzo={(store.percorso.distanzaKm - 20) * 3} />
                      )}
                      <RiepilogoRow
                        label={t('cerimonia')}
                        value={store.cerimonia?.tipo ? `${store.cerimonia.tipo} — ${store.cerimonia.luogo || 'luogo da definire'}` : undefined}
                        onEdit={() => store.setStep(4)}
                        nonSelezionatoLabel={t('nonSelezionato')}
                      />
                      {store.fiori.map((f) => (
                        <RiepilogoRow key={f.id} label={t('fiori')} value={f.nome} prezzo={f.prezzo} onEdit={() => store.setStep(5)} nonSelezionatoLabel={t('nonSelezionato')} />
                      ))}
                      {store.serviziExtra.map((s) => (
                        <RiepilogoRow key={s.id} label={t('servizioExtra')} value={s.nome} prezzo={s.prezzo} onEdit={() => store.setStep(6)} nonSelezionatoLabel={t('nonSelezionato')} />
                      ))}

                      {referralSconto > 0 && (
                        <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg flex justify-between items-center">
                          <span className="text-accent text-sm font-medium">{t('scontoReferral')} ({referralCode}): -{referralSconto}%</span>
                          <span className="text-accent font-bold">-&euro; {(totale - totaleConSconto).toLocaleString('it-IT')}</span>
                        </div>
                      )}
                      <div className="border-t-2 border-primary pt-4 mt-4 flex justify-between items-center">
                        <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-bold">{t('totaleIndicativo')}</span>
                        <div className="text-right">
                          {referralSconto > 0 && <span className="text-text-muted text-sm line-through block">&euro; {totale.toLocaleString('it-IT')}</span>}
                          <span className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">&euro; {totaleConSconto.toLocaleString('it-IT')}</span>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-background-dark rounded-lg border border-border">
                        <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
                          {t('avvisoLegaleTitolo')}
                        </p>
                        <p className="text-xs text-text-light leading-relaxed">
                          {t('avvisoLegale1')}
                        </p>
                        <p className="text-xs text-text-light leading-relaxed mt-2">
                          {t('avvisoLegale2')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 8: Richiesta Contatto */}
                {store.step === 8 && (
                  <div>
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">
                      {t('step8Titolo')}
                    </h2>
                    <p className="text-text-light mb-6 leading-relaxed">
                      {t('step8Desc')}
                    </p>

                    <form
                      className="space-y-5"
                      onSubmit={async (e) => {
                        e.preventDefault()
                        const form = e.target as HTMLFormElement
                        const modalita = form.querySelector('input[name="modalita"]:checked') as HTMLInputElement
                        if (!modalita) {
                          alert(t('selezionaModalita'))
                          return
                        }

                        const nome = (form.querySelector('input[name="nome"]') as HTMLInputElement)?.value || ''
                        const tel = (form.querySelector('input[name="telefono"]') as HTMLInputElement)?.value || ''
                        const email = (form.querySelector('input[name="email"]') as HTMLInputElement)?.value || ''
                        let orario = (form.querySelector('select[name="orario"]') as HTMLSelectElement)?.value || ''
                        if (orario === 'orario_specifico') {
                          const oraSpec = (form.querySelector('input[name="orario_specifico"]') as HTMLInputElement)?.value
                          orario = oraSpec ? `Alle ore ${oraSpec}` : 'Orario specifico non indicato'
                        }
                        const note = (form.querySelector('textarea[name="note"]') as HTMLTextAreaElement)?.value || ''

                        // Costruisci riepilogo configurazione
                        const righe: string[] = []
                        righe.push(`Tipo servizio: ${store.tipoServizio || 'Non selezionato'}`)
                        if (store.bara) righe.push(`Bara: ${store.bara.nome} — €${store.bara.prezzo}`)
                        if (store.urna) righe.push(`Urna: ${store.urna.nome} — €${store.urna.prezzo}`)
                        if (store.autoFunebre) righe.push(`Trasporto: ${store.autoFunebre.nome} — €${store.autoFunebre.prezzo}`)
                        if (store.percorso?.partenza) righe.push(`Percorso: ${store.percorso.partenza} → ${store.percorso.chiesa || '...'} → ${store.percorso.destinazione || '...'} (${store.percorso.distanzaKm} km)`)
                        if (store.cerimonia?.tipo) righe.push(`Cerimonia: ${store.cerimonia.tipo} — ${store.cerimonia.luogo || 'da definire'}`)
                        store.fiori.forEach(f => righe.push(`Fiori: ${f.nome} — €${f.prezzo}`))
                        store.serviziExtra.forEach(s => righe.push(`Extra: ${s.nome} — €${s.prezzo}`))

                        // Salva la richiesta nel database (visibile in admin)
                        await useSitoStore.getState().aggiungiRichiesta({
                          nome,
                          telefono: tel,
                          email,
                          modalita: modalita.value,
                          orario,
                          note,
                          configurazione: righe.join('\n') + (referralCode ? `\nReferral: ${referralCode} (-${referralSconto}%)` : ''),
                          totale: totaleConSconto,
                          stato: 'nuova',
                          createdAt: new Date().toISOString(),
                        })

                        // Incrementa utilizzi referral
                        if (referralCode) {
                          const sb = getSupabase()
                          const { data: ref } = await sb.from('referral').select('id, utilizzi').eq('codice', referralCode).single() as { data: { id: string; utilizzi: number } | null }
                          if (ref) await sb.from('referral').update({ utilizzi: ref.utilizzi + 1 }).eq('id', ref.id)
                        }

                        // Notifica consulente (WhatsApp Business API + email)
                        // L'API legge le impostazioni dal DB e invia automaticamente
                        const nuovaRichiesta = useSitoStore.getState().richieste[0]
                        if (nuovaRichiesta) {
                          fetch('/api/notifica', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ richiestaId: nuovaRichiesta.id }),
                          }).catch(() => {})
                        }

                        // Mostra modale di conferma
                        setTempoAttesa(orario)
                        setRichiestaInviata(true)
                      }}
                    >
                      {/* Modalit&agrave; di contatto — obbligatoria */}
                      <div>
                        <label className="block text-sm font-medium text-text mb-3">
                          {t('comePreferite')}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {[
                            { value: 'telefonata', labelKey: 'chiamataLabel', descKey: 'chiamataDesc' },
                            { value: 'videochiamata', labelKey: 'videochimataLabel', descKey: 'videochimataDesc' },
                            { value: 'whatsapp', labelKey: 'whatsappLabel', descKey: 'whatsappDesc' },
                          ].map((opt) => (
                            <label key={opt.value} className="cursor-pointer">
                              <input type="radio" name="modalita" value={opt.value} className="peer sr-only" required />
                              <div className="product-card py-4 px-4 text-center peer-checked:border-secondary peer-checked:border-2 peer-checked:bg-secondary/5">
                                <span className="block font-medium text-primary text-sm">{t(opt.labelKey)}</span>
                                <span className="block text-text-muted text-xs mt-1">{t(opt.descKey)}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">{t('nomeCognome')}</label>
                          <input type="text" name="nome" required className="input-field" placeholder="Mario Rossi" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">{t('telefonoLabel')}</label>
                          <input type="tel" name="telefono" required className="input-field" placeholder="333 1234567" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">{t('emailLabel')}</label>
                          <input type="email" name="email" className="input-field" placeholder="mario.rossi@email.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">{t('quandoContatto')}</label>
                          <select
                            name="orario"
                            required
                            className="input-field"
                            onChange={(e) => setMostraOrarioSpecifico(e.target.value === 'orario_specifico')}
                          >
                            <option value="">{t('selezionate')}</option>
                            <option value="Entro 30 minuti">{t('entro30min')}</option>
                            <option value="Entro 1 ora">{t('entro1ora')}</option>
                            <option value="Entro 2 ore">{t('entro2ore')}</option>
                            <option value="orario_specifico">{t('orarioSpecifico')}</option>
                          </select>
                        </div>
                        {mostraOrarioSpecifico && (
                          <div>
                            <label className="block text-sm font-medium text-text mb-1">{t('orarioPreferito')}</label>
                            <input type="time" name="orario_specifico" required className="input-field" />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">{t('noteAggiuntive')}</label>
                        <textarea
                          name="note"
                          rows={4}
                          className="input-field"
                          placeholder={t('notePlaceholder')}
                        />
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" required className="w-5 h-5 mt-0.5 rounded border-border text-secondary focus:ring-secondary" />
                        <span className="text-sm text-text-light">
                          {t('gdprConsento')}
                        </span>
                      </label>
                      <button type="submit" className="btn-accent w-full py-4 text-base">
                        {t('inviaRichiestaContatto')}
                      </button>

                      {/* Promessa di risposta */}
                      <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-center">
                        <p className="text-primary font-medium text-sm">
                          {t('promessaRisposta')}
                        </p>
                        <p className="text-text-muted text-xs mt-1">
                          {t('servizioDisponibile')}
                        </p>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-10">
              <button
                onClick={() => { store.prevStep(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                disabled={store.step === 1}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} className="mr-1" />
                {t('indietro')}
              </button>
              <button
                onClick={store.reset}
                className="text-text-muted hover:text-error text-sm flex items-center gap-1 transition-colors"
              >
                <RotateCcw size={14} />
                {t('ricomincia')}
              </button>
              {store.step < TOTAL_STEPS && (
                <button onClick={() => { store.nextStep(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="btn-primary">
                  {t('avanti')}
                  <ChevronRight size={18} className="ml-1" />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar - Riepilogo live */}
          <div className="hidden lg:block">
            <div className="sticky top-24 card">
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">
                {t('ilTuoPreventivo')}
              </h3>
              <div className="space-y-3 text-sm">
                {store.tipoServizio && (
                  <SidebarItem label={t('servizio')} value={store.tipoServizio} />
                )}
                {store.bara && <SidebarItem label={t('bara')} value={store.bara.nome} prezzo={store.bara.prezzo} />}
                {store.urna && <SidebarItem label={t('urna')} value={store.urna.nome} prezzo={store.urna.prezzo} />}
                {store.autoFunebre && <SidebarItem label={t('trasporto')} value={store.autoFunebre.nome} prezzo={store.autoFunebre.prezzo} />}
                {store.fiori.map((f) => (
                  <SidebarItem key={f.id} label={t('fiori')} value={f.nome} prezzo={f.prezzo} />
                ))}
                {store.serviziExtra.map((s) => (
                  <SidebarItem key={s.id} label={t('extra')} value={s.nome} prezzo={s.prezzo} />
                ))}

                {totale > 0 && (
                  <>
                  {referralSconto > 0 && (
                    <div className="border-t border-border pt-2 mt-2 text-xs text-accent flex justify-between">
                      <span>{t('sconto')} {referralSconto}%</span>
                      <span>-&euro; {(totale - totaleConSconto).toLocaleString('it-IT')}</span>
                    </div>
                  )}
                  <div className={`${referralSconto > 0 ? 'pt-1' : 'border-t border-border pt-3 mt-3'} flex justify-between font-semibold text-primary`}>
                    <span>{t('totale')}</span>
                    <span className="font-[family-name:var(--font-serif)] text-lg">
                      &euro; {totaleConSconto.toLocaleString('it-IT')}
                    </span>
                  </div>
                  </>
                )}

                {totale === 0 && (
                  <p className="text-text-muted text-xs italic">
                    {t('sceltaAppariranno')}
                  </p>
                )}

                <p className="text-[10px] text-text-muted mt-4 leading-relaxed border-t border-border pt-3">
                  {t('preventivoIndicativo')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>)}
      </div>

      {/* Modale conferma */}
      {richiestaInviata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-surface rounded-2xl p-8 md:p-10 max-w-lg w-full shadow-2xl text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>

              <h2 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-primary mb-3">
                {t('richiestaInviata')}
              </h2>

              <p className="text-text-light text-lg leading-relaxed mb-6">
                {tempoAttesa.startsWith('Entro') ? (
                  <>Un nostro consulente vi contatter&agrave; <strong className="text-primary">{tempoAttesa.toLowerCase()}</strong> dalla ricezione della richiesta.</>
                ) : tempoAttesa.startsWith('Alle ore') ? (
                  <>Un nostro consulente vi contatter&agrave; <strong className="text-primary">{tempoAttesa.toLowerCase()}</strong> come da vostra preferenza.</>
                ) : (
                  <>{t('consulenteCiContatta')}</>
                )}
              </p>

              <div className="bg-background rounded-xl p-5 mb-6 text-left">
                <p className="text-sm text-text-light leading-relaxed">
                  {t('dettagliConfigurazioni')} <strong className="text-primary">&euro; {totaleConSconto.toLocaleString('it-IT')}</strong>.
                </p>
              </div>

              <p className="text-text-muted text-sm mb-6">
                {t('urgenze')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { setRichiestaInviata(false); store.reset(); window.location.href = '/' }}
                  className="btn-primary flex-1"
                >
                  {t('tornaHome')}
                </button>
                <button
                  onClick={() => { setRichiestaInviata(false) }}
                  className="btn-secondary flex-1"
                >
                  {t('modificaConfigurazione')}
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RiepilogoRow({
  label,
  value,
  prezzo,
  onEdit,
  nonSelezionatoLabel = '— Non selezionato',
  modificaLabel = 'Modifica',
}: {
  label: string
  value?: string | null
  prezzo?: number
  onEdit?: () => void
  nonSelezionatoLabel?: string
  modificaLabel?: string
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border">
      <div>
        <span className="text-xs text-text-muted uppercase tracking-wider">{label}</span>
        <p className="text-text font-medium">{value || nonSelezionatoLabel}</p>
      </div>
      <div className="flex items-center gap-4">
        {prezzo != null && (
          <span className="font-[family-name:var(--font-serif)] text-lg text-primary">
            &euro; {prezzo.toLocaleString('it-IT')}
          </span>
        )}
        {onEdit && (
          <button onClick={onEdit} className="text-secondary text-sm hover:underline">
            {modificaLabel}
          </button>
        )}
      </div>
    </div>
  )
}

function SidebarItem({ label, value, prezzo }: { label: string; value: string; prezzo?: number }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <div className="min-w-0">
        <span className="text-text-muted text-xs">{label}</span>
        <p className="text-text truncate">{value}</p>
      </div>
      {prezzo != null && (
        <span className="text-primary font-medium whitespace-nowrap">
          &euro; {prezzo.toLocaleString('it-IT')}
        </span>
      )}
    </div>
  )
}
