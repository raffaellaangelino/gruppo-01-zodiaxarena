import { useLayoutEffect, useState, type RefObject } from 'react'

/** Misura di un elemento in px. */
export interface ElementSize {
  width: number
  height: number
}

/**
 * Misura un elemento e si aggiorna quando cambia dimensione.
 *
 * Serve agli ornamenti disegnati in SVG (incavi, fili) che devono seguire la larghezza
 * reale dell'elemento, per esempio un pulsante a tutta larghezza.
 *
 * @param ref Riferimento all'elemento da misurare.
 * @returns Larghezza e altezza correnti (0 finché l'elemento non è montato).
 */
export function useElementSize<T extends Element>(ref: RefObject<T | null>): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const update = () => {
      const { width, height } = element.getBoundingClientRect()
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return size
}
