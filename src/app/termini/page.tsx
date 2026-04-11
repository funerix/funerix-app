import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termini e Condizioni',
  description: 'Termini e condizioni di utilizzo del sito e dei servizi Funerix.',
}

export default function TerminiPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white">Termini e Condizioni</h1>
          <p className="mt-3 text-white/80">Condizioni di utilizzo del sito e dei servizi</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Torna alla Home</Link>
          <div className="space-y-6">
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Natura del servizio</h2>
              <p className="text-sm text-text-light">Il sito funerix.com offre un servizio di configurazione online di servizi funebri. I preventivi generati attraverso il configuratore hanno valore puramente indicativo e non costituiscono proposta contrattuale vincolante ai sensi dell&apos;art. 1336 del Codice Civile.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Preventivi e prezzi</h2>
              <p className="text-sm text-text-light">I prezzi mostrati sul sito sono orientativi e possono variare in base alle specifiche circostanze del servizio, alle disposizioni dell&apos;autorit&agrave; comunale e alla normativa vigente. Il prezzo definitivo verr&agrave; concordato con il consulente dedicato.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Previdenza funeraria</h2>
              <p className="text-sm text-text-light">I piani di previdenza funeraria costituiscono un prepagamento rateale per un servizio futuro. Non sono prodotti finanziari, assicurativi o di investimento. Il diritto di recesso &egrave; esercitabile in qualsiasi momento: entro 14 giorni con rimborso totale, successivamente con rimborso del versato meno il 5% di spese amministrative.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Autorizzazioni</h2>
              <p className="text-sm text-text-light">Funerix opera in conformit&agrave; alla L.R. Campania n. 12/2001 e s.m.i., al D.Lgs. 206/2005 (Codice del Consumo) e alle normative comunali vigenti in materia di servizi funebri.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Responsabilit&agrave;</h2>
              <p className="text-sm text-text-light">Funerix si impegna a fornire informazioni accurate e aggiornate. Tuttavia, non pu&ograve; garantire l&apos;assenza di errori o imprecisioni nei contenuti del sito. L&apos;utilizzo delle informazioni presenti sul sito avviene sotto la responsabilit&agrave; dell&apos;utente.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Foro competente</h2>
              <p className="text-sm text-text-light">Per qualsiasi controversia derivante dall&apos;utilizzo del sito o dei servizi, il foro competente &egrave; quello di Napoli.</p>
            </div>
            <p className="text-xs text-text-muted">Ultimo aggiornamento: aprile 2026</p>
          </div>
        </div>
      </section>
    </div>
  )
}
