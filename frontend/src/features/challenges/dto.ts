import type { Challenge, ChallengeCancelReason, ChallengeStatus } from '@/features/challenges/types'

/**
 * Forme del backend per le sfide (`ChallengeItemDto`, `ChallengeListResponseDto`,
 * `PlayerReferenceDto`). Le pagine usano solo {@link toChallenge}.
 */

/** Un altro giocatore come lo manda il backend: per ora solo id e nickname. */
export interface PlayerReferenceDto {
  id: number
  nickname: string
}

/** Una sfida come la manda il backend (`GET /api/challenges/me`). */
export interface ChallengeItemDto {
  id: number
  status: ChallengeStatus
  direction: 'RECEIVED' | 'SENT'
  opponent: PlayerReferenceDto
  /** Data e ora senza fuso orario. */
  createdAt: string
  expiresAt: string | null
  /** Sempre `false` nel SAL: i premi arrivano dopo. */
  rewarded: boolean
  matchId: number | null
  cancelReason: ChallengeCancelReason | null
}

/** Risposta di `GET /api/challenges/me?box=…`. */
export interface ChallengeListDto {
  items: ChallengeItemDto[]
}

/**
 * Traduce una sfida del backend nella forma dell'interfaccia. Il backend non manda ancora la
 * Fazione dell'avversario né se l'hai già affrontato: finché non arrivano, l'avversario ha
 * l'iniziale (come prima di una partita, D-014).
 *
 * @param dto Sfida come la manda il backend.
 * @returns La sfida.
 */
export function toChallenge(dto: ChallengeItemDto): Challenge {
  return {
    id: dto.id,
    status: dto.status,
    direction: dto.direction,
    opponent: { id: dto.opponent.id, nickname: dto.opponent.nickname, faction: null, faced: false },
    createdAt: dto.createdAt,
    expiresAt: dto.expiresAt,
    matchId: dto.matchId,
    cancelReason: dto.cancelReason,
  }
}
