import { Navigate, Outlet, useLocation } from 'react-router'
import { PATHS } from '@/app/paths'
import type { LoginRedirectState } from '@/features/auth/types'
import { useAuth } from '@/features/auth/useAuth'

/**
 * Pagine solo per chi non ha una sessione (accesso, registrazione).
 * Chi è già dentro, o ha appena effettuato l'accesso, va alla pagina da cui arrivava
 * (oppure alla Home): è l'unico punto che fa questo reindirizzamento.
 */
export function GuestOnly() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    const from = (location.state as LoginRedirectState | null)?.from
    return <Navigate to={from ?? PATHS.home} replace />
  }
  return <Outlet />
}
