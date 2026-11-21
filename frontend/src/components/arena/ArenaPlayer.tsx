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
  /** PV a fine partita, sotto il medaglione (Verdetto). */
  hp?: number
  /** Chi ha perso: medaglione spento (Verdetto). */
  dimmed?: boolean
  className?: string
}

/**
 * Giocatore in piedi sulla pozza di luce dell'arena (tavole Sfide-Attesa, Sfide-Verdetto): nome e
 * Fazione sopra, medaglione grande (112) con lo stemma, oppure l'iniziale se la Fazione è da scoprire.
 * Nel Verdetto sotto ci sono i PV, e chi ha perso ha il medaglione spento.
 */
export function ArenaPlayer({
  nickname,
  isMe = false,
  faction,
  hp,
  dimmed = false,
  className = '',
}: ArenaPlayerProps) {
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
        className={`flex size-28 items-center justify-center rounded-full bg-(image:--za-medallion-fill) shadow-(--za-arena-medallion-ring) ${dimmed ? 'opacity-60 grayscale-[0.6]' : ''}`}
      >
        {faction ? (
          <ElementEmblem element={faction.element} size={98} />
        ) : (
          <span className="font-display text-[2rem] font-bold text-gold-bright">
            {nickname.charAt(0).toUpperCase()}
          </span>
        )}
      </span>
      {hp !== undefined && (
        <p className={`mt-3 type-h2 ${dimmed ? 'text-text-muted' : 'text-text'}`}>{hp} PV</p>
      )}
    </div>
  )
}
