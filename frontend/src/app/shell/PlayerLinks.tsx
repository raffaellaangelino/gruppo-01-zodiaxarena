import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { Badge } from '@/components/ui/Badge'
import { Coin } from '@/components/ui/Coin'
import { Icon } from '@/components/ui/Icon'
import { Medallion } from '@/components/ui/Medallion'
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

/** Avatar con lo stemma della Fazione; su desktop anche nome e Fazione. Porta al Profilo. */
export function ProfileLink({ player, density }: PlayerLinkProps) {
  const desktop = density === 'desktop'
  const label = player.faction
    ? `Profilo di ${player.nickname}, Fazione ${player.faction.god}`
    : `Profilo di ${player.nickname}`
  const avatar = (
    <Medallion size={desktop ? 32 : 34} variant="avatar" className={desktop ? 'm-1' : ''}>
      {player.faction ? (
        <ElementEmblem element={player.faction.element} size={desktop ? 28 : 29} />
      ) : (
        <Icon name="profilo" size={20} className="text-gold-bright" />
      )}
    </Medallion>
  )

  return (
    <Link
      to={PATHS.profile}
      aria-label={label}
      className="inline-flex items-center gap-3 text-text"
    >
      {avatar}
      {desktop && (
        <span aria-hidden="true" className="flex flex-col">
          <span className="type-body-strong">{player.nickname}</span>
          {player.faction && (
            <span className="type-label text-gold">Fazione {player.faction.god}</span>
          )}
        </span>
      )}
    </Link>
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
