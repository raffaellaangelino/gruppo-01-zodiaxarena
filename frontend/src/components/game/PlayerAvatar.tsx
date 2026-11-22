import { ElementEmblem } from '@/components/game/ElementEmblem'
import { Medallion } from '@/components/ui/Medallion'
import type { PlayerRef } from '@/domain/game'

/** Proprietà di {@link PlayerAvatar}. */
export interface PlayerAvatarProps {
  player: PlayerRef
  /** Diametro in px (64 nella sfida ricevuta, 40 nelle righe, 32 nelle liste fitte). */
  size: number
}

/**
 * Medaglione di un altro giocatore (tavole Sfide): l'iniziale finché non lo hai affrontato,
 * lo stemma della sua Fazione dopo (D-014: prima della partita la Fazione non si vede).
 * Decorativo: il nickname è sempre scritto accanto.
 */
export function PlayerAvatar({ player, size }: PlayerAvatarProps) {
  return (
    <span aria-hidden="true" className="shrink-0">
      <Medallion size={size}>
        {player.faction ? (
          <ElementEmblem element={player.faction.element} size={size - 8} />
        ) : (
          <span
            className={`font-display font-bold text-gold-bright ${size >= 48 ? 'text-[1.25rem]' : 'text-[0.9375rem]'}`}
          >
            {player.nickname.charAt(0).toUpperCase()}
          </span>
        )}
      </Medallion>
    </span>
  )
}
