import { USE_MOCKS } from '@/config/env'
import { request } from '@/lib/http'
import { homeSummaryMock } from '@/mocks/home'
import { mockResponse } from '@/mocks/mockResponse'
import type { HomeSummary } from '@/features/home/types'

/**
 * Dati della Home: `GET /api/home` (contratto API §3.2).
 * Con i dati di esempio attivi risponde con quelli.
 *
 * @param signal Per annullare la richiesta.
 * @returns Sfide premiate, "Ti aspettano", Cielo, missioni, pacchetti e luna piena.
 */
export async function fetchHomeSummary(signal?: AbortSignal): Promise<HomeSummary> {
  if (USE_MOCKS) return mockResponse(homeSummaryMock(), signal)
  return request<HomeSummary>('/home', { signal })
}
