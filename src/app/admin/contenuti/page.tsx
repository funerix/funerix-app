'use client'

import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { ImageField } from '@/components/admin/ImageField'
import { useState } from 'react'

export default function AdminContenutiPage() {
  const { contenuti, impostazioni, salvaContenuti, salvaImpostazioni } = useSitoStore()
  const [sezioneAttiva, setSezioneAttiva] = useState('homepage')
  const [salvato, setSalvato] = useState(false)
  const [formContenuti, setFormContenuti] = useState(contenuti)
  const [formImpostazioni, setFormImpostazioni] = useState(impostazioni)

  // Helper per campi extra (CMS pagine)
  const getExtra = (key: string) => formContenuti.extra?.[key] || ''
  const setExtra = (key: string, value: string) => setFormContenuti({
    ...formContenuti,
    extra: { ...formContenuti.extra, [key]: value },
  })

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
              { id: 'previdenza', label: 'Previdenza' },
              { id: 'pet', label: 'Pet' },
              { id: 'rimpatri', label: 'Rimpatri' },
              { id: 'servizi-ricorrenti', label: 'Fiori e Cura Tomba' },
              { id: 'successione', label: 'Successione' },
              { id: 'convenzioni', label: 'Convenzioni' },
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
                  {['rispetto', 'trasparenza', 'disponibilita', 'esperienza'].map(valore => (
                    <div key={valore} className="border-b border-border pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
                      <label className="block text-sm font-medium text-text mb-1 capitalize">{valore.replace('disponibilita', 'Disponibilità 24/7')} — descrizione</label>
                      <textarea rows={2} className="input-field" value={getExtra(`valore_${valore}`) || ''} onChange={e => setExtra(`valore_${valore}`, e.target.value)} placeholder={`Descrizione del valore...`} />
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
                      <input type="text" className="input-field" value={formContenuti.chiSiamoTitolo} onChange={e => setFormContenuti({...formContenuti, chiSiamoTitolo: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Sottotitolo hero</label>
                      <textarea rows={2} className="input-field" value={formContenuti.chiSiamoSottotitolo} onChange={e => setFormContenuti({...formContenuti, chiSiamoSottotitolo: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1">Storia dell&apos;impresa</label>
                      <textarea rows={8} className="input-field" value={formContenuti.chiSiamoStoria} onChange={e => setFormContenuti({...formContenuti, chiSiamoStoria: e.target.value})} />
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
                    <input type="text" className="input-field" value={formImpostazioni.orari || ''} onChange={e => setFormImpostazioni({...formImpostazioni, orari: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Google Maps URL</label>
                    <input type="url" className="input-field" value={getExtra('google_maps_url') || ''} onChange={e => setExtra('google_maps_url', e.target.value)} placeholder="https://goo.gl/maps/..." />
                  </div>
                </div>
              </div>
            )}

            {sezioneAttiva === 'legale' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Disclaimer Preventivo</h2>
                  <textarea rows={6} className="input-field font-mono text-xs" value={formContenuti.disclaimerPreventivo || ''} onChange={e => setFormContenuti({...formContenuti, disclaimerPreventivo: e.target.value})} placeholder="Il presente preventivo ha valore meramente indicativo..." />
                </div>
                <div className="card">
                  <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Numero Registro Regionale</h2>
                  <input type="text" className="input-field" placeholder="Es. XXXX" value={formImpostazioni.registroRegionale || ''} onChange={e => setFormImpostazioni({...formImpostazioni, registroRegionale: e.target.value})} />
                  <p className="text-xs text-text-muted mt-1">Numero iscrizione al Registro Regionale Campania delle imprese funebri</p>
                </div>
                <div className="card">
                  <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Autorizzazione Comunale</h2>
                  <input type="text" className="input-field" placeholder="Es. n. 123/2020" value={formImpostazioni.autorizzazioneComunale || ''} onChange={e => setFormImpostazioni({...formImpostazioni, autorizzazioneComunale: e.target.value})} />
                </div>
              </div>
            )}

            {sezioneAttiva === 'seo' && (
              <div className="card">
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">SEO e Meta Tag</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Titolo sito (meta title)</label>
                    <input type="text" className="input-field" value={formContenuti.metaTitle} onChange={e => setFormContenuti({...formContenuti, metaTitle: e.target.value})} />
                    <p className="text-xs text-text-muted mt-1">Max 60 caratteri</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Descrizione (meta description)</label>
                    <textarea rows={3} className="input-field" value={formContenuti.metaDescription} onChange={e => setFormContenuti({...formContenuti, metaDescription: e.target.value})} />
                    <p className="text-xs text-text-muted mt-1">Max 160 caratteri</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Parole chiave</label>
                    <input type="text" className="input-field" value={formContenuti.metaKeywords} onChange={e => setFormContenuti({...formContenuti, metaKeywords: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Google My Business URL</label>
                    <input type="url" className="input-field" value={getExtra('google_business_url') || ''} onChange={e => setExtra('google_business_url', e.target.value)} placeholder="https://g.page/..." />
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
                    <input type="text" className="input-field" value={getExtra('configuratore_titolo') || 'Configura il Servizio Funebre'} onChange={e => setExtra('configuratore_titolo', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Sottotitolo</label>
                    <input type="text" className="input-field" value={getExtra('configuratore_sottotitolo') || 'Personalizzate ogni aspetto con calma. Nessun obbligo, nessuna fretta.'} onChange={e => setExtra('configuratore_sottotitolo', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Costo per km extra (oltre 20 km)</label>
                    <input type="number" className="input-field" value={getExtra('costo_km_extra') || '3'} onChange={e => setExtra('costo_km_extra', e.target.value)} />
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
                    <input type="text" className="input-field" value={getExtra('memorial_titolo') || 'Necrologi e Memorial'} onChange={e => setExtra('memorial_titolo', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Descrizione</label>
                    <textarea rows={3} className="input-field" value={getExtra('memorial_descrizione') || ''} onChange={e => setExtra('memorial_descrizione', e.target.value)} placeholder="Uno spazio per onorare e ricordare chi non c'è più..." />
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

            {sezioneAttiva === 'previdenza' && (
              <div className="space-y-6">
                <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Hero</h2>
                  <div className="space-y-4">
                    <ImageField label="Immagine sfondo hero" value={getExtra('previdenza_hero_img') || '/images/hero-previdenza.png'} onChange={v => setExtra('previdenza_hero_img', v)} hint="1920x700px consigliato" />
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo</label><input className="input-field" value={getExtra('previdenza_hero_titolo') || 'Previdenza Funerix'} onChange={e => setExtra('previdenza_hero_titolo', e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Sottotitolo</label><input className="input-field" value={getExtra('previdenza_hero_sottotitolo') || 'Pianificate oggi, vivete sereni'} onChange={e => setExtra('previdenza_hero_sottotitolo', e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Descrizione</label><textarea rows={2} className="input-field" value={getExtra('previdenza_hero_desc') || ''} onChange={e => setExtra('previdenza_hero_desc', e.target.value)} placeholder="Configurate il servizio funebre per voi o per un familiare..." /></div>
                  </div>
                </div>
                <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Sezioni</h2>
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo simulatore rate</label><input className="input-field" value={getExtra('previdenza_simulatore_titolo') || 'Quanto costa al mese?'} onChange={e => setExtra('previdenza_simulatore_titolo', e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo garanzie</label><input className="input-field" value={getExtra('previdenza_garanzie_titolo') || 'Le nostre garanzie'} onChange={e => setExtra('previdenza_garanzie_titolo', e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo "Per chi è pensato"</label><input className="input-field" value={getExtra('previdenza_perchi_titolo') || 'Per chi è pensato'} onChange={e => setExtra('previdenza_perchi_titolo', e.target.value)} /></div>
                  </div>
                </div>
                <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">CTA finale</h2>
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo</label><input className="input-field" value={getExtra('previdenza_cta_titolo') || 'Iniziate oggi'} onChange={e => setExtra('previdenza_cta_titolo', e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Descrizione</label><textarea rows={2} className="input-field" value={getExtra('previdenza_cta_desc') || ''} onChange={e => setExtra('previdenza_cta_desc', e.target.value)} placeholder="Configurate il piano in 5 minuti..." /></div>
                  </div>
                </div>
              </div>
            )}

            {sezioneAttiva === 'pet' && (
              <div className="space-y-6">
                <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Hero</h2>
                  <div className="space-y-4">
                    <ImageField label="Immagine sfondo hero" value={getExtra('pet_hero_img') || '/images/hero-pet.png'} onChange={v => setExtra('pet_hero_img', v)} hint="1920x700px" />
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo</label><input className="input-field" value={getExtra('pet_hero_titolo') || 'Cremazione Animali Domestici'} onChange={e => setExtra('pet_hero_titolo', e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Sottotitolo</label><textarea rows={2} className="input-field" value={getExtra('pet_hero_sottotitolo') || ''} onChange={e => setExtra('pet_hero_sottotitolo', e.target.value)} placeholder="Un ultimo saluto dignitoso per il vostro compagno di vita." /></div>
                  </div>
                </div>
                <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">CTA</h2>
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo CTA</label><input className="input-field" value={getExtra('pet_cta_titolo') || ''} onChange={e => setExtra('pet_cta_titolo', e.target.value)} placeholder="Configurate il servizio per il vostro compagno" /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Descrizione CTA</label><textarea rows={2} className="input-field" value={getExtra('pet_cta_desc') || ''} onChange={e => setExtra('pet_cta_desc', e.target.value)} placeholder="Cremazione individuale con restituzione ceneri..." /></div>
                  </div>
                </div>
              </div>
            )}

            {sezioneAttiva === 'rimpatri' && (
              <div className="space-y-6">
                <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Hero</h2>
                  <div className="space-y-4">
                    <ImageField label="Immagine sfondo hero" value={getExtra('rimpatri_hero_img') || '/images/config-rimpatri-hero.jpg'} onChange={v => setExtra('rimpatri_hero_img', v)} hint="1920x700px" />
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo</label><input className="input-field" value={getExtra('rimpatri_hero_titolo') || 'Rimpatrio e Espatrio Salme'} onChange={e => setExtra('rimpatri_hero_titolo', e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Sottotitolo</label><textarea rows={2} className="input-field" value={getExtra('rimpatri_hero_sottotitolo') || ''} onChange={e => setExtra('rimpatri_hero_sottotitolo', e.target.value)} placeholder="Trasporto internazionale salme..." /></div>
                  </div>
                </div>
                <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">CTA</h2>
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo CTA</label><input className="input-field" value={getExtra('rimpatri_cta_titolo') || ''} onChange={e => setExtra('rimpatri_cta_titolo', e.target.value)} placeholder="Avete bisogno di assistenza urgente?" /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Descrizione CTA</label><textarea rows={2} className="input-field" value={getExtra('rimpatri_cta_desc') || ''} onChange={e => setExtra('rimpatri_cta_desc', e.target.value)} placeholder="Il nostro team è disponibile 24/7..." /></div>
                  </div>
                </div>
              </div>
            )}

            {sezioneAttiva === 'servizi-ricorrenti' && (
              <div className="space-y-6">
                <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Hero</h2>
                  <div className="space-y-4">
                    <ImageField label="Immagine sfondo hero" value={getExtra('ricorrenti_hero_img') || '/images/hero-fiori.png'} onChange={v => setExtra('ricorrenti_hero_img', v)} hint="1920x700px" />
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo</label><input className="input-field" value={getExtra('ricorrenti_hero_titolo') || 'Fiori e Cura della Tomba'} onChange={e => setExtra('ricorrenti_hero_titolo', e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Sottotitolo</label><textarea rows={2} className="input-field" value={getExtra('ricorrenti_hero_sottotitolo') || ''} onChange={e => setExtra('ricorrenti_hero_sottotitolo', e.target.value)} placeholder="Non potete visitare spesso il cimitero?..." /></div>
                  </div>
                </div>
                <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">CTA</h2>
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo CTA</label><input className="input-field" value={getExtra('ricorrenti_cta_titolo') || ''} onChange={e => setExtra('ricorrenti_cta_titolo', e.target.value)} placeholder="Attivate il servizio" /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Descrizione CTA</label><textarea rows={2} className="input-field" value={getExtra('ricorrenti_cta_desc') || ''} onChange={e => setExtra('ricorrenti_cta_desc', e.target.value)} placeholder="Contattateci per attivare l'abbonamento..." /></div>
                  </div>
                </div>
              </div>
            )}

            {sezioneAttiva === 'successione' && (
              <div className="space-y-6">
                <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Hero</h2>
                  <div className="space-y-4">
                    <ImageField label="Immagine sfondo hero" value={getExtra('successione_hero_img') || '/images/card-successione.png'} onChange={v => setExtra('successione_hero_img', v)} hint="1920x700px" />
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo</label><input className="input-field" value={getExtra('successione_hero_titolo') || 'Dichiarazione di Successione'} onChange={e => setExtra('successione_hero_titolo', e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Sottotitolo</label><textarea rows={2} className="input-field" value={getExtra('successione_hero_sottotitolo') || ''} onChange={e => setExtra('successione_hero_sottotitolo', e.target.value)} placeholder="Ci occupiamo di tutto noi..." /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo CTA</label><input className="input-field" value={getExtra('successione_cta_titolo') || ''} onChange={e => setExtra('successione_cta_titolo', e.target.value)} placeholder="Avete bisogno di assistenza?" /></div>
                  </div>
                </div>
              </div>
            )}

            {sezioneAttiva === 'convenzioni' && (
              <div className="space-y-6">
                <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Hero</h2>
                  <div className="space-y-4">
                    <ImageField label="Immagine sfondo hero" value={getExtra('convenzioni_hero_img') || '/images/hero-principale.png'} onChange={v => setExtra('convenzioni_hero_img', v)} hint="1920x700px" />
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo</label><input className="input-field" value={getExtra('convenzioni_hero_titolo') || 'Convenzioni RSA e Case di Cura'} onChange={e => setExtra('convenzioni_hero_titolo', e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Sottotitolo</label><textarea rows={2} className="input-field" value={getExtra('convenzioni_hero_sottotitolo') || ''} onChange={e => setExtra('convenzioni_hero_sottotitolo', e.target.value)} placeholder="Offrite ai familiari dei vostri ospiti la tranquillità..." /></div>
                    <div><label className="block text-sm font-medium text-text mb-1">Titolo CTA</label><input className="input-field" value={getExtra('convenzioni_cta_titolo') || ''} onChange={e => setExtra('convenzioni_cta_titolo', e.target.value)} placeholder="Diventate partner Funerix" /></div>
                  </div>
                </div>
              </div>
            )}

            {sezioneAttiva === 'footer' && (
              <div className="card">
                <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Footer</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Descrizione impresa</label>
                    <textarea rows={3} className="input-field" value={formContenuti.footerDescrizione} onChange={e => setFormContenuti({...formContenuti, footerDescrizione: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Testo copyright</label>
                    <input type="text" className="input-field" value={formContenuti.footerCopyright} onChange={e => setFormContenuti({...formContenuti, footerCopyright: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Nota sui preventivi</label>
                    <input type="text" className="input-field" value={formContenuti.footerNotaPreventivi} onChange={e => setFormContenuti({...formContenuti, footerNotaPreventivi: e.target.value})} />
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
