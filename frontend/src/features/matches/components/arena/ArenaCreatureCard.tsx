import { CARD_BACK } from '@/components/game/cardBack'
import { useMatchCardImage } from '@/features/matches/hooks/useMatchCardImage'
import { StatMedal } from '@/features/matches/components/arena/StatMedal'
import { MATCH_COPY } from '@/features/matches/messages'
import { activeBonuses, formatNumber, type ArenaCreature } from '@/features/matches/replay'
import './arena.css'

/** Statistica aperta nella scomposizione. */
export type OpenStat = 'atk' | 'def'

const COPY = MATCH_COPY.arena

/** Proprietà di {@link ArenaCreatureCard}. */
export interface ArenaCreatureCardProps {
  creature: ArenaCreature
  /** È caduta proprio in questo momento ("Cade in questo round"). */
  justFell: boolean
  /** Statistica di cui è aperta la scomposizione. */
  openStat: OpenStat | null
  onToggleStat: (stat: OpenStat) => void
  /** Lato dell'arena: cadendo, la carta si inclina verso l'esterno (a destra, specchiata). */
  side?: 'left' | 'right'
  /** Larghezza della carta (l'altezza segue il 5:7). */
  className?: string
}

/**
 * Creatura in piedi sulla pozza di luce (tavola Sfide-Rotolo). Niente targhe: ATK e DEF del
 * momento sopra i medaglioni stampati, sugli stessi punti del sorgente (80,548 e 420,548 su
 * 500×700), ingranditi 1,75× perché il numero resti leggibile. Sotto, sull'arena, il nome e i
 * bonus attivi. Toccando un medaglione si apre il calcolo. La creatura caduta si inclina sulla
 * base e si spegne (colori smorzati, non il grigio del "disabilitato").
 */
export function ArenaCreatureCard({
  creature,
  justFell,
  openStat,
  onToggleStat,
  side = 'left',
  className = '',
}: ArenaCreatureCardProps) {
  const imageUrl = useMatchCardImage(creature.card)
  const { card, attack, defense, defenseMax, fallen } = creature
  const hurt = defense < defenseMax
  const bonuses = activeBonuses(creature)

  const medal = (stat: OpenStat, value: number, position: string) => {
    const label = stat === 'atk' ? COPY.atk : COPY.def
    return (
      <button
        type="button"
        aria-expanded={openStat === stat}
        aria-label={COPY.openBreakdown(label, formatNumber(value), card.name)}
        onClick={() => onToggleStat(stat)}
        className={`absolute top-[78.29%] aspect-square w-[23.1%] -translate-1/2 cursor-pointer rounded-full border-0 bg-transparent p-0 ${position} ${
          openStat === stat
            ? 'shadow-[0_0_0_2px_var(--za-clasp-light),0_0_16px_rgba(255,231,160,0.7)]'
            : ''
        }`}
      >
        <StatMedal kind={stat} value={formatNumber(value)} hurt={stat === 'def' && hurt} />
      </button>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-2 text-center xl:gap-3 ${className}`}>
      <div
        key={card.name}
        className={`arena-card relative aspect-[5/7] w-full ${fallen ? `arena-card--fallen arena-card--fallen-${side}` : ''}`}
      >
        {/* Il nome è scritto sotto: l'immagine non lo ripete agli screen reader */}
        <img src={imageUrl ?? CARD_BACK} alt="" className="arena-card__image" />
        {medal('atk', attack, 'left-[16%]')}
        {medal('def', defense, 'left-[84%]')}
        {hurt && (
          <span className="absolute top-[calc(86.5%+0.25rem)] left-[84%] z-[1] flex h-5 min-w-12 -translate-x-1/2 items-center justify-center rounded-full bg-medallion-core px-2 text-[0.75rem] font-extrabold text-text tabular-nums shadow-[inset_0_0_0_1px_rgba(232,176,75,0.7)]">
            {COPY.ofMax(defenseMax)}
          </span>
        )}
      </div>
      <div className="flex w-full flex-col items-center gap-1 text-shadow-scene xl:w-72">
        <p
          className={`leading-tight font-display text-[0.9375rem] font-bold sm:type-h3 ${fallen ? 'text-text-muted' : 'text-text'}`}
        >
          {card.name}
        </p>
        {bonuses.length > 0 && (
          <p className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 text-[0.75rem] font-extrabold text-gold-bright xl:gap-x-3">
            {bonuses.map((b) => (
              <span key={b} className="xl:whitespace-nowrap">
                {b}
              </span>
            ))}
          </p>
        )}
        {fallen && (
          <p className="text-[0.75rem] font-extrabold tracking-[0.1em] text-danger uppercase">
            {justFell ? COPY.fallsNow : COPY.fallen}
          </p>
        )}
      </div>
    </div>
  )
}
