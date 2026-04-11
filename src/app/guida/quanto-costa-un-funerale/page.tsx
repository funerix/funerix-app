import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Phone, ChevronRight, Euro } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quanto costa un funerale nel 2026 — Guida ai prezzi",
  description: "Quanto costa un funerale in Italia? Guida completa ai costi: funerale economico da €1.350, standard €4.000-€8.000, premium fino a €20.000. Cosa incide sul prezzo.",
  keywords: "quanto costa un funerale, costo funerale napoli, prezzo funerale campania, funerale economico, costo cremazione",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
        <Image src="/images/guida-quanto-costa-un-funerale.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
        <Euro size={36} className="mx-auto mb-3 text-secondary-light" />
        <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white">Quanto costa un funerale?</h1>
        <p className="mt-3 text-white/85">Guida completa ai costi in Campania — aggiornata 2026</p>
      </div></section>
      <section className="py-16"><div className="max-w-3xl mx-auto px-4">
        <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Tutte le guide</Link>
        <div className="prose max-w-none text-text-light leading-relaxed space-y-6">
          <div className="card"><h2 className="text-xl text-primary mb-3">Funerale economico: da €1.350</h2>
          <p>Include cofano in paulownia o abete, trasporto standard, corona base, pratiche burocratiche essenziali. Adatto a chi cerca un servizio dignitoso con budget contenuto.</p></div>
          <div className="card"><h2 className="text-xl text-primary mb-3">Funerale standard: €4.000 — €8.000</h2>
          <p>Include cofano in noce o rovere, auto funebre Mercedes, corona e addobbi, vestizione, necrologi su giornale locale, manifesti funebri, assistenza burocratica completa, camera ardente.</p></div>
          <div className="card"><h2 className="text-xl text-primary mb-3">Funerale premium: €8.000 — €20.000+</h2>
          <p>Include cofano pregiato (mogano, bronzo), allestimento completo della cerimonia, tanatocosmesi, memorial online con QR Code, composizioni floreali personalizzate, assistenza totale.</p></div>
          <div className="card"><h2 className="text-xl text-primary mb-3">Cremazione: da €1.370</h2>
          <p>Tariffa crematorio (€500-€800), cofano per cremazione, urna cineraria (€80-€1.200), trasporto. Attenzione ai tempi di attesa del crematorio (10-30 giorni a Napoli).</p></div>
          <div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Cosa incide sul prezzo?</h2>
          <ul className="list-disc pl-5 space-y-1"><li>Tipo di cofano (da €350 a €10.000+)</li><li>Tipo di auto funebre (da €300 a €800)</li><li>Concessione cimiteriale (da €300 a €8.000)</li><li>Composizioni floreali (da €80 a €500)</li><li>Servizi aggiuntivi (tanatocosmesi, necrologi, manifesti)</li><li>Distanza del trasporto</li></ul></div>
        </div>
        <div className="mt-12 text-center">
          <Link href="/configuratore" className="btn-primary">Calcola il tuo preventivo <ChevronRight size={14} className="ml-1" /></Link>
        </div>
      </div></section>
    </div>
  )
}
