import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight, Heart } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Donazione Organi e Tessuti: Cosa Sapere",
  description: "Guida completa alla donazione di organi e tessuti in Italia: come esprimere la volontà, il processo, chi può donare e le domande più frequenti.",
  keywords: "donazione organi Italia, come donare organi, silenzio assenso organi, AIDO tessera donatore",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-principale.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
        <Heart size={36} className="mx-auto mb-3 text-secondary-light" />
        <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white">Donazione Organi e Tessuti: Cosa Sapere</h1>
        <p className="mt-3 text-white/85">Un gesto d&apos;amore che può salvare molte vite</p>
      </div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Tutte le guide</Link>
        <div className="space-y-4">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Cos&apos;è la donazione</h2>
          <p className="text-sm text-text-light">Atto volontario che permette di salvare vite donando i propri organi e tessuti dopo la morte. In Italia vige il principio del silenzio-assenso informato, introdotto dalla Legge 91/1999: ogni cittadino è chiamato a esprimere la propria volontà, e in assenza di dichiarazione i familiari vengono interpellati.</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Come esprimere la volontà</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-light"><li><strong>Tessera sanitaria (SIT)</strong> — al momento del rilascio o rinnovo presso l&apos;ASL o il Comune</li><li><strong>Dichiarazione all&apos;ASL</strong> — compilando l&apos;apposito modulo presso la propria azienda sanitaria locale</li><li><strong>DAT (Disposizioni Anticipate di Trattamento)</strong> — documento più ampio che include anche la volontà sulla donazione</li><li><strong>Tesserino AIDO</strong> — iscrivendosi all&apos;Associazione Italiana Donatori Organi</li><li><strong>Dichiarazione scritta con data e firma</strong> — un foglio da conservare tra i documenti personali</li></ul></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Il processo</h2>
          <p className="text-sm text-text-light">Il prelievo degli organi avviene solo dopo l&apos;accertamento della morte cerebrale, che richiede un periodo di osservazione di 6 ore da parte di una commissione medica. La donazione non modifica in alcun modo l&apos;aspetto esteriore della salma ed è pienamente compatibile con il funerale a bara aperta e con tutte le forme di sepoltura, inclusa la cremazione.</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Chi può donare</h2>
          <p className="text-sm text-text-light">Non ci sono limiti di età per la donazione di organi e tessuti. L&apos;idoneità viene valutata caso per caso dai medici al momento del potenziale prelievo. Sono escluse solo alcune patologie specifiche (come alcune malattie infettive o neoplastiche). Anche persone anziane o con patologie croniche possono risultare idonee alla donazione di alcuni tessuti.</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Domande frequenti</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-light"><li><strong>La donazione ritarda il funerale?</strong> — No, il ritardo è minimo: massimo 24-48 ore rispetto ai tempi normali</li><li><strong>Si possono donare organi con la cremazione?</strong> — Sì, donazione e cremazione sono perfettamente compatibili</li><li><strong>I familiari possono opporsi?</strong> — Sì, se il defunto non ha espresso in vita una volontà chiara sulla donazione</li><li><strong>Costa qualcosa?</strong> — No, la donazione di organi è completamente gratuita per la famiglia del donatore</li></ul></div>
        </div>
        <div className="mt-12 text-center"><Link href="/guida/testamento-e-volonta" className="btn-primary">Scopri le Disposizioni Anticipate <ChevronRight size={14} className="ml-1" /></Link></div>
      </div></section>
    </div>
  )
}
