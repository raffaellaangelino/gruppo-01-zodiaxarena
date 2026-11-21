import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Icon } from '@/components/ui/Icon'

/** Proprietà di {@link ArenaTopBar}. */
export interface ArenaTopBarProps {
  /** Dove porta l'uscita a sinistra. */
  backTo: string
  backLabel: string
  /** Azione a destra (es. "Salta al risultato"). */
  action?: ReactNode
}

/**
 * Barra delle schermate nell'arena (rev. 10/11): solo l'uscita a sinistra e un'azione a destra,
 * come nei giochi di carte in partita. Niente barra di gioco: la scena occupa tutto.
 */
export function ArenaTopBar({ backTo, backLabel, action }: ArenaTopBarProps) {
  return (
    <div className="absolute inset-x-4 top-4 z-10 flex min-h-12 items-center justify-between gap-4 md:inset-x-8 md:top-6">
      <Link
        to={backTo}
        className="flex items-center gap-2 whitespace-nowrap text-gold-bright no-underline text-shadow-scene type-meta-strong"
      >
        <Icon name="indietro" size={16} />
        {backLabel}
      </Link>
      {action}
    </div>
  )
}
