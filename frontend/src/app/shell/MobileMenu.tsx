import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { PATHS } from '@/app/paths'
import { NAV_ITEMS } from '@/app/shell/navItems'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import type { PlayerSummary } from '@/features/player/types'

const EXTRA_ITEMS = [
  { label: 'Missioni', to: PATHS.missions, icon: 'missione' as const },
  { label: 'La tua Fazione', to: PATHS.faction, icon: 'fazione' as const },
  { label: 'Profilo', to: PATHS.profile, icon: 'profilo' as const },
  { label: 'Notifiche', to: PATHS.notifications, icon: 'notifiche' as const },
]

export function MobileMenu({ player }: { player: PlayerSummary }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOutside)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOutside)
    }
  }, [open])

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
        aria-expanded={open}
        aria-controls="mobile-game-menu"
        onClick={() => setOpen((value) => !value)}
        className="mobile-menu-button"
      >
        <span aria-hidden="true" className="mobile-menu-button__lines" />
      </button>

      {open && (
        <nav
          id="mobile-game-menu"
          aria-label="Menu principale"
          className="mobile-menu-panel"
        >
          <div className="mobile-menu-list">
            {NAV_ITEMS.map((item) => {
              const count = item.count?.(player) ?? 0
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === PATHS.home}
                  className="mobile-menu-link"
                >
                  <Icon name={item.icon} size={20} />
                  <span className="flex-1">{item.label}</span>
                  {count > 0 && <Badge count={count} />}
                </NavLink>
              )
            })}
            {EXTRA_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className="mobile-menu-link">
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
