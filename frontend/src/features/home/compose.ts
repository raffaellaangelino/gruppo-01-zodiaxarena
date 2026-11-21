import type { Catalog } from '@/features/cards/queries'
import { cardThumb } from '@/features/cards/thumb'
import type { Challenge } from '@/features/challenges/types'
import type { DeckDto } from '@/features/decks/dto'
import { skyWarnings } from '@/features/decks/sky'
import { toDeck } from '@/features/decks/dto'
import type { HomeSummary, WaitingItem } from '@/features/home/types'

/**
 * La Home composta dalle API che il backend ha già, finché manca `GET /api/home` (contratto §3.2):
 *
 * - "Ti aspettano": le sfide ricevute in attesa e le partite giocate da guardare (`/challenges/me`,
 *   come la pagina Sfide · Da giocare). Gli scambi arrivano con il loro endpoint.
 * - Il tuo Cielo: il primo mazzo (`/decks/{id}`), valido se lo è per il backend e per gli avvisi
 *   in anteprima del Cielo (le regole V1–V8 del backend sono ancora spente), come nella sua pagina.
 * - Sfide premiate, missioni, pacchetti e luna piena non hanno ancora una fonte: `null`, e la Home
 *   non li mostra.
 *
 * @param toPlay Sfide da giocare (ricevute in attesa e giocate non ancora viste).
 * @param deck Il primo mazzo del giocatore, oppure `null`.
 * @param catalog Catalogo delle carte.
 * @returns I dati della Home.
 */
export function composeHome(
  toPlay: Challenge[],
  deck: DeckDto | null,
  catalog: Catalog,
): HomeSummary {
  const waiting: WaitingItem[] = [
    ...toPlay
      .filter((c) => c.status === 'PENDING')
      .map((c): WaitingItem => ({
        kind: 'CHALLENGE_RECEIVED',
        id: c.id,
        from: c.opponent,
        receivedAt: c.createdAt,
      })),
    ...toPlay
      .filter((c) => c.status === 'PLAYED' && c.matchId !== null)
      .map((c): WaitingItem => ({
        kind: 'REPLAY_UNSEEN',
        id: c.matchId as number,
        opponent: c.opponent,
      })),
  ]
  return {
    rewardedChallenges: null,
    waiting,
    deck: deck && {
      name: deck.name,
      valid: deck.valid && skyWarnings(deck.slots, catalog).length === 0,
      cards: toDeck(deck, catalog).cards.map(cardThumb),
    },
    missions: null,
    packs: null,
    fullMoon: null,
  }
}
