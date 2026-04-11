import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR).',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl text-white">Privacy Policy</h1>
          <p className="mt-3 text-white/80">Informativa sul trattamento dei dati personali</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-1 text-secondary text-sm mb-8 hover:underline"><ArrowLeft size={14} /> Torna alla Home</Link>
          <div className="prose max-w-none text-text-light space-y-6">
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Titolare del trattamento</h2>
              <p className="text-sm">Funerix S.r.l. — i dati di contatto sono disponibili nella pagina <Link href="/contatti" className="text-secondary hover:underline">Contatti</Link>.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Dati raccolti</h2>
              <p className="text-sm">Raccogliamo i dati forniti volontariamente tramite i form del sito: nome, cognome, telefono, email, indirizzo. Questi dati sono necessari per erogare i servizi richiesti.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Finalit&agrave; del trattamento</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Erogazione del servizio richiesto</li>
                <li>Comunicazioni relative al servizio</li>
                <li>Adempimenti di legge</li>
                <li>Miglioramento del servizio (in forma anonima)</li>
              </ul>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Base giuridica</h2>
              <p className="text-sm">Il trattamento &egrave; basato sul consenso dell&apos;interessato (art. 6, par. 1, lett. a GDPR) e sull&apos;esecuzione di un contratto (art. 6, par. 1, lett. b GDPR).</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Conservazione dei dati</h2>
              <p className="text-sm">I dati personali vengono conservati per il tempo necessario all&apos;erogazione del servizio e per gli adempimenti di legge (massimo 10 anni per documenti fiscali).</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Diritti dell&apos;interessato</h2>
              <p className="text-sm">Avete il diritto di accedere, rettificare, cancellare i vostri dati, di limitare il trattamento, di opporvi e di richiedere la portabilit&agrave; dei dati. Per esercitare i vostri diritti, contattateci tramite la pagina <Link href="/contatti" className="text-secondary hover:underline">Contatti</Link>.</p>
            </div>
            <div className="card">
              <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-3">Cookie</h2>
              <p className="text-sm">Per informazioni sull&apos;uso dei cookie, consultate la nostra <Link href="/cookie" className="text-secondary hover:underline">Cookie Policy</Link>.</p>
            </div>
            <p className="text-xs text-text-muted">Ultimo aggiornamento: aprile 2026</p>
          </div>
        </div>
      </section>
    </div>
  )
}
