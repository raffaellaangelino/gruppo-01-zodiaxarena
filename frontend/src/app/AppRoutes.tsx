import { Navigate, Outlet, Route, Routes } from 'react-router'
import { BootGate } from '@/app/boot/BootGate'
import { PATHS } from '@/app/paths'
import { AppShell } from '@/app/shell/AppShell'
import { GuestOnly } from '@/features/auth/components/GuestOnly'
import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { ChallengesLayout } from '@/features/challenges/components/ChallengesLayout'
import { ChallengesSentPage } from '@/features/challenges/pages/ChallengesSentPage'
import { ChallengesToPlayPage } from '@/features/challenges/pages/ChallengesToPlayPage'
import { NewChallengePage } from '@/features/challenges/pages/NewChallengePage'
import { HomePage } from '@/features/home/pages/HomePage'
import { GuidePage } from '@/features/guide/pages/GuidePage'
import { PrivacyPage } from '@/features/legal/pages/PrivacyPage'
import { OnboardingGate } from '@/features/onboarding/components/OnboardingGate'
import { FactionPage } from '@/features/onboarding/pages/FactionPage'
import { RegisterPage } from '@/features/registration/pages/RegisterPage'
import { SectionPlaceholder } from '@/pages/SectionPlaceholder'

/** Sezioni non ancora costruite: tengono il posto finché arriva la loro issue. */
const PLACEHOLDERS: { path: string; title: string }[] = [
  { path: PATHS.collection, title: 'Collezione' },
  { path: PATHS.deck, title: 'Il tuo Cielo' },
  { path: PATHS.playChallenge, title: 'Partita' },
  { path: PATHS.match, title: 'Partita' },
  { path: PATHS.trades, title: 'Scambi' },
  { path: PATHS.shop, title: 'Negozio' },
  { path: PATHS.missions, title: 'Missioni' },
  { path: PATHS.faction, title: 'La tua Fazione' },
  { path: PATHS.notifications, title: 'Notifiche' },
]

/**
 * Mappa delle pagine.
 * - Solo per chi non ha una sessione: accesso e registrazione.
 * - Riservate: prima `BootGate` carica i dati essenziali. Chi deve ancora scegliere la Fazione
 *   va alla scelta (`OnboardingGate`); gli altri entrano nel guscio con le barre, Home e sezioni.
 * - Percorso sconosciuto: alla Home (la pagina 404 del design arriverà con gli stati di sistema).
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path={PATHS.privacy} element={<PrivacyPage />} />
      <Route element={<GuestOnly />}>
        <Route path={PATHS.login} element={<LoginPage />} />
        <Route path={PATHS.register} element={<RegisterPage />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route
          element={
            <BootGate>
              <Outlet />
            </BootGate>
          }
        >
          <Route path={PATHS.welcomeFaction} element={<FactionPage />} />
          <Route element={<OnboardingGate />}>
            <Route element={<AppShell />}>
              <Route path={PATHS.home} element={<HomePage />} />
              <Route path={PATHS.guide} element={<GuidePage />} />
              <Route element={<ChallengesLayout />}>
                <Route path={PATHS.challenges} element={<ChallengesToPlayPage />} />
                <Route path={PATHS.challengesSent} element={<ChallengesSentPage />} />
                <Route path={PATHS.newChallenge} element={<NewChallengePage />} />
              </Route>
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
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={PATHS.home} replace />} />
    </Routes>
  )
}
