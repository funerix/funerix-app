'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plane, Briefcase, Truck, CheckCircle, TrendingUp, Globe, Landmark, Handshake, Euro, FileCheck, FileText, Clock } from 'lucide-react'

interface Stats {
  attive: number
  inTransito: number
  completateMese: number
  revenueMese: number
}

const statiLabel: Record<string, string> = {
  richiesta: 'Richiesta', documenti_in_corso: 'Documenti in corso', documenti_completati: 'Documenti completati',
  autorizzato: 'Autorizzato', in_transito: 'In transito', arrivata: 'Arrivata', consegnata: 'Consegnata',
  completata: 'Completata', annullata: 'Annullata',
}
const statiColor: Record<string, string> = {
  richiesta: 'bg-blue-100 text-blue-700', documenti_in_corso: 'bg-yellow-100 text-yellow-700',
  documenti_completati: 'bg-indigo-100 text-indigo-700', autorizzato: 'bg-purple-100 text-purple-700',
  in_transito: 'bg-orange-100 text-orange-700', arrivata: 'bg-teal-100 text-teal-700',
  consegnata: 'bg-green-100 text-green-700', completata: 'bg-gray-100 text-gray-600',
  annullata: 'bg-red-100 text-red-700',
}

export default function AdminRimpatriDashboard() {
  const [stats, setStats] = useState<Stats>({ attive: 0, inTransito: 0, completateMese: 0, revenueMese: 0 })
  const [praticheRecenti, setPraticheRecenti] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/rimpatri/pratiche')
      .then(r => r.json())
      .then((pratiche: any[]) => {
        if (!Array.isArray(pratiche)) { setLoading(false); return }
        const now = new Date()
        const meseCorrente = now.getMonth()
        const annoCorrente = now.getFullYear()

        const statiAttivi = ['richiesta', 'documenti_in_corso', 'documenti_completati', 'autorizzato', 'in_transito', 'arrivata']
        setStats({
          attive: pratiche.filter(p => statiAttivi.includes(p.stato)).length,
          inTransito: pratiche.filter(p => p.stato === 'in_transito').length,
          completateMese: pratiche.filter(p => {
            if (p.stato !== 'completata' && p.stato !== 'consegnata') return false
            const d = new Date(p.updated_at || p.created_at)
            return d.getMonth() === meseCorrente && d.getFullYear() === annoCorrente
          }).length,
          revenueMese: pratiche.filter(p => {
            const d = new Date(p.created_at)
            return d.getMonth() === meseCorrente && d.getFullYear() === annoCorrente
          }).reduce((sum: number, p: any) => sum + (p.totale || 0), 0),
        })
        setPraticheRecenti(pratiche.slice(0, 5))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Pratiche attive', value: stats.attive, icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
    { label: 'In transito', value: stats.inTransito, icon: Truck, color: 'text-orange-600 bg-orange-50' },
    { label: 'Completate mese', value: stats.completateMese, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'Revenue mese', value: `\u20AC ${stats.revenueMese.toLocaleString('it-IT')}`, icon: TrendingUp, color: 'text-secondary bg-secondary/10' },
  ]

  const quickLinks = [
    { href: '/admin/rimpatri/pratiche', icon: Briefcase, label: 'Pratiche', desc: 'Gestisci pratiche rimpatrio' },
    { href: '/admin/rimpatri/paesi', icon: Globe, label: 'Paesi e Zone', desc: 'Configurazione corridoi' },
    { href: '/admin/rimpatri/consolati', icon: Landmark, label: 'Consolati', desc: 'Ambasciate e consolati' },
    { href: '/admin/rimpatri/partner', icon: Handshake, label: 'Partner', desc: 'Agenzie estere partner' },
    { href: '/admin/rimpatri/prezzi', icon: Euro, label: 'Prezzi', desc: 'Listino servizi rimpatrio' },
    { href: '/admin/rimpatri/documenti', icon: FileCheck, label: 'Documenti', desc: 'Template documenti' },
    { href: '/admin/rimpatri/contenuti', icon: FileText, label: 'Contenuti', desc: 'Testi e FAQ' },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
          <Plane size={20} className="text-secondary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary">Funerix Rimpatri</h1>
          <p className="text-text-muted text-sm">Dashboard rimpatrio salme</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map(s => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon size={16} />
              </div>
            </div>
            <p className="text-text-muted text-xs">{s.label}</p>
            <p className="text-2xl font-bold text-primary">{loading ? '...' : s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links + Pratiche recenti */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-medium text-primary mb-3">Gestione rapida</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map(l => (
              <Link key={l.href} href={l.href} className="card p-4 hover:border-secondary/30 transition-colors group">
                <l.icon size={20} className="text-secondary mb-2" />
                <p className="font-medium text-primary text-sm group-hover:text-secondary transition-colors">{l.label}</p>
                <p className="text-text-muted text-xs">{l.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-primary">Ultime pratiche</h2>
            <Link href="/admin/rimpatri/pratiche" className="text-secondary text-xs hover:underline">Vedi tutte</Link>
          </div>
          <div className="card divide-y divide-border">
            {loading ? (
              <p className="p-4 text-text-muted text-sm">Caricamento...</p>
            ) : praticheRecenti.length === 0 ? (
              <p className="p-4 text-text-muted text-sm">Nessuna pratica. Esegui lo SQL in Supabase per attivare le tabelle.</p>
            ) : praticheRecenti.map((p: any) => (
              <Link key={p.id} href={`/admin/rimpatri/pratiche?id=${p.id}`} className="flex items-center justify-between p-3 hover:bg-background transition-colors">
                <div>
                  <p className="text-sm font-medium text-primary">{p.defunto_nome} {p.defunto_cognome}</p>
                  <p className="text-xs text-text-muted">
                    {p.rimpatri_paesi?.bandiera_emoji || ''} {p.rimpatri_paesi?.nome || 'N/D'} &mdash; {new Date(p.created_at).toLocaleDateString('it-IT')}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statiColor[p.stato] || 'bg-gray-100'}`}>
                    {statiLabel[p.stato] || p.stato}
                  </span>
                  {p.totale != null && <p className="text-xs font-medium text-primary mt-1">&euro; {p.totale}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
