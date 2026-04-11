'use client'

import Link from 'next/link'
import { Package, FileText, BarChart3, Users, TrendingUp, Clock, Heart, Settings, Globe, Edit3, Image, Phone } from 'lucide-react'
import { useSitoStore } from '@/store/sito'
import { useAdminUser } from '@/lib/useAdminUser'

const statoColori: Record<string, string> = {
  nuova: 'bg-blue-100 text-blue-800',
  in_lavorazione: 'bg-yellow-100 text-yellow-800',
  confermata: 'bg-green-100 text-green-800',
  completata: 'bg-gray-100 text-gray-600',
}

const sezioniAdmin = [
  { href: '/admin/prodotti', icon: Package, label: 'Prodotti', desc: 'Gestisci catalogo, prezzi, foto e categorie' },
  { href: '/admin/richieste', icon: FileText, label: 'Richieste', desc: 'Richieste clienti, stati e comunicazioni' },
  { href: '/admin/memorial', icon: Heart, label: 'Memorial', desc: 'Crea, modifica e gestisci le pagine memorial' },
  { href: '/admin/contenuti', icon: Edit3, label: 'Contenuti Sito', desc: 'Testi homepage, chi siamo, FAQ e pagine' },
  { href: '/admin/media', icon: Image, label: 'Media', desc: 'Galleria foto, immagini prodotti e hero' },
  { href: '/admin/impostazioni', icon: Settings, label: 'Impostazioni', desc: 'Dati azienda, contatti, orari, social' },
]

export default function AdminPage() {
  const { richieste, prodotti, memorial } = useSitoStore()
  const { user, canSeeAll, isConsulente } = useAdminUser()

  // Filtra richieste: consulente vede solo le sue
  const mieRichieste = canSeeAll ? richieste : richieste.filter(r => (r as unknown as Record<string, string>).consulente_id === user?.id)
  const richiesteNuove = mieRichieste.filter(r => r.stato === 'nuova').length

  const stats = canSeeAll ? [
    { label: 'Richieste totali', value: String(richieste.length), icon: FileText, trend: richiesteNuove > 0 ? `${richiesteNuove} nuove` : undefined },
    { label: 'Prodotti attivi', value: String(prodotti.filter(p => p.attivo).length), icon: Package, trend: undefined },
    { label: 'Memorial attivi', value: String(memorial.filter(m => m.attivo).length), icon: Heart, trend: undefined },
    { label: 'Ultimo preventivo', value: richieste[0] ? `€${richieste[0].totale.toLocaleString('it-IT')}` : '—', icon: TrendingUp, trend: undefined },
  ] : [
    { label: 'Le mie pratiche', value: String(mieRichieste.length), icon: FileText, trend: richiesteNuove > 0 ? `${richiesteNuove} nuove` : undefined },
    { label: 'In lavorazione', value: String(mieRichieste.filter(r => r.stato === 'in_lavorazione').length), icon: Clock, trend: undefined },
    { label: 'Confermate', value: String(mieRichieste.filter(r => r.stato === 'confermata').length), icon: TrendingUp, trend: undefined },
    { label: 'Completate', value: String(mieRichieste.filter(r => r.stato === 'completata').length), icon: Heart, trend: undefined },
  ]

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl text-primary">
              {isConsulente ? `Benvenuto, ${user?.nome || 'Consulente'}` : 'Dashboard'}
            </h1>
            <p className="text-text-light text-sm mt-1">
              {isConsulente ? 'Le tue pratiche assegnate' : 'Gestisci tutto il contenuto visibile sul sito'}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/" target="_blank" className="btn-secondary text-sm py-2 px-4">
              <Globe size={16} className="mr-2" />
              Vedi sito
            </Link>
            <Link href="/admin/richieste" className="btn-primary text-sm py-2 px-4">
              <FileText size={16} className="mr-2" />
              Richieste
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <stat.icon size={20} className="text-secondary" />
                </div>
                {stat.trend && (
                  <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-1 rounded">
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-3xl text-primary font-bold">{stat.value}</p>
              <p className="text-text-muted text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sezioni gestione — solo admin/manager */}
        {canSeeAll && (
        <div className="mb-8">
          <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary mb-4">
            Gestione contenuti
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sezioniAdmin.map((sezione) => (
              <Link key={sezione.href} href={sezione.href} className="card group hover:border-secondary">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <sezione.icon size={20} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary group-hover:text-secondary transition-colors">{sezione.label}</h3>
                    <p className="text-text-muted text-sm mt-0.5">{sezione.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        )}

        {/* Richieste recenti */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-[family-name:var(--font-serif)] text-xl text-primary">
              Richieste recenti
            </h2>
            <Link href="/admin/richieste" className="text-secondary text-sm hover:underline">
              Vedi tutte
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-text-muted font-medium">ID</th>
                  <th className="text-left py-3 px-2 text-text-muted font-medium">Cliente</th>
                  <th className="text-left py-3 px-2 text-text-muted font-medium">Data</th>
                  <th className="text-left py-3 px-2 text-text-muted font-medium">Servizio</th>
                  <th className="text-left py-3 px-2 text-text-muted font-medium">Stato</th>
                  <th className="text-right py-3 px-2 text-text-muted font-medium">Totale</th>
                </tr>
              </thead>
              <tbody>
                {richieste.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-text-muted">{isConsulente ? 'Nessuna pratica assegnata.' : 'Nessuna richiesta ancora.'}</td></tr>
                ) : mieRichieste.slice(0, 5).map((r) => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-background transition-colors">
                    <td className="py-3 px-2 font-mono text-xs text-text-muted">{r.id.slice(0, 10)}</td>
                    <td className="py-3 px-2 font-medium text-primary">{r.nome}</td>
                    <td className="py-3 px-2 text-text-light">
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(r.createdAt).toLocaleDateString('it-IT')}</span>
                    </td>
                    <td className="py-3 px-2 text-text-light">{r.modalita}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statoColori[r.stato]}`}>
                        {r.stato.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-primary">
                      &euro; {r.totale.toLocaleString('it-IT')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
