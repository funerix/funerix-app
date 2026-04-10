'use client'

import { Layers } from 'lucide-react'

export default function AdminPrevidenzaTipiPiano() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tipi Piano</h1>
          <p className="text-text-muted text-sm">Configurazione tipologie di piano previdenziale</p>
        </div>
      </div>

      <div className="card p-8 text-center">
        <Layers size={32} className="mx-auto mb-3 text-text-muted/30" />
        <p className="text-text-muted">Nessun dato. Questa sezione sara attiva a breve.</p>
      </div>
    </div>
  )
}
