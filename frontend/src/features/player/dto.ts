import type { Element, GodCode } from '@/domain/game'
import { GOD_ELEMENT, toSignCode } from '@/domain/rules'
import type { OnboardingStep, PlayerSummary } from '@/features/player/types'

/**
 * Forme del backend per il giocatore (`PlayerResponseDto`, `SignResponseDto`), così come
 * arrivano. Le pagine non le usano mai: passano da {@link toPlayerSummary}, così un nome
 * cambiato nel backend si corregge solo qui.
 */

/** Segno come lo manda il backend. */
export interface SignDto {
  id: number
  /** Nome in italiano (es. `"Leone"`). */
  name: string
  type: Element
  atk: number
  def: number
}

/** Giocatore come lo manda il backend (`GET /api/players/me`, registrazione, scelta della Fazione). */
export interface PlayerDto {
  id: number
  appUserId: number | null
  nickName: string
  credits: number
  god: GodCode | null
  /** Data e ora dell'ultimo cambio di Fazione, senza fuso orario. */
  lastGodChange: string | null
  pityCounter: number
  sunSign: SignDto | null
  cardCount: number
  deckIds: number[]
  onboarding: { completed: boolean; currentStep: OnboardingStep | null }
}

/**
 * Traduce il giocatore del backend nel riepilogo usato dall'interfaccia.
 *
 * Il backend non ha ancora notifiche, sfide, scambi e Rotoli in attesa (contratto API §3.1):
 * finché non arrivano valgono zero, e la barra non mostra contatori.
 *
 * @param dto Giocatore come lo manda il backend.
 * @returns Il riepilogo del giocatore.
 * @throws {Error} Se il segno del giocatore manca o non è conosciuto: senza segno il giocatore
 *   non è completo, ed è meglio fermarsi che mostrare dati sbagliati.
 */
export function toPlayerSummary(dto: PlayerDto): PlayerSummary {
  const sign = dto.sunSign ? toSignCode(dto.sunSign.name) : null
  if (!sign) throw new Error(`Segno del giocatore non valido: ${dto.sunSign?.name ?? 'assente'}`)
  return {
    id: dto.id,
    nickname: dto.nickName,
    sign,
    credits: dto.credits,
    faction: dto.god ? { god: dto.god, element: GOD_ELEMENT[dto.god] } : null,
    deckIds: dto.deckIds,
    unreadNotifications: 0,
    pending: { challenges: 0, trades: 0, replays: 0 },
    onboarding: dto.onboarding,
  }
}
