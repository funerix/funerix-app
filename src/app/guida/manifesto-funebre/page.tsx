import Link from "next/link"
import { ArrowLeft, ScrollText } from "lucide-react"
import type { Metadata } from "next"
export const metadata: Metadata = { title: "Il Manifesto Funebre — Come scriverlo, costi, dove affiggerlo", description: "Guida al manifesto funebre: come scrivere il testo, formato, dove affiggerlo a Napoli, costi stampa e affissione. Esempi e modelli.", keywords: "manifesto funebre, necrologi napoli, come scrivere manifesto funebre, costo manifesto funebre, affissione manifesti" }
export default function Page() { return (
<div className="min-h-screen bg-background">
<section className="bg-primary py-20 md:py-28"><div className="max-w-4xl mx-auto px-4 text-center"><ScrollText size={36} className="mx-auto mb-3 text-secondary-light" /><h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">Il manifesto funebre</h1><p className="mt-3 text-white/85">Come scriverlo, formati, costi e dove affiggerlo</p></div></section>
<section className="py-16"><div className="max-w-3xl mx-auto px-4">
<Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Tutte le guide</Link>
<div className="space-y-4">
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Struttura del manifesto</h2><p className="text-sm text-text-light">Il manifesto funebre tradizionale contiene: simbolo religioso (croce), nome completo del defunto con eventuale soprannome (&ldquo;detto...&rdquo;), età, frase di annuncio, elenco familiari, data/luogo/ora della cerimonia, nome dell&apos;impresa funebre.</p></div>
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Costi</h2><ul className="list-disc pl-5 space-y-1 text-sm text-text-light"><li>Stampa manifesti (50-100 copie): <strong>€50 — €150</strong></li><li>Affissione comunale: <strong>€50 — €150</strong></li><li>Necrologio su giornale locale (Il Mattino): <strong>€150 — €600</strong></li><li>Necrologio online: <strong>€50 — €100</strong></li></ul></div>
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Dove affiggerlo</h2><p className="text-sm text-text-light">I manifesti vengono affissi sugli spazi comunali dedicati, presso la chiesa della cerimonia, nei pressi dell&apos;abitazione del defunto e del cimitero. In Campania i manifesti funebri sono particolarmente importanti e diffusi.</p></div>
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Il nostro servizio</h2><p className="text-sm text-text-light">Con Funerix potete creare il manifesto direttamente dall&apos;area riservata, scegliendo tra 14 cornici diverse, 8 font e personalizzando ogni dettaglio. Il manifesto può essere condiviso via WhatsApp, email e stampato in PDF.</p></div>
</div>
</div></section></div>) }
