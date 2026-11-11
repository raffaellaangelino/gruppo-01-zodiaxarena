import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setUnauthorizedHandler } from '@/lib/http'
import { getJwtExpiry, isJwtValid } from '@/lib/jwt'
import { loginRequest } from '@/features/auth/api'
import { AuthContext, type AuthContextValue } from '@/features/auth/AuthContext'
import {
  clearToken,
  onTokenChangedElsewhere,
  readToken,
  saveToken,
} from '@/features/auth/tokenStorage'
import type { LoginCredentials } from '@/features/auth/types'

/** Ritardo massimo di `setTimeout` (circa 24 giorni): oltre, il timer scatterebbe subito. */
const MAX_TIMEOUT_MS = 2 ** 31 - 1

/** Token salvato solo se ancora valido; uno scaduto viene cancellato. */
function readValidToken(): string | null {
  const saved = readToken()
  if (saved && isJwtValid(saved)) return saved
  if (saved) clearToken()
  return null
}

/** Proprietà di {@link AuthProvider}. */
export interface AuthProviderProps {
  children: ReactNode
}

/**
 * Gestisce la sessione del giocatore per tutta l'applicazione.
 *
 * - All'avvio riprende il token salvato, se non è scaduto.
 * - Chiude la sessione quando il token scade, quando il backend risponde 401 a una richiesta
 *   autenticata e quando si esce da un'altra scheda.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(readValidToken)

  const logout = useCallback(() => {
    clearToken()
    setToken(null)
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const newToken = await loginRequest(credentials)
    saveToken(newToken)
    setToken(newToken)
  }, [])

  // Il client HTTP avvisa qui quando il backend rifiuta il token.
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  // Uscita alla scadenza del token.
  useEffect(() => {
    if (!token) return
    const expiry = getJwtExpiry(token)
    if (expiry === null) return
    const delay = expiry - Date.now()
    if (delay > MAX_TIMEOUT_MS) return
    const timer = window.setTimeout(logout, Math.max(0, delay))
    return () => window.clearTimeout(timer)
  }, [token, logout])

  // Accesso o uscita in un'altra scheda.
  useEffect(
    () =>
      onTokenChangedElsewhere((newToken) =>
        setToken(newToken && isJwtValid(newToken) ? newToken : null),
      ),
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ token, isAuthenticated: token !== null, login, logout }),
    [token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
