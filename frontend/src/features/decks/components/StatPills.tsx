import { Icon } from '@/components/ui/Icon'
import { printedStats } from '@/features/cards/stats'
import type { CardDefinition } from '@/features/cards/types'

/**
 * ATK e DEF stampati in piccolo (tavola Collezione-Cielo: le pillole rossa e blu), con
 * l'intervallo per le carte d'Aria. Il valore per gli screen reader è scritto per esteso.
 */
export function StatPills({ card }: { card: CardDefinition }) {
  const { atk, def } = printedStats(card)
  const pill =
    'inline-flex h-6 items-center gap-1 rounded-pill px-2 font-display text-[0.875rem] font-black text-text tabular-nums'
  return (
    <span className="flex items-center gap-1.5">
      <span className={`${pill} bg-atk-card`}>
        <Icon name="atk" size={14} />
        <span className="sr-only">ATK</span>
        {atk.value}
      </span>
      <span className={`${pill} bg-def-card`}>
        <Icon name="def" size={14} />
        <span className="sr-only">DEF</span>
        {def.value}
      </span>
    </span>
  )
}
