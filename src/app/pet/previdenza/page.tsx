'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PawPrint, ChevronRight, Phone, Check, Heart, Calendar, Euro, Shield, Stethoscope } from 'lucide-react'
import { useState, useEffect } from 'react'

const specieOptions = [
  { id: 'gatto', label: 'Gatto', taglia: 'piccolo' },
  { id: 'cane_piccolo', label: 'Cane piccolo (<10kg)', taglia: 'piccolo' },
  { id: 'cane_medio', label: 'Cane medio (10-25kg)', taglia: 'medio' },
  { id: 'cane_grande', label: 'Cane grande (>25kg)', taglia: 'grande' },
  { id: 'altro', label: 'Altro animale', taglia: 'piccolo' },
]

const rateOptions = [
  { mesi: 1, label: 'Pagamento unico' },
  { mesi: 3, label: '3 mesi' },
  { mesi: 6, label: '6 mesi' },
  { mesi: 12, label: '12 mesi' },
  { mesi: 24, label: '24 mesi' },
]

export default function PrevidenzaPetPage() {
  const [prezziDb, setPrezziDb] = useState<any[]>([])
  const [specie, setSpecie] = useState('cane_medio')
  const [rate, setRate] = useState(12)
  const [includiUrna, setIncludiUrna] = useState(true)
  const [includiRitiro, setIncludiRitiro] = useState(true)

  useEffect(() => {
    fetch('/api/pet/prezzi').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setPrezziDb(d)
    }).catch(() => {})
  }, [])

  const specieObj = specieOptions.find(s => s.id === specie)
  const specieDb = specie === 'cane_piccolo' ? 'cane' : specie === 'cane_medio' ? 'cane' : specie === 'cane_grande' ? 'cane' : specie === 'gatto' ? 'gatto' : 'altro'
  const tagliaDb = specieObj?.taglia || 'piccolo'

  const prezzoCrema = prezziDb.find(p => p.specie === specieDb && p.taglia === tagliaDb && p.tipo_cremazione === 'individuale')
  const prezzoCremazione = prezzoCrema ? Number(prezzoCrema.prezzo) : specie === 'cane_grande' ? 380 : specie === 'cane_medio' ? 250 : 150
  const prezzoRitiro = prezzoCrema ? Number(prezzoCrema.ritiro_domicilio_prezzo) : 60
  const prezzoUrna = 80 // urna standard legno

  const totale = prezzoCremazione + (includiUrna ? prezzoUrna : 0) + (includiRitiro ? prezzoRitiro : 0)
  const rataMensile = rate === 1 ? totale : Math.ceil(totale / rate)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
        <Image src="/images/hero-pet.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-light text-xs px-4 py-2 rounded-full mb-5 border border-secondary/20">
            <Shield size={14} /> Prezzo bloccato, rate flessibili
          </div>
          <PawPrint size={48} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white leading-tight">
            Previdenza Pet
          </h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
            Pianificate oggi la cremazione del vostro animale domestico.
            Scegliete come pagare: tutto subito o in comode rate fino a 24 mesi.
          </p>
        </div>
      </section>

      {/* Simulatore libero */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-4">Configura il tuo piano</h2>
          <p className="text-text-light text-center mb-10">Scegliete il vostro animale, i servizi e come pagare.</p>

          <div className="card p-6 md:p-8">
            {/* Specie */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-3">Tipo di animale</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {specieOptions.map(s => (
                  <button key={s.id} onClick={() => setSpecie(s.id)}
                    className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-center ${
                      specie === s.id ? 'bg-primary text-white' : 'bg-background-dark text-text-muted hover:text-primary'
                    }`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Opzioni */}
            <div className="mb-6 space-y-3">
              <label className="flex items-center gap-3 card p-3 cursor-pointer">
                <input type="checkbox" checked={includiUrna} onChange={e => setIncludiUrna(e.target.checked)} className="w-5 h-5 rounded" />
                <div className="flex-1">
                  <span className="font-medium text-primary text-sm">Urna in legno</span>
                  <p className="text-text-muted text-xs">Urna elegante con incisione nome</p>
                </div>
                <span className="font-[family-name:var(--font-serif)] text-primary font-medium">+ &euro; {prezzoUrna}</span>
              </label>
              <label className="flex items-center gap-3 card p-3 cursor-pointer">
                <input type="checkbox" checked={includiRitiro} onChange={e => setIncludiRitiro(e.target.checked)} className="w-5 h-5 rounded" />
                <div className="flex-1">
                  <span className="font-medium text-primary text-sm">Ritiro a domicilio</span>
                  <p className="text-text-muted text-xs">Ritiriamo il vostro animale a casa vostra</p>
                </div>
                <span className="font-[family-name:var(--font-serif)] text-primary font-medium">+ &euro; {prezzoRitiro}</span>
              </label>
            </div>

            {/* Totale */}
            <div className="text-center mb-6 py-4 bg-background-dark rounded-xl">
              <p className="text-text-muted text-sm">Totale servizio</p>
              <p className="font-[family-name:var(--font-serif)] text-4xl text-primary font-bold">&euro; {totale}</p>
              <p className="text-text-muted text-xs mt-1">Cremazione individuale con restituzione ceneri</p>
            </div>

            {/* Rate */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-3">Come volete pagare?</label>
              <div className="grid grid-cols-5 gap-2">
                {rateOptions.map(r => (
                  <button key={r.mesi} onClick={() => setRate(r.mesi)}
                    className={`px-2 py-3 rounded-lg text-xs font-medium transition-colors text-center ${
                      rate === r.mesi ? 'bg-secondary text-white' : 'bg-background-dark text-text-muted hover:text-secondary'
                    }`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Risultato */}
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="bg-background rounded-xl p-4">
                <p className="text-text-muted text-xs">{rate === 1 ? 'Pagamento' : 'Rate'}</p>
                <p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">{rate === 1 ? '1' : rate}</p>
                <p className="text-text-muted text-xs">{rate === 1 ? 'unico' : 'mesi'}</p>
              </div>
              <div className="bg-secondary/10 rounded-xl p-4">
                <p className="text-secondary text-xs font-medium">{rate === 1 ? 'Totale' : 'Al mese'}</p>
                <p className="font-[family-name:var(--font-serif)] text-2xl text-secondary font-bold">&euro; {rataMensile}</p>
                <p className="text-secondary/60 text-xs">{rate === 1 ? 'una tantum' : 'al mese'}</p>
              </div>
              <div className="bg-background rounded-xl p-4">
                <p className="text-text-muted text-xs">Risparmi</p>
                <p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">0%</p>
                <p className="text-text-muted text-xs">zero interessi</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/pet/previdenza/configuratore" className="btn-accent text-sm py-3 px-6 justify-center">
                Richiedi il piano <ChevronRight size={16} className="ml-1" />
              </Link>
              <a href="tel:+390815551234" className="btn-secondary text-sm py-3 px-6 justify-center">
                <Phone size={16} className="mr-1" /> Parla con noi
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-12">Come funziona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', icon: Heart, t: 'Configurate', d: 'Scegliete specie, taglia, servizi e modalita di pagamento.' },
              { n: '02', icon: Euro, t: 'Pagate come volete', d: 'Tutto subito, in 3, 6, 12 o 24 rate mensili. Zero interessi.' },
              { n: '03', icon: Shield, t: 'Prezzo bloccato', d: 'Il prezzo non cambia mai. Nessun aumento, nessuna sorpresa.' },
              { n: '04', icon: Calendar, t: 'Tutto organizzato', d: 'Quando il momento arriva, chiamate e ci occupiamo di tutto.' },
            ].map(s => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <s.icon size={24} className="text-secondary" />
                </div>
                <span className="text-secondary/30 font-[family-name:var(--font-serif)] text-3xl font-bold">{s.n}</span>
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mt-1 mb-2">{s.t}</h3>
                <p className="text-text-muted text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vantaggi */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">Perche scegliere la previdenza pet</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Euro, t: 'Prezzo bloccato per sempre', d: 'Il prezzo che scegliete oggi resta invariato, indipendentemente dall\'inflazione e dagli aumenti.' },
              { icon: Heart, t: 'Nessun pensiero nel dolore', d: 'Quando il momento arriva, non dovrete prendere nessuna decisione. Tutto e gia organizzato.' },
              { icon: Stethoscope, t: 'Collegamento veterinario', d: 'Il vostro veterinario partner puo attivare direttamente il servizio, senza che dobbiate fare nulla.' },
            ].map(g => (
              <div key={g.t} className="card text-center">
                <g.icon size={28} className="mx-auto mb-3 text-accent" />
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-2">{g.t}</h3>
                <p className="text-text-muted text-sm">{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cosa include */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Cosa include ogni piano</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Cremazione individuale con restituzione ceneri',
              'Certificato di cremazione',
              'Prezzo bloccato per tutta la durata',
              'Nessun interesse sulle rate',
              'Annullabile in qualsiasi momento',
              'Rimborso del versato (meno 5% spese)',
              'Attivazione immediata dal veterinario',
              'Assistenza dedicata 24/7',
            ].map(t => (
              <div key={t} className="flex gap-2 text-sm text-text-light">
                <Check size={14} className="text-accent mt-0.5 flex-shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 flex items-start gap-3">
            <Euro size={20} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-primary">Non &egrave; un finanziamento</p>
              <p className="text-sm text-text-muted">&Egrave; un semplice prepagamento rateale per un servizio futuro. Nessun interesse, nessuna segnalazione, nessun prodotto finanziario.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 relative overflow-hidden">
        <Image src="/images/hero-pet.png" alt="" fill className="object-cover opacity-15" sizes="100vw" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-4">Proteggete il vostro amico</h2>
          <p className="text-white/80 mb-8">Contattateci per attivare il piano. Un consulente vi guidera nella scelta migliore.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pet/previdenza/configuratore" className="btn-accent text-lg py-4 px-10">
              Contattaci <ChevronRight size={18} className="ml-2" />
            </Link>
            <a href="tel:+390815551234" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-lg py-4 px-10">
              <Phone size={18} className="mr-2" /> Chiama ora
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
