import { mockResponse } from '@/mocks/mockResponse'
import { dashboardSummaryMock } from '@/mocks/dashboard'
import type { DashboardSummary } from '@/features/home/dashboardTypes'

export async function fetchDashboardSummary(signal?: AbortSignal): Promise<DashboardSummary> {
  return mockResponse(dashboardSummaryMock(), signal)
}
