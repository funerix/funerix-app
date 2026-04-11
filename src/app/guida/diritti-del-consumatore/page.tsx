import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight, Shield } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Diritti del Consumatore nei Servizi Funebri",
  description: "Guida completa ai diritti del consumatore nei servizi funebri: preventivo obbligatorio, trasparenza prezzi, segnalazioni e consigli pratici per tutelarsi.",
  keywords: "diritti consumatore funerale, preventivo funerale obbligatorio, trasparenza prezzi funebri",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-principale.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
        <Shield size={36} className="mx-auto mb-3 text-secondary-light" />
        <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white">Diritti del Consumatore nei Servizi Funebri</h1>
        <p className="mt-3 text-white/85">Tutto quello che dovete sapere per tutelarvi</p>
      </div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Tutte le guide</Link>
        <div className="space-y-4">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">I vostri diritti</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-light"><li><strong>Diritto a preventivo scritto gratuito</strong> — ogni impresa funebre è tenuta a fornirvi un preventivo dettagliato senza alcun costo</li><li><strong>Diritto a scegliere liberamente l&apos;impresa</strong> — nessun ospedale, obitorio o struttura può imporvi un&apos;impresa funebre specifica</li><li><strong>Divieto di imposizione servizi</strong> — non possono obbligarvi ad acquistare servizi non richiesti o non necessari</li><li><strong>Diritto a trasparenza prezzi</strong> — i costi devono essere chiari, dettagliati e comunicati prima di qualsiasi impegno</li></ul></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Cosa deve fare l&apos;impresa funebre</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-light"><li><strong>Preventivo dettagliato per iscritto</strong> — con ogni voce di spesa separata e descritta</li><li><strong>Nessun obbligo di accettazione</strong> — avete tutto il diritto di rifiutare il preventivo senza penali</li><li><strong>Possibilità di confrontare più preventivi</strong> — l&apos;impresa non può fare pressioni per una decisione immediata</li></ul></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Segnalazioni e reclami</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-light"><li><strong>ASL locale</strong> — per violazioni igienico-sanitarie e irregolarità nei servizi</li><li><strong>Comune</strong> — per verificare licenze e autorizzazioni dell&apos;impresa funebre</li><li><strong>Associazioni consumatori</strong> — per assistenza legale e tutela dei vostri diritti</li><li><strong>Guardia di Finanza</strong> — per segnalare prezzi anomali o pratiche commerciali scorrette</li></ul></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Consigli pratici</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-light"><li><strong>Non firmate nulla sotto pressione</strong> — prendetevi il tempo necessario per decidere</li><li><strong>Chiedete sempre il preventivo scritto</strong> — è un vostro diritto e deve essere gratuito</li><li><strong>Confrontate almeno 2-3 imprese</strong> — i prezzi possono variare significativamente tra un&apos;impresa e l&apos;altra</li></ul></div>
        </div>
        <div className="mt-12 text-center"><Link href="/contatti" className="btn-primary">Avete bisogno di assistenza? <ChevronRight size={14} className="ml-1" /></Link></div>
      </div></section>
    </div>
  )
}
