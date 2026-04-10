import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronRight, BookOpen } from "lucide-react"
import type { Metadata } from "next"
export const metadata: Metadata = { title: "Inumazione o Tumulazione: le differenze", description: "Differenza tra inumazione e tumulazione: costi, tempistiche, concessioni cimiteriali. Come scegliere la sepoltura giusta.", keywords: "inumazione tumulazione differenze, sepoltura in terra, loculo cimitero, concessione cimiteriale napoli" }
export default function Page() { return (
<div className="min-h-screen bg-background">
<section className="bg-primary py-20 md:py-28 relative overflow-hidden">
<Image src="/images/guida-inumazione-o-tumulazione.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
<div className="relative max-w-4xl mx-auto px-4 text-center"><BookOpen size={36} className="mx-auto mb-3 text-secondary-light" /><h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">Inumazione o Tumulazione?</h1><p className="mt-3 text-white/85">Le differenze spiegate — come scegliere</p></div></section>
<section className="py-16"><div className="max-w-3xl mx-auto px-4">
<Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Tutte le guide</Link>
<div className="space-y-4">
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Inumazione (sepoltura in terra)</h2><p className="text-sm text-text-light">Il cofano viene sepolto in un campo del cimitero. Concessione: 10-30 anni. Costo concessione: <strong>€300 — €2.000</strong>. Al termine, i resti vengono esumati e trasferiti in ossario.</p></div>
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Tumulazione (sepoltura in loculo)</h2><p className="text-sm text-text-light">Il cofano viene posto in un loculo murato nel muro del cimitero. Concessione: 30-50 anni o perpetua. Costo: <strong>€1.500 — €8.000</strong>. Richiede anche lapide e chiusura (€500-€2.000).</p></div>
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Come scegliere?</h2><ul className="list-disc pl-5 space-y-1 text-sm text-text-light"><li>Budget: l&apos;inumazione costa meno</li><li>Durata: il loculo dura di più</li><li>Disponibilità: a Napoli i loculi sono scarsi</li><li>Tradizione familiare: cappella di famiglia</li><li>Preferenze religiose o personali</li></ul></div>
</div>
<div className="mt-12 text-center"><Link href="/configuratore" className="btn-primary">Configura il servizio <ChevronRight size={14} className="ml-1" /></Link></div>
</div></section></div>) }
