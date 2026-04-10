'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, FileText, Heart, Edit3, Image as ImageIcon, Settings,
  Bell, Building2, LogOut, BookOpen, BarChart3, CalendarDays, Gift, Shield,
  ChevronLeft, ChevronDown, Menu, X, Users, Globe, PawPrint, Plane, CreditCard, Star,
  Stethoscope, FileCheck, Megaphone, MessageSquare, Receipt
} from 'lucide-react'
import { RealtimeNotifiche } from '@/components/admin/RealtimeNotifiche'
import { useSitoStore } from '@/store/sito'
import { useEffect, useState } from 'react'

const navGroups = [
  {
    label: 'Principale',
    defaultOpen: true,
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', ruolo: 'tutti' },
      { href: '/admin/richieste', icon: FileText, label: 'Richieste', badge: true, ruolo: 'tutti' },
      { href: '/admin/calendario', icon: CalendarDays, label: 'Calendario', ruolo: 'tutti' },
      { href: '/admin/analytics', icon: BarChart3, label: 'Analytics', ruolo: 'perm:analytics_globali' },
    ],
  },
  {
    label: 'Funerix Pet',
    defaultOpen: false,
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
    defaultOpen: false,
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
    defaultOpen: false,
    items: [
      { href: '/admin/rimpatri', icon: Plane, label: 'Dashboard', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/pratiche', icon: FileText, label: 'Pratiche', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/paesi', icon: Globe, label: 'Paesi e Zone', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/consolati', icon: Building2, label: 'Consolati', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/partner', icon: Users, label: 'Partner Esteri', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/prezzi', icon: CreditCard, label: 'Prezzi', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/documenti', icon: FileCheck, label: 'Documenti', ruolo: 'perm:rimpatri' },
      { href: '/admin/rimpatri/contenuti', icon: Edit3, label: 'Contenuti', ruolo: 'perm:rimpatri' },
    ],
  },
  {
    label: 'Catalogo',
    defaultOpen: false,
    items: [
      { href: '/admin/prodotti', icon: Package, label: 'Prodotti', ruolo: 'perm:prodotti' },
      { href: '/admin/memorial', icon: Heart, label: 'Memorial', ruolo: 'perm:memorial' },
      { href: '/admin/blog', icon: BookOpen, label: 'Blog', ruolo: 'perm:blog' },
    ],
  },
  {
    label: 'Contenuti',
    defaultOpen: false,
    items: [
      { href: '/admin/homepage', icon: LayoutDashboard, label: 'Homepage', ruolo: 'manager+' },
      { href: '/admin/contenuti', icon: Edit3, label: 'Contenuti Sito', ruolo: 'manager+' },
      { href: '/admin/media', icon: ImageIcon, label: 'Media', ruolo: 'perm:media' },
    ],
  },
  {
    label: 'Marketing',
    defaultOpen: false,
    items: [
      { href: '/admin/referral', icon: Gift, label: 'Referral', ruolo: 'manager+' },
      { href: '/admin/agenzie', icon: Globe, label: 'Agenzie', ruolo: 'admin' },
      { href: '/admin/recensioni', icon: Star, label: 'Recensioni', ruolo: 'manager+' },
    ],
  },
  {
    label: 'Sistema',
    defaultOpen: false,
    items: [
      { href: '/admin/consulenti', icon: Users, label: 'Consulenti', ruolo: 'admin' },
      { href: '/admin/notifiche', icon: Megaphone, label: 'Notifiche', ruolo: 'admin' },
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

function SidebarNav({ groups, pathname, adminRuolo, adminPermessi, richiesteNuove, sidebarOpen }: {
  groups: typeof navGroups; pathname: string; adminRuolo: string; adminPermessi: Record<string, boolean>; richiesteNuove: number; sidebarOpen: boolean
}) {
  // Auto-open group that contains active path
  const getInitialOpen = () => {
    const open: Record<string, boolean> = {}
    groups.forEach(g => {
      const hasActive = g.items.some(item => item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href) && item.href !== '/admin')
      open[g.label] = hasActive || g.defaultOpen
    })
    return open
  }

  const [openGroups, setOpenGroups] = useState(getInitialOpen)

  const toggleGroup = (label: string) => {
    if (!sidebarOpen) return
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <nav className="flex-1 overflow-y-auto py-1 scrollbar-thin">
      {groups.map(group => {
        const visibleItems = group.items.filter(item => hasAccess(item.ruolo, adminRuolo, adminPermessi))
        if (visibleItems.length === 0) return null
        const isOpen = openGroups[group.label] || !sidebarOpen
        const hasActive = visibleItems.some(item => item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href) && item.href !== '/admin')

        return (
          <div key={group.label} className="mb-0.5">
            {sidebarOpen ? (
              <button
                onClick={() => toggleGroup(group.label)}
                className={`w-full flex items-center justify-between px-4 py-1.5 text-[9px] uppercase tracking-wider transition-colors ${
                  hasActive ? 'text-secondary-light' : 'text-white/30 hover:text-white/50'
                }`}
              >
                <span>{group.label}</span>
                <ChevronDown size={10} className={`transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
              </button>
            ) : (
              <div className="h-px bg-white/5 mx-3 my-1" />
            )}
            {isOpen && visibleItems.map(item => {
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href) && item.href !== '/admin'
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 mx-1.5 rounded-md text-[11px] transition-colors relative ${
                    isActive ? 'bg-white/15 text-white font-medium' : 'text-white/55 hover:text-white hover:bg-white/5'
                  }`}>
                  <item.icon size={14} className="flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                  {item.badge && richiesteNuove > 0 && (
                    <span className={`${sidebarOpen ? 'ml-auto' : 'absolute -top-1 -right-1'} w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold`}>
                      {richiesteNuove}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        )
      })}
    </nav>
  )
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

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

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

      <div className="flex h-screen overflow-hidden" data-admin>
        {/* Sidebar Desktop */}
        <aside className={`hidden md:flex flex-col bg-primary-dark text-white/80 transition-all duration-300 flex-shrink-0 ${sidebarOpen ? 'w-52' : 'w-14'}`}>
          {/* Logo + Toggle */}
          <div className="flex items-center justify-between p-2.5 border-b border-white/10 flex-shrink-0">
            {sidebarOpen && (
              <Image src="/images/logo-white.png" alt="Funerix" width={100} height={30} className="h-5 w-auto" />
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-white/10 rounded transition-colors">
              {sidebarOpen ? <ChevronLeft size={14} /> : <Menu size={14} />}
            </button>
          </div>

          {/* Nav Groups — collapsible */}
          <SidebarNav
            groups={navGroups}
            pathname={pathname}
            adminRuolo={adminRuolo}
            adminPermessi={adminPermessi}
            richiesteNuove={richiesteNuove}
            sidebarOpen={sidebarOpen}
          />

          {/* User + Actions */}
          <div className="border-t border-white/10 p-2.5 flex-shrink-0">
            {sidebarOpen && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-secondary/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users size={10} className="text-secondary-light" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-white truncate">{adminNome || 'Admin'}</p>
                  <p className="text-[9px] text-white/40 capitalize">{adminRuolo}</p>
                </div>
              </div>
            )}
            <div className="flex gap-1">
              <Link href="/" className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] text-white/40 hover:text-white hover:bg-white/5 transition-colors ${sidebarOpen ? 'flex-1' : ''}`}>
                <Globe size={11} />
                {sidebarOpen && <span>Sito</span>}
              </Link>
              <button onClick={logout} className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors ${sidebarOpen ? 'flex-1' : ''}`}>
                <LogOut size={11} />
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
            <aside className="absolute left-0 top-12 bottom-0 w-64 bg-primary-dark text-white/80 flex flex-col">
              <SidebarNav
                groups={navGroups}
                pathname={pathname}
                adminRuolo={adminRuolo}
                adminPermessi={adminPermessi}
                richiesteNuove={richiesteNuove}
                sidebarOpen={true}
              />
              <div className="border-t border-white/10 p-3 flex-shrink-0">
                <p className="text-xs text-white mb-2">{adminNome || 'Admin'} <span className="text-white/40 capitalize text-[10px]">({adminRuolo})</span></p>
                <div className="flex gap-2">
                  <Link href="/" onClick={() => setMobileOpen(false)} className="text-[11px] text-white/40 hover:text-white flex items-center gap-1">
                    <Globe size={12} /> Sito
                  </Link>
                  <button onClick={logout} className="text-[11px] text-white/40 hover:text-red-400 flex items-center gap-1">
                    <LogOut size={12} /> Esci
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Content — scrollable */}
        <main className="flex-1 overflow-y-auto bg-background pt-12 md:pt-0">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
