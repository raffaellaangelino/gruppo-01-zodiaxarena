import type { GodCode } from '@/domain/game'

export interface DashboardMission {
  id: number
  title: string
  description: string
  done: number
  total: number
  reward: number
}

export interface DashboardPendingChallenge {
  id: number
  nickname: string
  receivedAt: string
}

export interface DashboardPendingTrade {
  id: number
  nickname: string
  offeredCards: number
  requestedCards: number
  expiresAt: string
}

export interface DashboardLastMatch {
  id: number
  outcome: 'WIN' | 'LOSS'
  opponent: string
  playedAt: string
  rounds: number
}

export interface DashboardSummary {
  credits: number
  faction: GodCode | null
  nextFullMoon: string | null
  moonWindowOpen: boolean
  missions: DashboardMission[]
  challenges: DashboardPendingChallenge[]
  trades: DashboardPendingTrade[]
  lastMatch: DashboardLastMatch | null
}
