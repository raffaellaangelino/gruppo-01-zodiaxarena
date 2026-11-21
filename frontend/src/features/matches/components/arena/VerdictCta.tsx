import { useRef } from 'react'
import { GoldLink } from '@/components/ui/GoldButton'
import { useKeyframes } from '@/features/matches/hooks/useReplayMotion'
import { MATCH_COPY } from '@/features/matches/messages'
import { EASE_OUT, MOTION } from '@/features/matches/motion'

/** Proprietà di {@link VerdictCta}. */
export interface VerdictCtaProps {
  to: string
  /** Posizione e visibilità (desktop dentro il sigillo, mobile su una riga sua). */
  className?: string
}

/**
 * "Vai al Verdetto" a fine Racconto: compare dopo che Atropo ha tagliato il filo, salendo
 * appena. Il passaggio lo sceglie il giocatore. Dopo un salto alla fine è subito lì.
 */
export function VerdictCta({ to, className = '' }: VerdictCtaProps) {
  const ref = useRef<HTMLSpanElement>(null)
  useKeyframes(
    ref,
    [
      { opacity: 0, transform: 'translateY(0.5rem)' },
      { opacity: 1, transform: 'none' },
    ],
    {
      run: true,
      delay: MOTION.end.ctaDelay,
      duration: MOTION.end.cta,
      easing: EASE_OUT,
      fill: 'backwards',
    },
  )
  return (
    <span ref={ref} className={className}>
      <GoldLink hero size="l" to={to} className="w-72">
        {MATCH_COPY.toVerdict}
      </GoldLink>
    </span>
  )
}
