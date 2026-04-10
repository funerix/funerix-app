'use client'

import { FileText, Settings } from 'lucide-react'

export default function AdminRimpatriContenuti() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">Contenuti Rimpatri</h1>
          <p className="text-text-muted text-sm">Testi, FAQ e contenuti sezione rimpatri</p>
        </div>
      </div>

      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Settings size={28} className="text-secondary" />
        </div>
        <h2 className="text-lg font-medium text-primary mb-2">Contenuti editabili in arrivo</h2>
        <p className="text-text-muted text-sm max-w-md mx-auto">
          In questa sezione potrai gestire i testi delle pagine pubbliche, le FAQ,
          le guide informative e i contenuti SEO relativi al servizio rimpatri salme.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-2xl mx-auto">
          <div className="card p-4 bg-background">
            <FileText size={20} className="text-secondary mb-2 mx-auto" />
            <p className="text-sm font-medium text-primary">Pagine</p>
            <p className="text-xs text-text-muted">Testi pagine pubbliche</p>
          </div>
          <div className="card p-4 bg-background">
            <FileText size={20} className="text-secondary mb-2 mx-auto" />
            <p className="text-sm font-medium text-primary">FAQ</p>
            <p className="text-xs text-text-muted">Domande frequenti</p>
          </div>
          <div className="card p-4 bg-background">
            <FileText size={20} className="text-secondary mb-2 mx-auto" />
            <p className="text-sm font-medium text-primary">Guide</p>
            <p className="text-xs text-text-muted">Guide informative</p>
          </div>
        </div>
      </div>
    </div>
  )
}
