import Image from 'next/image'
import Link from 'next/link'
import { Plane, FileText, Phone, ChevronRight, Clock, Shield, AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guida al Rimpatrio Salma — Procedure, Documenti e Costi',
  description: 'Guida completa al rimpatrio salma: documenti necessari, procedure consolari, tempi, costi per zona. Come funziona il trasporto internazionale.',
}

export default function GuidaRimpatrioPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/guida-rimpatrio-salma.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Plane size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white mb-4">Guida al Rimpatrio Salma</h1>
          <p className="text-white/80 text-lg">Tutto quello che dovete sapere sul trasporto internazionale.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 prose max-w-none">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">Quando serve il rimpatrio?</h2>
          <p className="text-text-light mb-4">Il rimpatrio salma e necessario quando una persona decede in un paese diverso da quello in cui la famiglia desidera la sepoltura. Ci sono due scenari principali:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-2">Rimpatrio IN Italia</h3>
              <p className="text-text-light text-sm">Un italiano o residente in Italia decede all&apos;estero. La famiglia desidera riportare la salma in Italia per la sepoltura.</p>
            </div>
            <div className="card">
              <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-2">Espatrio DALL&apos;Italia</h3>
              <p className="text-text-light text-sm">Un cittadino straniero decede in Italia. La famiglia desidera il rimpatrio nel paese d&apos;origine.</p>
            </div>
          </div>

          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">Documenti necessari</h2>
          <div className="card bg-primary/5 border-primary/10 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Certificato di morte (originale)',
                'Traduzione giurata del certificato',
                'Passaporto mortuario (rilasciato dal Comune)',
                'Nulla osta dell\'autorita consolare',
                'Autorizzazione al trasporto internazionale',
                'Certificato di imbalsamazione/tanatoprassi',
                'Dichiarazione di contenuto del feretro',
                'Passaporto o documento del defunto',
              ].map(d => (
                <div key={d} className="flex gap-2 text-sm text-text-light">
                  <FileText size={14} className="text-secondary mt-0.5 flex-shrink-0" /> {d}
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-4">I documenti variano per paese. Funerix si occupa della raccolta e presentazione di tutti i documenti necessari.</p>
          </div>

          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">Costi indicativi per zona</h2>
          <div className="card overflow-x-auto mb-8 p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background-dark/50">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Zona</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Range costo</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium hidden md:table-cell">Tempo medio</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { zona: 'Europa', costo: '2.000 — 4.500', tempo: '3-7 giorni' },
                  { zona: 'Nord Africa', costo: '3.000 — 5.500', tempo: '7-10 giorni' },
                  { zona: 'Americhe', costo: '4.500 — 9.000', tempo: '10-14 giorni' },
                  { zona: 'Asia', costo: '5.000 — 12.000', tempo: '12-14 giorni' },
                  { zona: 'Africa Sub-Sahariana', costo: '4.500 — 7.000', tempo: '10-12 giorni' },
                ].map(z => (
                  <tr key={z.zona} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium text-primary">{z.zona}</td>
                    <td className="py-3 px-4 text-right font-[family-name:var(--font-serif)] font-semibold">&euro; {z.costo}</td>
                    <td className="py-3 px-4 text-right text-text-muted hidden md:table-cell flex items-center justify-end gap-1"><Clock size={12} /> {z.tempo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">Cosa e incluso nel servizio Funerix</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {[
              'Recupero salma nel paese straniero',
              'Tutte le pratiche consolari e burocratiche',
              'Traduzione e legalizzazione documenti',
              'Trattamento conservativo (tanatoprassi)',
              'Cofano zincato a norma IATA',
              'Coordinamento trasporto aereo',
              'Sdoganamento e pratiche aeroportuali',
              'Accoglienza all\'arrivo e consegna',
              'Tracking della pratica in tempo reale',
              'Consulente dedicato multilingua',
            ].map(s => (
              <div key={s} className="flex gap-2 text-sm text-text-light">
                <Shield size={14} className="text-accent mt-0.5 flex-shrink-0" /> {s}
              </div>
            ))}
          </div>

          <div className="card bg-secondary/5 border-secondary/20 mb-8">
            <div className="flex gap-3 items-start">
              <AlertTriangle size={20} className="text-secondary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-primary mb-1">Importante: agite rapidamente</h3>
                <p className="text-text-light text-sm">In caso di decesso all&apos;estero, contattate immediatamente un servizio di rimpatrio. I tempi sono importanti per la conservazione della salma e per le pratiche burocratiche. Funerix e operativo 24/7.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/rimpatri" className="btn-primary text-base py-4 px-10">
              Vai al Servizio Rimpatri <ChevronRight size={18} className="ml-2" />
            </Link>
            <a href="tel:+390815551234" className="btn-secondary text-base py-4 px-10">
              <Phone size={18} className="mr-2" /> Urgenze 24/7
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
