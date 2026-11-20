/**
 * Lettura del token JWT lato client.
 *
 * Il client non verifica la firma (lo fa il backend a ogni richiesta): legge solo la
 * scadenza, per non usare un token già scaduto e per chiudere la sessione al momento giusto.
 */

/**
 * Restituisce la scadenza del token in millisecondi dall'epoca Unix.
 *
 * @param token Token JWT (tre parti separate da punti).
 * @returns La scadenza (`exp` × 1000), oppure `null` se il token non è leggibile o non ha `exp`.
 */
export function getJwtExpiry(token: string): number | null {
  const payload = token.split('.')[1]
  if (!payload) return null
  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))) as {
      exp?: unknown
    }
    return typeof json.exp === 'number' ? json.exp * 1000 : null
  } catch {
    return null
  }
}

/**
 * Dice se il token è ancora valido in questo momento.
 *
 * @param token Token JWT.
 * @param now Istante di riferimento in millisecondi (predefinito: adesso).
 * @returns Vero se il token ha una scadenza leggibile e non ancora passata.
 */
export function isJwtValid(token: string, now: number = Date.now()): boolean {
  const expiry = getJwtExpiry(token)
  return expiry !== null && expiry > now
}
