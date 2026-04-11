'use client'

import Link from 'next/link'
import { ArrowLeft, Flower2 } from 'lucide-react'
import { useSitoStore } from '@/store/sito'

export default function AdminInviaFioriPage() {
  const { richieste } = useSitoStore()
  const richiesteFiori = richieste.filter(r => r.note?.includes('INVIO FIORI'))

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Invio Fiori</h1>
            <p className="text-text-light text-sm">Richieste di invio fiori one-shot ({richiesteFiori.length} totali)</p>
          </div>
        </div>

        {richiesteFiori.length === 0 ? (
          <div className="card text-center py-12">
            <Flower2 size={32} className="mx-auto mb-3 text-text-muted" />
            <p className="text-text-muted">Nessuna richiesta di invio fiori ancora.</p>
            <p className="text-text-muted text-sm mt-1">Le richieste appariranno qui quando i clienti useranno il servizio.</p>
          </div>
        ) : (
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background-dark/50">
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Data</th>
                  <th className="text-left py-3 px-4 text-text-muted font-medium">Stato</th>
                  <th className="text-right py-3 px-4 text-text-muted font-medium">Totale</th>
                </tr>
              </thead>
              <tbody>
                {richiesteFiori.map((r: any) => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-background transition-colors">
                    <td className="py-3 px-4 font-medium text-primary">{r.nome}</td>
                    <td className="py-3 px-4 text-text-muted">{new Date(r.createdAt).toLocaleDateString('it-IT')}</td>
                    <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${r.stato === 'nuova' ? 'bg-blue-100 text-blue-700' : r.stato === 'completata' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.stato}</span></td>
                    <td className="py-3 px-4 text-right font-medium">&euro; {r.totale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
