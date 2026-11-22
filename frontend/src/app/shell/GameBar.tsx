import { NavLink } from 'react-router'
import { PATHS } from '@/app/paths'
import { DesktopBarFrame } from '@/app/shell/BarFrame'
import { NAV_ITEMS } from '@/app/shell/navItems'
import { CreditsLink, NotificationsLink, ProfileLink } from '@/app/shell/PlayerLinks'
import { GoldClasp } from '@/components/ornaments/GoldClasp'
import { Badge } from '@/components/ui/Badge'
import type { PlayerSummary } from '@/features/player/types'
import './navigation.css'

/** Proprietà di {@link GameBar}. */
export interface GameBarProps {
  player: PlayerSummary
}

/**
 * Barra di gioco desktop (FOUNDATIONS §6b, D-021): nella cornice della barra ({@link DesktopBarFrame})
 * le cinque voci in testo e, a destra, crediti, profilo e campanella.
 */
export function GameBar({ player }: GameBarProps) {
  return (
    <DesktopBarFrame>
      <nav aria-label="Principale" className="ml-8 flex">
        {NAV_ITEMS.map((item) => {
          const count = item.count ? item.count(player) : 0
          return (
            <NavLink key={item.to} to={item.to} end={item.to === PATHS.home} className="nav-item">
              {({ isActive }) => (
                <>
                  {item.label}
                  {count > 0 && (
                    <>
                      <Badge count={count} />
                      <span className="sr-only">, {item.countLabel?.(count)}</span>
                    </>
                  )}
                  {isActive && <GoldClasp className="nav-item__clasp" />}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="ml-auto flex items-center gap-6">
        <CreditsLink player={player} density="desktop" />
        <span aria-hidden="true" className="h-7.5 w-px bg-divider-gold" />
        <ProfileLink player={player} density="desktop" />
        <NotificationsLink player={player} density="desktop" />
      </div>
    </DesktopBarFrame>
  )
}
