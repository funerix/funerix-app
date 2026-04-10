'use client'

import { Landmark } from 'lucide-react'

export default function AdminRimpatriConsolati() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Consolati</h1>
          <p className="text-text-muted text-sm">Anagrafica consolati e ambasciate di riferimento</p>
        </div>
      </div>

      <div className="card p-8 text-center">
        <Landmark size={32} className="mx-auto mb-3 text-text-muted/30" />
        <p className="text-text-muted">Nessun dato. Questa sezione sara attiva a breve.</p>
      </div>
    </div>
  )
}
