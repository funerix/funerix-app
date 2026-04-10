'use client'

import { Heart } from 'lucide-react'

export default function AdminPetMemorial() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Memorial Pet</h1>
          <p className="text-text-muted text-sm">Pagine memorial dedicate agli animali</p>
        </div>
      </div>

      <div className="card p-8 text-center">
        <Heart size={32} className="mx-auto mb-3 text-text-muted/30" />
        <p className="text-text-muted">Nessun dato. Questa sezione sara attiva a breve.</p>
      </div>
    </div>
  )
}
