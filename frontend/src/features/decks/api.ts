import { shouldUseMocks } from '@/config/env'
import { request } from '@/lib/http'
import { deckMock, saveDeckMock } from '@/mocks/decks'
import { mockResponse } from '@/mocks/mockResponse'
import type { DeckDto } from '@/features/decks/dto'
import type { DeckSlot } from '@/features/decks/types'

/**
 * Un mazzo del giocatore: `GET /api/decks/{id}` (contratto API §5.1, con più mazzi per giocatore).
 * Con i dati di esempio attivi risponde con il Cielo di esempio.
 *
 * @param id Mazzo.
 * @param signal Per annullare la richiesta.
 * @returns Il mazzo come lo manda il backend.
 * @throws {import('@/lib/http').ApiError} 404 se il mazzo non esiste o è di un altro giocatore.
 */
export async function fetchDeck(id: number, signal?: AbortSignal): Promise<DeckDto> {
  if (shouldUseMocks()) return mockResponse(deckMock(id), signal)
  return request<DeckDto>(`/decks/${id}`, { signal })
}

/** Cosa si salva di un Cielo: il nome e la carta di ogni casella (`null` = vuota). */
export interface DeckSaveBody {
  name: string
  slots: Record<DeckSlot, number | null>
}

/**
 * Salva un Cielo: `PUT /api/decks/{id}` (contratto API §5.2). Si può salvare anche incompleto: è
 * una bozza. Il backend rifiuta le carte che il giocatore non possiede.
 *
 * @param id Mazzo.
 * @param body Nome e caselle.
 * @returns Il mazzo salvato, come lo manda il backend.
 * @throws {import('@/lib/http').ApiError} 422 `CARD_NOT_OWNED`, 404 se il mazzo non è suo.
 */
export async function saveDeck(id: number, body: DeckSaveBody): Promise<DeckDto> {
  if (shouldUseMocks()) return mockResponse(saveDeckMock(id, body))
  return request<DeckDto>(`/decks/${id}`, { method: 'PUT', body })
}
