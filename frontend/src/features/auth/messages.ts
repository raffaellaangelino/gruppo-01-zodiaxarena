import type { LoginFailure } from '@/features/auth/types'

/**
 * Testi degli errori dell'accesso: dicono cosa è successo e cosa fare.
 * L'errore delle credenziali è volutamente generico (non dice quale dei due è sbagliato).
 */
export const LOGIN_FAILURE_MESSAGES: Record<LoginFailure, string> = {
  credentials: 'Email o password non corretti. Riprova.',
  network: 'Non riusciamo a raggiungere il server. Controlla la connessione e riprova.',
  server: 'Qualcosa non ha funzionato da parte nostra. Riprova tra poco.',
}
