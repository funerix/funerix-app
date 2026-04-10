'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, FileText, Heart, Edit3, Image as ImageIcon, Settings,
  Bell, Building2, LogOut, BookOpen, BarChart3, CalendarDays, Gift, Shield,
  ChevronLeft, Menu, X, Users, Globe, PawPrint, Plane, CreditCard, Star,
  Stethoscope, MapPin, FileCheck, Megaphone, MessageSquare, Receipt
} from 'lucide-react'
import { RealtimeNotifiche } from '@/components/admin/RealtimeNotifiche'
import { useSitoStore } from '@/store/sito'
import { useEffect, useState } from 'react'

// ruoli: 'tutti' = sempre visibile, 'admin' = solo admin, 'manager+' = admin+manager, 'perm:xxx' = serve permesso xxx
const navGroups = [
  {
    label: 'Principale',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', ruolo: 'tutti' },
      { href: '/admin/richieste', icon: FileText, label: 'Richieste', badge: true, ruolo: 'tutti' },
      { href: '/admin/calendario', icon: CalendarDays, label: 'Calendario', ruolo: 'tutti' },
      { href: '/admin/analytics', icon: BarChart3, label: 'Analytics', ruolo: 'perm:analytics_globali' },
    ],
  },
  {
    label: 'Funerix Pet',
    items: [
      { href: '/admin/pet', icon: PawPrint, label: 'Dashboard Pet', ruolo: 'perm:pet' },
      { href: '/admin/pet/ordini', icon: FileText, label: 'Ordini Pet', ruolo: 'perm:pet' },
      { href: '/admin/pet/catalogo', icon: Package, label: 'Catalogo Pet', ruolo: 'perm:pet' },
      { href: '/admin/pet/prezzi', icon: CreditCard, label: 'Prezzi Pet', ruolo: 'perm:pet' },
      { href: '/admin/pet/veterinari', icon: Stethoscope, label: 'Veterinari', ruolo: 'perm:pet' },
      { href: '/admin/pet/memorial', icon: Heart, label: 'Memorial Pet', ruolo: 'perm:pet' },
      { href: '/admin/pet/contenuti', icon: Edit3, label: 'Contenuti Pet', ruolo: 'perm:pet' },
    ],
  },
  {
    label: 'Funerix Previdenza',
    items: [
      { href: '/admin/previdenza', icon: Shield, label: 'Dashboard', ruolo: 'perm:previdenza' },
      { href: '/admin/previdenza/piani', icon: FileCheck, label: 'Piani Attivi', ruolo: 'perm:previdenza' },
      { href: '/admin/previdenza/rate', icon: CreditCard, label: 'Rate e Pagamenti', ruolo: 'perm:previdenza' },
      { href: '/admin/previdenza/tipi-piano', icon: Package, label: 'Tipi Piano', ruolo: 'perm:previdenza' },
      { href: '/admin/previdenza/rsa', icon: Building2, label: 'RSA Partner', ruolo: 'manager+' },
      { href: '/admin/previdenza/commissioni', icon: Receipt, label: 'Commissioni', ruolo: 'manager+' },
      { href: '/admin/previdenza/beneficiari', icon: Users, label: 'Beneficiari', ruolo: 'perm:previdenza' },
      { href: '/admin/previdenza/contratti', icon: FileText, label: 'Contratti', ruolo: 'perm:previdenza' },
      { href: '/admin/previdenza/contenuti', icon: Edit3, label: 'Contenuti', ruolo: 'perm:previdenza' },
    ],
  },
  {
    label: 'Funerix Rimpatri',
    items: [
      { href: '/admin/rimpatri', icon: Plane, label: 'Dashboard', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/pratiche', icon: FileText, label: 'Pratiche', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/paesi', icon: Globe, label: 'Paesi e Zone', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/consolati', icon: Building2, label: 'Consolati', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/partner', icon: Users, label: 'Partner Esteri', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/prezzi', icon: CreditCard, label: 'Prezzi', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/documenti', icon: FileCheck, label: 'Documenti Template', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/contenuti', icon: Edit3, label: 'Contenuti', ruolo: 'perm:rimpatri' },
    ],
  },
  {
    label: 'Catalogo',
    items: [
      { href: '/admin/prodotti', icon: Package, label: 'Prodotti', ruolo: 'perm:prodotti' },
      { href: '/admin/memorial', icon: Heart, label: 'Memorial', ruolo: 'perm:memorial' },
      { href: '/admin/blog', icon: BookOpen, label: 'Blog', ruolo: 'perm:blog' },
    ],
  },
  {
    label: 'Contenuti',
    items: [
      { href: '/admin/homepage', icon: LayoutDashboard, label: 'Homepage', ruolo: 'manager+' },
      { href: '/admin/contenuti', icon: Edit3, label: 'Contenuti Sito', ruolo: 'manager+' },
      { href: '/admin/media', icon: ImageIcon, label: 'Media', ruolo: 'perm:media' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { href: '/admin/referral', icon: Gift, label: 'Referral', ruolo: 'manager+' },
      { href: '/admin/agenzie', icon: Globe, label: 'Agenzie', ruolo: 'admin' },
      { href: '/admin/recensioni', icon: Star, label: 'Recensioni', ruolo: 'manager+' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/admin/consulenti', icon: Users, label: 'Consulenti', ruolo: 'admin' },
      { href: '/admin/notifiche', icon: Megaphone, label: 'Notifiche Template', ruolo: 'admin' },
      { href: '/admin/chatbot', icon: MessageSquare, label: 'AI Chatbot', ruolo: 'admin' },
      { href: '/admin/impostazioni', icon: Settings, label: 'Impostazioni', ruolo: 'admin' },
    ],
  },
]

function hasAccess(itemRuolo: string, userRuolo: string, userPermessi: Record<string, boolean>): boolean {
  if (itemRuolo === 'tutti') return true
  if (itemRuolo === 'admin') return userRuolo === 'admin'
  if (itemRuolo === 'manager+') return userRuolo === 'admin' || userRuolo === 'manager'
  if (itemRuolo.startsWith('perm:')) {
    const perm = itemRuolo.replace('perm:', '')
    if (userRuolo === 'admin') return true
    if (userRuolo === 'manager') return true
    return userPermessi[perm] === true
  }
  return false
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const richiesteNuove = useSitoStore((s) => s.richieste.filter(r => r.stato === 'nuova').length)
  const [autenticato, setAutenticato] = useState<boolean | null>(null)
  const [adminNome, setAdminNome] = useState('')
  const [adminRuolo, setAdminRuolo] = useState('admin')
  const [adminPermessi, setAdminPermessi] = useState<Record<string, boolean>>({})
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) { setAutenticato(true); return }
    fetch('/api/auth')
      .then(r => r.json())
      .then(data => {
        if (data.authenticated) {
          setAutenticato(true)
          setAdminNome(data.user?.nome || '')
          setAdminRuolo(data.user?.ruolo || 'consulente')
          setAdminPermessi(data.user?.permessi || {})
        } else {
          router.push('/admin/login')
        }
      })
      .catch(() => router.push('/admin/login'))
  }, [isLoginPage, router])

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  if (autenticato === null && !isLoginPage) {
    return <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
    </div>
  }

  if (isLoginPage) return <>{children}</>

  return (
    <>
      <RealtimeNotifiche />

      <div className="flex min-h-screen" data-admin>
        {/* Sidebar Desktop */}
        <aside className={`hidden md:flex flex-col bg-primary-dark text-white/80 transition-all duration-300 ${sidebarOpen ? 'w-56' : 'w-16'}`}>
          {/* Logo + Toggle */}
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            {sidebarOpen && (
              <Image src="/images/logo-white.png" alt="Funerix" width={100} height={30} className="h-6 w-auto" />
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-white/10 rounded transition-colors">
              {sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
            </button>
          </div>

          {/* Nav Groups — filtrati per ruolo */}
          <nav className="flex-1 overflow-y-auto py-2">
            {navGroups.map(group => {
              const visibleItems = group.items.filter(item => hasAccess(item.ruolo, adminRuolo, adminPermessi))
              if (visibleItems.length === 0) return null
              return (
              <div key={group.label} className="mb-2">
                {sidebarOpen && (
                  <p className="text-[9px] text-white/30 uppercase tracking-wider px-4 py-1">{group.label}</p>
                )}
                {visibleItems.map(item => {
                  const isActive = item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href) && item.href !== '/admin'
                  return (
                    <Link key={item.href} href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 mx-2 rounded-lg text-xs transition-colors relative ${
                        isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}>
                      <item.icon size={16} className="flex-shrink-0" />
                      {sidebarOpen && <span>{item.label}</span>}
                      {item.badge && richiesteNuove > 0 && (
                        <span className={`${sidebarOpen ? 'ml-auto' : 'absolute -top-1 -right-1'} w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold`}>
                          {richiesteNuove}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )})}
          </nav>

          {/* User + Actions */}
          <div className="border-t border-white/10 p-3">
            {sidebarOpen && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-secondary/30 rounded-full flex items-center justify-center">
                  <Users size={12} className="text-secondary-light" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white truncate">{adminNome || 'Admin'}</p>
                  <p className="text-[9px] text-white/40 capitalize">{adminRuolo}</p>
                </div>
              </div>
            )}
            <div className="flex gap-1">
              <Link href="/" className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-[10px] text-white/40 hover:text-white hover:bg-white/5 transition-colors ${sidebarOpen ? 'flex-1' : ''}`}>
                <Globe size={12} />
                {sidebarOpen && <span>Sito</span>}
              </Link>
              <button onClick={logout} className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-[10px] text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors ${sidebarOpen ? 'flex-1' : ''}`}>
                <LogOut size={12} />
                {sidebarOpen && <span>Esci</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-primary-dark text-white h-12 flex items-center justify-between px-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Image src="/images/logo-white.png" alt="Funerix" width={80} height={24} className="h-5 w-auto" />
          <Link href="/admin/richieste" className="relative p-1.5">
            <Bell size={18} />
            {richiesteNuove > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center font-bold">{richiesteNuove}</span>}
          </Link>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-12 bottom-0 w-64 bg-primary-dark text-white/80 overflow-y-auto">
              <nav className="py-2">
                {navGroups.map(group => {
                  const visibleItems = group.items.filter(item => hasAccess(item.ruolo, adminRuolo, adminPermessi))
                  if (visibleItems.length === 0) return null
                  return (
                  <div key={group.label} className="mb-2">
                    <p className="text-[9px] text-white/30 uppercase tracking-wider px-4 py-1">{group.label}</p>
                    {visibleItems.map(item => {
                      const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href) && item.href !== '/admin'
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm ${isActive ? 'bg-white/15 text-white' : 'text-white/60'}`}>
                          <item.icon size={16} /> {item.label}
                          {item.badge && richiesteNuove > 0 && <span className="ml-auto w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">{richiesteNuove}</span>}
                        </Link>
                      )
                    })}
                  </div>
                )})}
              </nav>
              <div className="border-t border-white/10 p-3">
                <p className="text-xs text-white mb-2">{adminNome || 'Admin'}</p>
                <button onClick={logout} className="flex items-center gap-2 text-sm text-white/40 hover:text-red-400">
                  <LogOut size={14} /> Esci
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 md:overflow-y-auto md:h-screen pt-12 md:pt-0">
          {children}
        </main>
      </div>
    </>
  )
}
