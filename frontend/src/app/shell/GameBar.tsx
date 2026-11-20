import { NavLink } from 'react-router'
import { PATHS } from '@/app/paths'
import { NAV_ITEMS } from '@/app/shell/navItems'
import { CreditsLink, NotificationsLink, ProfileLink } from '@/app/shell/PlayerLinks'
import { Logo } from '@/components/brand/Logo'
import { GoldClasp } from '@/components/ornaments/GoldClasp'
import { Badge } from '@/components/ui/Badge'
import type { PlayerSummary } from '@/features/player/types'
import './navigation.css'

/** Proprietà di {@link GameBar}. */
export interface GameBarProps {
  player: PlayerSummary
}

/**
 * Barra di gioco desktop (FOUNDATIONS §6b, D-021): vetro dritto alto 64 con il doppio filo d'oro,
 * logo a sinistra, le cinque voci in testo, a destra crediti, profilo e campanella.
 * Sotto, un'ombra morbida rende leggibile la barra sopra qualunque scena.
 */
export function GameBar({ player }: GameBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-37.5 bg-(image:--za-bar-shade)"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(image:--za-bar-fill) backdrop-blur-glass"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-0.5 bg-(image:--za-edge-gold-h)"
      />
      <span aria-hidden="true" className="absolute inset-x-0 top-14.5 h-px bg-edge-thin" />

      <div className="relative flex h-14.5 items-stretch pr-5.5 pl-8">
        <Logo height={40} className="self-center" />

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
      </div>
    </header>
  )
}
