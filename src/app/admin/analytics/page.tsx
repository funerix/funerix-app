'use client'

import Link from 'next/link'
import { ArrowLeft, TrendingUp, Euro, FileText, Users } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const COLORS = ['#2C3E50', '#8B7355', '#6B8E6B', '#C9A96E', '#C0392B']

export default function AnalyticsPage() {
  const { richieste, prodotti, memorial } = useSitoStore()

  // Richieste per stato
  const perStato = [
    { nome: 'Nuove', valore: richieste.filter(r => r.stato === 'nuova').length },
    { nome: 'In lavorazione', valore: richieste.filter(r => r.stato === 'in_lavorazione').length },
    { nome: 'Confermate', valore: richieste.filter(r => r.stato === 'confermata').length },
    { nome: 'Completate', valore: richieste.filter(r => r.stato === 'completata').length },
  ].filter(s => s.valore > 0)

  // Fatturato totale
  const fatturatoTotale = richieste.reduce((s, r) => s + r.totale, 0)
  const fatturatoConfermato = richieste.filter(r => r.stato === 'confermata' || r.stato === 'completata').reduce((s, r) => s + r.totale, 0)

  // Richieste per giorno (ultimi 7 giorni)
  const oggi = new Date()
  const ultimi7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(oggi)
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const count = richieste.filter(r => r.createdAt.startsWith(dateStr)).length
    return { giorno: d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }), richieste: count }
  })

  // Top servizi richiesti
  const serviziCount: Record<string, number> = {}
  richieste.forEach(r => {
    const righe = r.configurazione.split('\n')
    righe.forEach(riga => {
      const match = riga.match(/^(.+?):\s/)
      if (match) serviziCount[match[1]] = (serviziCount[match[1]] || 0) + 1
    })
  })
  const topServizi = Object.entries(serviziCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nome, valore]) => ({ nome, valore }))

  // Tasso conversione
  const confermate = richieste.filter(r => r.stato === 'confermata' || r.stato === 'completata').length
  const tassoConversione = richieste.length > 0 ? Math.round((confermate / richieste.length) * 100) : 0

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-text-muted hover:text-primary"><ArrowLeft size={20} /></Link>
          <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">Analytics</h1>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card py-4">
            <FileText size={20} className="text-secondary mb-2" />
            <p className="text-2xl font-bold text-primary">{richieste.length}</p>
            <p className="text-text-muted text-xs">Richieste totali</p>
          </div>
          <div className="card py-4">
            <Euro size={20} className="text-secondary mb-2" />
            <p className="text-2xl font-bold text-primary">&euro; {fatturatoTotale.toLocaleString('it-IT')}</p>
            <p className="text-text-muted text-xs">Fatturato potenziale</p>
          </div>
          <div className="card py-4">
            <TrendingUp size={20} className="text-accent mb-2" />
            <p className="text-2xl font-bold text-accent">{tassoConversione}%</p>
            <p className="text-text-muted text-xs">Tasso conversione</p>
          </div>
          <div className="card py-4">
            <Users size={20} className="text-secondary mb-2" />
            <p className="text-2xl font-bold text-primary">&euro; {fatturatoConfermato.toLocaleString('it-IT')}</p>
            <p className="text-text-muted text-xs">Fatturato confermato</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Richieste ultimi 7 giorni */}
          <div className="card">
            <h3 className="text-sm font-medium text-primary mb-4">Richieste ultimi 7 giorni</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ultimi7}>
                  <XAxis dataKey="giorno" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="richieste" fill="#8B7355" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Richieste per stato */}
          <div className="card">
            <h3 className="text-sm font-medium text-primary mb-4">Richieste per stato</h3>
            <div className="h-48 flex items-center justify-center">
              {perStato.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={perStato} dataKey="valore" nameKey="nome" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`}>
                      {perStato.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-text-muted text-sm">Nessun dato</p>}
            </div>
          </div>

          {/* Top servizi */}
          <div className="card">
            <h3 className="text-sm font-medium text-primary mb-4">Servizi pi&ugrave; richiesti</h3>
            <div className="space-y-3">
              {topServizi.length > 0 ? topServizi.map((s, i) => (
                <div key={s.nome} className="flex items-center gap-3">
                  <span className="text-xs text-text-muted w-4">{i + 1}.</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-text">{s.nome}</span>
                      <span className="text-xs text-text-muted">{s.valore}</span>
                    </div>
                    <div className="w-full h-1.5 bg-border rounded-full">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${(s.valore / (topServizi[0]?.valore || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              )) : <p className="text-text-muted text-sm">Nessun dato</p>}
            </div>
          </div>

          {/* Metriche */}
          <div className="card">
            <h3 className="text-sm font-medium text-primary mb-4">Metriche chiave</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-xs text-text-muted">Preventivo medio</span>
                <span className="text-sm font-bold text-primary">&euro; {richieste.length > 0 ? Math.round(fatturatoTotale / richieste.length).toLocaleString('it-IT') : '0'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-xs text-text-muted">Prodotti attivi</span>
                <span className="text-sm font-bold text-primary">{prodotti.filter(p => p.attivo).length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-xs text-text-muted">Memorial attivi</span>
                <span className="text-sm font-bold text-primary">{memorial.filter(m => m.attivo).length}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-text-muted">Messaggi condoglianze</span>
                <span className="text-sm font-bold text-primary">{memorial.reduce((s, m) => s + m.messaggi.length, 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
