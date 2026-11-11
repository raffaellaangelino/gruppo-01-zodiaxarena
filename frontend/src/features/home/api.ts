import { USE_MOCKS } from '@/config/env'
import { apiNotAvailable } from '@/lib/http'
import { homeSummaryMock } from '@/mocks/home'
import { mockResponse } from '@/mocks/mockResponse'
import type { HomeSummary } from '@/features/home/types'

/**
 * Dati della Home: sfide premiate, "Ti aspettano", Cielo attivo, missioni, pacchetti, luna piena.
 *
 * Il backend non ha ancora questi endpoint: con i dati di esempio attivi risponde con quelli.
 * Quando arrivano, qui si sostituisce `apiNotAvailable` con una o più `request()`.
 *
 * @param signal Per annullare la richiesta.
 * @returns Il riepilogo della Home.
 */
export async function fetchHomeSummary(signal?: AbortSignal): Promise<HomeSummary> {
  if (USE_MOCKS) return mockResponse(homeSummaryMock, signal)
  return apiNotAvailable('riepilogo della Home')
}
