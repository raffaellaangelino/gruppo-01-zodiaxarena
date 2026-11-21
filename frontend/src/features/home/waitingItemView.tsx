import type { ReactNode } from 'react'
import { PATHS } from '@/app/paths'
import type { IconName } from '@/components/ui/Icon'
import type { WaitingItem } from '@/features/home/types'
import { daysAgoLabel, daysUntil } from '@/lib/dates'
import { plural } from '@/lib/plural'

/** Come si mostra una cosa che aspetta il giocatore. */
export interface WaitingItemView {
  /** Categoria, in sopratitolo (es. "Sfida ricevuta"). */
  category: string
  /** Frase principale, con il nome in evidenza. */
  text: ReactNode
  /** Stato sotto la frase (es. "ricevuta oggi"). */
  meta: string
  action: {
    label: string
    icon: IconName
    to: string
    /** Testo accessibile completo (es. "Gioca la sfida di Maia"). */
    ariaLabel: string
  }
}

/**
 * Traduce un elemento di "Ti aspettano" in ciò che si vede: categoria, frase, stato e azione.
 * Separato dalla grafica: i testi si correggono qui, i componenti non cambiano.
 *
 * @param item Sfida ricevuta, replay da guardare o scambio ricevuto.
 * @param compact Testi brevi per il mobile.
 * @returns La vista della riga.
 */
export function toWaitingItemView(item: WaitingItem, compact = false): WaitingItemView {
  switch (item.kind) {
    case 'CHALLENGE_RECEIVED':
      return {
        category: 'Sfida ricevuta',
        text: (
          <>
            <b>{item.from.nickname}</b> ti ha sfidato
          </>
        ),
        meta: `ricevuta ${daysAgoLabel(item.receivedAt)}`,
        action: {
          label: 'Gioca',
          icon: 'sfide',
          to: PATHS.challenges,
          ariaLabel: `Gioca la sfida di ${item.from.nickname}`,
        },
      }
    case 'REPLAY_UNSEEN':
      return {
        category: 'Replay da guardare',
        text: (
          <>
            Contro <b>{item.opponent.nickname}</b>
          </>
        ),
        meta: compact ? 'esito nascosto' : 'esito nascosto finché non lo guardi',
        action: {
          label: 'Guarda',
          icon: 'rotolo',
          to: PATHS.challenges,
          ariaLabel: `Guarda il replay contro ${item.opponent.nickname}`,
        },
      }
    case 'TRADE_RECEIVED':
      return {
        category: 'Scambio ricevuto',
        text: (
          <>
            <b>{item.from.nickname}</b> {compact ? 'propone uno scambio' : 'ti propone uno scambio'}
          </>
        ),
        meta: compact
          ? 'attende risposta'
          : `${plural(item.cardsOffered, 'carta', 'carte')} contro ${item.cardsRequested} · scade tra ${plural(daysUntil(item.expiresAt), 'giorno', 'giorni')}`,
        action: {
          label: 'Rispondi',
          icon: 'scambi',
          to: PATHS.trades,
          ariaLabel: `Rispondi allo scambio di ${item.from.nickname}`,
        },
      }
  }
}
