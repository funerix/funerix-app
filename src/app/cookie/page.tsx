import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Informativa sull\'utilizzo dei cookie sul sito Funerix.',
}

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white">Cookie Policy</h1>
          <p className="mt-3 text-white/80">Informativa sull&apos;utilizzo dei cookie</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Torna alla Home</Link>
          <div className="space-y-6">
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Cosa sono i cookie</h2>
              <p className="text-sm text-text-light">I cookie sono piccoli file di testo che i siti visitati inviano al browser dell&apos;utente, dove vengono memorizzati per essere ritrasmessi agli stessi siti alla visita successiva.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Cookie tecnici</h2>
              <p className="text-sm text-text-light mb-2">Utilizziamo cookie tecnici necessari per il funzionamento del sito:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-text-light">
                <li><strong>funerix-lang</strong> — memorizza la lingua scelta</li>
                <li><strong>funerix-country</strong> — memorizza il paese per la geolocalizzazione</li>
                <li><strong>funerix-cookie-consent</strong> — memorizza il consenso ai cookie</li>
              </ul>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Cookie di terze parti</h2>
              <p className="text-sm text-text-light">Il sito potrebbe utilizzare servizi di terze parti che installano cookie propri (Google Analytics, Google Fonts). Questi cookie sono soggetti alle privacy policy dei rispettivi servizi.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Come gestire i cookie</h2>
              <p className="text-sm text-text-light">Potete gestire le preferenze sui cookie attraverso le impostazioni del vostro browser. La disabilitazione dei cookie tecnici potrebbe compromettere il funzionamento del sito.</p>
            </div>
            <p className="text-xs text-text-muted">Ultimo aggiornamento: aprile 2026</p>
          </div>
        </div>
      </section>
    </div>
  )
}
