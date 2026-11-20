import { useSyncExternalStore } from 'react'

/**
 * Dice se una media query è vera, e si aggiorna quando cambia (es. ridimensionando la finestra).
 * Serve quando la differenza tra desktop e mobile non è solo di stile ma di contenuto
 * (testi più brevi, componenti diversi), così non si disegna tutto due volte.
 *
 * @param query Media query CSS (usare quelle di `config/breakpoints.ts`).
 * @returns Vero se la media query è soddisfatta.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
  )
}
