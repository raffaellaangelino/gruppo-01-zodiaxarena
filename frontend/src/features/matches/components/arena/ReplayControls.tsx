import { Icon } from '@/components/ui/Icon'
import type { ReplayControls as Controls } from '@/features/matches/hooks/useReplay'
import { MATCH_COPY } from '@/features/matches/messages'

const COPY = MATCH_COPY.arena

/** Pulsante tondo del passo (40), con il filo d'oro. */
const STEP_BUTTON =
  'flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-[rgba(16,23,43,0.85)] text-gold-bright shadow-[inset_0_0_0_1px_var(--za-gold)] disabled:cursor-default disabled:opacity-40'

/** Proprietà di {@link ReplayControls}. */
export interface ReplayControlsProps {
  controls: Controls
}

/**
 * Comandi del Racconto (tavola Sfide-Rotolo): evento precedente, riproduci o pausa (d'oro, il
 * principale), evento successivo e la velocità. Alla fine il pulsante principale riparte da capo.
 */
export function ReplayControls({ controls }: ReplayControlsProps) {
  const { playing, atStart, atEnd, speed, previous, next, togglePlay, toggleSpeed } = controls
  const mainLabel = atEnd ? COPY.restart : playing ? COPY.pause : COPY.play
  return (
    <div className="relative flex items-center gap-4">
      <button
        type="button"
        aria-label={COPY.previous}
        onClick={previous}
        disabled={atStart}
        className={STEP_BUTTON}
      >
        <Icon name="passo" size={18} className="-scale-x-100" />
      </button>
      <button
        type="button"
        aria-label={mainLabel}
        onClick={togglePlay}
        className="flex size-12 cursor-pointer items-center justify-center rounded-full border-0 bg-[linear-gradient(180deg,var(--za-clasp-light),var(--za-card-gold-mid))] text-text-on-gold shadow-[inset_0_0_0_1px_var(--za-gold)]"
      >
        <Icon name={playing ? 'pausa' : 'riproduci'} size={20} />
      </button>
      <button
        type="button"
        aria-label={COPY.next}
        onClick={next}
        disabled={atEnd}
        className={STEP_BUTTON}
      >
        <Icon name="passo" size={18} />
      </button>
      <button
        type="button"
        aria-label={COPY.speed(speed)}
        onClick={toggleSpeed}
        className="absolute left-full ml-4 h-10 cursor-pointer rounded-full border-0 bg-[rgba(16,23,43,0.85)] px-4 font-extrabold whitespace-nowrap text-text shadow-[inset_0_0_0_1px_rgba(243,235,221,0.2)] type-meta"
      >
        {speed}×
      </button>
    </div>
  )
}
