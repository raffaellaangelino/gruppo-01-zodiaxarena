import { Navigate, Route, Routes } from 'react-router'
import { PATHS } from '@/app/paths'
import { GuestOnly } from '@/features/auth/components/GuestOnly'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { HomePage } from '@/pages/HomePage'

/**
 * Mappa delle pagine.
 * - Solo per chi non ha una sessione: accesso.
 * - Riservate: tutto il resto (per ora la Home provvisoria).
 * - Percorso sconosciuto: alla Home (la pagina 404 del design arriverà con gli stati di sistema).
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path={PATHS.login} element={<LoginPage />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path={PATHS.home} element={<HomePage />} />
      </Route>
      <Route path="*" element={<Navigate to={PATHS.home} replace />} />
    </Routes>
  )
}
