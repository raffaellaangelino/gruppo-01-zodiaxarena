import type { Element, GodCode, SignCode } from '@/domain/game'
import type { PlayerDto } from '@/features/player/dto'

/**
 * Tipi della registrazione. Le forme `*Dto` sono quelle del backend (`/api/auth`),
 * le altre sono quelle usate dall'interfaccia.
 */

/** Corpo di `POST /api/auth/register` (`RegisterRequestDto`). */
export interface RegisterRequestDto {
  email: string
  password: string
  nickName: string
  /** Data di nascita `AAAA-MM-GG`: serve solo a calcolare il segno, il backend non la salva. */
  birthDate: string
  acceptedTerms: boolean
  ageConfirmed: boolean
}

/** Risposta di `POST /api/auth/register` (201). */
export interface RegisterResponseDto {
  token: string
  player: PlayerDto
  proposedFaction: GodCode
}

/** Risposta di `POST /api/auth/register/preview`. */
export interface RegistrationPreviewDto {
  /** Nome del segno in italiano (es. `"Leone"`). */
  sunSign: string
  element: Element
  proposedFaction: GodCode
  welcomeCounts: { credits: number; creatureCards: number; ascendants: number }
}

/** Risposta di `GET /api/auth/nickname-available`. */
export interface NicknameAvailabilityDto {
  available: boolean
  code: 'INVALID_FORMAT' | 'TAKEN' | null
}

/** Cosa riceve il giocatore dal suo giorno di nascita (scena del passo "Il tuo segno"). */
export interface RegistrationPreview {
  sign: SignCode
  element: Element
  /** Fazione proposta dal segno; la sceglierà dopo, al primo passo con Ermes. */
  proposedGod: GodCode
  credits: number
  /** Creature del primo cielo (7, una per pianeta). */
  creatureCards: number
  /**
   * Ascendenti regalati con il primo cielo (oggi 1, a caso, nel mazzo iniziale). La regola è
   * ancora aperta (Q-01): si mostra quello che manda il backend.
   */
  ascendants: number
}

/** I tre passi della registrazione (tavole Registrati, Registrati-Segno, Registrati-Conferma). */
export type RegistrationStep = 'account' | 'sign' | 'confirm'

/** Campi del passo "Account". */
export interface AccountValues {
  nickname: string
  email: string
  password: string
}

/** Data di nascita come la sceglie il giocatore: giorno, mese (1–12) e anno, vuoti finché non li sceglie. */
export interface BirthDateValues {
  day: string
  month: string
  year: string
}

/** Esito del controllo del nickname mentre lo si scrive. */
export type NicknameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'unknown'

/** Errori che arrivano dal backend all'invio, uno per campo. */
export type ServerFieldError =
  | 'nicknameTaken'
  | 'emailTaken'
  | 'nicknameInvalid'
  | 'emailInvalid'
  | 'passwordInvalid'
  | 'birthDateInvalid'
  | 'consentMissing'

/** Perché la registrazione non è riuscita, quando non dipende da un campo. */
export type RegistrationFailure = 'network' | 'server'
