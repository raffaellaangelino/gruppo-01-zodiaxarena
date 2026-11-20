/** Strumenti di validazione lato client, comuni a tutti i moduli. */

/** Errori di validazione per campo: solo i campi non validi hanno un messaggio. */
export type FieldErrors<T> = Partial<Record<keyof T, string>>

/** Forma minima di un'email: qualcosa, @, dominio con un punto. Il controllo vero lo fa il backend. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Dice se il testo ha la forma di un'email.
 *
 * @param value Testo scritto dal giocatore.
 * @returns Vero se è un'email plausibile.
 */
export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

/**
 * Dice se un modulo non ha errori.
 *
 * @param errors Errori restituiti da una funzione di validazione.
 * @returns Vero se nessun campo ha un messaggio.
 */
export function hasNoErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length === 0
}
