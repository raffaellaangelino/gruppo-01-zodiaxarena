import type { FactionFailure } from '@/features/onboarding/hooks/useChooseFaction'

/** Errori della scelta della Fazione: dicono cosa è successo e cosa fare. */
export const FACTION_FAILURE_MESSAGES: Record<FactionFailure, string> = {
  network: 'Non riusciamo a raggiungere il server. Controlla la connessione e riprova.',
  server: 'Non siamo riusciti a salvare la tua scelta. Riprova tra poco.',
}
