import { shouldUseMocks } from '@/config/env'
import { request } from '@/lib/http'
import { catalogMock } from '@/mocks/catalog'
import { mockResponse } from '@/mocks/mockResponse'
import { toCardDefinition, type CardDefinitionDto } from '@/features/cards/dto'
import type { CardDefinition } from '@/features/cards/types'

/**
 * Catalogo di tutte le carte del gioco: `GET /api/cards` (contratto API §4.1).
 * Con i dati di esempio attivi risponde con il catalogo di esempio, uguale a quello vero.
 *
 * @param signal Per annullare la richiesta.
 * @returns Le 96 carte (84 Creature e 12 Ascendenti).
 */
export async function fetchCatalog(signal?: AbortSignal): Promise<CardDefinition[]> {
  const dtos = shouldUseMocks()
    ? await mockResponse(catalogMock(), signal)
    : await request<CardDefinitionDto[]>('/cards', { signal })
  return dtos.map(toCardDefinition)
}
