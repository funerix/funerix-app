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
import { TipoServizio, TipoCerimonia } from '@/types'
import { useState } from 'react'

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -200 : 200, opacity: 0 }),
}

export default function ConfiguratorePage() {
  const store = useConfiguratoreStore()
  const { prodotti, impostazioni } = useSitoStore()
  const totale = store.totale()
  const [mostraOrarioSpecifico, setMostraOrarioSpecifico] = useState(false)
  const [richiestaInviata, setRichiestaInviata] = useState(false)
  const [tempoAttesa, setTempoAttesa] = useState('')

  const { categorie } = useSitoStore()
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
          {[
            { id: 'funebre' as const, label: 'Servizio Funebre', desc: 'Per una persona cara' },
            { id: 'animale' as const, label: 'Cremazione Animale', desc: 'Per un animale domestico' },
            { id: 'rimpatrio' as const, label: 'Rimpatrio / Espatrio', desc: 'Trasporto internazionale' },
            { id: 'previdenza' as const, label: 'Previdenza Funerix', desc: 'Pianifica e paga a rate' },
          ].map(t => (
            <button key={t.id} onClick={() => setTipoConfigurazione(t.id)}
              className={`px-3 md:px-5 py-3 rounded-xl text-center transition-all ${
                tipoConfigurazione === t.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-surface border border-border text-text-light'
              }`}>
              <span className="block text-xs md:text-sm font-medium">{t.label}</span>
              <span className={`block text-[9px] md:text-[10px] mt-0.5 ${tipoConfigurazione === t.id ? 'text-white/70' : 'text-text-muted'}`}>{t.desc}</span>
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
            <h1 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl text-white">Configura il Servizio Funebre</h1>
            <p className="mt-2 text-white/80 text-sm max-w-lg mx-auto">Personalizzate ogni aspetto con calma. Nessun obbligo, nessuna fretta.</p>
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
                      Tipo di servizio
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {([
                        { value: 'inumazione', label: 'Inumazione', desc: 'Sepoltura in terra' },
                        { value: 'tumulazione', label: 'Tumulazione', desc: 'Sepoltura in loculo' },
                        { value: 'cremazione', label: 'Cremazione', desc: 'Con scelta urna cineraria' },
                      ] as const).map((tipo) => (
                        <div
                          key={tipo.value}
                          onClick={() => store.setTipoServizio(tipo.value as TipoServizio)}
                          className={
                            store.tipoServizio === tipo.value
                              ? 'product-card-selected text-center py-10'
                              : 'product-card text-center py-10'
                          }
                        >
                          <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-2">
                            {tipo.label}
                          </h3>
                          <p className="text-text-light text-sm">{tipo.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Bara / Urna */}
                {store.step === 2 && (
                  <div>
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-6">
                      {store.tipoServizio === 'cremazione' ? 'Scelta della bara e dell\'urna' : 'Scelta della bara'}
                    </h2>
                    <ProductSelector
                      prodotti={bare}
                      selected={store.bara}
                      onSelect={store.setBara}
                    />
                    {store.tipoServizio === 'cremazione' && (
                      <div className="mt-10">
                        <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">
                          Urna cineraria
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
                      Trasporto funebre
                    </h2>
                    <ProductSelector
                      prodotti={auto}
                      selected={store.autoFunebre}
                      onSelect={store.setAutoFunebre}
                    />
                    <div className="mt-8 card">
                      <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">
                        Percorso
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Luogo di partenza (es. ospedale, abitazione)"
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
                          placeholder="Chiesa o luogo cerimonia"
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
                          placeholder="Cimitero o crematorio di destinazione"
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
                            placeholder="Distanza stimata (km)"
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
                            Primi 20 km inclusi. Oltre: 3 &euro;/km
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
                      Cerimonia
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-text mb-3">Tipo di cerimonia</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {([
                            { value: 'cattolica', label: 'Cattolica' },
                            { value: 'altra_confessione', label: 'Altra confessione' },
                            { value: 'laica', label: 'Laica' },
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
                                  ? 'product-card-selected text-center py-6'
                                  : 'product-card text-center py-6'
                              }
                            >
                              <span className="font-medium text-primary">{tipo.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text mb-2">Luogo della cerimonia</label>
                        <input
                          type="text"
                          placeholder="Es. Chiesa di San Gennaro, Casa funeraria..."
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
                          <span className="text-text">Musica durante la cerimonia</span>
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
                          <span className="text-text">Libro delle firme</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Fiori */}
                {store.step === 5 && (
                  <div>
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">
                      Fiori e addobbi
                    </h2>
                    <p className="text-text-light text-sm mb-6">
                      Potete selezionare pi&ugrave; composizioni floreali
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
                      Servizi aggiuntivi
                    </h2>
                    <p className="text-text-light text-sm mb-6">
                      Selezionate i servizi di cui avete bisogno
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
                      Riepilogo e preventivo
                    </h2>
                    <div className="space-y-4">
                      <RiepilogoRow label="Tipo di servizio" value={store.tipoServizio || '—'} onEdit={() => store.setStep(1)} />
                      <RiepilogoRow label="Bara" value={store.bara?.nome} prezzo={store.bara?.prezzo} onEdit={() => store.setStep(2)} />
                      {store.tipoServizio === 'cremazione' && (
                        <RiepilogoRow label="Urna" value={store.urna?.nome} prezzo={store.urna?.prezzo} onEdit={() => store.setStep(2)} />
                      )}
                      <RiepilogoRow label="Auto funebre" value={store.autoFunebre?.nome} prezzo={store.autoFunebre?.prezzo} onEdit={() => store.setStep(3)} />
                      {store.percorso && store.percorso.distanzaKm > 20 && (
                        <RiepilogoRow label="Supplemento km" value={`${store.percorso.distanzaKm - 20} km extra`} prezzo={(store.percorso.distanzaKm - 20) * 3} />
                      )}
                      <RiepilogoRow
                        label="Cerimonia"
                        value={store.cerimonia?.tipo ? `${store.cerimonia.tipo} — ${store.cerimonia.luogo || 'luogo da definire'}` : undefined}
                        onEdit={() => store.setStep(4)}
                      />
                      {store.fiori.map((f) => (
                        <RiepilogoRow key={f.id} label="Fiori" value={f.nome} prezzo={f.prezzo} onEdit={() => store.setStep(5)} />
                      ))}
                      {store.serviziExtra.map((s) => (
                        <RiepilogoRow key={s.id} label="Servizio extra" value={s.nome} prezzo={s.prezzo} onEdit={() => store.setStep(6)} />
                      ))}

                      <div className="border-t-2 border-primary pt-4 mt-6 flex justify-between items-center">
                        <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-bold">Totale indicativo</span>
                        <span className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">
                          &euro; {totale.toLocaleString('it-IT')}
                        </span>
                      </div>
                      <div className="mt-6 p-4 bg-background-dark rounded-lg border border-border">
                        <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
                          Avviso legale
                        </p>
                        <p className="text-xs text-text-light leading-relaxed">
                          Il presente preventivo ha valore meramente indicativo e informativo ai sensi
                          dell&apos;art. 1336 del Codice Civile e <strong>non costituisce offerta al pubblico
                          n&eacute; proposta contrattuale vincolante</strong>. I prezzi indicati sono orientativi
                          e possono variare in base alle specifiche circostanze del servizio, alle disposizioni
                          dell&apos;autorit&agrave; comunale competente e alla normativa vigente.
                        </p>
                        <p className="text-xs text-text-light leading-relaxed mt-2">
                          Il preventivo definitivo sar&agrave; formulato esclusivamente a seguito di un colloquio
                          diretto con la famiglia e della verifica di tutti gli elementi necessari, nel rispetto
                          della L.R. Campania n. 12/2001 e s.m.i. e del D.Lgs. 206/2005 (Codice del Consumo).
                          Nessun impegno contrattuale sorge dalla consultazione del presente configuratore.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 8: Richiesta Contatto */}
                {store.step === 8 && (
                  <div>
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl text-primary mb-2">
                      Richiesta di contatto
                    </h2>
                    <p className="text-text-light mb-6 leading-relaxed">
                      State richiedendo informazioni per il servizio che avete appena configurato.
                      Un nostro consulente dedicato vi accompagner&agrave; in ogni fase del percorso,
                      dalla conferma dei dettagli fino alla completa organizzazione del servizio.
                    </p>

                    <form
                      className="space-y-5"
                      onSubmit={async (e) => {
                        e.preventDefault()
                        const form = e.target as HTMLFormElement
                        const modalita = form.querySelector('input[name="modalita"]:checked') as HTMLInputElement
                        if (!modalita) {
                          alert('Selezionate la modalit\u00e0 di contatto preferita.')
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
                          configurazione: righe.join('\n'),
                          totale,
                          stato: 'nuova',
                          createdAt: new Date().toISOString(),
                        })

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
                          Come preferite essere contattati? *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {[
                            { value: 'telefonata', label: 'Chiamata telefonica', desc: 'Un consulente vi chiamer\u00e0 direttamente' },
                            { value: 'videochiamata', label: 'Videochiamata', desc: 'Colloquio in video per maggiore vicinanza' },
                            { value: 'whatsapp', label: 'WhatsApp', desc: 'Messaggi e aggiornamenti via WhatsApp' },
                          ].map((opt) => (
                            <label key={opt.value} className="cursor-pointer">
                              <input type="radio" name="modalita" value={opt.value} className="peer sr-only" required />
                              <div className="product-card py-4 px-4 text-center peer-checked:border-secondary peer-checked:border-2 peer-checked:bg-secondary/5">
                                <span className="block font-medium text-primary text-sm">{opt.label}</span>
                                <span className="block text-text-muted text-xs mt-1">{opt.desc}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Nome e Cognome *</label>
                          <input type="text" name="nome" required className="input-field" placeholder="Mario Rossi" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Telefono *</label>
                          <input type="tel" name="telefono" required className="input-field" placeholder="333 1234567" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Email</label>
                          <input type="email" name="email" className="input-field" placeholder="mario.rossi@email.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Quando preferite essere contattati? *</label>
                          <select
                            name="orario"
                            required
                            className="input-field"
                            onChange={(e) => setMostraOrarioSpecifico(e.target.value === 'orario_specifico')}
                          >
                            <option value="">Selezionate...</option>
                            <option value="Entro 30 minuti">Entro 30 minuti</option>
                            <option value="Entro 1 ora">Entro 1 ora</option>
                            <option value="Entro 2 ore">Entro 2 ore</option>
                            <option value="orario_specifico">Scelgo un orario specifico</option>
                          </select>
                        </div>
                        {mostraOrarioSpecifico && (
                          <div>
                            <label className="block text-sm font-medium text-text mb-1">Orario preferito</label>
                            <input type="time" name="orario_specifico" required className="input-field" />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-1">Note aggiuntive</label>
                        <textarea
                          name="note"
                          rows={4}
                          className="input-field"
                          placeholder="Indicazioni particolari, richieste speciali o domande..."
                        />
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" required className="w-5 h-5 mt-0.5 rounded border-border text-secondary focus:ring-secondary" />
                        <span className="text-sm text-text-light">
                          Acconsento al trattamento dei dati personali ai sensi del GDPR (Reg. UE 2016/679).
                          Ho letto e accetto l&apos;informativa sulla privacy. *
                        </span>
                      </label>
                      <button type="submit" className="btn-accent w-full py-4 text-base">
                        Invia Richiesta di Contatto
                      </button>

                      {/* Promessa di risposta */}
                      <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-center">
                        <p className="text-primary font-medium text-sm">
                          Un nostro consulente vi contatter&agrave; entro 30 minuti dall&apos;invio della richiesta.
                        </p>
                        <p className="text-text-muted text-xs mt-1">
                          Servizio disponibile 24 ore su 24, 7 giorni su 7. Siamo sempre al vostro fianco.
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
                onClick={store.prevStep}
                disabled={store.step === 1}
                className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} className="mr-1" />
                Indietro
              </button>
              <button
                onClick={store.reset}
                className="text-text-muted hover:text-error text-sm flex items-center gap-1 transition-colors"
              >
                <RotateCcw size={14} />
                Ricomincia
              </button>
              {store.step < TOTAL_STEPS && (
                <button onClick={store.nextStep} className="btn-primary">
                  Avanti
                  <ChevronRight size={18} className="ml-1" />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar - Riepilogo live */}
          <div className="hidden lg:block">
            <div className="sticky top-24 card">
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">
                Il tuo preventivo
              </h3>
              <div className="space-y-3 text-sm">
                {store.tipoServizio && (
                  <SidebarItem label="Servizio" value={store.tipoServizio} />
                )}
                {store.bara && <SidebarItem label="Bara" value={store.bara.nome} prezzo={store.bara.prezzo} />}
                {store.urna && <SidebarItem label="Urna" value={store.urna.nome} prezzo={store.urna.prezzo} />}
                {store.autoFunebre && <SidebarItem label="Trasporto" value={store.autoFunebre.nome} prezzo={store.autoFunebre.prezzo} />}
                {store.fiori.map((f) => (
                  <SidebarItem key={f.id} label="Fiori" value={f.nome} prezzo={f.prezzo} />
                ))}
                {store.serviziExtra.map((s) => (
                  <SidebarItem key={s.id} label="Extra" value={s.nome} prezzo={s.prezzo} />
                ))}

                {totale > 0 && (
                  <div className="border-t border-border pt-3 mt-3 flex justify-between font-semibold text-primary">
                    <span>Totale</span>
                    <span className="font-[family-name:var(--font-serif)] text-lg">
                      &euro; {totale.toLocaleString('it-IT')}
                    </span>
                  </div>
                )}

                {totale === 0 && (
                  <p className="text-text-muted text-xs italic">
                    Le vostre scelte appariranno qui man mano che configurate il servizio.
                  </p>
                )}

                <p className="text-[10px] text-text-muted mt-4 leading-relaxed border-t border-border pt-3">
                  Preventivo indicativo a solo scopo informativo. Non costituisce proposta
                  contrattuale ai sensi dell&apos;art. 1336 C.C.
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
                Richiesta inviata
              </h2>

              <p className="text-text-light text-lg leading-relaxed mb-6">
                {tempoAttesa.startsWith('Entro') ? (
                  <>Un nostro consulente vi contatter&agrave; <strong className="text-primary">{tempoAttesa.toLowerCase()}</strong> dalla ricezione della richiesta.</>
                ) : tempoAttesa.startsWith('Alle ore') ? (
                  <>Un nostro consulente vi contatter&agrave; <strong className="text-primary">{tempoAttesa.toLowerCase()}</strong> come da vostra preferenza.</>
                ) : (
                  <>Un nostro consulente vi contatter&agrave; al pi&ugrave; presto.</>
                )}
              </p>

              <div className="bg-background rounded-xl p-5 mb-6 text-left">
                <p className="text-sm text-text-light leading-relaxed">
                  Il consulente avr&agrave; gi&agrave; tutti i dettagli della vostra configurazione
                  e del preventivo indicativo di <strong className="text-primary">&euro; {totale.toLocaleString('it-IT')}</strong>.
                  Non dovrete ripetere nulla.
                </p>
              </div>

              <p className="text-text-muted text-sm mb-6">
                Per qualsiasi urgenza potete contattarci direttamente al numero indicato nel sito.
                Siamo disponibili 24 ore su 24.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { setRichiestaInviata(false); store.reset(); window.location.href = '/' }}
                  className="btn-primary flex-1"
                >
                  Torna alla Home
                </button>
                <button
                  onClick={() => { setRichiestaInviata(false) }}
                  className="btn-secondary flex-1"
                >
                  Modifica configurazione
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
}: {
  label: string
  value?: string | null
  prezzo?: number
  onEdit?: () => void
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border">
      <div>
        <span className="text-xs text-text-muted uppercase tracking-wider">{label}</span>
        <p className="text-text font-medium">{value || '— Non selezionato'}</p>
      </div>
      <div className="flex items-center gap-4">
        {prezzo != null && (
          <span className="font-[family-name:var(--font-serif)] text-lg text-primary">
            &euro; {prezzo.toLocaleString('it-IT')}
          </span>
        )}
        {onEdit && (
          <button onClick={onEdit} className="text-secondary text-sm hover:underline">
            Modifica
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
