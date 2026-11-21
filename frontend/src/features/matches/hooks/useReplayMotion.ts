import { createContext, useContext, useEffect, type RefObject } from 'react'

/** Lo stato del Racconto che serve ai movimenti. */
export interface ReplayMotionState {
  /** Il momento è arrivato avanzando di un passo: si anima (dopo un salto no). */
  animate: boolean
  /** 1× o 2×. */
  speed: number
  /** Cambia a ogni momento: fa ripartire i movimenti. */
  runKey: number
}

/** Contesto dei movimenti del Rotolo: lo fornisce la pagina, lo leggono i pezzi dell'arena. */
export const ReplayMotionContext = createContext<ReplayMotionState>({
  animate: false,
  speed: 1,
  runKey: 0,
})

/** Lo stato dei movimenti del Racconto. */
export function useReplayMotion(): ReplayMotionState {
  return useContext(ReplayMotionContext)
}

/** Il sistema chiede meno movimento. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Opzioni di un movimento. */
export interface KeyframesOptions {
  /** Se `false` non parte (non è il momento giusto, o il Racconto ha saltato). */
  run: boolean
  /** Attesa e durata in ms a velocità 1×. */
  delay?: number
  duration: number
  easing?: string
  /** `backwards`: nell'attesa si vede il primo fotogramma (es. la stella ancora accesa). */
  fill?: FillMode
}

/**
 * Fa partire un movimento su un elemento a ogni momento del Racconto, con la Web Animations API:
 * riparte senza ricreare l'elemento, segue la velocità e si ferma da solo se il momento cambia.
 * Con "riduci movimento" non parte: resta solo il cambio di stato.
 *
 * @param ref Elemento da muovere.
 * @param keyframes Fotogrammi.
 * @param options Quando e come.
 */
export function useKeyframes(
  ref: RefObject<Element | null>,
  keyframes: Keyframe[],
  { run, delay = 0, duration, easing = 'ease-out', fill = 'none' }: KeyframesOptions,
): void {
  const { animate, speed, runKey } = useReplayMotion()
  const active = run && animate
  // I fotogrammi si confrontano per contenuto: un array nuovo a ogni render non deve ripartire.
  const frames = JSON.stringify(keyframes)

  useEffect(() => {
    const element = ref.current
    if (!active || !element || prefersReducedMotion()) return
    const animation = element.animate(JSON.parse(frames) as Keyframe[], {
      delay: delay / speed,
      duration: duration / speed,
      easing,
      fill,
    })
    return () => animation.cancel()
  }, [ref, active, frames, delay, duration, easing, fill, speed, runKey])
}
