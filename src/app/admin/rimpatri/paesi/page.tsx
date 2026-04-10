'use client'

import { Globe } from 'lucide-react'

export default function AdminRimpatriPaesi() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Paesi e Zone</h1>
          <p className="text-text-muted text-sm">Configurazione paesi, zone e corridoi di rimpatrio</p>
        </div>
      </div>

      <div className="card p-8 text-center">
        <Globe size={32} className="mx-auto mb-3 text-text-muted/30" />
        <p className="text-text-muted">Nessun dato. Questa sezione sara attiva a breve.</p>
      </div>
    </div>
  )
}
