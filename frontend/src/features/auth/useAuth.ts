import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from '@/features/auth/AuthContext'

/**
 * Stato e azioni dell'autenticazione.
 *
 * @returns Token, stato della sessione, `login` e `logout`.
 * @throws {Error} Se usato fuori da `AuthProvider`.
 */
export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth va usato dentro AuthProvider')
  return value
}
