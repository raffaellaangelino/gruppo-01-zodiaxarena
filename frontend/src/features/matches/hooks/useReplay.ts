import { useCallback, useEffect, useState } from 'react'
import type { ReplayStep, StepKind } from '@/features/matches/replay'

/** Velocità del Racconto (tavola Sfide-Rotolo: 1× / 2×). */
export type ReplaySpeed = 1 | 2

/**
 * Quanto resta in scena ogni momento a 1×, in millisecondi: il colpo simultaneo ha più cose da
 * leggere (due colpi, cadute, PV), l'ingresso e il vantaggio meno.
 */
const STEP_MS: Record<StepKind, number> = {
  enter: 1800,
  advantage: 1800,
  clash: 3200,
  end: 0,
}

/** Quello che serve alla pagina per guidare il Racconto. */
export interface ReplayControls {
  index: number
  step: ReplayStep
  playing: boolean
  atStart: boolean
  atEnd: boolean
  speed: ReplaySpeed
  /**
   * Il momento è arrivato avanzando di un passo (da solo o con "successivo"): si anima.
   * Dopo un salto, un passo indietro o la ripartenza lo stato appare subito, senza movimento.
   */
  animate: boolean
  /**
   * La fine è arrivata da sola, con la riproduzione: tra poco si passa al Verdetto. Diventa
   * `false` appena il giocatore tocca un comando (pausa, passi, salti, calcolo, cronaca).
   */
  awaitingVerdict: boolean
  togglePlay: () => void
  /** Mette in pausa; alla fine, resta nel Rotolo invece di passare al Verdetto. */
  pause: () => void
  /** Resta nel Rotolo alla fine (il giocatore sta leggendo), senza toccare la riproduzione. */
  holdEnd: () => void
  previous: () => void
  next: () => void
  seek: (index: number) => void
  toggleSpeed: () => void
}

/** Dentro un campo di testo i tasti restano al campo. */
function isTextField(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  )
}

/** Lo Spazio su un pulsante o un link lo attiva: non va rubato. */
function isActivatable(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && ['BUTTON', 'A'].includes(target.tagName)
}

/**
 * Guida il Racconto: parte da solo, si ferma alla fine; avanti e indietro mettono in pausa
 * (chi va passo passo vuole leggere). Su desktop anche la tastiera: ← → per i passi, Spazio
 * per pausa e ripresa (ux/challenge-replay.md, controlli).
 *
 * @param steps Momenti del Racconto (almeno uno: la fine).
 * @returns Lo stato e i comandi.
 */
export function useReplay(steps: ReplayStep[]): ReplayControls {
  const last = steps.length - 1
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState<ReplaySpeed>(1)
  const [animate, setAnimate] = useState(true)
  const [autoEnd, setAutoEnd] = useState(false)

  const atEnd = index >= last
  const isPlaying = playing && !atEnd
  const kind = steps[index].kind

  useEffect(() => {
    if (!isPlaying) return
    const timer = window.setTimeout(() => {
      setAnimate(true)
      if (index + 1 >= last) setAutoEnd(true)
      setIndex(Math.min(index + 1, last))
    }, STEP_MS[kind] / speed)
    return () => window.clearTimeout(timer)
  }, [isPlaying, index, kind, speed, last])

  const seek = useCallback(
    (to: number) => {
      setPlaying(false)
      setAnimate(false)
      setAutoEnd(false)
      setIndex(Math.max(0, Math.min(to, last)))
    },
    [last],
  )
  const previous = useCallback(() => seek(index - 1), [seek, index])
  const next = useCallback(() => {
    if (index >= last) return
    setPlaying(false)
    setAnimate(true)
    setAutoEnd(false)
    setIndex(index + 1)
  }, [index, last])
  const togglePlay = useCallback(() => {
    // In attesa del Verdetto, il comando principale è "resta qui".
    if (atEnd && autoEnd) {
      setAutoEnd(false)
      return
    }
    // Alla fine, "riproduci" riparte dall'inizio.
    if (atEnd) {
      setAnimate(false)
      setIndex(0)
    }
    setPlaying((p) => (atEnd ? true : !p))
  }, [atEnd, autoEnd])
  const pause = useCallback(() => {
    setPlaying(false)
    setAutoEnd(false)
  }, [])
  const holdEnd = useCallback(() => setAutoEnd(false), [])
  const toggleSpeed = useCallback(() => setSpeed((s) => (s === 1 ? 2 : 1)), [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || isTextField(event.target)) return
      if (event.key === 'ArrowLeft') previous()
      else if (event.key === 'ArrowRight') next()
      else if (event.key === ' ' && !isActivatable(event.target)) togglePlay()
      else return
      event.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [previous, next, togglePlay])

  return {
    index,
    step: steps[index],
    playing: isPlaying,
    atStart: index === 0,
    atEnd,
    speed,
    animate,
    awaitingVerdict: atEnd && autoEnd,
    togglePlay,
    pause,
    holdEnd,
    previous,
    next,
    seek,
    toggleSpeed,
  }
}
