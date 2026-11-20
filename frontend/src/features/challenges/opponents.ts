import type { PlayerRef } from '@/domain/game'
import type { Challenge } from '@/features/challenges/types'

/** Un avversario con cui hai già avuto a che fare, per "Sfida di nuovo". */
export interface RecentOpponent {
  player: PlayerRef
  /** Sfida ancora in attesa con lui (in un verso o nell'altro): non se ne può lanciare un'altra. */
  pending: Challenge | null
  /** L'ultima sfida con lui (ISO 8601). */
  lastAt: string
}

/**
 * Avversari recenti, ricavati dalle sfide che già conosciamo (ricevute e inviate), dal più
 * recente. Finché il backend non ha "avversari recenti" e i gruppi (contratto API §10.2), la
 * lista si costruisce così, senza inventare dati.
 *
 * @param challenges Sfide da giocare e inviate.
 * @param limit Quanti avversari al massimo.
 * @returns Gli avversari, senza doppioni.
 */
export function recentOpponents(challenges: Challenge[], limit = 5): RecentOpponent[] {
  const byPlayer = new Map<number, RecentOpponent>()
  const sorted = [...challenges].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  for (const challenge of sorted) {
    const known = byPlayer.get(challenge.opponent.id)
    const pending = challenge.status === 'PENDING' ? challenge : null
    if (!known) {
      byPlayer.set(challenge.opponent.id, {
        player: challenge.opponent,
        pending,
        lastAt: challenge.createdAt,
      })
    } else if (pending && !known.pending) {
      known.pending = pending
    }
  }
  return [...byPlayer.values()].slice(0, limit)
}
