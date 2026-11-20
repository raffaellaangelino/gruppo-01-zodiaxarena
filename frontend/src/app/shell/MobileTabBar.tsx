import { NavLink } from 'react-router'
import { PATHS } from '@/app/paths'
import { NAV_ITEMS } from '@/app/shell/navItems'
import { GoldClasp } from '@/components/ornaments/GoldClasp'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import type { PlayerSummary } from '@/features/player/types'
import './navigation.css'

/** Proprietà di {@link MobileTabBar}. */
export interface MobileTabBarProps {
  player: PlayerSummary
}

/**
 * Barra mobile in basso (FOUNDATIONS §6b-ter): le cinque voci con icona ed etichetta,
 * alta 64 più l'area sicura, doppio filo sul bordo alto. Voce attiva: chiarore, oro,
 * fermaglio sul filo. Contatori sull'icona.
 */
export function MobileTabBar({ player }: MobileTabBarProps) {
  return (
    <nav aria-label="Principale" className="fixed inset-x-0 bottom-0 z-40 pb-safe">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(image:--za-bar-fill-m) backdrop-blur-glass"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-(image:--za-gold-line-h)"
      />
      <span aria-hidden="true" className="absolute inset-x-0 top-1.5 h-px bg-edge-thin" />

      <div className="relative flex px-1">
        {NAV_ITEMS.map((item) => {
          const count = item.count ? item.count(player) : 0
          return (
            <NavLink key={item.to} to={item.to} end={item.to === PATHS.home} className="tab-item">
              {({ isActive }) => (
                <>
                  <Icon name={item.icon} size={24} active={isActive} />
                  {item.label}
                  {count > 0 && (
                    <>
                      <Badge count={count} className="tab-item__badge" />
                      <span className="sr-only">, {item.countLabel?.(count)}</span>
                    </>
                  )}
                  {isActive && <GoldClasp className="tab-item__clasp" />}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
