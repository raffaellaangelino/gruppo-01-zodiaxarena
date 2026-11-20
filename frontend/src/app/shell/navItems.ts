import { PATHS } from '@/app/paths'
import type { IconName } from '@/components/ui/Icon'
import type { PlayerSummary } from '@/features/player/types'

/** Una destinazione della barra di gioco. */
export interface NavItem {
  label: string
  to: string
  /** Icona della barra mobile (su desktop le voci sono solo testo). */
  icon: IconName
  /** Cosa da fare contata sulla voce, se c'è. */
  count?: (player: PlayerSummary) => number
  /** Testo accessibile del contatore (es. "2 da giocare"). */
  countLabel?: (n: number) => string
}

/**
 * Le cinque destinazioni del regolamento (FOUNDATIONS §6b): le stesse su desktop e su mobile.
 * Gruppi, Profilo, Missioni e Fazione non sono nella barra: si raggiungono dal profilo e dalla Home.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', to: PATHS.home, icon: 'home' },
  { label: 'Collezione', to: PATHS.collection, icon: 'collezione' },
  {
    label: 'Sfide',
    to: PATHS.challenges,
    icon: 'sfide',
    count: (p) => p.pending.challenges,
    countLabel: (n) => `${n} da giocare`,
  },
  {
    label: 'Scambi',
    to: PATHS.trades,
    icon: 'scambi',
    count: (p) => p.pending.trades,
    countLabel: (n) => `${n} da rispondere`,
  },
  { label: 'Negozio', to: PATHS.shop, icon: 'negozio' },
]
