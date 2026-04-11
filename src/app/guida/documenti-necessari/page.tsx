import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight, FileText, CheckCircle2 } from "lucide-react"
import { PhoneLink } from '@/components/PhoneLink'
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documenti necessari per un funerale — Lista completa",
  description: "Quali documenti servono per organizzare un funerale? Lista completa: carta identità, tessera sanitaria, certificato morte, autorizzazioni. Cosa procuriamo noi.",
  keywords: "documenti funerale, certificato di morte, autorizzazione trasporto salma, pratiche funerarie, denuncia di morte",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/guida-documenti-necessari.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
        <FileText size={36} className="mx-auto mb-3 text-secondary-light" />
        <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white">Documenti necessari per un funerale</h1>
        <p className="mt-3 text-white/85">Lista completa — ci occupiamo noi di tutto</p>
      </div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Tutte le guide</Link>
        <div className="space-y-4">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Documenti da procurare voi</h2>
          <div className="space-y-2">{["Carta d'identità del defunto (in corso di validità)","Tessera sanitaria","Codice fiscale","Eventuale testamento o disposizioni"].map(d=>
            <div key={d} className="flex gap-2 text-sm text-text-light"><CheckCircle2 size={16} className="text-accent flex-shrink-0 mt-0.5" />{d}</div>)}</div></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Documenti che procuriamo noi</h2>
          <div className="space-y-2">{["Certificato di morte (dal medico o 118)","Denuncia di morte al Comune (entro 24 ore)","Autorizzazione al trasporto della salma","Autorizzazione alla sepoltura o cremazione","Concessione cimiteriale","Nulla osta della Procura (se necessario)","Passaporto mortuario (per rimpatri)"].map(d=>
            <div key={d} className="flex gap-2 text-sm text-text-light"><CheckCircle2 size={16} className="text-secondary flex-shrink-0 mt-0.5" />{d}</div>)}</div></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Tempistiche</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-text-light"><li>Denuncia di morte: entro 24 ore dal decesso</li><li>Autorizzazione al trasporto: 24-48 ore</li><li>Autorizzazione alla sepoltura: 24-48 ore</li><li>Concessione cimiteriale: variabile (da 1 a 5 giorni)</li></ul></div>
        </div>
        <div className="mt-12 text-center">
          <PhoneLink className="btn-primary" showIcon label="Chiamaci — pensiamo a tutto noi" />
        </div>
      </div></section>
    </div>
  )
}
