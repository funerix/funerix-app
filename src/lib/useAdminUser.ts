'use client'

import { useState, useEffect } from 'react'

interface AdminUser {
  id: string
  email: string
  nome: string
  ruolo: string
  permessi: Record<string, boolean>
}

export function useAdminUser() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth')
      .then(r => r.json())
      .then(data => {
        if (data.authenticated) setUser(data.user)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const isAdmin = user?.ruolo === 'admin'
  const isManager = user?.ruolo === 'manager'
  const isConsulente = user?.ruolo === 'consulente'
  const canSeeAll = isAdmin || isManager

  return { user, loading, isAdmin, isManager, isConsulente, canSeeAll }
}
