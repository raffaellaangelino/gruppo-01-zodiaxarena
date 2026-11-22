import { CreditsLink, NotificationsLink, ProfileLink } from '@/app/shell/PlayerLinks'
import { MobileBarFrame } from '@/app/shell/BarFrame'
import { MobileMenu } from '@/app/shell/MobileMenu'
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
    <MobileBarFrame>
      <div className="flex items-center gap-4">
        <CreditsLink player={player} density="mobile" />
        <NotificationsLink player={player} density="mobile" />
        <ProfileLink player={player} density="mobile" />
        <MobileMenu player={player} />
      </div>
    </MobileBarFrame>
  )
}
