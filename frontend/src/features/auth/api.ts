import { request } from '@/lib/http'
import type { AuthResponse, LoginCredentials } from '@/features/auth/types'

/**
 * Accesso con email e password.
 *
 * @param credentials Email e password.
 * @param signal Per annullare la richiesta.
 * @returns Il token JWT.
 * @throws {import('@/lib/http').ApiError} 401 se le credenziali sono errate, 0 se il server non risponde.
 */
export async function loginRequest(
  credentials: LoginCredentials,
  signal?: AbortSignal,
): Promise<string> {
  const { token } = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
    token: null,
    signal,
  })
  return token
}
