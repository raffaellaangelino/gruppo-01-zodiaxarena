import { useRef, type ReactNode } from 'react'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { Icon } from '@/components/ui/Icon'
import { ELEMENT_WITH_ARTICLE } from '@/domain/labels'
import { useKeyframes } from '@/features/matches/hooks/useReplayMotion'
import { MATCH_COPY } from '@/features/matches/messages'
import { EASE_INOUT, EASE_OUT, MOTION } from '@/features/matches/motion'
import type { Advantage } from '@/features/matches/replay'

const COPY = MATCH_COPY.arena
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** Proprietà di {@link RoundSeal}. */
export interface RoundSealProps {
  round: number
  advantage: Advantage | null
  /** Il round è appena cambiato: il numero gira. */
  roundChanged?: boolean
  /** Il vantaggio è appena annunciato: gli stemmi pulsano e la freccia passa. */
  advantageNow?: boolean
  /** Sotto il medaglione, al posto del vantaggio (a fine partita: "Vai al Verdetto"). */
  children?: ReactNode
}

/**
 * Al centro, sul pavimento davanti al trono (tavola Sfide-Rotolo): il medaglione del round e,
 * sotto, il vantaggio di elemento del round ("La Terra batte l'Aria · +1 ATK a Venere in Toro").
 * Niente riquadri: sta sull'arena.
 */
export function RoundSeal({
  round,
  advantage,
  roundChanged = false,
  advantageNow = false,
  children,
}: RoundSealProps) {
  const numberRef = useRef<HTMLElement>(null)
  const winnerRef = useRef<HTMLSpanElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)
  useKeyframes(
    numberRef,
    [
      { transform: 'rotateX(90deg)', opacity: 0 },
      { transform: 'none', opacity: 1 },
    ],
    { run: roundChanged, duration: MOTION.round.flip, easing: EASE_OUT },
  )
  useKeyframes(
    winnerRef,
    [
      { transform: 'scale(1)', filter: 'none' },
      {
        transform: 'scale(1.3)',
        filter: 'drop-shadow(0 0 8px rgba(255,214,107,0.8))',
        offset: 0.4,
      },
      { transform: 'scale(1)', filter: 'none' },
    ],
    { run: advantageNow, duration: MOTION.advantage.pulse, easing: EASE_OUT },
  )
  useKeyframes(
    arrowRef,
    [
      { transform: 'translateX(-0.375rem)', opacity: 0.3 },
      { transform: 'translateX(0.375rem)', opacity: 1, offset: 0.6 },
      { transform: 'none', opacity: 1 },
    ],
    { run: advantageNow, duration: MOTION.advantage.pulse, easing: EASE_INOUT },
  )
  return (
    <div className="flex w-24 flex-col items-center gap-3 text-center sm:w-40 xl:w-70">
      <div className="flex size-18 flex-col items-center justify-center rounded-full bg-[radial-gradient(circle,#222C4F,#0B0E35)] shadow-[0_0_0_1.5px_var(--za-gold),0_0_0_5px_rgba(11,14,53,0.85),0_0_0_6px_rgba(232,176,75,0.45)] xl:size-23">
        <span className="font-display text-[0.75rem] font-bold tracking-[0.1em] text-gold uppercase">
          {COPY.round}
        </span>
        <b
          ref={numberRef}
          className="font-display text-[1.75rem] leading-none text-text xl:text-[2rem]"
        >
          {round}
        </b>
      </div>
      {children}
      {!children && advantage && (
        <div className="flex flex-col items-center gap-2 text-shadow-scene">
          <span aria-hidden="true" className="flex items-center gap-2.5">
            <span ref={winnerRef} className="flex">
              <ElementEmblem element={advantage.winner} size={28} />
            </span>
            <span ref={arrowRef} className="flex">
              <Icon name="avanti" size={16} className="text-gold-bright" />
            </span>
            <span className="opacity-70">
              <ElementEmblem element={advantage.loser} size={28} />
            </span>
          </span>
          <p className="text-[0.75rem] font-bold text-text sm:type-meta-strong">
            {capitalize(ELEMENT_WITH_ARTICLE[advantage.winner])} batte{' '}
            {ELEMENT_WITH_ARTICLE[advantage.loser]}
            <br />
            <span className="text-gold-bright">
              +{advantage.amount} ATK a {advantage.card.name}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
