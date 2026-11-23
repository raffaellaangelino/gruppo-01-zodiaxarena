import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { fetchShopPacks, purchasePack } from '@/features/shop/api'
import { playerSummaryQuery } from '@/features/player/queries'

/** Chiave condivisa dello shop. */
export const SHOP_KEY = ['shop'] as const

/** Pacchetti disponibili, saldo e contatore del Sole del giocatore. */
export const shopPacksQuery = queryOptions({
  queryKey: [...SHOP_KEY, 'packs'],
  queryFn: ({ signal }) => fetchShopPacks(signal),
})

/** Legge i pacchetti e compra un pacchetto in modo sicuro ai retry. */
export function useShop() {
  const queryClient = useQueryClient()
  const shop = useSuspenseQuery(shopPacksQuery).data
  const purchase = useMutation({
    mutationFn: ({ code, idempotencyKey }: { code: string; idempotencyKey: string }) =>
      purchasePack(code, idempotencyKey),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: shopPacksQuery.queryKey }),
        queryClient.invalidateQueries({ queryKey: playerSummaryQuery.queryKey }),
        queryClient.invalidateQueries({ queryKey: ['collection'] }),
      ])
    },
  })

  return { shop, purchase }
}
