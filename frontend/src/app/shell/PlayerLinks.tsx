import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router'
import { PATHS } from '@/app/paths'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { Badge } from '@/components/ui/Badge'
import { Coin } from '@/components/ui/Coin'
import { Icon } from '@/components/ui/Icon'
import { Medallion } from '@/components/ui/Medallion'
import { TilePanel } from '@/components/panels/TilePanel'
import { GOD_LABELS } from '@/domain/labels'
import { useAuth } from '@/features/auth/useAuth'
import type { PlayerSummary } from '@/features/player/types'

/** Misura dei collegamenti: barra desktop o intestazione mobile. */
type Density = 'desktop' | 'mobile'

/** Proprietà comuni ai collegamenti del giocatore. */
interface PlayerLinkProps {
  player: PlayerSummary
  density: Density
}

/** Crediti discreti, con la moneta: portano al Negozio. */
export function CreditsLink({ player, density }: PlayerLinkProps) {
  const desktop = density === 'desktop'
  return (
    <Link
      to={PATHS.shop}
      aria-label={`${player.credits} crediti, vai al negozio`}
      className={`inline-flex items-center text-text-warm ${desktop ? 'gap-2' : 'gap-1'}`}
    >
      <Coin size={desktop ? 20 : 18} />
      <span className={desktop ? 'tabular-nums type-body-strong' : 'tabular-nums type-meta-strong'}>
        {player.credits}
      </span>
    </Link>
  )
}

/** Avatar con lo stemma della Fazione; su desktop anche nome e Fazione. Apre il menu giocatore. */
export function ProfileLink({ player, density }: PlayerLinkProps) {
  const desktop = density === 'desktop'
  const label = player.faction
    ? `Profilo di ${player.nickname}, Fazione ${GOD_LABELS[player.faction.god].name}`
    : `Profilo di ${player.nickname}`
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const { logout } = useAuth()
  const avatar = (
    <Medallion size={desktop ? 32 : 34} variant="avatar" className={desktop ? 'm-1' : ''}>
      {player.faction ? (
        <ElementEmblem element={player.faction.element} size={desktop ? 28 : 29} />
      ) : (
        <Icon name="profilo" size={20} className="text-gold-bright" />
      )}
    </Medallion>
  )

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className={`profile-menu ${desktop ? 'profile-menu--desktop' : 'profile-menu--mobile'}`}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        aria-controls={menuId}
        className="profile-menu__trigger"
        onClick={() => setIsOpen((open) => !open)}
      >
        {avatar}
        {desktop && (
          <span aria-hidden="true" className="flex flex-col">
            <span className="type-body-strong">{player.nickname}</span>
            {player.faction && (
              <span className="type-label text-gold">
                Fazione {GOD_LABELS[player.faction.god].name}
              </span>
            )}
          </span>
        )}
      </button>

      {isOpen && (
        <TilePanel as="div" className="profile-menu__panel">
          <nav id={menuId} aria-label="Menu del giocatore" className="profile-menu__content">
            <div className="profile-menu__section">
              <ProfileMenuLink to={PATHS.profile} icon="profilo" onNavigate={closeMenu}>
                Profilo
              </ProfileMenuLink>
              <ProfileMenuLink to={PATHS.groups} icon="gruppo" onNavigate={closeMenu}>
                Amici
              </ProfileMenuLink>
              <ProfileMenuLink to={PATHS.collection} icon="collezione" onNavigate={closeMenu}>
                Collezione
              </ProfileMenuLink>
              <ProfileMenuLink to={PATHS.missions} icon="missione" onNavigate={closeMenu}>
                Missioni
              </ProfileMenuLink>
              <ProfileMenuLink
                to={PATHS.faction}
                icon="fazione"
                onNavigate={closeMenu}
                detail={player.faction ? GOD_LABELS[player.faction.god].name : undefined}
              >
                Gilda
              </ProfileMenuLink>
            </div>
            <div className="profile-menu__divider" />
            <ProfileMenuLink to={PATHS.settings} icon="impostazioni" onNavigate={closeMenu}>
              Impostazioni
            </ProfileMenuLink>
            <div className="profile-menu__divider" />
            <button
              type="button"
              className="profile-menu__item profile-menu__logout"
              onClick={() => {
                closeMenu()
                logout()
              }}
            >
              <Icon name="esci" size={18} />
              <span>Esci</span>
            </button>
          </nav>
        </TilePanel>
      )}
    </div>
  )
}

function ProfileMenuLink({
  to,
  icon,
  onNavigate,
  detail,
  children,
}: {
  to: string
  icon: 'profilo' | 'gruppo' | 'collezione' | 'missione' | 'fazione' | 'impostazioni'
  onNavigate: () => void
  detail?: string
  children: ReactNode
}) {
  return (
    <NavLink to={to} onClick={onNavigate} className="profile-menu__item">
      {({ isActive }) => (
        <>
          <Icon name={icon} size={18} active={isActive} />
          <span>{children}</span>
          {detail && <span className="profile-menu__detail">{detail}</span>}
        </>
      )}
    </NavLink>
  )
}
/** Campanella: conta solo le novità senza un'azione (le cose da fare stanno sulle voci). */
export function NotificationsLink({ player, density }: PlayerLinkProps) {
  const unread = player.unreadNotifications
  const label =
    unread === 0 ? 'Notifiche' : `Notifiche, ${unread} ${unread === 1 ? 'non letta' : 'non lette'}`
  return (
    <Link
      to={PATHS.notifications}
      aria-label={label}
      className={`relative flex items-center justify-center text-text-muted ${density === 'desktop' ? 'size-10' : 'size-8'}`}
    >
      <Icon name="notifiche" size={20} />
      {unread > 0 && (
        <Badge
          count={unread}
          variant="bell"
          className={`absolute ${density === 'desktop' ? 'top-1.5 right-1.25' : 'top-px right-0'}`}
        />
      )}
    </Link>
  )
}
