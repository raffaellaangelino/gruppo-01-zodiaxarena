import { ElementEmblem } from '@/components/game/ElementEmblem'
import { Medallion } from '@/components/ui/Medallion'
import { ELEMENT_LABELS, GOD_LABELS } from '@/domain/labels'
import { MATCH_COPY } from '@/features/matches/messages'
import type { TokenState } from '@/features/matches/replay'
import type { MatchPlayer } from '@/features/matches/types'

const COPY = MATCH_COPY.arena

/** Stella a quattro punte dei PV (componente Progressione). */
function Star({ tone }: { tone: 'lit' | 'lost' }) {
  return (
    <svg viewBox="-7 -7 14 14" aria-hidden="true" className="size-3.5 overflow-visible">
      <path
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
          <Star key={i} tone="lost" />
        ) : (
          <span key={i} className="mx-[0.3125rem] size-1 rounded-full bg-text-muted/45" />
        ),
      )}
    </span>
  )
}

/** Segnalini del mazzo: rombi vuoti le cadute, d'oro quella in gioco, pieni quelle da pescare. */
function DeckTokens({ tokens }: { tokens: TokenState[] }) {
  return (
    <span aria-hidden="true" className="flex items-center gap-1.5 sm:gap-2">
      {tokens.map((token, i) => (
        <span
          key={i}
          className={`size-2.5 rotate-45 ${
            token === 'fallen'
              ? 'shadow-[inset_0_0_0_1px_rgba(168,163,207,0.7)]'
              : token === 'inPlay'
                ? 'bg-gold-bright shadow-[0_0_8px_rgba(255,214,107,0.7)]'
                : 'bg-text-soft/80'
          }`}
        />
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
  mirror = false,
}: ReplayPlateProps) {
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
            <span aria-hidden="true">{hp} PV</span>
          </b>
        </span>
        <span className="flex items-center gap-2">
          <DeckTokens tokens={tokens} />
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
