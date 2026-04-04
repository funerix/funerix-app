'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, FileText, Heart, Edit3, Image, Settings, Bell, Building2, LogOut, BookOpen, BarChart3, CalendarDays, Gift, Shield } from 'lucide-react'
import { RealtimeNotifiche } from '@/components/admin/RealtimeNotifiche'
import { useSitoStore } from '@/store/sito'
import { useEffect, useState } from 'react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/richieste', icon: FileText, label: 'Richieste' },
  { href: '/admin/prodotti', icon: Package, label: 'Prodotti' },
  { href: '/admin/memorial', icon: Heart, label: 'Memorial' },
  { href: '/admin/contenuti', icon: Edit3, label: 'Contenuti' },
  { href: '/admin/blog', icon: BookOpen, label: 'Blog' },
  { href: '/admin/media', icon: Image, label: 'Media' },
  { href: '/admin/calendario', icon: CalendarDays, label: 'Calendario' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/previdenza', icon: Shield, label: 'Previdenza' },
  { href: '/admin/rsa', icon: Building2, label: 'RSA' },
  { href: '/admin/referral', icon: Gift, label: 'Referral' },
  { href: '/admin/agenzie', icon: Building2, label: 'Agenzie' },
  { href: '/admin/impostazioni', icon: Settings, label: 'Impostazioni' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const richiesteNuove = useSitoStore((s) => s.richieste.filter(r => r.stato === 'nuova').length)
  const [autenticato, setAutenticato] = useState<boolean | null>(null)
  const [adminNome, setAdminNome] = useState('')

  // Skip auth check per la pagina login
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) { setAutenticato(true); return }
    fetch('/api/auth')
      .then(r => r.json())
      .then(data => {
        if (data.authenticated) {
          setAutenticato(true)
          setAdminNome(data.user?.nome || '')
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

  // Loading
  if (autenticato === null && !isLoginPage) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Login page — no navbar
  if (isLoginPage) return <>{children}</>

  return (
    <>
      <RealtimeNotifiche />

      {/* Admin top bar */}
      <div className="bg-primary-dark text-white/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 py-1 transition-colors relative whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <item.icon size={14} />
                  <span className="hidden md:inline">{item.label}</span>
                  {item.href === '/admin/richieste' && richiesteNuove > 0 && (
                    <span className="absolute -top-1 -right-3 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold animate-pulse">
                      {richiesteNuove}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap">
            {richiesteNuove > 0 && (
              <Link href="/admin/richieste" className="flex items-center gap-1 text-yellow-300 animate-pulse">
                <Bell size={14} />
                <span>{richiesteNuove} nuove</span>
              </Link>
            )}
            {adminNome && <span className="text-white/40 hidden md:inline">{adminNome}</span>}
            <Link href="/" className="text-white/40 hover:text-white/70">Sito</Link>
            <button onClick={logout} className="text-white/40 hover:text-red-400 flex items-center gap-1">
              <LogOut size={12} /> <span className="hidden md:inline">Esci</span>
            </button>
          </div>
        </div>
      </div>

      {children}
    </>
  )
}
