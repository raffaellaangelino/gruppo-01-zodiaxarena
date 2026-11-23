import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router'
import { PageErrorBoundary } from '@/app/PageErrorBoundary'
import { PageLoading } from '@/app/PageLoading'
import { PATHS } from '@/app/paths'
import { GameBar } from '@/app/shell/GameBar'
import { MobileHeader } from '@/app/shell/MobileHeader'
import { MobileTabBar } from '@/app/shell/MobileTabBar'
import { MockDataNotice } from '@/app/shell/MockDataNotice'
import { MEDIA } from '@/config/breakpoints'
import { USE_MOCKS } from '@/config/env'
import { usePlayerSummary } from '@/features/player/queries'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import './shell.css'

/**
 * Guscio delle pagine interne: barra di gioco su desktop (da 1280 px), intestazione e barra
 * in basso su mobile e tablet. Le pagine si disegnano nell'`Outlet` e usano `--shell-top` e
 * `--shell-bottom` per lasciare spazio alle barre. Va dentro `BootGate`, che ha già caricato
 * il riepilogo del giocatore.
 */
export function AppShell() {
  const player = usePlayerSummary()
  const isDesktop = useMediaQuery(MEDIA.desktop)
  const { pathname } = useLocation()

  return (
    <div className="app-shell min-h-dvh">
      {isDesktop ? (
        <GameBar player={player} />
      ) : (
        <>
          <MobileHeader player={player} />
          <MobileTabBar player={player} />
        </>
      )}
      <PageErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </PageErrorBoundary>
      {USE_MOCKS &&
        pathname !== PATHS.guide &&
        pathname !== PATHS.missions &&
        pathname !== PATHS.notifications &&
        pathname !== PATHS.profile &&
        pathname !== PATHS.groups &&
        pathname !== PATHS.collection &&
        pathname !== PATHS.editCard &&
        pathname !== PATHS.faction &&
        pathname !== PATHS.settings &&
        pathname !== PATHS.shop && <MockDataNotice />}
    </div>
  )
}
