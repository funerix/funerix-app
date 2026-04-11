import Link from 'next/link'
import Image from 'next/image'
import { FileText, ChevronRight, Check, Euro, Clock, Shield } from 'lucide-react'
import { PhoneLink } from '@/components/PhoneLink'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dichiarazione di Successione — Assistenza Completa',
  description: 'Assistenza completa per la dichiarazione di successione ereditaria. Disbrigo pratiche, documenti, notaio. Prezzi trasparenti.',
}

const pratiche = [
  { tipo: 'Successione Standard', prezzo: '800 — 1.500', desc: 'Nessun immobile, solo conti correnti, titoli, veicoli. Disbrigo pratiche e presentazione all\'Agenzia delle Entrate.', tempo: '30-60 giorni' },
  { tipo: 'Successione con Immobili', prezzo: '1.500 — 3.000', desc: 'Uno o piu immobili. Include visure catastali, voltura, calcolo imposte, presentazione dichiarazione.', tempo: '60-90 giorni' },
  { tipo: 'Successione Complessa', prezzo: '3.000 — 5.000+', desc: 'Eredita complesse con piu immobili, societa, attivita commerciali, contenziosi tra eredi.', tempo: '90-180 giorni' },
]

const documenti = [
  'Certificato di morte',
  'Stato di famiglia storico del defunto',
  'Codice fiscale del defunto e degli eredi',
  'Atto di ultima volonta (testamento, se presente)',
  'Visure catastali degli immobili',
  'Estratti conto bancari alla data del decesso',
  'Certificati di possesso titoli/azioni',
  'Documenti dei veicoli intestati al defunto',
]

export default function SuccessionePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/card-successione.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <FileText size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            Dichiarazione di Successione
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Ci occupiamo di tutto: documenti, calcolo imposte, presentazione all&apos;Agenzia delle Entrate
            e voltura catastale. Voi non dovete pensare a nulla.
          </p>
        </div>
      </section>

      {/* Cos'e */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-4">Cos&apos;e la successione?</h2>
              <p className="text-text-light text-base leading-relaxed mb-4">
                La dichiarazione di successione e&apos; un obbligo fiscale che gli eredi devono presentare
                all&apos;Agenzia delle Entrate entro 12 mesi dal decesso. Serve per trasferire
                ufficialmente i beni del defunto (immobili, conti, veicoli) agli eredi.
              </p>
              <p className="text-text-light text-base leading-relaxed">
                E&apos; una pratica complessa che richiede la raccolta di numerosi documenti,
                il calcolo delle imposte dovute e la presentazione telematica. Funerix si occupa
                di tutto, dalla raccolta documenti alla voltura catastale.
              </p>
            </div>
            <div className="card bg-primary/5 border-primary/10">
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-4">Quando e&apos; obbligatoria?</h3>
              <ul className="space-y-3 text-sm text-text-light">
                <li className="flex gap-2"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" /> Sempre, se il defunto possedeva beni (immobili, conti, titoli)</li>
                <li className="flex gap-2"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" /> Entro 12 mesi dal decesso (sanzioni per ritardo)</li>
                <li className="flex gap-2"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" /> Anche se non c&apos;e&apos; testamento (successione legittima)</li>
                <li className="flex gap-2"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" /> Anche per conti correnti con saldo minimo</li>
              </ul>
              <p className="text-xs text-text-muted mt-4">Non e&apos; obbligatoria solo se il valore dell&apos;eredita e&apos; inferiore a €100.000 e non ci sono immobili.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Tipologie e prezzi */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Tipologie e costi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pratiche.map((p, i) => (
              <div key={p.tipo} className={`card flex flex-col ${i === 1 ? 'border-2 border-secondary relative' : ''}`}>
                {i === 1 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs px-3 py-1 rounded-full font-medium">Piu comune</div>}
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-2">{p.tipo}</h3>
                <p className="text-text-light text-sm mb-4 flex-1">{p.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-[family-name:var(--font-serif)] text-2xl text-primary font-bold">&euro; {p.prezzo}</p>
                  </div>
                  <div className="flex items-center gap-1 text-text-muted text-xs">
                    <Clock size={12} /> {p.tempo}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cosa include */}
      <section className="py-16 bg-background-dark">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Cosa include il servizio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Raccolta e verifica di tutti i documenti necessari',
              'Visure catastali e ipotecarie',
              'Calcolo delle imposte di successione',
              'Compilazione della dichiarazione di successione',
              'Presentazione telematica all\'Agenzia delle Entrate',
              'Voltura catastale degli immobili',
              'Sblocco conti correnti bancari',
              'Assistenza per rinuncia all\'eredita (se necessario)',
              'Supporto per divisione ereditaria tra eredi',
              'Consulenza su agevolazioni prima casa eredi',
            ].map(t => (
              <div key={t} className="flex gap-2 text-sm text-text-light"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" />{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Documenti necessari */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Documenti necessari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documenti.map(d => (
              <div key={d} className="flex items-start gap-2 text-sm text-text-light">
                <FileText size={14} className="text-secondary mt-0.5 flex-shrink-0" /> {d}
              </div>
            ))}
            <p className="md:col-span-2 text-xs text-text-muted mt-2">Non preoccupatevi se non avete tutti i documenti. Vi guideremo nella raccolta.</p>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="bg-primary py-16 relative overflow-hidden">
        <Image src="/images/card-successione.png" alt="" fill className="object-cover opacity-15" sizes="100vw" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-4">Avete bisogno di assistenza?</h2>
          <p className="text-white/80 mb-8">Contattateci per un preventivo gratuito. Vi guideremo in ogni passo della pratica.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <PhoneLink className="btn-accent text-lg py-4 px-10" showIcon label="Chiama Ora" />
            <Link href="/contatti" className="btn-secondary border-white/30 text-white hover:bg-white/10 hover:text-white text-lg py-4 px-10">
              Richiedi Preventivo <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
