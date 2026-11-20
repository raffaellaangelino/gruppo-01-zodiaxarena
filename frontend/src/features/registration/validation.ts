import { isEmail } from '@/lib/validation'
import type { BirthDateValues } from '@/features/registration/types'

/**
 * Regole dei campi della registrazione, controllate nel browser prima di chiamare il backend.
 * Sono le stesse del backend (`RegisterRequestDto`), più quella della tavola sulla password
 * (una lettera e un numero), che il backend non controlla.
 */

/** Nickname: da 3 a 16 tra lettere, numeri e trattino basso (come il backend). */
const NICKNAME_PATTERN = /^[A-Za-z0-9_]{3,16}$/

/** Lunghezza della password accettata dal backend. */
export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 72

/**
 * @param nickname Nickname scritto.
 * @returns Vero se ha il formato giusto (spazi ai lati esclusi).
 */
export function isNicknameFormatValid(nickname: string): boolean {
  return NICKNAME_PATTERN.test(nickname.trim())
}

/**
 * @param email Email scritta.
 * @returns Vero se ha la forma di un'email.
 */
export function isEmailValid(email: string): boolean {
  return isEmail(email)
}

/** Cosa manca a una password per essere accettata. */
export interface PasswordCheck {
  tooShort: boolean
  tooLong: boolean
  missingLetter: boolean
  missingNumber: boolean
}

/**
 * @param password Password scritta.
 * @returns Le regole non rispettate; tutte false se la password va bene.
 */
export function checkPassword(password: string): PasswordCheck {
  return {
    tooShort: password.length < PASSWORD_MIN,
    tooLong: password.length > PASSWORD_MAX,
    missingLetter: !/\p{L}/u.test(password),
    missingNumber: !/\d/.test(password),
  }
}

/**
 * @param check Risultato di {@link checkPassword}.
 * @returns Vero se la password rispetta tutte le regole.
 */
export function isPasswordValid(check: PasswordCheck): boolean {
  return !check.tooShort && !check.tooLong && !check.missingLetter && !check.missingNumber
}

/**
 * Giorni di un mese (con l'anno, per il 29 febbraio).
 *
 * @param month Mese da 1 a 12.
 * @param year Anno; se manca si conta un anno bisestile, così il 29 febbraio si può scegliere.
 * @returns Il numero di giorni.
 */
export function daysInMonth(month: number, year?: number): number {
  return new Date(Date.UTC(year ?? 2000, month, 0)).getUTCDate()
}

/** Perché una data di nascita non va bene. */
export type BirthDateProblem = 'incomplete' | 'future'

/**
 * Controlla la data di nascita e la scrive come la vuole il backend.
 *
 * @param values Giorno, mese e anno scelti.
 * @param today Oggi (si passa nei test; di norma la data corrente).
 * @returns La data `AAAA-MM-GG`, oppure il motivo per cui non va bene.
 */
export function toBirthDate(
  values: BirthDateValues,
  today: Date = new Date(),
): { date: string } | { problem: BirthDateProblem } {
  if (!values.day || !values.month || !values.year) return { problem: 'incomplete' }
  const day = Number(values.day)
  const month = Number(values.month)
  const year = Number(values.year)
  if (day > daysInMonth(month, year)) return { problem: 'incomplete' }
  const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const todayIso = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')
  if (date >= todayIso) return { problem: 'future' }
  return { date }
}
