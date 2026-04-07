import Link from 'next/link'
import { ArrowLeft, Phone, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Decesso in RSA — Guida Pratica',
  description: 'Quando il decesso avviene in casa di riposo. Guida completa passo dopo passo su cosa fare.',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl text-white">Decesso in RSA</h1>
          <p className="mt-3 text-white/90">Quando il decesso avviene in casa di riposo</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/guida" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline">
            <ArrowLeft size={14} /> Tutte le guide
          </Link>
          <div className="prose max-w-none text-text-light leading-relaxed space-y-6">
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">1. Chiamare il medico</h2>
              <p>Il medico curante o il 118 deve constatare il decesso e rilasciare il certificato di morte. Senza questo documento non si pu&ograve; procedere.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">2. Contattare l&apos;impresa funebre</h2>
              <p>Chiamateci a qualsiasi ora al 081 555 1234. Ci occuperemo immediatamente del trasporto della salma e di tutte le pratiche necessarie.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">3. Documenti necessari</h2>
              <p>Carta d&apos;identit&agrave; del defunto, tessera sanitaria, certificato di morte. Penseremo noi a tutto il resto: denuncia di morte, autorizzazioni, pratiche cimiteriali.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">4. Scelta del servizio</h2>
              <p>Insieme definiremo il tipo di cerimonia, la bara, i fiori e ogni dettaglio. Potete usare il nostro configuratore online o decidere con il consulente.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">5. Cerimonia e sepoltura</h2>
              <p>Organizziamo e coordiniamo l&apos;intera cerimonia secondo le vostre volont&agrave;. Vi accompagniamo fino alla sepoltura o cremazione.</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-text-muted mb-4">Avete bisogno di assistenza immediata?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+390815551234" className="btn-primary"><Phone size={16} className="mr-2" /> Chiama Ora</a>
              <Link href="/configuratore" className="btn-secondary">Configura il Servizio <ChevronRight size={14} className="ml-1" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
