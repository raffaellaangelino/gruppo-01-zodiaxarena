import { BACKEND_READY, USE_MOCKS } from '@/config/env'
import type { Catalog } from '@/features/cards/queries'
import type { PackOpening, ShopCatalog } from '@/features/shop/types'
import { request } from '@/lib/http'
import { mockResponse } from '@/mocks/mockResponse'
import { openingMock, purchaseMock, shopCatalogMock } from '@/mocks/shop'

/** Con il backend vero ma senza `/api/shop` il Negozio usa i dati di esempio (con l'etichetta). */
export const SHOP_SAMPLE = USE_MOCKS || !BACKEND_READY.shop

/** Quello che serve ai dati di esempio: saldo vero, catalogo e collezione. */
export interface ShopSampleContext {
  credits: number
  catalog: Catalog
  owned: ReadonlySet<number>
}

/**
 * Il Negozio: `GET /api/shop/packs` (contratto §6.1).
 *
 * @param signal Per annullare la richiesta.
 * @param sample Contesto dei dati di esempio.
 * @returns Saldo, contatore del Sole e pacchetti.
 */
export async function fetchShop(
  signal: AbortSignal,
  sample: ShopSampleContext,
): Promise<ShopCatalog> {
  if (SHOP_SAMPLE) return mockResponse(shopCatalogMock(sample.credits), signal)
  return request<ShopCatalog>('/shop/packs', { signal })
}

/**
 * Compra e apre un pacchetto: `POST /api/shop/packs/{code}/purchase` (contratto §6.2). La chiave di
 * idempotenza fa sì che un doppio clic o un nuovo tentativo non comprino due volte.
 *
 * @param code Pacchetto.
 * @param idempotencyKey Chiave dell'acquisto (una per tentativo dell'utente).
 * @param sample Contesto dei dati di esempio.
 * @returns L'apertura.
 */
export async function purchasePack(
  code: string,
  idempotencyKey: string,
  sample: ShopSampleContext,
): Promise<PackOpening> {
  if (SHOP_SAMPLE)
    return mockResponse(purchaseMock(code, sample.credits, sample.catalog, sample.owned))
  return request<PackOpening>(`/shop/packs/${code}/purchase`, {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
  })
}

/**
 * Un'apertura già fatta, per ritrovare il riepilogo: `GET /api/shop/openings/{id}`.
 *
 * @param id Apertura.
 * @param signal Per annullare la richiesta.
 * @returns L'apertura, oppure `null` se non si trova.
 */
export async function fetchOpening(id: number, signal: AbortSignal): Promise<PackOpening | null> {
  if (SHOP_SAMPLE) return mockResponse(openingMock(id), signal)
  return request<PackOpening>(`/shop/openings/${id}`, { signal })
}
