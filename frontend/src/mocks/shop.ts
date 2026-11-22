import type { Catalog } from '@/features/cards/queries'
import type { CardDefinition } from '@/features/cards/types'
import type { Tier } from '@/domain/game'
import type {
  OpenedCard,
  PackOpening,
  ShopCatalog,
  ShopPack,
  SlotType,
  StarTier,
} from '@/features/shop/types'

/**
 * Negozio di esempio, finché il backend non ha `/api/shop` (contratto §6). Economia del 12/11
 * (DECISIONS, tela Negozio): Costellazione 5 carte · 100, Zenit 10 · 300 con 4 Stelle e nessuna
 * garanzia, Luna Piena 12 · 600 con un Ascendente garantito e una volta per ciclo lunare.
 * Stella: Rara 60 · Epica 30 · Leggendaria 8 · Ascendente 2; Sole (Leggendaria) garantito entro 10
 * Stelle; niente doppioni di Epiche e Leggendarie finché non le hai tutte. Le carte escono dal
 * catalogo vero; "nuova" o "doppione" si decide sulla collezione vera. Il saldo e le carte uscite
 * restano in questa pagina: in collezione non entrano finché il backend non c'è.
 */

const STAR_ODDS: Record<StarTier, number> = {
  RARE: 0.6,
  EPIC: 0.3,
  LEGENDARY: 0.08,
  ASCENDANT: 0.02,
}
const GLOBAL = ['SUN_WITHIN_10_STARS', 'NO_DUPLICATE_EPIC_LEGENDARY'] as const
const slots = (s: string): SlotType[] =>
  [...s].map(
    (c) => ({ C: 'COMMON', R: 'RARE', E: 'EPIC', A: 'ASCENDANT', S: 'STAR' })[c] as SlotType,
  )

const PACKS: Omit<ShopPack, 'available' | 'unavailableReason' | 'availableAgainAt'>[] = [
  {
    code: 'COSTELLAZIONE',
    name: 'Costellazione',
    role: 'Il pacchetto di tutti i giorni, dal set della Casa I.',
    price: 100,
    cardCount: 5,
    slots: slots('CCCRS'),
    starOdds: STAR_ODDS,
    guarantees: [...GLOBAL],
    limit: null,
  },
  {
    code: 'ZENIT',
    name: 'Zenit',
    role: 'Quattro Stelle: aperture più ricche, dal set base.',
    price: 300,
    cardCount: 10,
    slots: slots('CCCRRRSSSS'),
    starOdds: STAR_ODDS,
    guarantees: [...GLOBAL],
    limit: null,
  },
  {
    code: 'LUNA_PIENA',
    name: 'Luna Piena',
    role: "L'unico pacchetto con un Ascendente garantito.",
    price: 600,
    cardCount: 12,
    slots: slots('CCCCCCRRRESA'),
    starOdds: STAR_ODDS,
    guarantees: [...GLOBAL, 'ASCENDANT'],
    limit: 'ONCE_PER_LUNAR_CYCLE',
  },
]

/** Crediti del riciclo per rarità (regolamento: C 5 · R 10 · E 25 · L 60 · Asc 100). */
const RECYCLE: Record<Tier, number> = {
  COMMON: 5,
  RARE: 10,
  EPIC: 25,
  LEGENDARY: 60,
  ASCENDANT: 100,
}
const LUNAR_CYCLE_DAYS = 29.5

/** Lo stato della sessione di prova: crediti spesi, contatore del Sole, aperture, limiti. */
const state = {
  /** Saldo di partenza, fissato alla prima apertura del Negozio: la barra poi segue gli acquisti. */
  base: null as number | null,
  spent: 0,
  sun: 0,
  lunaOpenedAt: null as number | null,
  nextId: 1,
  openings: new Map<number, PackOpening>(),
}

/**
 * Il Negozio di esempio, con il saldo di partenza del giocatore meno quello speso qui.
 *
 * @param credits Saldo vero del giocatore.
 * @returns Saldo, contatore del Sole e pacchetti con la loro disponibilità.
 */
export function shopCatalogMock(credits: number): ShopCatalog {
  state.base ??= credits
  const balance = Math.max(0, state.base - state.spent)
  return {
    balance,
    sunCounter: { done: state.sun, total: 10 },
    packs: PACKS.map((p) => {
      const limited = p.limit !== null && state.lunaOpenedAt !== null
      const short = balance < p.price
      return {
        ...p,
        available: !limited && !short,
        unavailableReason: limited ? 'LIMIT_REACHED' : short ? 'INSUFFICIENT_CREDITS' : null,
        availableAgainAt: limited
          ? new Date((state.lunaOpenedAt as number) + LUNAR_CYCLE_DAYS * 86_400_000).toISOString()
          : null,
      }
    }),
  }
}

/** La rarità che esce dalla Stella, con la garanzia del Sole. */
function rollStar(): StarTier {
  if (state.sun >= 9) return 'LEGENDARY'
  let r = Math.random()
  for (const tier of ['RARE', 'EPIC', 'LEGENDARY', 'ASCENDANT'] as const) {
    if ((r -= STAR_ODDS[tier]) < 0) return tier
  }
  return 'RARE'
}

/**
 * Apre un pacchetto di esempio: una carta per slot dal catalogo vero.
 *
 * @param code Pacchetto.
 * @param credits Saldo vero del giocatore.
 * @param catalog Catalogo delle carte.
 * @param owned Carte già possedute (per "nuova" o "doppione").
 * @returns L'apertura, come `POST /api/shop/packs/{code}/purchase`.
 */
export function purchaseMock(
  code: string,
  credits: number,
  catalog: Catalog,
  owned: ReadonlySet<number>,
): PackOpening {
  const shop = shopCatalogMock(credits)
  const pack = shop.packs.find((p) => p.code === code)
  if (!pack) throw new Error(`Pacchetto ${code} sconosciuto`)
  if (!pack.available) throw new Error(pack.unavailableReason ?? 'NON_DISPONIBILE')

  const have = new Set(owned)
  let sunFound = false
  const cards: OpenedCard[] = pack.slots.map((slotType, i) => {
    const tier: Tier = slotType === 'STAR' ? rollStar() : slotType
    if (slotType === 'STAR') {
      if (tier === 'LEGENDARY') {
        state.sun = 0
        sunFound = true
      } else state.sun += 1
    }
    const pool = catalog.cards.filter((c: CardDefinition) => c.tier === tier)
    // Niente doppioni di Epiche e Leggendarie finché non le hai tutte
    const fresh = pool.filter((c) => !have.has(c.id))
    const from = (tier === 'EPIC' || tier === 'LEGENDARY') && fresh.length > 0 ? fresh : pool
    const card = from[Math.floor(Math.random() * from.length)]
    const isNew = !have.has(card.id)
    have.add(card.id)
    return { slot: i + 1, slotType, cardId: card.id, isNew, recycleValue: RECYCLE[tier] }
  })

  state.spent += pack.price
  if (pack.limit) state.lunaOpenedAt = Date.now()
  const opening: PackOpening = {
    openingId: state.nextId++,
    packCode: code,
    cards,
    balance: Math.max(0, (state.base ?? credits) - state.spent),
    sunCounter: { done: state.sun, total: 10 },
    sunFound,
  }
  state.openings.set(opening.openingId, opening)
  return opening
}

/**
 * Un'apertura già fatta (`GET /api/shop/openings/{id}`).
 *
 * @param id Apertura.
 * @returns L'apertura, oppure `null` se non c'è (es. dopo aver ricaricato la pagina).
 */
export function openingMock(id: number): PackOpening | null {
  return state.openings.get(id) ?? null
}
