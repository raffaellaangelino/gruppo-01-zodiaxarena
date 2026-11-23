import { request } from '@/lib/http'

export type PackSlotType = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'ASCENDANT' | 'STAR'
export type PackGuarantee =
  'SUN_WITHIN_10_STARS' | 'NO_DUPLICATE_EPIC_LEGENDARY' | 'EPIC' | 'LEGENDARY' | 'ASCENDANT'
export type PackUnavailableReason =
  'INSUFFICIENT_CREDITS' | 'NOT_YET_RELEASED' | 'LIMIT_REACHED' | null

export interface ShopPack {
  code: string
  name: string
  role: string
  price: number
  cardCount: number
  slots: PackSlotType[]
  starOdds: Partial<Record<Exclude<PackSlotType, 'COMMON' | 'STAR'>, number>>
  guarantees: PackGuarantee[]
  limit: string | null
  available: boolean
  unavailableReason: PackUnavailableReason
  availableAgainAt: string | null
}

export interface ShopPacksResponse {
  balance: number
  sunCounter: { done: number; total: number }
  packs: ShopPack[]
}

export interface PackOpeningResponse {
  openingId: number
  cards: {
    slot: number
    slotType: PackSlotType
    cardId: number
    isNew: boolean
    recycleValue: number
  }[]
  balance: number
  sunCounter: { done: number; total: number }
  sunFound: boolean
}

/** Elenca i pacchetti attivi e il saldo del giocatore autenticato. */
export function fetchShopPacks(signal?: AbortSignal): Promise<ShopPacksResponse> {
  return request<ShopPacksResponse>('/shop/packs', { signal })
}

/** Acquista e apre un pacchetto; la chiave protegge da addebiti duplicati in caso di retry. */
export function purchasePack(code: string, idempotencyKey: string): Promise<PackOpeningResponse> {
  return request<PackOpeningResponse>(`/shop/packs/${encodeURIComponent(code)}/purchase`, {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
  })
}
