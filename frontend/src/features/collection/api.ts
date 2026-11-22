import { USE_MOCKS } from '@/config/env'
import { request } from '@/lib/http'
import { collectionMock } from '@/mocks/collection'
import { mockResponse } from '@/mocks/mockResponse'
import { toCollection, type CollectionDto } from '@/features/collection/dto'
import type { Collection } from '@/features/collection/types'

/**
 * Le carte del giocatore: `GET /api/collection` (contratto API §4.2).
 * Con i dati di esempio attivi risponde con una collezione di esempio.
 *
 * @param signal Per annullare la richiesta.
 * @returns La collezione.
 */
export async function fetchCollection(signal?: AbortSignal): Promise<Collection> {
  const dto = USE_MOCKS
    ? await mockResponse(collectionMock(), signal)
    : await request<CollectionDto>('/collection', { signal })
  return toCollection(dto)
}
