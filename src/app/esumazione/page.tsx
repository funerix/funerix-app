import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Shovel, Check, FileText, ClipboardCheck, Search, HardHat } from 'lucide-react'
import { PhoneLink } from '@/components/PhoneLink'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Esumazione e Riesumazione — Servizio Completo',
  description: 'Servizio di esumazione e riesumazione salme in Campania. Trasferimento resti, ricollocazione in loculo, cremazione resti. Assistenza pratiche.',
}

const servizi = [
  { nome: 'Esumazione ordinaria', prezzo: '400 — 800', desc: 'Al termine della concessione cimiteriale (generalmente dopo 10-30 anni).' },
  { nome: 'Esumazione straordinaria', prezzo: '600 — 1.200', desc: 'Prima del termine della concessione, su richiesta della famiglia o dell\'autorità.' },
  { nome: 'Riesumazione da loculo', prezzo: '500 — 1.000', desc: 'Estrazione della salma da un loculo per trasferimento o cremazione.' },
  { nome: 'Cremazione resti', prezzo: '200 — 400', desc: 'Cremazione dei resti ossei dopo esumazione.' },
  { nome: 'Trasferimento in altro cimitero', prezzo: '800 — 2.000', desc: 'Trasporto dei resti in un cimitero diverso, anche fuori provincia.' },
  { nome: 'Ricollocazione in loculo/ossario', prezzo: '300 — 600', desc: 'Collocazione dei resti in nuovo loculo, ossario o cappella di famiglia.' },
  { nome: 'Assistenza pratiche', prezzo: '150 — 300', desc: 'Gestione completa delle autorizzazioni con Comune, ASL e cimitero.' },
]

const passaggi = [
  { n: '01', icon: FileText, t: 'Richiesta', d: 'Contattateci e spiegateci la vostra esigenza. Vi guideremo nella scelta del servizio più adatto.' },
  { n: '02', icon: Search, t: 'Sopralluogo', d: 'Verifichiamo la situazione presso il cimitero: stato della concessione, posizione e condizioni.' },
  { n: '03', icon: ClipboardCheck, t: 'Autorizzazioni', d: 'Ci occupiamo di tutte le pratiche con Comune, ASL e direzione cimiteriale.' },
  { n: '04', icon: HardHat, t: 'Esumazione', d: 'Eseguiamo l\'intervento con personale qualificato nel pieno rispetto delle normative.' },
]

export default function EsumazionePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/card-esumazione.jpg" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Shovel size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">Esumazione e Riesumazione</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Servizio completo per esumazione, riesumazione, trasferimento resti e cremazione.
            Assistenza per tutte le pratiche burocratiche in Campania.
          </p>
        </div>
      </section>

      {/* Come funziona */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-12">Come funziona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {passaggi.map(s => (
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

      {/* Servizi e costi */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Servizi e costi indicativi</h2>
          <div className="space-y-3">
            {servizi.map(s => (
              <div key={s.nome} className="card flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="font-medium text-primary">{s.nome}</h3>
                  <p className="text-text-muted text-sm">{s.desc}</p>
                </div>
                <span className="font-[family-name:var(--font-serif)] text-xl text-primary font-semibold whitespace-nowrap">&euro; {s.prezzo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quando è necessaria */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-10">Quando è necessaria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-3">Esumazione Ordinaria</h3>
              <p className="text-text-light text-sm mb-4">
                Avviene alla scadenza della concessione cimiteriale, generalmente dopo 10-30 anni dalla sepoltura in terra.
                Il Comune invia un avviso ai familiari per procedere al recupero dei resti.
              </p>
              <ul className="space-y-2">
                {['Scadenza concessione cimiteriale', 'Avviso comunale ai familiari', 'Trasferimento resti in ossario o cremazione'].map(t => (
                  <li key={t} className="flex gap-2 text-sm text-text-light"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-3">Esumazione Straordinaria</h3>
              <p className="text-text-light text-sm mb-4">
                Richiesta dalla famiglia prima della scadenza della concessione, per trasferimento in altro cimitero,
                cremazione o ricongiungimento con altri familiari. Richiede autorizzazione specifica.
              </p>
              <ul className="space-y-2">
                {['Su richiesta della famiglia o autorità giudiziaria', 'Trasferimento in altro cimitero o città', 'Cremazione dei resti o ricongiungimento familiare'].map(t => (
                  <li key={t} className="flex gap-2 text-sm text-text-light"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ci occupiamo di tutto */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Ci occupiamo di tutto</h2>
          <p className="text-text-light text-center mb-10 max-w-2xl mx-auto">
            Non dovete pensare a nulla. Funerix gestisce ogni aspetto dell&apos;esumazione, dalla burocrazia all&apos;intervento.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Richiesta autorizzazione al Comune',
              'Coordinamento con la direzione cimiteriale',
              'Pratiche ASL e certificazioni sanitarie',
              'Intervento con personale qualificato',
              'Trasporto resti verso nuova destinazione',
              'Ricollocazione in loculo, ossario o cappella',
              'Cremazione resti ossei (se richiesta)',
              'Assistenza completa alla famiglia',
            ].map(t => (
              <div key={t} className="flex gap-2 text-sm text-text-light">
                <Check size={14} className="text-accent mt-0.5 flex-shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 relative overflow-hidden">
        <Image src="/images/card-esumazione.jpg" alt="" fill className="object-cover opacity-15" sizes="100vw" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-4">Avete bisogno di un&apos;esumazione?</h2>
          <p className="text-white/80 mb-8">Contattateci per un sopralluogo gratuito e un preventivo senza impegno.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contatti" className="btn-accent text-lg py-4 px-10">
              Richiedi Preventivo <ChevronRight size={16} className="ml-1" />
            </Link>
            <PhoneLink className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-lg py-4 px-10" showIcon label="Chiama per Preventivo" />
          </div>
        </div>
      </section>
    </div>
  )
}
