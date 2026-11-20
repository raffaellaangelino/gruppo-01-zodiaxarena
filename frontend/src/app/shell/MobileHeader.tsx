import { CreditsLink, NotificationsLink, ProfileLink } from '@/app/shell/PlayerLinks'
import { Logo } from '@/components/brand/Logo'
import type { PlayerSummary } from '@/features/player/types'

/** Proprietà di {@link MobileHeader}. */
export interface MobileHeaderProps {
  player: PlayerSummary
}

/**
 * Intestazione mobile (FOUNDATIONS §6b-ter): specchio della barra desktop, alta 56 più l'area
 * sicura. Logo a sinistra; a destra crediti discreti, campanella e solo l'avatar.
 */
export function MobileHeader({ player }: MobileHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-safe">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(image:--za-bar-fill-m) backdrop-blur-glass"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-0.5 bg-(image:--za-edge-gold-h)"
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-1.5 h-px bg-edge-thin" />

      <div className="relative flex h-14 items-center justify-between pr-3 pl-4">
        <Logo height={32} />
        <div className="flex items-center gap-4">
          <CreditsLink player={player} density="mobile" />
          <NotificationsLink player={player} density="mobile" />
          <ProfileLink player={player} density="mobile" />
        </div>
      </div>
    </header>
  )
}
