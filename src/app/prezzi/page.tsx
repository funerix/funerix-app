'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Euro, ChevronRight, Search, Globe, MapPin, TrendingUp, Filter, ArrowUpDown } from 'lucide-react'

const zoneItalia: Record<string, string> = { nord: 'Nord Italia', centro: 'Centro Italia', sud: 'Sud e Isole' }
const zoneLabel: Record<string, string> = { europa: 'Europa', americhe: 'Americhe', asia: 'Asia', oceania: 'Oceania', medio_oriente: 'Medio Oriente' }
const categorieLabel: Record<string, string> = { cofano: 'Cofano funebre', trasporto: 'Trasporto', fiori: 'Composizioni floreali', cerimonia: 'Cerimonia', urna: 'Urna cineraria', burocrazia: 'Burocrazia', extra: 'Extra' }
const fasceLabel: Record<string, string> = { economico: 'Economico', standard: 'Standard', premium: 'Premium' }
const fasceColor: Record<string, string> = { economico: 'text-green-600', standard: 'text-primary', premium: 'text-secondary' }

type TabId = 'italia' | 'europa' | 'mondo' | 'servizi'

export default function PrezziPage() {
  const [tab, setTab] = useState<TabId>('italia')
  const [aree, setAree] = useState<any[]>([])
  const [servizi, setServizi] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [zonaFilter, setZonaFilter] = useState('')
  const [sortBy, setSortBy] = useState<'nome' | 'prezzo'>('nome')

  useEffect(() => {
    Promise.all([
      fetch('/api/prezzi').then(r => r.json()),
      fetch('/api/prezzi?categoria=servizi').then(r => r.json()),
    ]).then(([a, s]) => {
      if (Array.isArray(a)) setAree(a)
      if (Array.isArray(s)) setServizi(s)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const regioni = aree.filter(a => a.tipo === 'regione')
  const paesiEu = aree.filter(a => a.tipo === 'paese_eu')
  const paesiMondo = aree.filter(a => a.tipo === 'paese_mondo')

  const filterAndSort = (items: any[]) => {
    let filtered = items
    if (search) filtered = filtered.filter(a => a.nome.toLowerCase().includes(search.toLowerCase()))
    if (zonaFilter) filtered = filtered.filter(a => a.zona === zonaFilter)
    if (sortBy === 'prezzo') filtered = [...filtered].sort((a, b) => (a.funerale_base_min || 0) - (b.funerale_base_min || 0))
    else filtered = [...filtered].sort((a, b) => a.nome.localeCompare(b.nome))
    return filtered
  }

  const tabs: { id: TabId; label: string; icon: typeof Globe; count: number }[] = [
    { id: 'italia', label: 'Italia', icon: MapPin, count: regioni.length },
    { id: 'europa', label: 'Europa', icon: Globe, count: paesiEu.length },
    { id: 'mondo', label: 'Mondo', icon: Globe, count: paesiMondo.length },
    { id: 'servizi', label: 'Per Servizio', icon: Euro, count: servizi.length },
  ]

  const mediaItalia = regioni.length > 0 ? Math.round(regioni.reduce((s, r) => s + ((r.funerale_standard_min + r.funerale_standard_max) / 2), 0) / regioni.length) : 0
  const mediaEuropa = paesiEu.length > 0 ? Math.round(paesiEu.reduce((s, r) => s + ((r.funerale_standard_min + r.funerale_standard_max) / 2), 0) / paesiEu.length) : 0

  const getZonesForTab = () => {
    if (tab === 'italia') return Object.entries(zoneItalia)
    if (tab === 'europa' || tab === 'mondo') return []
    return []
  }

  const getCurrentItems = () => {
    if (tab === 'italia') return filterAndSort(regioni)
    if (tab === 'europa') return filterAndSort(paesiEu)
    if (tab === 'mondo') return filterAndSort(paesiMondo)
    return []
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Euro size={40} className="mx-auto mb-4 text-secondary-light" />
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl text-white mb-4">
            Quanto Costa un Funerale?
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Confronta i prezzi in tutta Italia, Europa e nel mondo.
            Dati aggiornati al 2025 da fonti ufficiali.
          </p>
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
              <p className="text-white/60 text-xs">Media Italia</p>
              <p className="font-[family-name:var(--font-serif)] text-2xl text-white font-bold">&euro; {mediaItalia.toLocaleString('it-IT')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
              <p className="text-white/60 text-xs">Media Europa</p>
              <p className="font-[family-name:var(--font-serif)] text-2xl text-white font-bold">&euro; {mediaEuropa.toLocaleString('it-IT')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
              <p className="text-white/60 text-xs">Regioni + Paesi</p>
              <p className="font-[family-name:var(--font-serif)] text-2xl text-white font-bold">{aree.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
            {tabs.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setSearch(''); setZonaFilter('') }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id ? 'bg-primary text-white' : 'bg-background-dark text-text-muted hover:text-primary'
                }`}>
                <t.icon size={16} />
                {t.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-white/20' : 'bg-border'}`}>{t.count}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20"><div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : tab === 'servizi' ? (
            /* TAB SERVIZI */
            <div>
              <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-8">Dettaglio costi per servizio</h2>
              <div className="space-y-8">
                {Object.entries(categorieLabel).map(([cat, label]) => {
                  const items = servizi.filter(s => s.categoria === cat)
                  if (items.length === 0) return null
                  return (
                    <div key={cat}>
                      <h3 className="font-[family-name:var(--font-serif)] text-lg text-primary mb-3 flex items-center gap-2">
                        {label}
                        <span className="text-xs bg-background-dark text-text-muted px-2 py-0.5 rounded-full">{items.length} voci</span>
                      </h3>
                      <div className="card overflow-x-auto p-0">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border bg-background-dark/50">
                              <th className="text-left py-2.5 px-4 text-text-muted font-medium">Servizio</th>
                              <th className="text-center py-2.5 px-4 text-text-muted font-medium">Fascia</th>
                              <th className="text-right py-2.5 px-4 text-text-muted font-medium">Prezzo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((s: any) => (
                              <tr key={s.id} className="border-b border-border/50">
                                <td className="py-2.5 px-4 text-text">{s.nome}</td>
                                <td className="py-2.5 px-4 text-center">
                                  <span className={`text-xs font-medium ${fasceColor[s.fascia]}`}>{fasceLabel[s.fascia]}</span>
                                </td>
                                <td className="py-2.5 px-4 text-right font-[family-name:var(--font-serif)] font-medium">
                                  &euro; {Number(s.prezzo_min).toLocaleString('it-IT')}
                                  {s.prezzo_min !== s.prezzo_max && <span className="text-text-muted"> — {Number(s.prezzo_max).toLocaleString('it-IT')}</span>}
                                  {s.unita && s.unita !== 'pezzo' && <span className="text-text-muted text-xs ml-1">/{s.unita.replace('al_', '')}</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            /* TAB AREE (Italia, Europa, Mondo) */
            <div>
              <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-6">
                {tab === 'italia' ? 'Prezzi per Regione' : tab === 'europa' ? 'Prezzi in Europa' : 'Prezzi nel Mondo'}
              </h2>

              {/* Filtri */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="text" placeholder={`Cerca ${tab === 'italia' ? 'regione' : 'paese'}...`}
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="input-field pl-9 text-sm" />
                </div>
                {tab === 'italia' && (
                  <select value={zonaFilter} onChange={e => setZonaFilter(e.target.value)} className="input-field text-sm w-auto">
                    <option value="">Tutte le zone</option>
                    {getZonesForTab().map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                )}
                <button onClick={() => setSortBy(sortBy === 'nome' ? 'prezzo' : 'nome')}
                  className="btn-secondary text-sm py-2 px-4 flex items-center gap-1.5">
                  <ArrowUpDown size={14} />
                  {sortBy === 'nome' ? 'A-Z' : 'Prezzo'}
                </button>
              </div>

              {/* Tabella */}
              <div className="card overflow-x-auto p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background-dark/50">
                      <th className="text-left py-3 px-4 text-text-muted font-medium">{tab === 'italia' ? 'Regione' : 'Paese'}</th>
                      {tab === 'italia' && <th className="text-left py-3 px-4 text-text-muted font-medium hidden sm:table-cell">Zona</th>}
                      <th className="text-right py-3 px-4 text-text-muted font-medium">Base</th>
                      <th className="text-right py-3 px-4 text-text-muted font-medium hidden md:table-cell">Standard</th>
                      <th className="text-right py-3 px-4 text-text-muted font-medium hidden md:table-cell">Cremazione</th>
                      <th className="text-right py-3 px-4 text-text-muted font-medium hidden lg:table-cell">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentItems().map((a: any) => (
                      <tr key={a.id} className="border-b border-border/50 hover:bg-background transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-medium text-primary">{a.nome}</span>
                          {a.valuta && a.valuta !== 'EUR' && <span className="text-text-muted text-xs ml-1">({a.valuta})</span>}
                          <span className="sm:hidden block text-text-muted text-xs capitalize">{zoneItalia[a.zona] || zoneLabel[a.zona] || a.zona}</span>
                        </td>
                        {tab === 'italia' && <td className="py-3 px-4 text-text-muted text-xs capitalize hidden sm:table-cell">{zoneItalia[a.zona]}</td>}
                        <td className="py-3 px-4 text-right font-[family-name:var(--font-serif)]">
                          <span className="text-green-600 font-medium">&euro; {Number(a.funerale_base_min).toLocaleString('it-IT')}</span>
                          <span className="text-text-muted text-xs hidden sm:inline"> — {Number(a.funerale_base_max).toLocaleString('it-IT')}</span>
                        </td>
                        <td className="py-3 px-4 text-right font-[family-name:var(--font-serif)] hidden md:table-cell">
                          &euro; {Number(a.funerale_standard_min).toLocaleString('it-IT')} — {Number(a.funerale_standard_max).toLocaleString('it-IT')}
                        </td>
                        <td className="py-3 px-4 text-right font-[family-name:var(--font-serif)] hidden md:table-cell">
                          &euro; {Number(a.cremazione_min).toLocaleString('it-IT')} — {Number(a.cremazione_max).toLocaleString('it-IT')}
                        </td>
                        <td className="py-3 px-4 text-right font-[family-name:var(--font-serif)] font-semibold text-primary hidden lg:table-cell">
                          &euro; {Number(a.premium_min).toLocaleString('it-IT')} — {Number(a.premium_max).toLocaleString('it-IT')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {getCurrentItems().length === 0 && (
                  <p className="text-text-muted text-center py-8">Nessun risultato per la ricerca.</p>
                )}
              </div>

              {/* Note */}
              <div className="mt-6 bg-primary/5 border border-primary/10 rounded-xl p-4 text-xs text-text-muted">
                <p>Prezzi orientativi basati su medie di mercato (fonti: Federconsumatori, SunLife, NFDA, miofunerale.it). Non costituiscono offerta contrattuale.
                I prezzi variano in base alla citta, all&apos;impresa funebre e ai servizi scelti. Anno riferimento: 2025.</p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-16">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl text-primary mb-4">Volete un preventivo personalizzato?</h2>
            <p className="text-text-light mb-6 max-w-xl mx-auto">Usate il configuratore per un preventivo dettagliato voce per voce, gratuito e senza impegno.</p>
            <Link href="/configuratore" className="btn-primary text-base py-4 px-10">
              Configura il Servizio <ChevronRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
