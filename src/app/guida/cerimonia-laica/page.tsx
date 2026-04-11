import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight, Heart } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cerimonia Funebre Laica: Come Organizzarla",
  description: "Guida completa alla cerimonia funebre laica: come si svolge, il celebrante laico, luoghi possibili, costi e consigli per organizzare un funerale senza chiesa.",
  keywords: "cerimonia funebre laica, funerale senza chiesa, celebrante laico funerale",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-principale.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
        <Heart size={36} className="mx-auto mb-3 text-secondary-light" />
        <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white">Cerimonia Funebre Laica: Come Organizzarla</h1>
        <p className="mt-3 text-white/85">Un&apos;alternativa significativa per celebrare la vita</p>
      </div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Tutte le guide</Link>
        <div className="space-y-4">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Cos&apos;è una cerimonia laica</h2>
          <p className="text-sm text-text-light">Un&apos;alternativa alla cerimonia religiosa che celebra la vita del defunto senza riferimenti confessionali. Si concentra sulla persona, sui ricordi e sui valori condivisi, offrendo un momento di raccoglimento personalizzato e profondamente significativo.</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Come si svolge</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-light"><li><strong>Letture di testi</strong> — poesie, brani letterari o lettere scelte dalla famiglia</li><li><strong>Musica significativa</strong> — brani amati dal defunto o musica dal vivo</li><li><strong>Discorsi di familiari e amici</strong> — ricordi, aneddoti e parole di saluto</li><li><strong>Proiezione foto e video</strong> — un tributo visivo alla vita del defunto</li><li><strong>Momento di silenzio</strong> — per il raccoglimento personale e il saluto intimo</li></ul></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Il celebrante laico</h2>
          <p className="text-sm text-text-light">Figura che conduce la cerimonia, può essere un professionista specializzato o un familiare. Il celebrante coordina gli interventi e i tempi, garantendo che la cerimonia si svolga in modo armonioso e rispettoso dei desideri della famiglia.</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Dove si può svolgere</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-light"><li><strong>Sala del commiato</strong> — spazio dedicato, attrezzato e raccolto</li><li><strong>Camera ardente</strong> — presso l&apos;ospedale o la casa funeraria</li><li><strong>Giardini</strong> — per una cerimonia all&apos;aperto immersa nella natura</li><li><strong>Luoghi significativi</strong> — posti cari al defunto (con autorizzazione comunale)</li></ul></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Costi</h2>
          <div className="space-y-2 text-sm text-text-light"><p>Celebrante professionista: <strong>€200 — €500</strong></p><p>Sala del commiato: <strong>€200 — €600</strong></p><p>Servizi aggiuntivi (musica dal vivo, video tributo): <strong>variabili in base alle esigenze</strong></p></div></div>
        </div>
        <div className="mt-12 text-center"><Link href="/servizi" className="btn-primary">Scopri i Servizi Aggiuntivi <ChevronRight size={14} className="ml-1" /></Link></div>
      </div></section>
    </div>
  )
}
