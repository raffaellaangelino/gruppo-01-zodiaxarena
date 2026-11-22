import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useCatalog } from '@/features/cards/queries'
import { useCollection } from '@/features/collection/queries'
import { playerSummaryQuery, usePlayerSummary } from '@/features/player/queries'
import { fetchOpening, fetchShop, purchasePack, type ShopSampleContext } from '@/features/shop/api'
import type { PackOpening } from '@/features/shop/types'

/** Chiave della cache del Negozio. */
export const SHOP_KEY = ['shop'] as const

/** Il contesto dei dati di esempio, dai dati veri già in memoria. */
function useSampleContext(): ShopSampleContext {
  const { credits } = usePlayerSummary()
  const catalog = useCatalog()
  const { owned } = useCollection()
  return { credits, catalog, owned: new Set(owned.keys()) }
}

/**
 * Il Negozio, già pronto (la pagina aspetta con la Suspense del guscio).
 *
 * @returns Saldo, contatore del Sole e pacchetti.
 */
export function useShop() {
  const sample = useSampleContext()
  return useSuspenseQuery({
    queryKey: [...SHOP_KEY, 'packs'],
    queryFn: ({ signal }) => fetchShop(signal, sample),
  }).data
}

/**
 * Comprare e aprire un pacchetto. Dopo l'acquisto si aggiornano Negozio, saldo nella barra e
 * collezione; l'apertura va in cache, così la pagina dell'apertura è subito pronta.
 *
 * @returns La mutazione: `mutate({ code, idempotencyKey })`.
 */
export function usePurchasePack() {
  const queryClient = useQueryClient()
  const sample = useSampleContext()
  return useMutation({
    mutationFn: ({ code, idempotencyKey }: { code: string; idempotencyKey: string }) =>
      purchasePack(code, idempotencyKey, sample),
    onSuccess: (opening) => {
      queryClient.setQueryData([...SHOP_KEY, 'opening', opening.openingId], opening)
      // Il saldo nella barra segue subito l'acquisto (con i dati di esempio resta solo qui)
      queryClient.setQueryData(playerSummaryQuery.queryKey, (player) =>
        player ? { ...player, credits: opening.balance } : player,
      )
      void queryClient.invalidateQueries({ queryKey: [...SHOP_KEY, 'packs'] })
      void queryClient.invalidateQueries({ queryKey: ['collection'] })
    },
  })
}

/**
 * Un'apertura, per la pagina dell'apertura e del riepilogo.
 *
 * @param id Apertura.
 * @returns L'apertura, oppure `null` se non si trova.
 */
export function useOpening(id: number): PackOpening | null {
  return useSuspenseQuery({
    queryKey: [...SHOP_KEY, 'opening', id],
    queryFn: ({ signal }) => fetchOpening(id, signal),
  }).data
}
