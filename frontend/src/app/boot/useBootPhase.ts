import { useEffect, useState } from 'react'

/** Se i dati arrivano prima di così, la schermata di caricamento non compare affatto. */
const SHOW_AFTER_MS = 150
/** Se compare, resta almeno così: niente lampi di mezzo secondo. */
const MIN_VISIBLE_MS = 400

/**
 * Fasi del caricamento iniziale:
 * - `waiting`: i dati non ci sono ancora, ma è troppo presto per mostrare la schermata;
 * - `loading`: si mostra la schermata di caricamento;
 * - `ready`: si mostrano le pagine. Non si torna più indietro, anche se i dati si aggiornano.
 */
export type BootPhase = 'waiting' | 'loading' | 'ready'

/**
 * Decide se e quanto mostrare la schermata di caricamento, per evitare lampi:
 * niente schermata se i dati arrivano in meno di 150 ms; se compare, almeno 400 ms.
 *
 * @param dataReady Vero quando i dati iniziali sono arrivati.
 * @returns La fase corrente.
 */
export function useBootPhase(dataReady: boolean): BootPhase {
  const [done, setDone] = useState(dataReady)
  const [shownAt, setShownAt] = useState<number | null>(null)

  // Troppo lento: si mostra la schermata.
  useEffect(() => {
    if (done || dataReady || shownAt !== null) return
    const timer = window.setTimeout(() => setShownAt(Date.now()), SHOW_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [done, dataReady, shownAt])

  // Dati arrivati: subito se la schermata non è comparsa, altrimenti dopo il tempo minimo.
  useEffect(() => {
    if (done || !dataReady) return
    const remaining = shownAt === null ? 0 : MIN_VISIBLE_MS - (Date.now() - shownAt)
    const timer = window.setTimeout(() => setDone(true), Math.max(0, remaining))
    return () => window.clearTimeout(timer)
  }, [done, dataReady, shownAt])

  if (done) return 'ready'
  return shownAt === null ? 'waiting' : 'loading'
}
