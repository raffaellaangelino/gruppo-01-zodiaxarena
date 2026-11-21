import { Fragment, useEffect, useRef } from 'react'
import { TilePanel } from '@/components/panels/TilePanel'
import { Icon } from '@/components/ui/Icon'
import { MATCH_COPY } from '@/features/matches/messages'
import type { ReplayStep, TextSegment } from '@/features/matches/replay'

const COPY = MATCH_COPY.arena
const LIST_ID = 'za-cronaca'

/** Una frase della Cronaca, con le parti in evidenza e il danno ai PV in rosso. */
function Sentence({ segments }: { segments: TextSegment[] }) {
  return segments.map((segment, i) =>
    segment.tone === 'strong' ? (
      <b key={i}>{segment.text}</b>
    ) : segment.tone === 'danger' ? (
      <b key={i} className="text-danger-soft">
        {segment.text}
      </b>
    ) : (
      <Fragment key={i}>{segment.text}</Fragment>
    ),
  )
}

/** Proprietà di {@link ReplayChronicle}. */
export interface ReplayChronicleProps {
  steps: ReplayStep[]
  index: number
  open: boolean
  onToggle: () => void
  onSeek: (index: number) => void
  className?: string
}

/**
 * La Cronaca, voce di Lachesi (tavola Sfide-Rotolo): sempre nell'angolo in basso a sinistra,
 * come la lista delle mosse di un replay. Compatta mostra il momento attuale e, sfumato sopra,
 * il precedente; aperta cresce verso l'alto con tutta la storia, divisa per turno e round.
 * Solo i momenti già raccontati (niente anticipazioni); un tocco su una riga porta lì.
 * È anche la versione accessibile del Racconto (`role="log"`).
 */
export function ReplayChronicle({
  steps,
  index,
  open,
  onToggle,
  onSeek,
  className = '',
}: ReplayChronicleProps) {
  const listRef = useRef<HTMLDivElement>(null)

  // Il momento attuale resta sempre in vista, in fondo.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [index, open])

  const told = steps.slice(0, index + 1)

  return (
    <TilePanel glass as="div" className={className}>
      <div className="flex h-full flex-col">
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-line-thin pr-2 pl-5">
          <h2 className="flex items-center gap-2 font-display text-[0.75rem] font-bold tracking-[0.12em] text-gold-bright uppercase">
            <Icon name="rotolo" size={16} />
            {COPY.chronicle}
          </h2>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={LIST_ID}
            aria-label={open ? COPY.collapse : COPY.expand}
            onClick={onToggle}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-gold-bright"
          >
            <Icon name="espandi" size={18} className={open ? '' : 'rotate-180'} />
          </button>
        </div>
        <div
          id={LIST_ID}
          ref={listRef}
          role="log"
          aria-live="polite"
          className={`min-h-0 flex-1 pb-1.5 ${
            open
              ? 'overflow-y-auto [mask:linear-gradient(180deg,transparent_0,#000_1.75rem)]'
              : 'overflow-hidden [mask:linear-gradient(180deg,transparent_0,#000_2.75rem)]'
          }`}
        >
          <div className="flex min-h-full flex-col justify-end">
            {told.map((step, i) => {
              const previous = told[i - 1]
              const newSection =
                open && (!previous || previous.turn !== step.turn || previous.round !== step.round)
              const current = i === index
              return (
                <Fragment key={i}>
                  {newSection && (
                    <div className="flex items-center gap-3 px-5 pt-3 pb-1">
                      <span className="font-display text-[0.75rem] font-bold tracking-[0.12em] whitespace-nowrap text-gold uppercase">
                        {COPY.turnRound(step.turn, step.round)}
                      </span>
                      <span aria-hidden="true" className="h-px flex-1 bg-[rgba(232,176,75,0.25)]" />
                    </div>
                  )}
                  <button
                    type="button"
                    aria-current={current ? 'step' : undefined}
                    onClick={() => onSeek(i)}
                    className={`relative block w-full cursor-pointer border-0 text-left ${
                      current
                        ? 'mt-1 bg-[rgba(255,231,160,0.07)] py-2 pr-5 pl-9 text-text shadow-[inset_2px_0_0_var(--za-clasp-light)] type-body'
                        : 'bg-transparent px-5 py-1 text-text-soft type-meta'
                    }`}
                  >
                    {current && (
                      <span
                        aria-hidden="true"
                        className="absolute top-[1.0625rem] left-4.5 size-[0.4375rem] rotate-45 bg-(--za-clasp-light)"
                      />
                    )}
                    <Sentence segments={step.text} />
                  </button>
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </TilePanel>
  )
}
