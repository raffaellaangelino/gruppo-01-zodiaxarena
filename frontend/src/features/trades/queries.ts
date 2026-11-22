import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import type { Trade, TradeDirection } from '@/features/trades/types'

export async function fetchTrades(
  direction: TradeDirection,
  signal?: AbortSignal,
): Promise<Trade[]> {
  // Gli endpoint degli scambi non esistono ancora nel backend:
  // non mostrare dati finti e non eseguire richieste inesistenti.
  void direction
  void signal
  return []
}

export const tradesQuery = (direction: TradeDirection) =>
  queryOptions({
    queryKey: ['trades', direction],
    queryFn: ({ signal }) => fetchTrades(direction, signal),
  })

export function useTrades(direction: TradeDirection): Trade[] {
  return useSuspenseQuery(tradesQuery(direction)).data
}
