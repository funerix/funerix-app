'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PawPrint, Package, FileText, Stethoscope, CreditCard, TrendingUp, Clock, CheckCircle } from 'lucide-react'

interface Stats {
  totali: number
  ricevuti: number
  inCremazione: number
  ceneriPronte: number
  consegnatiMese: number
  revenueMese: number
}

export default function AdminPetDashboard() {
  const [stats, setStats] = useState<Stats>({ totali: 0, ricevuti: 0, inCremazione: 0, ceneriPronte: 0, consegnatiMese: 0, revenueMese: 0 })
  const [ordiniRecenti, setOrdiniRecenti] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pet/ordini')
      .then(r => r.json())
      .then((ordini: any[]) => {
        if (!Array.isArray(ordini)) { setLoading(false); return }
        const now = new Date()
        const meseCorrente = now.getMonth()
        const annoCorrente = now.getFullYear()

        setStats({
          totali: ordini.length,
          ricevuti: ordini.filter(o => o.stato === 'ricevuto').length,
          inCremazione: ordini.filter(o => o.stato === 'in_cremazione').length,
          ceneriPronte: ordini.filter(o => o.stato === 'ceneri_pronte').length,
          consegnatiMese: ordini.filter(o => {
            if (o.stato !== 'consegnato') return false
            const d = new Date(o.data_consegna || o.created_at)
            return d.getMonth() === meseCorrente && d.getFullYear() === annoCorrente
          }).length,
          revenueMese: ordini.filter(o => {
            const d = new Date(o.created_at)
            return d.getMonth() === meseCorrente && d.getFullYear() === annoCorrente
          }).reduce((sum: number, o: any) => sum + (o.totale || 0), 0),
        })
        setOrdiniRecenti(ordini.slice(0, 5))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Ordini ricevuti', value: stats.ricevuti, icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'In cremazione', value: stats.inCremazione, icon: Clock, color: 'text-orange-600 bg-orange-50' },
    { label: 'Ceneri pronte', value: stats.ceneriPronte, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'Revenue mese', value: `\u20AC ${stats.revenueMese.toLocaleString('it-IT')}`, icon: TrendingUp, color: 'text-secondary bg-secondary/10' },
  ]

  const quickLinks = [
    { href: '/admin/pet/ordini', icon: FileText, label: 'Ordini', desc: 'Gestisci ordini cremazione' },
    { href: '/admin/pet/catalogo', icon: Package, label: 'Catalogo', desc: 'Urne e accessori' },
    { href: '/admin/pet/prezzi', icon: CreditCard, label: 'Prezzi', desc: 'Listino per specie e taglia' },
    { href: '/admin/pet/veterinari', icon: Stethoscope, label: 'Veterinari', desc: 'Partner convenzionati' },
  ]

  const statiLabel: Record<string, string> = {
    ricevuto: 'Ricevuto', confermato: 'Confermato', ritirato: 'Ritirato',
    in_cremazione: 'In cremazione', ceneri_pronte: 'Ceneri pronte', consegnato: 'Consegnato', annullato: 'Annullato',
  }
  const statiColor: Record<string, string> = {
    ricevuto: 'bg-blue-100 text-blue-700', confermato: 'bg-indigo-100 text-indigo-700', ritirato: 'bg-yellow-100 text-yellow-700',
    in_cremazione: 'bg-orange-100 text-orange-700', ceneri_pronte: 'bg-green-100 text-green-700', consegnato: 'bg-gray-100 text-gray-600', annullato: 'bg-red-100 text-red-700',
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
          <PawPrint size={20} className="text-secondary" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">Funerix Pet</h1>
          <p className="text-text-muted text-sm">Dashboard cremazione animali</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(s => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon size={16} />
              </div>
            </div>
            <p className="text-text-muted text-xs">{s.label}</p>
            <p className="text-xl md:text-2xl font-bold text-primary">{loading ? '...' : s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links + Ordini recenti */}
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
            <h2 className="font-medium text-primary">Ultimi ordini</h2>
            <Link href="/admin/pet/ordini" className="text-secondary text-xs hover:underline">Vedi tutti</Link>
          </div>
          <div className="card divide-y divide-border">
            {loading ? (
              <p className="p-4 text-text-muted text-sm">Caricamento...</p>
            ) : ordiniRecenti.length === 0 ? (
              <p className="p-4 text-text-muted text-sm">Nessun ordine. Esegui lo SQL in Supabase per attivare le tabelle.</p>
            ) : ordiniRecenti.map((o: any) => (
              <Link key={o.id} href={`/admin/pet/ordini?id=${o.id}`} className="flex items-center justify-between p-3 hover:bg-background transition-colors">
                <div>
                  <p className="text-sm font-medium text-primary">{o.animale_nome} ({o.specie})</p>
                  <p className="text-xs text-text-muted">{o.pet_clienti?.nome || 'Cliente'} &mdash; {new Date(o.created_at).toLocaleDateString('it-IT')}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statiColor[o.stato] || 'bg-gray-100'}`}>
                    {statiLabel[o.stato] || o.stato}
                  </span>
                  <p className="text-xs font-medium text-primary mt-1">&euro; {o.totale}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
