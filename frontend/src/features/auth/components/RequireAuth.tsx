import { Navigate, Outlet, useLocation } from 'react-router'
import { PATHS } from '@/app/paths'
import { DEV_AUTH_BYPASS } from '@/config/env'
import type { LoginRedirectState } from '@/features/auth/types'
import { useAuth } from '@/features/auth/useAuth'

/**
 * Protegge le pagine riservate ai giocatori con una sessione.
 * Senza sessione porta all'accesso e, dopo, riporta alla pagina richiesta.
 */
export function RequireAuth() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated && !DEV_AUTH_BYPASS) {
    const state: LoginRedirectState = { from: location.pathname + location.search }
    return <Navigate to={PATHS.login} replace state={state} />
  }
  return <Outlet />
}
