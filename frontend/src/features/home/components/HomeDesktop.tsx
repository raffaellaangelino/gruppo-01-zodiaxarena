import { MEDIA } from '@/config/breakpoints'
import { HighlightsBand } from '@/features/home/components/HighlightsBand'
import { HomeScene } from '@/features/home/components/HomeScene'
import { WaitingPanel } from '@/features/home/components/WaitingPanel'
import { buildHighlights } from '@/features/home/highlights'
import type { HomeSummary } from '@/features/home/types'
import type { PlayerSummary } from '@/features/player/types'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/** Proprietà delle due impaginazioni della Home. */
export interface HomeLayoutProps {
  home: HomeSummary
  player: PlayerSummary
}

/**
 * Home desktop (FOUNDATIONS §6c): niente scroll in 1440 × 900. A sinistra la scena,
 * a destra "Ti aspettano", centrati ciascuno in verticale tra la barra e la Banda.
 */
export function HomeDesktop({ home, player }: HomeLayoutProps) {
  const isWide = useMediaQuery(MEDIA.wide)
  return (
    <div className="relative flex h-dvh min-h-180 flex-col pt-(--shell-top)">
      <div className="flex min-h-0 flex-1 items-center justify-between gap-8 pr-8 pl-19">
        <HomeScene compact={false} rewarded={home.rewardedChallenges} />
        {home.waiting.length > 0 && (
          <WaitingPanel items={home.waiting} compact={false} className="w-97.5 shrink-0" />
        )}
      </div>
      <HighlightsBand
        highlights={buildHighlights(home, player, isWide ? 'band' : 'band-narrow')}
        className="mx-8 mb-6.5 h-24 shrink-0"
      />
    </div>
  )
}
