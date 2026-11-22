import type { Progress } from '@/domain/game'

/** Tipo di uno slot del pacchetto (contratto §6.1): rarità fissa, oppure la Stella. */
export type SlotType = 'COMMON' | 'RARE' | 'EPIC' | 'ASCENDANT' | 'STAR'

/** Cosa può uscire dalla Stella. */
export type StarTier = 'RARE' | 'EPIC' | 'LEGENDARY' | 'ASCENDANT'

/** Garanzie di un pacchetto. */
export type PackGuarantee = 'SUN_WITHIN_10_STARS' | 'NO_DUPLICATE_EPIC_LEGENDARY' | 'ASCENDANT'

/** Perché un pacchetto non si può aprire adesso. */
export type PackUnavailableReason = 'INSUFFICIENT_CREDITS' | 'LIMIT_REACHED' | 'NOT_YET_RELEASED'

/** Un pacchetto in vendita (`GET /api/shop/packs`, contratto §6.1). Niente è scritto nel frontend. */
export interface ShopPack {
  code: string
  name: string
  /** Il suo ruolo in una riga ("Il pacchetto di tutti i giorni"). */
  role: string
  price: number
  cardCount: number
  /** La struttura fissa, uno slot per carta, nell'ordine dell'apertura. */
  slots: SlotType[]
  starOdds: Record<StarTier, number>
  guarantees: PackGuarantee[]
  limit: 'ONCE_PER_LUNAR_CYCLE' | null
  available: boolean
  unavailableReason: PackUnavailableReason | null
  availableAgainAt: string | null
}

/** Il Negozio: saldo, contatore del Sole e pacchetti. */
export interface ShopCatalog {
  balance: number
  /** Stelle aperte senza una Leggendaria, su quante la garantiscono. */
  sunCounter: Progress
  packs: ShopPack[]
}

/** Una carta uscita dal pacchetto (contratto §6.2). */
export interface OpenedCard {
  slot: number
  slotType: SlotType
  cardId: number
  /** Nuova per il giocatore, oppure un doppione. */
  isNew: boolean
  /** Crediti se la ricicla (per i doppioni). */
  recycleValue: number
}

/** Un pacchetto aperto: le carte sono del giocatore dal momento dell'acquisto. */
export interface PackOpening {
  openingId: number
  packCode: string
  cards: OpenedCard[]
  balance: number
  sunCounter: Progress
  /** È uscita una Leggendaria: il contatore del Sole riparte. */
  sunFound: boolean
}
