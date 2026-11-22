import { MEDIA } from '@/config/breakpoints'
import { HomeBackdrop } from '@/features/home/components/HomeBackdrop'
import { HomeDesktop } from '@/features/home/components/HomeDesktop'
import { HomeMobile } from '@/features/home/components/HomeMobile'
import { useHomeSummary } from '@/features/home/queries'
import { usePlayerSummary } from '@/features/player/queries'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useDashboardSummary } from '@/features/home/dashboardQueries'

/**
 * Home del giocatore (S03, D-021, tavole Home scenica e Home mobile).
 * I dati arrivano già pronti (`BootGate`): la pagina sceglie solo l'impaginazione.
 */
export function HomePage() {
  const isDesktop = useMediaQuery(MEDIA.desktop)
  const player = usePlayerSummary()
  const home = useHomeSummary()
  const dashboard = useDashboardSummary()

  return (
    <main className="relative min-h-dvh bg-scene-base">
      <title>Home · Zodiax Arena</title>
      <HomeBackdrop desktop={isDesktop} />
      {isDesktop ? (
        <HomeDesktop home={home} player={player} dashboard={dashboard} />
      ) : (
        <HomeMobile home={home} player={player} dashboard={dashboard} />
      )}
    </main>
  )
}
