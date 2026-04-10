import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Flame } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cremazione: come funziona, costi e tempi in Campania",
  description: "Guida completa alla cremazione in Campania: procedura, costi (da €1.370), tempi di attesa, crematori a Napoli e Salerno, scelta urna, dispersione ceneri.",
  keywords: "cremazione napoli, cremazione campania, costo cremazione, crematorio poggioreale, urna cineraria, tempi cremazione",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/guida-cremazione-come-funziona.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
        <Flame size={36} className="mx-auto mb-3 text-secondary-light" />
        <h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">Cremazione: come funziona</h1>
        <p className="mt-3 text-white/85">Procedura, costi e tempi in Campania</p>
      </div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Tutte le guide</Link>
        <div className="space-y-4">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">La procedura</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-text-light"><li>Richiesta di cremazione firmata dai familiari aventi diritto</li><li>Autorizzazione dell&apos;ASL</li><li>Trasporto della salma al crematorio</li><li>Cremazione (durata circa 2-3 ore)</li><li>Consegna dell&apos;urna alla famiglia (dopo 24-48 ore)</li></ol></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Crematori in Campania</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-text-light"><li><strong>Cimitero di Poggioreale, Napoli</strong> — il principale della regione</li><li><strong>Crematorio di Salerno</strong></li></ul>
          <p className="text-sm text-text-muted mt-2">Tempi di attesa: 10-30 giorni per la disponibilità. Durante l&apos;attesa la salma viene conservata in cella frigorifera (€30-€80/giorno).</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Costi</h2>
          <div className="space-y-2 text-sm text-text-light"><p>Tariffa cremazione: <strong>€500 — €800</strong></p><p>Cella frigorifera (attesa): <strong>€30 — €80/giorno</strong></p><p>Urna cineraria: <strong>€80 — €1.200</strong></p><p>Cofano per cremazione: <strong>€350 — €1.200</strong></p><p className="font-medium text-primary mt-2">Pacchetto completo cremazione: da €1.370</p></div></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Destinazione delle ceneri</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-text-light"><li>Conservazione in cimitero (colombario)</li><li>Conservazione domestica (in urna sigillata)</li><li>Dispersione in natura (con autorizzazione comunale)</li><li>Tumulazione dell&apos;urna in loculo</li></ul></div>
        </div>
        <div className="mt-12 text-center"><Link href="/configuratore" className="btn-primary">Configura cremazione <ChevronRight size={14} className="ml-1" /></Link></div>
      </div></section>
    </div>
  )
}
