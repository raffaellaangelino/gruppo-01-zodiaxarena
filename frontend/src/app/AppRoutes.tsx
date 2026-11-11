import { Navigate, Route, Routes } from 'react-router'
import { BootGate } from '@/app/boot/BootGate'
import { PATHS } from '@/app/paths'
import { AppShell } from '@/app/shell/AppShell'
import { GuestOnly } from '@/features/auth/components/GuestOnly'
import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { HomePage } from '@/features/home/pages/HomePage'
import { SectionPlaceholder } from '@/pages/SectionPlaceholder'

/** Sezioni non ancora costruite: tengono il posto finché arriva la loro issue. */
const PLACEHOLDERS: { path: string; title: string }[] = [
  { path: PATHS.collection, title: 'Collezione' },
  { path: PATHS.deck, title: 'Il tuo Cielo' },
  { path: PATHS.challenges, title: 'Sfide' },
  { path: PATHS.newChallenge, title: 'Nuova sfida' },
  { path: PATHS.trades, title: 'Scambi' },
  { path: PATHS.shop, title: 'Negozio' },
  { path: PATHS.missions, title: 'Missioni' },
  { path: PATHS.faction, title: 'La tua Fazione' },
  { path: PATHS.notifications, title: 'Notifiche' },
]

/**
 * Mappa delle pagine.
 * - Solo per chi non ha una sessione: accesso.
 * - Riservate: prima `BootGate` carica i dati essenziali, poi il guscio con le barre, Home e sezioni.
 * - Percorso sconosciuto: alla Home (la pagina 404 del design arriverà con gli stati di sistema).
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path={PATHS.login} element={<LoginPage />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route
          element={
            <BootGate>
              <AppShell />
            </BootGate>
          }
        >
          <Route path={PATHS.home} element={<HomePage />} />
          {PLACEHOLDERS.map(({ path, title }) => (
            <Route key={path} path={path} element={<SectionPlaceholder title={title} />} />
          ))}
          <Route
            path={PATHS.profile}
            element={
              <SectionPlaceholder title="Profilo">
                <LogoutButton />
              </SectionPlaceholder>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={PATHS.home} replace />} />
    </Routes>
  )
}
