import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '@/features/matches/hooks/useReplayMotion'

/** Come si muove il numero: conta fino al valore, oppure gira a caso e si ferma (dado). */
export type AnimatedMode = 'count' | 'roll'

/** Opzioni di {@link useAnimatedValue}. */
export interface AnimatedValueOptions {
  /** Valore finale, quello dell'engine. */
  to: number
  /** Da dove parte il conteggio (modo `count`). */
  from?: number
  /** Valori possibili mentre gira (modo `roll`). */
  min?: number
  max?: number
  mode: AnimatedMode
  /** Attesa prima di partire e durata, in ms a velocità 1×. */
  delay: number
  duration: number
  /** Velocità del Racconto: a 2× tutto dura la metà. */
  speed: number
  /** Se `false` (salto, passo indietro) il valore è subito quello finale. */
  active: boolean
  /** Cambia a ogni momento: fa ripartire il movimento. */
  runKey: number
}

/** Ogni quanto cambia la faccia del dado mentre gira, in ms. */
const ROLL_TICK = 60

/**
 * Un numero che si muove verso il valore dell'engine: la DEF che scende dopo il colpo, il dado
 * d'Aria che gira e si ferma. Il valore finale è sempre quello vero; il movimento è solo
 * presentazione e non parte con "riduci movimento", dopo un salto o un passo indietro.
 *
 * @returns Il numero da mostrare adesso.
 */
export function useAnimatedValue({
  to,
  from,
  min = 0,
  max = 0,
  mode,
  delay,
  duration,
  speed,
  active,
  runKey,
}: AnimatedValueOptions): number {
  const start = mode === 'count' ? (from ?? to) : to
  const animated = active && !prefersReducedMotion() && (mode === 'roll' || start !== to)
  const [shown, setShown] = useState<{ key: number; value: number } | null>(null)

  useEffect(() => {
    if (!animated) return
    let frame = 0
    let tick = 0
    const begin = performance.now() + delay / speed
    const total = duration / speed
    const step = (now: number) => {
      const t = (now - begin) / total
      if (t >= 1) {
        setShown({ key: runKey, value: to })
        return
      }
      if (t >= 0) {
        if (mode === 'count') {
          setShown({ key: runKey, value: Math.round(start + (to - start) * t) })
        } else if (now - tick >= ROLL_TICK) {
          tick = now
          setShown({ key: runKey, value: min + Math.floor(Math.random() * (max - min + 1)) })
        }
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [animated, runKey, to, start, mode, min, max, delay, duration, speed])

  if (!animated) return to
  // Prima che parta (nell'attesa) si vede il valore di partenza.
  return shown?.key === runKey ? shown.value : start
}
