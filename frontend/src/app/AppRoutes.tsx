import { Navigate, Route, Routes } from 'react-router'
import { BootGate } from '@/app/boot/BootGate'
import { PATHS } from '@/app/paths'
import { AppShell } from '@/app/shell/AppShell'
import { GuestOnly } from '@/features/auth/components/GuestOnly'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { HomePage } from '@/features/home/pages/HomePage'
import { GuidePage } from '@/features/guide/pages/GuidePage'
import { PrivacyPage } from '@/features/legal/pages/PrivacyPage'
import { ProfilePage } from '@/features/player/pages/ProfilePage'
import { FactionPage } from '@/features/player/pages/FactionPage'
import { MissionsPage } from '@/features/missions/pages/MissionsPage'
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { FriendsPage } from '@/features/friends/pages/FriendsPage'
import { CatalogPage } from '@/features/collection/pages/CatalogPage'
import { EditCardPage } from '@/features/collection/pages/EditCardPage'
import { ShopPage } from '@/features/shop/pages/ShopPage'
import { SectionPlaceholder } from '@/pages/SectionPlaceholder'

/** Sezioni non ancora costruite: tengono il posto finché arriva la loro issue. */
const PLACEHOLDERS: { path: string; title: string }[] = [
  { path: PATHS.deck, title: 'Il tuo Cielo' },
  { path: PATHS.challenges, title: 'Sfide' },
  { path: PATHS.newChallenge, title: 'Nuova sfida' },
  { path: PATHS.trades, title: 'Scambi' },
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
      <Route path={PATHS.privacy} element={<PrivacyPage />} />
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
          <Route path={PATHS.notifications} element={<NotificationsPage />} />
          <Route path={PATHS.guide} element={<GuidePage />} />
          <Route path={PATHS.missions} element={<MissionsPage />} />
          <Route path={PATHS.settings} element={<SettingsPage />} />
          <Route path={PATHS.groups} element={<FriendsPage />} />
          <Route path={PATHS.collection} element={<CatalogPage />} />
          <Route path={PATHS.editCard} element={<EditCardPage />} />
          <Route path={PATHS.shop} element={<ShopPage />} />
          {PLACEHOLDERS.map(({ path, title }) => (
            <Route key={path} path={path} element={<SectionPlaceholder title={title} />} />
          ))}
          <Route path={PATHS.profile} element={<ProfilePage />} />
          <Route path={PATHS.faction} element={<FactionPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={PATHS.home} replace />} />
    </Routes>
  )
}
