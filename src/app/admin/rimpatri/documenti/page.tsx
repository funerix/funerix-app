'use client'

import { useEffect, useState } from 'react'
import { FileCheck, Globe, ChevronDown, ChevronRight } from 'lucide-react'

const zoneLabel: Record<string, string> = {
  europa: 'Europa',
  nord_africa: 'Nord Africa/Medio Oriente',
  americhe: 'Americhe',
  asia: 'Asia',
  africa_subsahariana: 'Africa Sub-Sahariana',
  oceania: 'Oceania',
}

export default function AdminRimpatriDocumenti() {
  const [paesi, setPaesi] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/rimpatri/paesi?all=1').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setPaesi(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  // Group by zona
  const grouped = paesi.reduce((acc: Record<string, any[]>, p) => {
    const z = p.zona || 'europa'
    if (!acc[z]) acc[z] = []
    acc[z].push(p)
    return acc
  }, {})

  const paesiConDocumenti = paesi.filter(p => {
    const docs = p.documenti_richiesti
    return Array.isArray(docs) && docs.length > 0
  })

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">Documenti Template</h1>
          <p className="text-text-muted text-sm">Documenti richiesti per paese — {paesiConDocumenti.length} paesi con documenti configurati</p>
        </div>
      </div>

      <div className="card p-3 mb-6 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-700">
          I documenti richiesti sono configurati nella scheda di ogni paese. Per modificarli vai in{' '}
          <a href="/admin/rimpatri/paesi" className="font-medium underline">Paesi e Zone</a> e modifica il campo &quot;Documenti richiesti&quot;.
        </p>
      </div>

      {loading ? (
        <div className="card p-8 text-center"><p className="text-text-muted">Caricamento...</p></div>
      ) : paesiConDocumenti.length === 0 ? (
        <div className="card p-8 text-center">
          <FileCheck size={32} className="mx-auto mb-3 text-text-muted/30" />
          <p className="text-text-muted">Nessun documento configurato. Aggiungi documenti richiesti nella sezione Paesi.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(zoneLabel).filter(z => grouped[z]?.some((p: any) => Array.isArray(p.documenti_richiesti) && p.documenti_richiesti.length > 0)).map(zona => (
            <div key={zona}>
              <h3 className="font-medium text-primary mb-3 flex items-center gap-2">
                <Globe size={16} className="text-secondary" />
                {zoneLabel[zona]}
              </h3>
              <div className="space-y-2">
                {grouped[zona]
                  .filter((p: any) => Array.isArray(p.documenti_richiesti) && p.documenti_richiesti.length > 0)
                  .map((p: any) => (
                  <div key={p.id} className="card">
                    <button onClick={() => toggle(p.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-background transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.bandiera_emoji}</span>
                        <span className="font-medium text-primary">{p.nome}</span>
                        <span className="text-xs text-text-muted bg-background px-2 py-0.5 rounded-full">
                          {p.documenti_richiesti.length} documenti
                        </span>
                      </div>
                      {expanded[p.id] ? <ChevronDown size={16} className="text-text-muted" /> : <ChevronRight size={16} className="text-text-muted" />}
                    </button>
                    {expanded[p.id] && (
                      <div className="px-4 pb-4 border-t border-border">
                        <ul className="mt-3 space-y-2">
                          {p.documenti_richiesti.map((doc: any, i: number) => {
                            const docName = typeof doc === 'string' ? doc : doc.nome || doc.name || JSON.stringify(doc)
                            const docDesc = typeof doc === 'object' ? (doc.descrizione || doc.description || '') : ''
                            return (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <FileCheck size={14} className="text-secondary mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-primary font-medium">{docName}</p>
                                  {docDesc && <p className="text-text-muted text-xs">{docDesc}</p>}
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
