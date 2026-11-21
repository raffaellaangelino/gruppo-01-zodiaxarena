import { useEffect, useState } from 'react'

/**
 * Restituisce il valore solo quando smette di cambiare per un po': per esempio, per chiedere
 * al server se un nickname è libero solo quando il giocatore smette di scrivere.
 *
 * @param value Valore che cambia (es. il testo di un campo).
 * @param delayMs Pausa necessaria, in millisecondi.
 * @returns L'ultimo valore rimasto fermo per `delayMs`.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [settled, setSettled] = useState(value)
  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(value), delayMs)
    return () => window.clearTimeout(timer)
  }, [value, delayMs])
  return settled
}
