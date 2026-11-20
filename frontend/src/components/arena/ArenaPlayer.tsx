import { ElementEmblem } from '@/components/game/ElementEmblem'
import type { Faction } from '@/domain/game'
import { ELEMENT_LABELS, GOD_LABELS } from '@/domain/labels'

/** Proprietà di {@link ArenaPlayer}. */
export interface ArenaPlayerProps {
  nickname: string
  /** Chi guarda: accanto al nome "· tu". */
  isMe?: boolean
  /** Fazione; `null` se non si conosce ancora (prima della partita, D-014). */
  faction: Faction | null
  className?: string
}

/**
 * Giocatore in piedi sulla pozza di luce dell'arena (tavole Sfide-Attesa, Sfide-Verdetto): nome e
 * Fazione sopra, medaglione grande (112) con lo stemma, oppure l'iniziale se la Fazione è da scoprire.
 */
export function ArenaPlayer({ nickname, isMe = false, faction, className = '' }: ArenaPlayerProps) {
  return (
    <div
      className={`flex w-56 flex-col items-center gap-3 text-center text-shadow-scene ${className}`}
    >
      <p className="flex flex-col items-center gap-0.5">
        <span className="type-h2 text-text">
          {nickname}
          {isMe && ' · tu'}
        </span>
        <span className="text-text-muted type-meta">
          {faction
            ? `${GOD_LABELS[faction.god].name} · ${ELEMENT_LABELS[faction.element]}`
            : 'Fazione da scoprire'}
        </span>
      </p>
      <span
        aria-hidden="true"
        className="flex size-28 items-center justify-center rounded-full bg-(image:--za-medallion-fill) shadow-(--za-arena-medallion-ring)"
      >
        {faction ? (
          <ElementEmblem element={faction.element} size={98} />
        ) : (
          <span className="font-display text-[2rem] font-bold text-gold-bright">
            {nickname.charAt(0).toUpperCase()}
          </span>
        )}
      </span>
    </div>
  )
}
