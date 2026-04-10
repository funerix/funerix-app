import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import type { Metadata } from "next"
export const metadata: Metadata = { title: "Testamento e Volontà — Disposizioni anticipate", description: "Come redigere un testamento, disposizioni anticipate sulla cerimonia funebre, testamento biologico, DAT. Cosa sapere per pianificare.", keywords: "testamento funebre, disposizioni anticipate, testamento biologico, DAT, volontà cerimonia funebre" }
export default function Page() { return (
<div className="min-h-screen bg-background">
<section className="bg-primary py-20 md:py-28 relative overflow-hidden">
<Image src="/images/guida-testamento-e-volonta.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
<div className="relative max-w-4xl mx-auto px-4 text-center"><FileText size={36} className="mx-auto mb-3 text-secondary-light" /><h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">Testamento e volontà</h1><p className="mt-3 text-white/85">Disposizioni anticipate e pianificazione</p></div></section>
<section className="py-16"><div className="max-w-3xl mx-auto px-4">
<Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Tutte le guide</Link>
<div className="space-y-4">
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Disposizioni sulla cerimonia</h2><p className="text-sm text-text-light">È possibile lasciare indicazioni scritte su tipo di cerimonia (religiosa/laica), cremazione o sepoltura, musica, fiori, luogo della cerimonia. Queste disposizioni, anche se non legalmente vincolanti come un testamento, vengono generalmente rispettate dalla famiglia.</p></div>
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Testamento biologico (DAT)</h2><p className="text-sm text-text-light">Le Disposizioni Anticipate di Trattamento (Legge 219/2017) riguardano le cure mediche, non la cerimonia funebre. Tuttavia possono includere la volontà sulla donazione degli organi.</p></div>
<div className="card"><h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Pianificazione anticipata</h2><p className="text-sm text-text-light">Sempre più famiglie scelgono di pianificare in anticipo il servizio funebre, scegliendo prodotti e servizi con calma. Il nostro configuratore è lo strumento ideale per farlo.</p></div>
</div>
</div></section></div>) }
