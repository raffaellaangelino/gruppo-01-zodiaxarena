import { HighlightsTiles } from '@/features/home/components/HighlightsTiles'
import type { HomeLayoutProps } from '@/features/home/components/HomeDesktop'
import { HomeScene } from '@/features/home/components/HomeScene'
import { WaitingPanel } from '@/features/home/components/WaitingPanel'
import { buildHighlights } from '@/features/home/highlights'

/**
 * Home mobile (FOUNDATIONS §6b-ter): la pagina scorre, ma la scena e "Nuova sfida" stanno nel
 * primo schermo. Sotto: "Ti aspettano", poi le quattro Tessere.
 */
export function HomeMobile({ home, player }: HomeLayoutProps) {
  return (
    <div className="relative pb-[calc(var(--shell-bottom)+var(--za-space-4))]">
      <div className="flex min-h-140 flex-col justify-end px-4">
        <HomeScene compact rewarded={home.rewardedChallenges} />
      </div>
      <div className="mt-4 flex flex-col gap-4 px-4">
        {home.waiting.length > 0 && <WaitingPanel items={home.waiting} compact />}
        <HighlightsTiles highlights={buildHighlights(home, player, 'tile')} />
      </div>
    </div>
  )
}
