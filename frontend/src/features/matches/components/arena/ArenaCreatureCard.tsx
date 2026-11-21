import { useRef } from 'react'
import { CARD_BACK } from '@/components/game/cardBack'
import { StatMedal } from '@/features/matches/components/arena/StatMedal'
import { useAnimatedValue } from '@/features/matches/hooks/useAnimatedValue'
import { useMatchCardImage } from '@/features/matches/hooks/useMatchCardImage'
import { useKeyframes, useReplayMotion } from '@/features/matches/hooks/useReplayMotion'
import { MATCH_COPY } from '@/features/matches/messages'
import { EASE_INOUT, EASE_OUT, MOTION } from '@/features/matches/motion'
import { activeBonuses, formatNumber, type ArenaCreature } from '@/features/matches/replay'
import './arena.css'

/** Statistica aperta nella scomposizione. */
export type OpenStat = 'atk' | 'def'

/** Cosa fa la creatura in questo momento, per i movimenti. */
export interface CardMotion {
  /** È appena entrata: sale sulla pozza, i dadi d'Aria girano, i bonus compaiono in fila. */
  entering: boolean
  /** Colpo simultaneo: scatta verso il centro. */
  lunge: boolean
  /** Il colpo subito: la DEF scende da `before` e sale il danno. */
  hit: { before: number; amount: number } | null
  /** Vantaggio di elemento appena preso: "+1" sale dal medaglione ATK. */
  boost: number | null
  /** Cade proprio adesso: si inclina dopo l'impatto, non prima. */
  falling: boolean
  /** PV persi da chi la possedeva: il danno vola verso la sua piastra. */
  hpLoss: number | null
}

const NO_MOTION: CardMotion = {
  entering: false,
  lunge: false,
  hit: null,
  boost: null,
  falling: false,
  hpLoss: null,
}

const COPY = MATCH_COPY.arena

/** Valori possibili dei dadi d'Aria: 2d4×2 (regolamento). */
const AIR_MIN = 4
const AIR_MAX = 16

/** Numero che sale e svanisce sopra un medaglione ("−12", "+1"). Invisibile fuori dal movimento. */
function FloatingDelta({
  text,
  tone,
  run,
  delay,
  position,
}: {
  text: string
  tone: 'danger' | 'gold'
  run: boolean
  delay: number
  position: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useKeyframes(
    ref,
    [
      { opacity: 0, transform: 'translate(-50%, 0) scale(0.8)' },
      { opacity: 1, transform: 'translate(-50%, -1.25rem) scale(1.1)', offset: 0.25 },
      { opacity: 1, transform: 'translate(-50%, -2rem) scale(1)', offset: 0.7 },
      { opacity: 0, transform: 'translate(-50%, -2.75rem) scale(1)' },
    ],
    { run, delay, duration: MOTION.clash.float, easing: EASE_OUT },
  )
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute top-[64%] z-[2] font-display text-[1.375rem] font-black tabular-nums opacity-0 [-webkit-text-stroke:3px_#2A0A1A] [paint-order:stroke] ${position} ${
        tone === 'danger' ? 'text-stat-hurt' : 'text-(--za-clasp-light)'
      }`}
    >
      {text}
    </span>
  )
}

/** Una voce dei bonus che compare in fila all'ingresso. */
function BonusChip({ text, index, run }: { text: string; index: number; run: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  useKeyframes(
    ref,
    [
      { opacity: 0, transform: 'translateY(0.25rem)' },
      { opacity: 1, transform: 'none' },
    ],
    {
      run,
      delay: MOTION.enter.bonusDelay + index * MOTION.enter.bonusStagger,
      duration: MOTION.enter.bonus,
      easing: EASE_OUT,
      fill: 'backwards',
    },
  )
  return (
    <span ref={ref} className="xl:whitespace-nowrap">
      {text}
    </span>
  )
}

/** "Cade in questo round": compare quando la carta cade, non prima (niente anticipazioni). */
function FallLabel({ text, run }: { text: string; run: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null)
  useKeyframes(
    ref,
    [
      { opacity: 0, transform: 'translateY(-0.25rem)' },
      { opacity: 1, transform: 'none' },
    ],
    { run, delay: MOTION.clash.fall, duration: 260, easing: EASE_OUT, fill: 'backwards' },
  )
  return (
    <p ref={ref} className="text-[0.75rem] font-extrabold tracking-[0.1em] text-danger uppercase">
      {text}
    </p>
  )
}

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
  /** I movimenti di questo momento. */
  motion?: CardMotion
  /** Larghezza della carta (l'altezza segue il 5:7). */
  className?: string
}

/**
 * Creatura in piedi sulla pozza di luce (tavola Sfide-Rotolo). Niente targhe: ATK e DEF del
 * momento sopra i medaglioni stampati, sugli stessi punti del sorgente (80,548 e 420,548 su
 * 500×700), ingranditi 1,75× perché il numero resti leggibile. Sotto, sull'arena, il nome e i
 * bonus attivi. Toccando un medaglione si apre il calcolo. La creatura caduta si inclina sulla
 * base e si spegne (colori smorzati, non il grigio del "disabilitato").
 *
 * Movimenti (ux/challenge-replay.md): ingresso con i dadi d'Aria che girano, scatto del colpo
 * simultaneo con il danno che sale e la DEF che scende, caduta dopo l'impatto, danno in eccesso
 * che vola verso i PV. I numeri finali sono sempre quelli dell'engine.
 */
export function ArenaCreatureCard({
  creature,
  justFell,
  openStat,
  onToggleStat,
  side = 'left',
  motion = NO_MOTION,
  className = '',
}: ArenaCreatureCardProps) {
  const imageUrl = useMatchCardImage(creature.card)
  const { animate, speed, runKey } = useReplayMotion()
  const { card, attack, defense, defenseMax, fallen, airDice } = creature
  const bonuses = activeBonuses(creature)
  const rolling = motion.entering && airDice !== null

  // Dadi d'Aria: il numero gira nel campo dei valori possibili (più i bonus) e si ferma su quello vero.
  const attackBonus = attack - (creature.attackParts[0]?.amount ?? 0)
  const defenseBonus = creature.defenseMax - (creature.defenseParts[0]?.amount ?? 0)
  const shownAttack = useAnimatedValue({
    to: attack,
    mode: 'roll',
    min: AIR_MIN + attackBonus,
    max: AIR_MAX + attackBonus,
    delay: 0,
    duration: MOTION.enter.dice,
    speed,
    active: animate && rolling,
    runKey,
  })
  const shownDefense = useAnimatedValue({
    to: defense,
    from: motion.hit?.before,
    mode: rolling ? 'roll' : 'count',
    min: AIR_MIN + defenseBonus,
    max: AIR_MAX + defenseBonus,
    delay: rolling ? 0 : MOTION.clash.impact,
    duration: rolling ? MOTION.enter.dice : MOTION.clash.count,
    speed,
    active: animate && (rolling || motion.hit !== null),
    runKey,
  })
  // Mentre i dadi girano la DEF provvisoria non è un danno: niente rosso né "su N".
  const hurt = (rolling ? defense : shownDefense) < defenseMax

  const cardRef = useRef<HTMLDivElement>(null)
  const lungeRef = useRef<HTMLDivElement>(null)
  const defRef = useRef<HTMLButtonElement>(null)
  const chipRef = useRef<HTMLSpanElement>(null)
  const inward = side === 'left' ? 1 : -1

  // Ingresso: la carta sale sulla pozza.
  useKeyframes(
    cardRef,
    [
      { opacity: 0, transform: 'translateY(1.5rem) scale(0.96)' },
      { opacity: 1, transform: 'none' },
    ],
    { run: motion.entering, duration: MOTION.enter.card, easing: EASE_OUT },
  )
  // Colpo simultaneo: le due carte scattano insieme verso il centro e tornano.
  useKeyframes(
    lungeRef,
    [
      { transform: 'none' },
      { transform: `translateX(${inward * 12}%) rotate(${inward * 2}deg)`, offset: 0.5 },
      { transform: 'none' },
    ],
    { run: motion.lunge, duration: MOTION.clash.lunge, easing: EASE_INOUT },
  )
  // Il medaglione DEF colpito pulsa di rosso all'impatto.
  useKeyframes(
    defRef,
    [
      // Il centraggio usa la proprietà `translate` (Tailwind 4): qui basta la scala.
      { transform: 'scale(1)', filter: 'none' },
      {
        transform: 'scale(1.22)',
        filter: 'drop-shadow(0 0 10px rgba(255,107,127,0.9))',
        offset: 0.35,
      },
      { transform: 'scale(1)', filter: 'none' },
    ],
    { run: motion.hit !== null, delay: MOTION.clash.impact, duration: 420, easing: EASE_OUT },
  )
  // Danno in eccesso: vola dalla carta verso la piastra di chi perde i PV.
  const towardPlate =
    typeof window !== 'undefined' && window.matchMedia('(min-width: 80rem)').matches
      ? '-9rem'
      : side === 'left'
        ? '9rem'
        : '-9rem'
  useKeyframes(
    chipRef,
    [
      { opacity: 0, transform: 'translateY(0) scale(0.8)' },
      { opacity: 1, transform: 'translateY(-0.5rem) scale(1.1)', offset: 0.2 },
      { opacity: 0, transform: `translateY(${towardPlate}) scale(0.7)` },
    ],
    {
      run: motion.hpLoss !== null,
      delay: MOTION.clash.chipDelay,
      duration: MOTION.clash.chip,
      easing: 'ease-in',
    },
  )

  // Caduta: lo stato (inclinata e spenta) vale subito; il movimento parte dopo l'impatto e,
  // se il Racconto va avanti prima, si annulla lasciando la carta già caduta.
  useKeyframes(
    cardRef,
    [
      { transform: 'none', filter: 'none' },
      {
        transform: `rotate(${side === 'left' ? -8 : 8}deg)`,
        filter: 'brightness(0.5) saturate(0.55)',
      },
    ],
    {
      run: motion.falling,
      delay: MOTION.clash.fall,
      duration: 300,
      easing: EASE_OUT,
      fill: 'backwards',
    },
  )

  const medal = (stat: OpenStat, value: number, position: string) => {
    const label = stat === 'atk' ? COPY.atk : COPY.def
    return (
      <button
        ref={stat === 'def' ? defRef : undefined}
        type="button"
        aria-expanded={openStat === stat}
        aria-label={COPY.openBreakdown(
          label,
          formatNumber(stat === 'atk' ? attack : defense),
          card.name,
        )}
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
      <div ref={lungeRef} className="relative w-full">
        <div
          key={card.name}
          ref={cardRef}
          className={`arena-card relative aspect-[5/7] w-full ${fallen ? `arena-card--fallen arena-card--fallen-${side}` : ''}`}
        >
          {/* Il nome è scritto sotto: l'immagine non lo ripete agli screen reader */}
          <img src={imageUrl ?? CARD_BACK} alt="" className="arena-card__image" />
          {medal('atk', shownAttack, 'left-[16%]')}
          {medal('def', shownDefense, 'left-[84%]')}
          {hurt && (
            <span className="absolute top-[calc(86.5%+0.25rem)] left-[84%] z-[1] flex h-5 min-w-12 -translate-x-1/2 items-center justify-center rounded-full bg-medallion-core px-2 text-[0.75rem] font-extrabold text-text tabular-nums shadow-[inset_0_0_0_1px_rgba(232,176,75,0.7)]">
              {COPY.ofMax(defenseMax)}
            </span>
          )}
          {motion.boost !== null && (
            <FloatingDelta
              text={`+${motion.boost}`}
              tone="gold"
              run
              delay={MOTION.advantage.boostDelay}
              position="left-[16%]"
            />
          )}
          {motion.hit && (
            <FloatingDelta
              text={`−${motion.hit.amount}`}
              tone="danger"
              run
              delay={MOTION.clash.impact}
              position="left-[84%]"
            />
          )}
        </div>
        {motion.hpLoss !== null && (
          <span
            ref={chipRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-[10%] left-1/2 z-[3] -translate-x-1/2 rounded-full bg-medallion-core px-3 py-1 font-display text-[1rem] font-black whitespace-nowrap text-danger-soft opacity-0 shadow-[0_0_0_1px_var(--za-danger-soft),0_0_18px_rgba(255,107,127,0.6)]"
          >
            −{motion.hpLoss} PV
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
            {bonuses.map((b, i) => (
              <BonusChip key={b} text={b} index={i} run={motion.entering} />
            ))}
          </p>
        )}
        {fallen && <FallLabel text={justFell ? COPY.fallsNow : COPY.fallen} run={motion.falling} />}
      </div>
    </div>
  )
}
