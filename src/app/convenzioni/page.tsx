import Link from 'next/link'
import { Shield, Euro, Users, Phone, ChevronRight, Check, Building2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Convenzioni RSA e Case di Cura — Previdenza Funerix',
  description: 'Diventa partner Funerix. Offri ai familiari dei tuoi ospiti un piano previdenza funeraria. Commissioni per la struttura, assistenza completa.',
}

export default function ConvenzioniPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Building2 size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">Convenzioni RSA e Case di Cura</h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            Offrite ai familiari dei vostri ospiti la tranquillit&agrave; di un servizio funebre gi&agrave; organizzato e pagato.
            Diventate partner Funerix.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Users, t: 'Per i familiari', d: 'I familiari configurano il piano dal link dedicato della vostra struttura. Nessun onere per la RSA.' },
              { icon: Euro, t: 'Commissione', d: 'Ricevete una commissione del 5-10% su ogni piano attivato tramite la vostra convenzione.' },
              { icon: Shield, t: 'Assistenza totale', d: 'Funerix gestisce tutto: configurazione, pagamenti, attivazione. Voi fate solo da tramite.' },
            ].map(v => (
              <div key={v.t} className="card text-center">
                <v.icon size={28} className="mx-auto mb-3 text-secondary" />
                <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-2">{v.t}</h3>
                <p className="text-text-muted text-sm">{v.d}</p>
              </div>
            ))}
          </div>

          <div className="card mb-12">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">Come funziona la convenzione</h2>
            <div className="space-y-4">
              {[
                { n: '1', t: 'Registrazione', d: 'Compilate il form di adesione. Vi assegniamo un codice convenzione univoco e un link dedicato.' },
                { n: '2', t: 'Comunicazione', d: 'Informate i familiari dei vostri ospiti della possibilità di attivare un piano previdenza Funerix.' },
                { n: '3', t: 'Attivazione', d: 'I familiari accedono dal vostro link, configurano il piano e iniziano a pagare le rate.' },
                { n: '4', t: 'Commissione', d: 'Ricevete la commissione concordata su ogni piano attivato. Report mensile trasparente.' },
                { n: '5', t: 'Servizio', d: 'Quando un ospite viene a mancare, Funerix si attiva immediatamente. Tutto è già organizzato.' },
              ].map(s => (
                <div key={s.n} className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary font-bold text-sm">{s.n}</span>
                  </div>
                  <div><h3 className="font-medium text-primary">{s.t}</h3><p className="text-text-muted text-sm">{s.d}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card mb-12">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-4">Vantaggi per la struttura</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Nessun costo di adesione',
                'Commissione su ogni piano attivato',
                'Dashboard dedicata per monitorare i piani',
                'Materiale informativo fornito da Funerix',
                'Assistenza dedicata per la struttura',
                'Servizio professionale garantito per gli ospiti',
                'Nessuna responsabilità gestionale',
                'Report mensile trasparente',
              ].map(v => (
                <div key={v} className="flex gap-2 text-sm text-text-light"><Check size={14} className="text-accent mt-0.5 flex-shrink-0" />{v}</div>
              ))}
            </div>
          </div>

          <div className="card bg-secondary/5 border-secondary/20 text-center">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-3">Diventa partner</h2>
            <p className="text-text-light mb-6 max-w-lg mx-auto">Contattateci per attivare la convenzione. Vi ricontatteremo entro 24 ore.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="tel:+390815551234" className="btn-primary"><Phone size={16} className="mr-2" /> Chiama Ora</a>
              <Link href="/contatti" className="btn-secondary">Compila il form</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
