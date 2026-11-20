import { Constellation } from '@/components/progress/Constellation'
import type { Progress } from '@/domain/game'

/** Proprietà di {@link RewardedChallenges}. */
export interface RewardedChallengesProps {
  progress: Progress
  /** Larghezza della costellazione (92 su desktop, 86 su mobile). */
  width: number
  className?: string
}

/** "Sfide premiate oggi 2 di 5": le prime cinque sfide del giorno danno ricompense. */
export function RewardedChallenges({ progress, width, className = '' }: RewardedChallengesProps) {
  return (
    <p
      className={`flex items-center gap-3 text-text-soft text-shadow-scene type-meta ${className}`}
    >
      <Constellation progress={progress} width={width} />
      <span>
        Sfide premiate oggi{' '}
        <b className="text-text">
          {progress.done} di {progress.total}
        </b>
      </span>
    </p>
  )
}
