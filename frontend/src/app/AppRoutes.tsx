import { Navigate, Outlet, Route, Routes } from 'react-router'
import { ArenaLayout } from '@/app/arena/ArenaLayout'
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
import { PlayChallengePage } from '@/features/challenges/pages/PlayChallengePage'
import { MatchReplayPage } from '@/features/matches/pages/MatchReplayPage'
import { MatchVerdictPage } from '@/features/matches/pages/MatchVerdictPage'
import { HomePage } from '@/features/home/pages/HomePage'
import { GuidePage } from '@/features/guide/pages/GuidePage'
import { PublicGuidePage } from '@/features/landing/pages/PublicGuidePage'
import { PrivacyPage } from '@/features/legal/pages/PrivacyPage'
import { OnboardingGate } from '@/features/onboarding/components/OnboardingGate'
import { FactionPage } from '@/features/onboarding/pages/FactionPage'
import { RegisterPage } from '@/features/registration/pages/RegisterPage'
import { CollectionPage } from '@/features/collection/pages/CollectionPage'
import { SkyPage } from '@/features/decks/pages/SkyPage'
import { TradesLayout } from '@/features/trades/components/TradesLayout'
import { TradesReceivedPage } from '@/features/trades/pages/TradesReceivedPage'
import { TradesSentPage } from '@/features/trades/pages/TradesSentPage'
import { NewTradePage } from '@/features/trades/pages/NewTradePage'
import { SectionPlaceholder } from '@/pages/SectionPlaceholder'
import { AUTH_ENABLED } from '@/config/env'

/** Sezioni non ancora costruite: tengono il posto finché arriva la loro issue. */
const PLACEHOLDERS: { path: string; title: string }[] = [
  { path: PATHS.shop, title: 'Negozio' },
  { path: PATHS.missions, title: 'Missioni' },
  { path: PATHS.faction, title: 'La tua Fazione' },
  { path: PATHS.notifications, title: 'Notifiche' },
]

/**
 * Mappa delle pagine.
 * - Pubbliche: privacy, regolamento e, sulla radice senza sessione, la landing (`RequireAuth`).
 * - Solo per chi non ha una sessione: accesso e registrazione.
 * - Riservate: prima `BootGate` carica i dati essenziali. Chi deve ancora scegliere la Fazione
 *   va alla scelta (`OnboardingGate`); gli altri entrano nel guscio con le barre, Home e sezioni.
 * - Percorso sconosciuto: alla Home (la pagina 404 del design arriverà con gli stati di sistema).
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path={PATHS.privacy} element={<PrivacyPage />} />
      <Route path={PATHS.rules} element={<PublicGuidePage />} />
      <Route element={<GuestOnly />}>
        <Route
          path={PATHS.login}
          element={AUTH_ENABLED ? <LoginPage /> : <Navigate to={PATHS.home} replace />}
        />
        <Route
          path={PATHS.register}
          element={AUTH_ENABLED ? <RegisterPage /> : <Navigate to={PATHS.home} replace />}
        />
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
            {/* Arena a schermo intero: fuori dal guscio con le barre */}
            <Route element={<ArenaLayout />}>
              <Route path={PATHS.playChallenge} element={<PlayChallengePage />} />
              <Route path={PATHS.match} element={<MatchReplayPage />} />
              <Route path={PATHS.matchVerdict} element={<MatchVerdictPage />} />
            </Route>
            <Route element={<AppShell />}>
              <Route path={PATHS.home} element={<HomePage />} />
              <Route path={PATHS.guide} element={<GuidePage />} />
              <Route path={PATHS.collection} element={<CollectionPage />} />
              <Route path={PATHS.deck} element={<SkyPage />} />
              <Route element={<ChallengesLayout />}>
                <Route path={PATHS.challenges} element={<ChallengesToPlayPage />} />
                <Route path={PATHS.challengesSent} element={<ChallengesSentPage />} />
                <Route path={PATHS.newChallenge} element={<NewChallengePage />} />
              </Route>
              <Route element={<TradesLayout />}>
                <Route path={PATHS.trades} element={<TradesReceivedPage />} />
                <Route path={PATHS.tradesSent} element={<TradesSentPage />} />
                <Route path={PATHS.newTrade} element={<NewTradePage />} />
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
