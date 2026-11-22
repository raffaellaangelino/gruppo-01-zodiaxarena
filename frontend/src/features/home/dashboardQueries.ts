import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { fetchDashboardSummary } from '@/features/home/dashboardApi'

export const dashboardSummaryQuery = queryOptions({
  queryKey: ['dashboard', 'summary'],
  queryFn: ({ signal }) => fetchDashboardSummary(signal),
})

export function useDashboardSummary() {
  return useSuspenseQuery(dashboardSummaryQuery).data
}
