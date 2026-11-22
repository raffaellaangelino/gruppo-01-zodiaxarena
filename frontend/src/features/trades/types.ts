import type { CardDefinition } from '@/features/cards/types'
import type { PlayerRef } from '@/domain/game'

export type TradeStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'WITHDRAWN'
export type TradeDirection = 'RECEIVED' | 'SENT'

export interface Trade {
  id: number
  direction: TradeDirection
  status: TradeStatus
  player: PlayerRef
  offeredCardIds: number[]
  requestedCardIds: number[]
  createdAt: string
  expiresAt: string | null
}

export interface TradeCardSide {
  cards: CardDefinition[]
  quantities: number[]
}
