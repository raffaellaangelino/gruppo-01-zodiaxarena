import { createContext } from 'react'
import type { LoginCredentials } from '@/features/auth/types'

/** Stato e azioni dell'autenticazione, disponibili in tutta l'applicazione. */
export interface AuthContextValue {
  /** Token JWT valido, oppure `null` se il giocatore non ha effettuato l'accesso. */
  token: string | null
  /** Vero se c'è una sessione valida. */
  isAuthenticated: boolean
  /**
   * Accesso: chiama il backend e, se va bene, apre la sessione.
   *
   * @throws {import('@/lib/http').ApiError} Se le credenziali sono errate o il server non risponde.
   */
  login: (credentials: LoginCredentials) => Promise<void>
  /** Uscita: chiude la sessione su questo dispositivo. */
  logout: () => void
}

/** Contesto dell'autenticazione: si usa solo con `useAuth()`. */
export const AuthContext = createContext<AuthContextValue | null>(null)
