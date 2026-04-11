import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight, Flower2 } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fiori Funebri: Guida alla Scelta e ai Significati",
  description: "Guida completa ai fiori funebri: significato di rose, gigli, crisantemi, tipi di composizioni (corona, cuscino, copricassa), prezzi e consigli per la scelta.",
  keywords: "fiori funebri significato, corona funebre prezzo, composizioni floreali funerale",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/hero-principale.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
        <Flower2 size={36} className="mx-auto mb-3 text-secondary-light" />
        <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white">Fiori Funebri: Guida alla Scelta e ai Significati</h1>
        <p className="mt-3 text-white/85">Scegliere i fiori giusti per rendere omaggio</p>
      </div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Tutte le guide</Link>
        <div className="space-y-4">
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Significato dei fiori</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-light"><li><strong>Rose</strong> — simbolo di amore profondo e rispetto</li><li><strong>Gigli</strong> — rappresentano purezza e innocenza dell&apos;anima</li><li><strong>Crisantemi</strong> — il fiore della commemorazione per eccellenza</li><li><strong>Garofani</strong> — esprimono affetto e devozione</li><li><strong>Orchidee</strong> — simboleggiano rispetto eterno e ammirazione</li></ul></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Composizioni funebri</h2>
          <div className="space-y-2 text-sm text-text-light"><p><strong>Corona</strong> — la composizione più tradizionale, ideale per esprimere vicinanza: <strong>€100 — €500</strong></p><p><strong>Cuscino</strong> — composizione piatta per la bara, elegante e sobria: <strong>€130 — €300</strong></p><p><strong>Copricassa</strong> — composizione che adorna la bara, di grande impatto: <strong>€177 — €800</strong></p><p><strong>Mazzo</strong> — per la visita in camera ardente o al domicilio: <strong>€30 — €80</strong></p></div></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Come scegliere</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-light"><li>Considerate il rapporto con il defunto — fiori più importanti per legami stretti</li><li>Tenete conto delle preferenze del defunto — se amava particolari fiori o colori</li><li>Adattate la scelta al tipo di cerimonia — religiosa, laica, intima o pubblica</li></ul></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Fiori per la tomba</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-text-light"><li><strong>Piante perenni</strong> — ciclamini, erica, viole: durano a lungo con poca manutenzione</li><li><strong>Composizioni artificiali</strong> — soluzione pratica e duratura, aspetto sempre curato</li><li><strong>Abbonamento fiori freschi mensile</strong> — fiori sempre freschi sulla tomba senza pensieri</li></ul></div>
        </div>
        <div className="mt-12 text-center"><Link href="/servizi-ricorrenti" className="btn-primary">Abbonamento Fiori e Cura Tomba <ChevronRight size={14} className="ml-1" /></Link></div>
      </div></section>
    </div>
  )
}
