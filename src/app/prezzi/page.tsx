import Link from 'next/link'
import { ChevronRight, Euro } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prezzi Funerali Campania 2026 — Costi per Provincia',
  description: 'Quanto costa un funerale in Campania? Prezzi medi per provincia: Napoli, Caserta, Salerno, Avellino, Benevento. Confronta e risparmia.',
}

const prezziProvincia = [
  { provincia: 'Napoli', inumazione: '2.500', tumulazione: '4.500', cremazione: '2.200', premium: '8.000' },
  { provincia: 'Caserta', inumazione: '2.200', tumulazione: '4.000', cremazione: '2.000', premium: '7.500' },
  { provincia: 'Salerno', inumazione: '2.300', tumulazione: '4.200', cremazione: '2.100', premium: '7.800' },
  { provincia: 'Avellino', inumazione: '2.000', tumulazione: '3.800', cremazione: '1.900', premium: '7.000' },
  { provincia: 'Benevento', inumazione: '2.000', tumulazione: '3.700', cremazione: '1.800', premium: '6.800' },
]

const costiDettaglio = [
  { voce: 'Cofano funebre', economico: '350 — 700', standard: '800 — 2.000', premium: '2.000 — 4.000+' },
  { voce: 'Trasporto funebre', economico: '300 — 500', standard: '500 — 800', premium: '800 — 1.500' },
  { voce: 'Corona fiori', economico: '80 — 150', standard: '150 — 300', premium: '300 — 500+' },
  { voce: 'Vestizione salma', economico: '100 — 150', standard: '150 — 250', premium: '250 — 400' },
  { voce: 'Necrologi', economico: '50 — 100', standard: '100 — 300', premium: '300 — 600' },
  { voce: 'Pratiche burocratiche', economico: '150 — 250', standard: '250 — 400', premium: 'Incluse' },
  { voce: 'Camera ardente', economico: '—', standard: '200 — 500', premium: '500 — 800/giorno' },
  { voce: 'Tanatocosmesi', economico: '—', standard: '200 — 350', premium: '350 — 800' },
  { voce: 'Concessione cimiteriale', economico: '300 — 600', standard: '1.500 — 3.000', premium: '3.000 — 8.000' },
  { voce: 'Urna cineraria', economico: '50 — 150', standard: '150 — 400', premium: '400 — 1.200' },
]

export default function PrezziPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Euro size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            Prezzi Funerali in Campania
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Trasparenza totale sui costi. Confrontate i prezzi medi per provincia
            e ottenete un preventivo personalizzato con il nostro configuratore.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Tabella per provincia */}
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Prezzi medi per provincia (da...)</h2>
          <div className="card overflow-x-auto mb-16">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Provincia</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Inumazione</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Tumulazione</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Cremazione</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                {prezziProvincia.map(p => (
                  <tr key={p.provincia} className="border-b border-border/50 hover:bg-background transition-colors">
                    <td className="py-4 px-4 font-medium text-primary">{p.provincia}</td>
                    <td className="py-4 px-4 text-right font-[family-name:var(--font-serif)]">da &euro; {p.inumazione}</td>
                    <td className="py-4 px-4 text-right font-[family-name:var(--font-serif)]">da &euro; {p.tumulazione}</td>
                    <td className="py-4 px-4 text-right font-[family-name:var(--font-serif)]">da &euro; {p.cremazione}</td>
                    <td className="py-4 px-4 text-right font-[family-name:var(--font-serif)] font-semibold text-primary">da &euro; {p.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dettaglio costi */}
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary text-center mb-8">Dettaglio costi per servizio</h2>
          <div className="card overflow-x-auto mb-16">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Servizio</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Economico</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Standard</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                {costiDettaglio.map(c => (
                  <tr key={c.voce} className="border-b border-border/50">
                    <td className="py-3 px-4 text-text">{c.voce}</td>
                    <td className="py-3 px-4 text-right text-text-light">&euro; {c.economico}</td>
                    <td className="py-3 px-4 text-right text-text-light">&euro; {c.standard}</td>
                    <td className="py-3 px-4 text-right text-text-light">&euro; {c.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-center mb-16">
            <p className="text-xs text-text-muted mb-4">
              I prezzi indicati sono orientativi e basati sulle medie di mercato in Campania.
              Non costituiscono offerta contrattuale. Il preventivo definitivo viene concordato con il consulente.
            </p>
          </div>

          <div className="text-center">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-4">Volete un preventivo personalizzato?</h2>
            <p className="text-text-light mb-6">Usate il configuratore per un preventivo dettagliato voce per voce, gratuito e senza impegno.</p>
            <Link href="/configuratore" className="btn-primary text-base py-4 px-10">
              Configura il Servizio <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
