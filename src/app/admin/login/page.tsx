'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errore, setErrore] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrore('')

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (data.success) {
      router.push('/admin')
    } else {
      setErrore(data.error || 'Errore di autenticazione')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <Image src="/images/logo.png" alt="Funerix" width={160} height={48} className="h-12 w-auto mx-auto mb-4" />
          <p className="text-text-muted text-sm">Accesso area amministrativa</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email" required className="input-field pl-10 text-sm"
                placeholder="admin@funerix.com"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password" required className="input-field pl-10 text-sm"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {errore && (
            <p className="text-error text-sm text-center bg-error/10 rounded-lg py-2">{errore}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Accedi'}
          </button>
        </form>

        <p className="text-[10px] text-text-muted text-center mt-6">
          Accesso riservato al personale autorizzato
        </p>
      </div>
    </div>
  )
}
