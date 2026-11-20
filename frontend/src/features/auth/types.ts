/** Tipi dell'autenticazione, allineati alle API del backend (`/api/auth`). */

/** Credenziali dell'accesso (`LoginRequest` del backend). */
export interface LoginCredentials {
  email: string
  password: string
}

/** Risposta dell'accesso (`AuthResponse` del backend). */
export interface AuthResponse {
  /** Token JWT da inviare nelle richieste successive. */
  token: string
}

/** Stato passato alla pagina d'accesso: dove tornare dopo l'accesso. */
export interface LoginRedirectState {
  /** Percorso richiesto prima dell'accesso (con la query). */
  from?: string
}

/** Perché l'accesso non è riuscito. */
export type LoginFailure = 'credentials' | 'network' | 'server'
