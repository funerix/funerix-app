'use client'

import { Plane, Briefcase, Truck, CheckCircle, Euro } from 'lucide-react'

export default function AdminRimpatriDashboard() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard Rimpatri</h1>
          <p className="text-text-muted text-sm">Gestione pratiche di rimpatrio salme</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <Briefcase size={18} className="text-secondary mb-2" />
          <p className="text-text-muted text-xs">Pratiche Attive</p>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
        <div className="card p-4">
          <Truck size={18} className="text-secondary mb-2" />
          <p className="text-text-muted text-xs">In Transito</p>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
        <div className="card p-4">
          <CheckCircle size={18} className="text-secondary mb-2" />
          <p className="text-text-muted text-xs">Completate Mese</p>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
        <div className="card p-4">
          <Euro size={18} className="text-secondary mb-2" />
          <p className="text-text-muted text-xs">Revenue</p>
          <p className="text-2xl font-bold text-primary">&euro; 0</p>
        </div>
      </div>

      <div className="card p-8 text-center">
        <Plane size={32} className="mx-auto mb-3 text-text-muted/30" />
        <p className="text-text-muted">Nessun dato. Questa sezione sara attiva a breve.</p>
      </div>
    </div>
  )
}
