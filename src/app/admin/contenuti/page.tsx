'use client'

import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { useState } from 'react'

export default function AdminContenutiPage() {
  const { contenuti, impostazioni, salvaContenuti, salvaImpostazioni } = useSitoStore()
  const [sezioneAttiva, setSezioneAttiva] = useState('homepage')
  const [salvato, setSalvato] = useState(false)
  const [formContenuti, setFormContenuti] = useState(contenuti)
  const [formImpostazioni, setFormImpostazioni] = useState(impostazioni)

  const handleSalva = async () => {
    await salvaContenuti(formContenuti)
    await salvaImpostazioni(formImpostazioni)
    setSalvato(true)
    setTimeout(() => setSalvato(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Contenuti del Sito</h1>
              <p className="text-text-light text-sm">Modifica tutti i testi visibili sul sito pubblico</p>
            </div>
          </div>
          <button onClick={handleSalva} className="btn-accent text-sm">
            <Save size={16} className="mr-2" />
            {salvato ? 'Salvato!' : 'Salva modifiche'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar sezioni */}
          <div className="space-y-1">
            {[
              { id: 'homepage', label: 'Homepage' },
              { id: 'chi-siamo', label: 'Chi Siamo' },
              { id: 'configuratore', label: 'Configuratore' },
              { id: 'contatti', label: 'Contatti' },
              { id: 'memorial', label: 'Memorial' },
              { id: 'footer', label: 'Footer' },
              { id: 'legale', label: 'Testi Legali' },
              { id: 'seo', label: 'SEO e Meta' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSezioneAttiva(s.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  sezioneAttiva === s.id ? 'bg-primary text-white' : 'text-text-light hover:bg-surface'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Contenuto sezione */}
          <div className="lg:col-span-3">
            {sezioneAttiva === 'homepage' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Hero Homepage</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Titolo principale</label>
                      <input type="text" className="input-field" value={formContenuti.heroTitolo} onChange={e => setFormContenuti({...formContenuti, heroTitolo: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Sottotitolo</label>
                      <textarea rows={3} className="input-field" value={formContenuti.heroSottotitolo} onChange={e => setFormContenuti({...formContenuti, heroSottotitolo: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Testo bottone principale</label>
                      <input type="text" className="input-field" value={formContenuti.heroBottone} onChange={e => setFormContenuti({...formContenuti, heroBottone: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Immagine di sfondo hero</label>
                      <input type="file" accept="image/*" className="input-field" />
                      <p className="text-xs text-text-muted mt-1">Dimensione consigliata: 1920x700 px</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Sezione Valori</h2>
                  {['Rispetto', 'Trasparenza', 'Disponibilità 24/7', 'Esperienza'].map(valore => (
                    <div key={valore} className="border-b border-border pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
                      <label className="block text-sm font-medium text-text mb-1">{valore} — descrizione</label>
                      <textarea rows={2} className="input-field" defaultValue={`Descrizione del valore "${valore}"...`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sezioneAttiva === 'chi-siamo' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Pagina Chi Siamo</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Titolo pagina</label>
                      <input type="text" className="input-field" defaultValue="Chi Siamo" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Sottotitolo hero</label>
                      <textarea rows={2} className="input-field" defaultValue="Da oltre trent'anni al fianco delle famiglie campane, con professionalità, rispetto e dedizione in ogni momento." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Storia dell&apos;impresa</label>
                      <textarea rows={8} className="input-field" defaultValue="Funerix nasce dalla tradizione di una famiglia che da tre generazioni si dedica all'accompagnamento delle famiglie nei momenti più delicati della vita..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Immagine di sfondo</label>
                      <input type="file" accept="image/*" className="input-field" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sezioneAttiva === 'contatti' && (
              <div className="card">
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Dati di Contatto</h2>
                <p className="text-text-muted text-sm mb-4">Questi dati appaiono nella pagina Contatti, nell&apos;header e nel footer del sito.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Telefono principale</label>
                    <input type="tel" className="input-field" value={formImpostazioni.telefono} onChange={e => setFormImpostazioni({...formImpostazioni, telefono: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">WhatsApp</label>
                    <input type="tel" className="input-field" value={formImpostazioni.whatsapp} onChange={e => setFormImpostazioni({...formImpostazioni, whatsapp: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Email</label>
                    <input type="email" className="input-field" value={formImpostazioni.email} onChange={e => setFormImpostazioni({...formImpostazioni, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Indirizzo sede</label>
                    <input type="text" className="input-field" value={formImpostazioni.indirizzo} onChange={e => setFormImpostazioni({...formImpostazioni, indirizzo: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Orari ufficio</label>
                    <input type="text" className="input-field" defaultValue="Lun-Sab 9:00-18:00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Google Maps URL</label>
                    <input type="url" className="input-field" placeholder="https://goo.gl/maps/..." />
                  </div>
                </div>
              </div>
            )}

            {sezioneAttiva === 'legale' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Disclaimer Preventivo</h2>
                  <textarea rows={6} className="input-field font-mono text-xs" defaultValue={`Il presente preventivo ha valore meramente indicativo e informativo ai sensi dell'art. 1336 del Codice Civile e non costituisce offerta al pubblico né proposta contrattuale vincolante. I prezzi indicati sono orientativi e possono variare in base alle specifiche circostanze del servizio, alle disposizioni dell'autorità comunale competente e alla normativa vigente.\n\nIl preventivo definitivo sarà formulato esclusivamente a seguito di un colloquio diretto con la famiglia e della verifica di tutti gli elementi necessari, nel rispetto della L.R. Campania n. 12/2001 e s.m.i. e del D.Lgs. 206/2005 (Codice del Consumo).`} />
                </div>
                <div className="card">
                  <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Numero Registro Regionale</h2>
                  <input type="text" className="input-field" placeholder="Es. XXXX" defaultValue="" />
                  <p className="text-xs text-text-muted mt-1">Numero iscrizione al Registro Regionale Campania delle imprese funebri</p>
                </div>
                <div className="card">
                  <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Autorizzazione Comunale</h2>
                  <input type="text" className="input-field" placeholder="Es. n. 123/2020" defaultValue="" />
                </div>
              </div>
            )}

            {sezioneAttiva === 'seo' && (
              <div className="card">
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">SEO e Meta Tag</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Titolo sito (meta title)</label>
                    <input type="text" className="input-field" defaultValue="Funerix — Servizi Funebri in Campania" />
                    <p className="text-xs text-text-muted mt-1">Max 60 caratteri</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Descrizione (meta description)</label>
                    <textarea rows={3} className="input-field" defaultValue="Configura il servizio funebre per il tuo caro con rispetto e trasparenza. Preventivo indicativo immediato. Impresa funebre autorizzata in Campania." />
                    <p className="text-xs text-text-muted mt-1">Max 160 caratteri</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Parole chiave</label>
                    <input type="text" className="input-field" defaultValue="onoranze funebri, funerali Campania, servizi funebri Napoli, cremazione" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Google My Business URL</label>
                    <input type="url" className="input-field" placeholder="https://g.page/..." />
                  </div>
                </div>
              </div>
            )}

            {sezioneAttiva === 'configuratore' && (
              <div className="card">
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Testi Configuratore</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Titolo pagina</label>
                    <input type="text" className="input-field" defaultValue="Configura il Servizio Funebre" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Sottotitolo</label>
                    <input type="text" className="input-field" defaultValue="Personalizzate ogni aspetto con calma. Nessun obbligo, nessuna fretta." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Costo per km extra (oltre 20 km)</label>
                    <input type="number" className="input-field" defaultValue="3" />
                    <p className="text-xs text-text-muted mt-1">Euro per km oltre i primi 20 km inclusi</p>
                  </div>
                </div>
              </div>
            )}

            {sezioneAttiva === 'memorial' && (
              <div className="card">
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Testi Memorial</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Titolo pagina necrologi</label>
                    <input type="text" className="input-field" defaultValue="Necrologi e Memorial" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Descrizione</label>
                    <textarea rows={3} className="input-field" defaultValue="Uno spazio per onorare e ricordare chi non c'è più. Lasciate un pensiero, una condoglianza o un ricordo per i vostri cari." />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border" />
                    <span className="text-sm text-text">Permetti ai visitatori di lasciare messaggi pubblici</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border" />
                    <span className="text-sm text-text">Mostra sezione donazioni sui memorial</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border" />
                    <span className="text-sm text-text">Genera automaticamente QR Code per ogni memorial</span>
                  </label>
                </div>
              </div>
            )}

            {sezioneAttiva === 'footer' && (
              <div className="card">
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Footer</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Descrizione impresa</label>
                    <textarea rows={3} className="input-field" defaultValue="Accompagniamo le famiglie con rispetto e dignità nei momenti più difficili. Impresa funebre autorizzata e iscritta al Registro Regionale della Campania." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Testo copyright</label>
                    <input type="text" className="input-field" defaultValue="Funerix — Tutti i diritti riservati." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Nota sui preventivi</label>
                    <input type="text" className="input-field" defaultValue="I preventivi generati online sono indicativi e non costituiscono proposta contrattuale." />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
