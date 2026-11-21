import { MATCH_COPY } from '@/features/matches/messages'

const COPY = MATCH_COPY.arena

/** Distanza massima tra due stelle e larghezza massima della costellazione, in px. */
const GAP = 40
const MAX_WIDTH = 360

/** Proprietà di {@link RoundTrack}. */
export interface RoundTrackProps {
  turn: number
  round: number
  total: number
  onSeekRound: (round: number) => void
}

/** Stella a quattro punte. */
function starPath(cx: number, r: number): string {
  const k = r * 0.23
  return `M${cx} ${-r} L${cx + k} ${-k} L${cx + r} 0 L${cx + k} ${k} L${cx} ${r} L${cx - k} ${k} L${cx - r} 0 L${cx - k} ${-k} Z`
}

/**
 * Dove sei nella partita (tavola Sfide-Rotolo, componente Progressione): una stella per round,
 * accese quelle raccontate, la corrente più grande con il turno sopra, spente le prossime.
 * Ogni stella porta a quel round. Con tanti round le stelle si stringono, la linea no.
 */
export function RoundTrack({ turn, round, total, onSeekRound }: RoundTrackProps) {
  const rounds = Math.max(total, 1)
  const gap = rounds > 1 ? Math.min(GAP, MAX_WIDTH / (rounds - 1)) : 0
  const width = gap * (rounds - 1)
  const nowX = Math.max(0, round - 1) * gap
  const hit = Math.max(gap, 16)

  return (
    <nav
      aria-label={COPY.progress(turn, round, rounds)}
      className="relative h-6"
      style={{ width: width + 24 }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-1 -translate-x-1/2 -translate-y-full font-display text-[0.8125rem] font-bold tracking-[0.12em] whitespace-nowrap text-(--za-clasp-light) uppercase text-shadow-scene"
        style={{ left: nowX + 12 }}
      >
        {COPY.turn} {turn}
      </span>
      <svg
        aria-hidden="true"
        width={width + 24}
        height="24"
        viewBox={`-12 -12 ${width + 24} 24`}
        className="block overflow-visible"
      >
        <line x1="0" y1="0" x2={nowX} y2="0" stroke="rgba(232,176,75,0.8)" strokeWidth="1" />
        <line
          x1={nowX}
          y1="0"
          x2={width}
          y2="0"
          stroke="rgba(243,235,221,0.2)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        <circle cx={nowX} cy="0" r="16" fill="rgba(255,214,107,0.18)" />
        {Array.from({ length: rounds }, (_, i) => (
          <path
            key={i}
            d={starPath(i * gap, i + 1 === round ? 10 : 6)}
            fill={i + 1 <= round ? 'var(--za-clasp-light)' : 'rgba(243,235,221,0.28)'}
          />
        ))}
      </svg>
      {Array.from({ length: rounds }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={COPY.goToRound(i + 1)}
          aria-current={i + 1 === round ? 'step' : undefined}
          onClick={() => onSeekRound(i + 1)}
          className="absolute top-0 h-6 -translate-x-1/2 cursor-pointer rounded-full border-0 bg-transparent p-0"
          style={{ left: i * gap + 12, width: hit }}
        />
      ))}
    </nav>
  )
}
