import { useRef } from 'react'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { Medallion } from '@/components/ui/Medallion'
import { ELEMENT_LABELS, GOD_LABELS } from '@/domain/labels'
import { useAnimatedValue } from '@/features/matches/hooks/useAnimatedValue'
import { useKeyframes, useReplayMotion } from '@/features/matches/hooks/useReplayMotion'
import { MATCH_COPY } from '@/features/matches/messages'
import { EASE_OUT, MOTION } from '@/features/matches/motion'
import type { TokenState } from '@/features/matches/replay'
import type { MatchPlayer } from '@/features/matches/types'

const COPY = MATCH_COPY.arena

/**
 * Stella a quattro punte dei PV (componente Progressione). Quella appena persa resta accesa fino
 * al suo turno, poi si spegne in rosso: le stelle vanno via una alla volta, da destra.
 */
function Star({ tone, order = 0 }: { tone: 'lit' | 'lost'; order?: number }) {
  const ref = useRef<SVGPathElement>(null)
  useKeyframes(
    ref,
    [
      { fill: 'var(--za-clasp-light)', stroke: 'transparent', transform: 'scale(1)' },
      {
        fill: 'var(--za-danger-soft)',
        stroke: 'var(--za-danger-soft)',
        transform: 'scale(1.5)',
        offset: 0.4,
      },
      { fill: 'transparent', stroke: 'var(--za-danger-soft)', transform: 'scale(1)' },
    ],
    {
      run: tone === 'lost',
      delay: MOTION.clash.starsDelay + order * MOTION.clash.starStagger,
      duration: MOTION.clash.star,
      easing: EASE_OUT,
      fill: 'backwards',
    },
  )
  return (
    <svg viewBox="-7 -7 14 14" aria-hidden="true" className="size-3.5 overflow-visible">
      <path
        ref={ref}
        d="M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6 Z"
        fill={tone === 'lit' ? 'var(--za-clasp-light)' : 'none'}
        stroke={tone === 'lost' ? 'var(--za-danger-soft)' : 'none'}
        strokeWidth="1.2"
      />
    </svg>
  )
}

/** PV come stelle: accese quelle rimaste, rosse vuote quelle appena perse, puntini le altre. */
function HpStars({ hp, lost, total }: { hp: number; lost: number; total: number }) {
  return (
    <span aria-hidden="true" className="flex items-center gap-1">
      {Array.from({ length: total }, (_, i) =>
        i < hp ? (
          <Star key={i} tone="lit" />
        ) : i < hp + lost ? (
          <Star key={i} tone="lost" order={hp + lost - 1 - i} />
        ) : (
          <span key={i} className="mx-[0.3125rem] size-1 rounded-full bg-text-muted/45" />
        ),
      )}
    </span>
  )
}

/** Contorno del segnalino caduto: resta anche mentre pulsa. */
const FALLEN_RING = 'inset 0 0 0 1px rgba(168,163,207,0.7)'

/** Un segnalino; quello della carta appena caduta pulsa quando la carta cade. */
function Token({ token, fellNow }: { token: TokenState; fellNow: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  useKeyframes(
    ref,
    [
      { transform: 'scale(1)', boxShadow: `0 0 0 0 rgba(255,138,155,0), ${FALLEN_RING}` },
      {
        transform: 'scale(1.6)',
        boxShadow: `0 0 0 3px rgba(255,138,155,0.8), ${FALLEN_RING}`,
        offset: 0.4,
      },
      { transform: 'scale(1)', boxShadow: `0 0 0 0 rgba(255,138,155,0), ${FALLEN_RING}` },
    ],
    { run: fellNow, delay: MOTION.clash.fall, duration: 480, easing: EASE_OUT },
  )
  return (
    <span
      ref={ref}
      className={`size-2.5 rotate-45 ${
        token === 'fallen'
          ? 'shadow-[inset_0_0_0_1px_rgba(168,163,207,0.7)]'
          : token === 'inPlay'
            ? 'bg-gold-bright shadow-[0_0_8px_rgba(255,214,107,0.7)]'
            : 'bg-text-soft/80'
      }`}
    />
  )
}

/** Segnalini del mazzo: rombi vuoti le cadute, d'oro quella in gioco, pieni quelle da pescare. */
function DeckTokens({ tokens, fellNow }: { tokens: TokenState[]; fellNow: boolean }) {
  const lastFallen = tokens.lastIndexOf('fallen')
  return (
    <span aria-hidden="true" className="flex items-center gap-1.5 sm:gap-2">
      {tokens.map((token, i) => (
        <Token key={i} token={token} fellNow={fellNow && i === lastFallen} />
      ))}
    </span>
  )
}

/** Proprietà di {@link ReplayPlate}. */
export interface ReplayPlateProps {
  player: MatchPlayer
  isMe: boolean
  hp: number
  hpLost: number
  /** PV iniziali (le stelle in tutto). */
  hpTotal: number
  tokens: TokenState[]
  /** La sua creatura cade in questo momento (il segnalino pulsa). */
  fellNow?: boolean
  /** Specchiata: l'avversario, a destra, con lo stemma sul lato esterno. */
  mirror?: boolean
}

/**
 * Piastra del giocatore nel Rotolo (tavola Sfide-Rotolo): stemma della Fazione (ormai scoperta),
 * nome e Fazione; PV come stelle e mazzo come segnalini. Chi guarda sta a sinistra, l'avversario
 * a destra, specchiato.
 */
export function ReplayPlate({
  player,
  isMe,
  hp,
  hpLost,
  hpTotal,
  tokens,
  fellNow = false,
  mirror = false,
}: ReplayPlateProps) {
  const { animate, speed, runKey } = useReplayMotion()
  // I PV scendono contando insieme alle stelle che si spengono.
  const shownHp = useAnimatedValue({
    to: hp,
    from: hp + hpLost,
    mode: 'count',
    delay: MOTION.clash.starsDelay,
    duration: Math.max(1, hpLost) * MOTION.clash.starStagger + MOTION.clash.star,
    speed,
    active: animate && hpLost > 0,
    runKey,
  })
  const left = tokens.filter((t) => t === 'left').length
  const inPlay = tokens.filter((t) => t === 'inPlay').length
  const fallen = tokens.length - left - inPlay
  const { god, element } = player.faction
  return (
    <section
      aria-label={`${player.nickname}${isMe ? ` · ${COPY.you}` : ''}`}
      className={`flex items-center gap-3 rounded-full bg-[rgba(10,15,34,0.82)] py-2.5 shadow-[inset_0_0_0_1px_rgba(217,185,124,0.55)] sm:gap-4 ${
        mirror ? 'flex-row-reverse pr-3 pl-5 text-right sm:pl-6' : 'pr-5 pl-3 sm:pr-6'
      }`}
    >
      <span aria-hidden="true" className="shrink-0">
        <Medallion size={48}>
          <ElementEmblem element={element} size={40} />
        </Medallion>
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 sm:min-w-30">
        <span className="truncate font-display text-[1.0625rem] font-bold text-text">
          {player.nickname}
          {isMe && ` · ${COPY.you}`}
        </span>
        <span className="truncate text-text-muted type-meta">
          {GOD_LABELS[god].name} · {ELEMENT_LABELS[element]}
        </span>
      </span>
      <span aria-hidden="true" className="hidden h-9 w-px bg-[rgba(217,185,124,0.25)] sm:block" />
      <span className={`flex flex-col gap-1.5 ${mirror ? 'items-end' : 'items-start'}`}>
        <span className="flex items-center gap-2">
          <span className="hidden md:contents">
            <HpStars hp={hp} lost={hpLost} total={hpTotal} />
          </span>
          <b className="whitespace-nowrap text-text tabular-nums type-body-strong">
            <span className="sr-only">{COPY.hpLabel(hp, hpTotal)}</span>
            <span aria-hidden="true">{shownHp} PV</span>
          </b>
        </span>
        <span className="flex items-center gap-2">
          <DeckTokens tokens={tokens} fellNow={fellNow} />
          <span className="text-[0.75rem] font-bold whitespace-nowrap text-text-muted">
            <span className="sr-only">{COPY.deckLabel(left, inPlay, fallen)}</span>
            <span aria-hidden="true" className="hidden sm:inline">
              {COPY.toDraw(left)}
            </span>
          </span>
        </span>
      </span>
    </section>
  )
}
