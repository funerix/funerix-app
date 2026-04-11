import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Users, Phone } from "lucide-react"
import type { Metadata } from "next"
export const metadata: Metadata = { title: "Elaborazione del lutto — Supporto psicologico", description: "Come affrontare il lutto: fasi del dolore, quando cercare aiuto, supporto psicologico, gruppi di mutuo aiuto in Campania.", keywords: "elaborazione lutto, supporto psicologico lutto, fasi del lutto, gruppi mutuo aiuto napoli, come superare un lutto" }
export default function Page() { return (
<div className="min-h-screen bg-background">
<section className="bg-primary py-20 md:py-28 relative overflow-hidden">
<Image src="/images/guida-lutto-e-supporto.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
<div className="relative max-w-4xl mx-auto px-4 text-center"><Users size={36} className="mx-auto mb-3 text-secondary-light" /><h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white">Elaborazione del lutto</h1><p className="mt-3 text-white/85">Supporto e risorse per affrontare il dolore</p></div></section>
<section className="py-16"><div className="max-w-3xl mx-auto px-4">
<Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Tutte le guide</Link>
<div className="space-y-4">
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Le fasi del lutto</h2><p className="text-sm text-text-light">Il modello di Kübler-Ross identifica 5 fasi: negazione, rabbia, contrattazione, depressione, accettazione. Non tutti le attraversano nello stesso ordine, e non c&apos;è un tempo &ldquo;giusto&rdquo; per elaborare il dolore.</p></div>
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Quando cercare aiuto</h2><ul className="list-disc pl-5 space-y-1 text-sm text-text-light"><li>Difficoltà a svolgere le attività quotidiane dopo mesi</li><li>Isolamento sociale prolungato</li><li>Uso di alcol o farmaci per gestire il dolore</li><li>Pensieri di autolesionismo</li><li>Senso di colpa persistente</li></ul></div>
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Risorse in Campania</h2><ul className="list-disc pl-5 space-y-1 text-sm text-text-light"><li>Telefono Amico: 02 2327 2327</li><li>Consultori familiari ASL</li><li>Associazioni di volontariato per il lutto</li><li>Psicologi specializzati in elaborazione del lutto</li></ul></div>
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Il Memorial Online</h2><p className="text-sm text-text-light">Molte famiglie trovano conforto nel memorial online dedicato al proprio caro. Uno spazio dove raccogliere ricordi, foto e messaggi di chi vuole bene. Scoprite il nostro servizio memorial.</p></div>
</div>
<div className="mt-12 text-center"><Link href="/memorial" className="btn-secondary text-sm">Scopri il Memorial Online</Link></div>
</div></section></div>) }
