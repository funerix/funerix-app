'use client'

import Link from 'next/link'
import { ArrowLeft, BookOpen, ExternalLink } from 'lucide-react'

const guide = [
  { slug: 'decesso-in-casa', titolo: 'Decesso in Casa', tipo: 'Scenario' },
  { slug: 'decesso-in-ospedale', titolo: 'Decesso in Ospedale', tipo: 'Scenario' },
  { slug: 'decesso-allestero', titolo: 'Decesso all\'Estero', tipo: 'Scenario' },
  { slug: 'decesso-in-rsa', titolo: 'Decesso in RSA', tipo: 'Scenario' },
  { slug: 'quanto-costa-un-funerale', titolo: 'Quanto Costa un Funerale', tipo: 'Informativa' },
  { slug: 'documenti-necessari', titolo: 'Documenti Necessari', tipo: 'Informativa' },
  { slug: 'cremazione-come-funziona', titolo: 'Cremazione: Come Funziona', tipo: 'Informativa' },
  { slug: 'inumazione-o-tumulazione', titolo: 'Inumazione o Tumulazione', tipo: 'Informativa' },
  { slug: 'manifesto-funebre', titolo: 'Il Manifesto Funebre', tipo: 'Informativa' },
  { slug: 'testamento-e-volonta', titolo: 'Testamento e Volont\u00e0', tipo: 'Informativa' },
  { slug: 'lutto-e-supporto', titolo: 'Elaborazione del Lutto', tipo: 'Informativa' },
  { slug: 'cremazione-animali', titolo: 'Cremazione Animali', tipo: 'Informativa' },
  { slug: 'previdenza-funeraria', titolo: 'Previdenza Funeraria', tipo: 'Informativa' },
  { slug: 'rimpatrio-salma', titolo: 'Rimpatrio Salma', tipo: 'Informativa' },
  { slug: 'diritti-del-consumatore', titolo: 'Diritti del Consumatore', tipo: 'Informativa' },
  { slug: 'fiori-funebri', titolo: 'Fiori Funebri', tipo: 'Informativa' },
  { slug: 'cerimonia-laica', titolo: 'Cerimonia Laica', tipo: 'Informativa' },
  { slug: 'successione-ereditaria', titolo: 'Successione Ereditaria', tipo: 'Informativa' },
  { slug: 'donazione-organi', titolo: 'Donazione Organi', tipo: 'Informativa' },
]

export default function AdminGuidePage() {
  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Guide</h1>
              <p className="text-text-light text-sm">Gestisci le guide informative del sito ({guide.length} guide)</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {['Scenario', 'Informativa'].map(tipo => (
            <div key={tipo}>
              <h2 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-3 mt-6">
                {tipo === 'Scenario' ? 'Guide Scenario (Cosa fare)' : 'Guide Informative'}
              </h2>
              {guide.filter(g => g.tipo === tipo).map(g => (
                <div key={g.slug} className="card flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <BookOpen size={16} className="text-secondary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-primary text-sm">{g.titolo}</p>
                      <p className="text-text-muted text-xs">/guida/{g.slug}</p>
                    </div>
                  </div>
                  <a href={`/guida/${g.slug}`} target="_blank" rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition-colors">
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="card bg-primary/5 border-primary/10 mt-8">
          <div className="flex items-start gap-3">
            <BookOpen size={20} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-primary">Prossimo passo</h3>
              <p className="text-text-muted text-sm">Le guide saranno presto modificabili direttamente da questa pagina con un editor visuale. Per ora i contenuti sono gestiti nei file del codice.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
