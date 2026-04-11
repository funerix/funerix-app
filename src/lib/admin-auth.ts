import { NextRequest } from 'next/server'

interface AdminUser {
  id: string
  email: string
  nome: string
  ruolo: 'admin' | 'manager' | 'consulente'
  permessi: Record<string, boolean>
}

/**
 * Verifica autenticazione admin da cookie.
 * Restituisce l'utente admin o null se non autenticato.
 */
export function getAdminFromRequest(req: NextRequest): AdminUser | null {
  const token = req.cookies.get('funerix-admin-token')?.value
  const userCookie = req.cookies.get('funerix-admin-user')?.value
  if (!token || !userCookie) return null
  try {
    return JSON.parse(userCookie) as AdminUser
  } catch { return null }
}

/**
 * Verifica che l'utente abbia il ruolo richiesto.
 */
export function hasRole(user: AdminUser, required: 'admin' | 'manager+' | 'tutti'): boolean {
  if (required === 'tutti') return true
  if (required === 'admin') return user.ruolo === 'admin'
  if (required === 'manager+') return user.ruolo === 'admin' || user.ruolo === 'manager'
  return false
}

/**
 * Verifica che l'utente abbia un permesso specifico.
 */
export function hasPermission(user: AdminUser, perm: string): boolean {
  if (user.ruolo === 'admin' || user.ruolo === 'manager') return true
  return user.permessi[perm] === true
}
