import { DashboardGrid } from '@/features/home/components/DashboardGrid'
import type { DashboardSummary } from '@/features/home/dashboardTypes'
import type { HomeSummary } from '@/features/home/types'
import type { PlayerSummary } from '@/features/player/types'

/** Proprietà delle due impaginazioni della Home. */
export interface HomeLayoutProps {
  home: HomeSummary
  player: PlayerSummary
  dashboard: DashboardSummary
}

/**
 * Home desktop (FOUNDATIONS §6c): niente scroll in 1440 × 900. A sinistra la scena,
 * a destra "Ti aspettano", centrati ciascuno in verticale tra la barra e la Banda.
 */
export function HomeDesktop({ dashboard }: HomeLayoutProps) {
  return (
    <div className="relative mx-auto w-full max-w-[90rem] px-8 pt-(--shell-top) pb-8">
      <header className="flex items-end justify-between gap-6 pt-8">
        <div>
          <p className="type-eyebrow tracking-[0.12em] text-gold uppercase">Area utente</p>
          <h1 className="mt-2 text-text type-h1">Dashboard</h1>
        </div>
      </header>
      <div className="mt-6">
        <DashboardGrid dashboard={dashboard} />
      </div>
    </div>
  )
}
