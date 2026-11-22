import { Navigate, Outlet, useLocation } from 'react-router'
import { AUTH_ENABLED } from '@/config/env'
import { PATHS } from '@/app/paths'
import type { LoginRedirectState } from '@/features/auth/types'
import { useAuth } from '@/features/auth/useAuth'
import { LandingPage } from '@/features/landing/pages/LandingPage'

/**
 * Protegge le pagine riservate ai giocatori con una sessione.
 * Senza sessione porta all'accesso e, dopo, riporta alla pagina richiesta. Fa eccezione la radice:
 * lì chi non ha una sessione vede la landing (S01), chi ce l'ha la sua Home, allo stesso indirizzo.
 */
export function RequireAuth() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!AUTH_ENABLED) return <Outlet />

  if (!isAuthenticated) {
    if (location.pathname === PATHS.home) return <LandingPage />
    const state: LoginRedirectState = { from: location.pathname + location.search }
    return <Navigate to={PATHS.login} replace state={state} />
  }
  return <Outlet />
}
