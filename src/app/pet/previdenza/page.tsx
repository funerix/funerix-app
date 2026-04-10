import Link from 'next/link'
import { PawPrint, ChevronRight, Phone, Check, Heart, Calendar, Euro, Shield, Stethoscope } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Previdenza Pet — Piano Prepagato Cremazione | Funerix',
  description: 'Pianificate oggi la cremazione del vostro animale domestico. Prezzo bloccato, rate mensili comode, nessun pensiero nel momento del dolore.',
}

async function fetchPrezzi() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/pet/prezzi`, { cache: 'no-store' })
    if (res.ok) return res.json()
  } catch {}
  return []
}

export default async function PrevidenzaPetPage() {
  const prezzi = await fetchPrezzi()

  const piani = [
    {
      nome: 'Piano Piccolo',
      animale: 'Gatto / Cane piccolo',
      prezzo: 150,
      rata: 13,
      mesi: 12,
      colore: 'bg-secondary/10 text-secondary',
    },
    {
      nome: 'Piano Medio',
      animale: 'Cane medio',
      prezzo: 250,
      rata: 21,
      mesi: 12,
      colore: 'bg-accent/10 text-accent',
      evidenza: true,
    },
    {
      nome: 'Piano Grande',
      animale: 'Cane grande',
      prezzo: 380,
      rata: 32,
      mesi: 12,
      colore: 'bg-primary/10 text-primary',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/70" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-light text-xs px-4 py-2 rounded-full mb-5 border border-secondary/20">
            <Shield size={14} /> Prezzo bloccato per sempre
          </div>
          <PawPrint size={48} className="mx-auto mb-6 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white leading-tight">
            Previdenza Pet
          </h1>
          <p className="mt-4 text-xl text-secondary-light font-medium">
            Piano Prepagato Cremazione
          </p>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
            Pianificate oggi la cremazione del vostro animale domestico.
            Bloccate il prezzo e pagate comodamente a rate mensili.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contatti" className="btn-accent text-base py-4 px-8">
              Richiedi informazioni <ChevronRight size={18} className="ml-2" />
            </Link>
            <a href="tel:+390815551234" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-base py-4 px-8">
              <Phone size={18} className="mr-2" /> Parla con noi
            </a>
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-12">Come funziona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', icon: Heart, t: 'Scegliete', d: 'Selezionate il piano adatto alla taglia e alla specie del vostro animale.' },
              { n: '02', icon: Euro, t: 'Pagate a rate', d: 'Rate mensili comode: da 10 euro al mese. Nessun interesse.' },
              { n: '03', icon: Shield, t: 'Vivete tranquilli', d: 'Il prezzo e bloccato per sempre. Nessun aumento, nessuna sorpresa.' },
              { n: '04', icon: Calendar, t: 'Quando il momento arriva', d: 'Tutto e gia organizzato e pagato. Nessuna decisione da prendere nel dolore.' },
            ].map((s) => (
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

      {/* Piani */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-4">I nostri piani</h2>
          <p className="text-text-light text-center mb-10 max-w-xl mx-auto">
            Scegliete il piano adatto al vostro animale. Tutti i piani includono cremazione individuale, urna e certificato.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {piani.map((p) => (
              <div key={p.nome} className={`card relative ${p.evidenza ? 'ring-2 ring-accent' : ''}`}>
                {p.evidenza && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs px-3 py-1 rounded-full font-medium">
                    Piu scelto
                  </div>
                )}
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full ${p.colore} flex items-center justify-center`}>
                  <PawPrint size={20} />
                </div>
                <h3 className="font-[family-name:var(--font-serif)] text-xl text-primary text-center mb-1">{p.nome}</h3>
                <p className="text-text-muted text-sm text-center mb-4">{p.animale}</p>
                <div className="text-center mb-4">
                  <span className="font-[family-name:var(--font-serif)] text-3xl text-primary font-bold">&euro; {p.prezzo}</span>
                </div>
                <div className="bg-background-dark rounded-lg p-3 text-center mb-4">
                  <p className="text-sm text-text-muted">oppure</p>
                  <p className="text-lg font-bold text-secondary">da &euro; {p.rata}/mese</p>
                  <p className="text-xs text-text-muted">per {p.mesi} mesi</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {['Cremazione individuale', 'Urna inclusa', 'Certificato cremazione', 'Ritiro a domicilio'].map(t => (
                    <li key={t} className="flex gap-2 text-sm text-text-light">
                      <Check size={14} className="text-accent mt-0.5 flex-shrink-0" />{t}
                    </li>
                  ))}
                </ul>
                <Link href="/contatti" className={`btn-${p.evidenza ? 'accent' : 'primary'} w-full text-sm justify-center`}>
                  Richiedi informazioni
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vantaggi */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">Perche scegliere la previdenza pet</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Euro, t: 'Prezzo bloccato', d: 'Il prezzo che scegliete oggi resta invariato per sempre, indipendentemente dall\'inflazione e dagli aumenti.' },
              { icon: Heart, t: 'Nessun pensiero nel dolore', d: 'Quando il momento arriva, non dovrete prendere nessuna decisione. Tutto e gia organizzato e pagato.' },
              { icon: Stethoscope, t: 'Collegamento veterinario', d: 'Il vostro veterinario puo attivare direttamente il servizio, senza che dobbiate fare nulla.' },
            ].map((g) => (
              <div key={g.t} className="card text-center">
                <g.icon size={28} className="mx-auto mb-3 text-accent" />
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-2">{g.t}</h3>
                <p className="text-text-muted text-sm">{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-4">Proteggete il vostro amico</h2>
          <p className="text-white/80 mb-8">Contattateci per attivare il piano previdenza pet. Un consulente vi guidera nella scelta.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contatti" className="btn-accent text-lg py-4 px-10">
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
