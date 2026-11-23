import { MEDIA } from '@/config/breakpoints'
import { HomeBackdrop } from '@/features/home/components/HomeBackdrop'
import { HomeDesktop } from '@/features/home/components/HomeDesktop'
import { HomeMobile } from '@/features/home/components/HomeMobile'
import { useHomeSummary } from '@/features/home/queries'
import { usePlayerSummary } from '@/features/player/queries'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface HomePageProps {
  pageTitle?: string | null
}

/**
 * Home del giocatore (S03, D-021, tavole Home scenica e Home mobile).
 * I dati arrivano già pronti (`BootGate`): la pagina sceglie solo l'impaginazione.
 */
export function HomePage({ pageTitle = 'Home' }: HomePageProps) {
  const isDesktop = useMediaQuery(MEDIA.desktop)
  const player = usePlayerSummary()
  const home = useHomeSummary()

  return (
    <main className="relative min-h-dvh bg-scene-base">
      {pageTitle && <title>{pageTitle} · Zodiax Arena</title>}
      <HomeBackdrop desktop={isDesktop} />
      {isDesktop ? (
        <HomeDesktop home={home} player={player} />
      ) : (
        <HomeMobile home={home} player={player} />
      )}
    </main>
  )
}
