import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight, FileText } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Successione Ereditaria: Guida Completa",
  description: "Guida completa alla successione ereditaria: documenti necessari, tempistiche, costi, imposta di successione, rinuncia all'eredità e come Funerix vi assiste.",
  keywords: "successione ereditaria guida, dichiarazione successione costi, imposta successione 2025, rinuncia eredità",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-principale.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
        <FileText size={36} className="mx-auto mb-3 text-secondary-light" />
        <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white">Successione Ereditaria: Guida Completa</h1>
        <p className="mt-3 text-white/85">Tutto quello che dovete sapere sulla dichiarazione di successione</p>
      </div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Tutte le guide</Link>
        <div className="space-y-4">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Cos&apos;è la successione</h2>
          <p className="text-sm text-text-light">Procedura legale di trasferimento beni. Obbligatoria entro 12 mesi dal decesso se ci sono immobili o conti sopra determinate soglie. La dichiarazione di successione deve essere presentata all&apos;Agenzia delle Entrate e serve a comunicare il passaggio del patrimonio del defunto agli eredi legittimi o testamentari.</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Documenti necessari</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-light"><li><strong>Certificato di morte</strong> — rilasciato dal Comune di decesso</li><li><strong>Stato di famiglia</strong> — del defunto e di tutti gli eredi</li><li><strong>Visure catastali</strong> — di tutti gli immobili intestati al defunto</li><li><strong>Estratti conto bancari</strong> — saldi alla data del decesso</li><li><strong>Eventuali testamenti</strong> — olografi o pubblici, se presenti</li><li><strong>Codice fiscale di tutti gli eredi</strong> — necessario per la compilazione della dichiarazione</li></ul></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Tempistiche e costi</h2>
          <p className="text-sm text-text-light mb-3">La dichiarazione di successione deve essere presentata entro 12 mesi dalla data del decesso.</p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-light"><li><strong>4% per coniuge e figli</strong> — con franchigia di €1.000.000 per ciascun beneficiario</li><li><strong>6% per fratelli e sorelle</strong> — con franchigia di €100.000 per ciascun beneficiario</li><li><strong>6% per altri parenti fino al 4° grado</strong> — senza franchigia</li><li><strong>8% per altri soggetti</strong> — senza franchigia</li><li><strong>Onorario professionista</strong> — da €500 a €2.000 a seconda della complessità della pratica</li></ul></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Rinuncia all&apos;eredità</h2>
          <p className="text-sm text-text-light">Possibile entro 10 anni dall&apos;apertura della successione (3 mesi se già in possesso dei beni). Da valutare attentamente in caso di debiti del defunto superiori all&apos;attivo ereditario. La rinuncia si effettua con atto notarile o presso la cancelleria del tribunale competente. In alternativa è possibile accettare con beneficio d&apos;inventario, rispondendo dei debiti solo nei limiti del patrimonio ereditato.</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Come vi aiutiamo</h2>
          <p className="text-sm text-text-light">Funerix gestisce l&apos;intera pratica di successione per conto vostro: raccolta documenti, compilazione della dichiarazione, invio telematico all&apos;Agenzia delle Entrate e voltura catastale degli immobili. Vi seguiamo passo dopo passo per sollevarvi da ogni incombenza burocratica in un momento già difficile.</p></div>
        </div>
        <div className="mt-12 text-center"><Link href="/successione" className="btn-primary">Richiedi Assistenza Successione <ChevronRight size={14} className="ml-1" /></Link></div>
      </div></section>
    </div>
  )
}
