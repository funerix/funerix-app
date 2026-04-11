'use client'

import Link from 'next/link'
import { ArrowLeft, Shovel, Edit3, Save } from 'lucide-react'
import { useState } from 'react'

const serviziDefault = [
  { nome: 'Esumazione ordinaria', prezzo: '400 — 800', desc: 'Dopo scadenza concessione (10-30 anni). Inclusi operatori e trasporto resti.' },
  { nome: 'Esumazione straordinaria', prezzo: '600 — 1.200', desc: 'Prima della scadenza, per motivi giudiziari o trasferimento.' },
  { nome: 'Riesumazione', prezzo: '500 — 1.000', desc: 'Da loculo o tomba per trasferimento in altra sede.' },
  { nome: 'Riduzione resti', prezzo: '300 — 600', desc: 'Riduzione in cassetta ossario dopo esumazione.' },
  { nome: 'Trasferimento resti', prezzo: '400 — 900', desc: 'Da un cimitero a un altro, anche fuori comune.' },
  { nome: 'Nuova concessione', prezzo: '300 — 4.000', desc: 'Campo comune, loculo o cappella. Variabile per comune.' },
  { nome: 'Lapide e iscrizione', prezzo: '500 — 2.500', desc: 'Fornitura e posa della nuova lapide con iscrizione.' },
]

export default function AdminEsumazionePage() {
  const [editing, setEditing] = useState(false)

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Esumazione</h1>
              <p className="text-text-light text-sm">Gestisci servizi e prezzi esumazione</p>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">Servizi e Prezzi</h2>
          <p className="text-text-muted text-sm mb-6">Questi servizi vengono mostrati nella pagina pubblica /esumazione</p>
          <div className="space-y-3">
            {serviziDefault.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-3 px-4 bg-background rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-primary text-sm">{s.nome}</p>
                  <p className="text-text-muted text-xs">{s.desc}</p>
                </div>
                <p className="text-primary font-medium ml-4">&euro; {s.prezzo}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-primary/5 border-primary/10">
          <div className="flex items-start gap-3">
            <Shovel size={20} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-primary">Prossimo passo</h3>
              <p className="text-text-muted text-sm">I prezzi dell&apos;esumazione saranno presto modificabili direttamente da questa pagina. Per ora i dati sono gestiti nel codice della pagina /esumazione.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
