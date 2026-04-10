'use client'

import { FileSignature } from 'lucide-react'

export default function AdminPrevidenzaContratti() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">Contratti</h1>
          <p className="text-text-muted text-sm">Gestione contratti e documenti previdenziali</p>
        </div>
      </div>

      <div className="card p-8 text-center">
        <FileSignature size={32} className="mx-auto mb-3 text-text-muted/30" />
        <p className="text-text-muted">Nessun dato. Questa sezione sara attiva a breve.</p>
      </div>
    </div>
  )
}
