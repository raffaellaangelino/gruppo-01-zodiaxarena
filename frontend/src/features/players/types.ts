import type { PlayerRef } from '@/domain/game'

/** Un giocatore trovato con la ricerca (contratto API §10.1). */
export interface PlayerSearchResult {
  player: PlayerRef
  /** Sfida già in attesa con lui (in un verso o nell'altro): non se ne può lanciare un'altra. */
  pendingChallengeId: number | null
}
