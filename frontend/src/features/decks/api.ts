import { USE_MOCKS } from '@/config/env'
import { request } from '@/lib/http'
import { deckMock } from '@/mocks/decks'
import { mockResponse } from '@/mocks/mockResponse'
import type { DeckDto } from '@/features/decks/dto'

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
  if (USE_MOCKS) return mockResponse(deckMock(id), signal)
  return request<DeckDto>(`/decks/${id}`, { signal })
}
