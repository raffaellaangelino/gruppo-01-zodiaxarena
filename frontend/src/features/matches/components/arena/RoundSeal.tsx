import type { ReactNode } from 'react'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { Icon } from '@/components/ui/Icon'
import { ELEMENT_WITH_ARTICLE } from '@/domain/labels'
import { MATCH_COPY } from '@/features/matches/messages'
import type { Advantage } from '@/features/matches/replay'

const COPY = MATCH_COPY.arena
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** Proprietà di {@link RoundSeal}. */
export interface RoundSealProps {
  round: number
  advantage: Advantage | null
  /** Sotto il medaglione, al posto del vantaggio (a fine partita: "Vai al Verdetto"). */
  children?: ReactNode
}

/**
 * Al centro, sul pavimento davanti al trono (tavola Sfide-Rotolo): il medaglione del round e,
 * sotto, il vantaggio di elemento del round ("La Terra batte l'Aria · +1 ATK a Venere in Toro").
 * Niente riquadri: sta sull'arena.
 */
export function RoundSeal({ round, advantage, children }: RoundSealProps) {
  return (
    <div className="flex w-24 flex-col items-center gap-3 text-center sm:w-40 xl:w-70">
      <div className="flex size-18 flex-col items-center justify-center rounded-full bg-[radial-gradient(circle,#222C4F,#0B0E35)] shadow-[0_0_0_1.5px_var(--za-gold),0_0_0_5px_rgba(11,14,53,0.85),0_0_0_6px_rgba(232,176,75,0.45)] xl:size-23">
        <span className="font-display text-[0.75rem] font-bold tracking-[0.1em] text-gold uppercase">
          {COPY.round}
        </span>
        <b className="font-display text-[1.75rem] leading-none text-text xl:text-[2rem]">{round}</b>
      </div>
      {children}
      {!children && advantage && (
        <div className="flex flex-col items-center gap-2 text-shadow-scene">
          <span aria-hidden="true" className="flex items-center gap-2.5">
            <ElementEmblem element={advantage.winner} size={28} />
            <Icon name="avanti" size={16} className="text-gold-bright" />
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
