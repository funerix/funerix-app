'use client'

import { Plane } from 'lucide-react'

export default function RimpatriAreaClientePage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Plane size={32} className="mx-auto mb-3 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-3xl text-white mb-3">Area Cliente Rimpatri</h1>
          <p className="text-white/80">Accedi per tracciare la tua pratica di rimpatrio.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-md mx-auto px-4">
          <p className="text-text-muted text-center">L&apos;area cliente rimpatri sara disponibile a breve.</p>
        </div>
      </section>
    </div>
  )
}
