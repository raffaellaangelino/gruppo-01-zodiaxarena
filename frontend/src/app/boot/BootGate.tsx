import { useQueries } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { BootScreen } from '@/app/boot/BootScreen'
import { useBootPhase } from '@/app/boot/useBootPhase'
import { homeSummaryQuery } from '@/features/home/queries'
import { playerSummaryQuery } from '@/features/player/queries'

/**
 * Dati da avere prima di mostrare il gioco: si scaricano in parallelo all'ingresso.
 * Una pagina che ne ha bisogno subito, senza attese, aggiunge qui la sua richiesta.
 */
const BOOT_QUERIES = [playerSummaryQuery, homeSummaryQuery] as const

/** Messaggio se il caricamento iniziale non riesce. */
const BOOT_ERROR = 'Non riusciamo a entrare nel gioco. Controlla la connessione e riprova.'

/** Proprietà di {@link BootGate}. */
export interface BootGateProps {
  children: ReactNode
}

/**
 * Ingresso nel gioco: scarica in parallelo i dati essenziali e mostra le pagine solo quando
 * sono pronti, tutte insieme e con una dissolvenza. Nel frattempo, se serve, la schermata di
 * caricamento. Dopo, i dati restano in memoria: cambiare pagina è istantaneo.
 */
export function BootGate({ children }: BootGateProps) {
  const results = useQueries({ queries: BOOT_QUERIES })
  const ready = results.every((r) => r.isSuccess)
  const failed = results.filter((r) => r.isError)
  const phase = useBootPhase(ready)

  if (failed.length > 0) {
    const retry = () => failed.forEach((r) => void r.refetch())
    return <BootScreen error={{ message: BOOT_ERROR, onRetry: retry }} />
  }
  if (phase === 'waiting') return null
  if (phase === 'loading') return <BootScreen />
  return <div className="animate-enter motion-reduce:animate-none">{children}</div>
}
