import { useEffect, useRef } from 'react'
import { GoldLink } from '@/components/ui/GoldButton'
import { useKeyframes, useReplayMotion } from '@/features/matches/hooks/useReplayMotion'
import { MATCH_COPY } from '@/features/matches/messages'
import { EASE_OUT, MOTION } from '@/features/matches/motion'

/** Proprietà di {@link VerdictCta}. */
export interface VerdictCtaProps {
  to: string
  /** Si sta per passare da soli al Verdetto: il filo sul pulsante si riempie fino al passaggio. */
  countdown: boolean
  /** Posizione e visibilità (desktop dentro il sigillo, mobile su una riga sua). */
  className?: string
}

/**
 * "Vai al Verdetto" a fine Racconto: compare dopo che Atropo ha tagliato il filo, salendo appena.
 * Se la partita è arrivata alla fine da sola, un filo si riempie sul pulsante fino al passaggio
 * automatico: si vede che sta per succedere e si può fermare con Pausa. Il passaggio sostituisce
 * il Rotolo nella cronologia, così "indietro" dal Verdetto porta alle Sfide.
 */
export function VerdictCta({ to, countdown, className = '' }: VerdictCtaProps) {
  const { speed } = useReplayMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const threadRef = useRef<HTMLSpanElement>(null)
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

  // Il filo dell'attesa è un'indicazione di tempo, non un movimento decorativo: c'è sempre,
  // anche con "riduci movimento", perché il passaggio automatico non sia una sorpresa.
  useEffect(() => {
    const thread = threadRef.current
    if (!countdown || !thread) return
    const start = MOTION.end.ctaDelay + MOTION.end.cta
    const animation = thread.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      delay: start / speed,
      duration: (MOTION.end.autoVerdict - start) / speed,
      easing: 'linear',
      fill: 'both',
    })
    return () => animation.cancel()
  }, [countdown, speed])

  return (
    <span ref={ref} className={`relative ${className}`}>
      <GoldLink hero size="l" to={to} replace className="w-72">
        {MATCH_COPY.toVerdict}
      </GoldLink>
      {countdown && (
        <>
          <span
            ref={threadRef}
            aria-hidden="true"
            // Parte vuoto: la scala la riempie l'animazione (sul `transform`, non sulla proprietà `scale`)
            style={{ transform: 'scaleX(0)' }}
            className="pointer-events-none absolute inset-x-6 bottom-2 h-0.5 origin-left rounded-full bg-text-on-gold/55"
          />
          <output className="sr-only">{MATCH_COPY.arena.verdictSoon}</output>
        </>
      )}
    </span>
  )
}
