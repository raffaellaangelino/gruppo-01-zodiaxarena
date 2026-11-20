import { useLayoutEffect, useState } from 'react'

/** Misura di un elemento in px. */
export interface ElementSize {
  width: number
  height: number
}

/**
 * Misura un elemento e si aggiorna quando cambia dimensione.
 *
 * Serve agli ornamenti disegnati in SVG (incavi, fili) che devono seguire la misura reale
 * dell'elemento, per esempio un pulsante a tutta larghezza.
 *
 * Riceve l'elemento, non un `ref`: chi lo usa salva l'elemento nello stato con un ref a funzione
 * (`ref={setElement}`). Così la misura parte quando l'elemento esiste davvero, in qualunque
 * ordine React colleghi i riferimenti e gli effetti.
 *
 * @param element Elemento da misurare, oppure `null` finché non è montato.
 * @returns Larghezza e altezza correnti (0 finché l'elemento non c'è).
 */
export function useElementSize(element: Element | null): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!element) return
    const update = () => {
      const { width, height } = element.getBoundingClientRect()
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])

  return size
}
