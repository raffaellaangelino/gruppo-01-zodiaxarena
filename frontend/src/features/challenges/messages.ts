import type { IconName } from '@/components/ui/Icon'
import { daysAgoLabel, daysUntil, shortDateLabel } from '@/lib/dates'
import { plural } from '@/lib/plural'
import type { Challenge } from '@/features/challenges/types'

/** Testi della pagina Sfide (tavole Sfide, Sfide-Inviate, Sfide-Vuota, Sfide-Stati). */
export const CHALLENGES_COPY = {
  title: 'Sfide',
  tabs: { toPlay: 'Da giocare', sent: 'Inviate' },
  newChallenge: 'Nuova sfida',
  waiting: 'Ti aspettano',
  received: 'Ti ha sfidato',
  playWith: 'Giocherai con',
  yourSky: 'Il tuo Cielo',
  /** @param nickname Avversario. */
  hiddenDeck: (nickname: string) => `Il mazzo e la Fazione di ${nickname} si scoprono nel Rotolo.`,
  accept: 'Accetta e gioca',
  decline: 'Rifiuta',
  replayToWatch: 'Rotolo da guardare',
  /** @param nickname Avversario. */
  against: (nickname: string) => `Contro ${nickname}`,
  replayHint: "l'esito si scopre guardandola",
  watchReplay: 'Guarda il Rotolo',
  rematch: 'Sfida di nuovo',
  search: 'Cerca un giocatore per nome',
  recentOpponents: 'Avversari recenti',
  challenge: 'Sfida',
  pendingWith: 'In attesa',
  pendingSection: 'In attesa di risposta',
  closedSection: 'Chiuse di recente',
  withdraw: 'Ritira',
  emptyToPlay: {
    title: 'Nessuno ti ha ancora sfidato',
    text: "Lancia tu la prima sfida: Ermes la consegna e la partita si gioca appena l'altro accetta.",
  },
  emptySent: {
    title: 'Non hai sfide inviate',
    text: 'Le sfide che lanci compaiono qui finché non ti rispondono.',
  },
  /** @param nickname Chi l'ha ritirata. */
  gone: (nickname: string) =>
    `La sfida di ${nickname} non c'è più: l'ha ritirata prima che rispondessi.`,
  actionFailed: "Non siamo riusciti a completare l'azione. Controlla la connessione e riprova.",
} as const

/** Testi della finestra Nuova sfida (tavola Sfide-Nuova). */
export const NEW_CHALLENGE_COPY = {
  title: 'Nuova sfida',
  search: 'Cerca un giocatore per nome',
  searchHint: 'Scrivi almeno 3 lettere del nickname.',
  searching: 'Cerco…',
  /** @param query Testo cercato. */
  noResults: (query: string) => `Nessun giocatore con "${query}" nel nome.`,
  searchFailed: 'La ricerca non ha funzionato. Controlla la connessione e riprova.',
  searchUnavailable:
    'La ricerca per nome arriva a breve. Intanto puoi sfidare chi hai già incontrato.',
  results: 'Risultati',
  recent: 'Avversari recenti',
  noRecent:
    'Non hai ancora sfidato nessuno. La ricerca per nome arriva a breve: da lì potrai scegliere chiunque.',
  selected: 'Scelto',
  alreadyPending: 'già in attesa',
  see: 'Vedi',
  summary: 'Riepilogo',
  opponent: 'Avversario',
  pickOpponent: 'Scegli chi sfidare',
  yourSky: 'Il tuo Cielo',
  currentDeck: 'Il mazzo in uso',
  skyHint: 'Le carte e la validità del Cielo compariranno qui.',
  faction: 'Fazione',
  when: 'Quando',
  /** @param nickname Avversario. */
  whenText: (nickname: string) => `Si gioca appena ${nickname} accetta`,
  whenEmpty: 'Si gioca appena il tuo avversario accetta',
  cancel: 'Annulla',
  launch: 'Lancia la sfida',
  launching: 'Invio…',
  /** @param nickname Avversario. */
  launched: (nickname: string) => `Sfida lanciata a ${nickname}: si gioca appena accetta.`,
  noDeck: 'Ti serve un Cielo per sfidare: componilo nella Collezione.',
  failures: {
    alreadyPending: 'Hai già una sfida in attesa con questo giocatore.',
    deckInvalid: 'Il tuo Cielo non è valido: correggilo prima di sfidare.',
    notFound: 'Questo giocatore non esiste più. Scegline un altro.',
    network: 'Non riusciamo a raggiungere il server. Controlla la connessione e riprova.',
    server: 'La sfida non è partita per un problema da parte nostra. Riprova tra poco.',
  },
} as const

/** Testi dell'attesa dopo "Accetta e gioca" (tavole Sfide-Attesa e Sfide-Stati). */
export const ACCEPT_COPY = {
  exit: 'Torna alle sfide',
  title: 'Cloto fila la vostra partita…',
  text: 'Pochi istanti: poi Lachesi la svolge davanti a te.',
  /** @param me Chi guarda. @param opponent Avversario. */
  orbit: (me: string, opponent: string) => `${me} contro ${opponent}: la partita si sta preparando`,
  retry: 'Riprova',
  fixSky: 'Correggi il Cielo',
  failures: {
    notPending: 'Questa sfida non è più in attesa: forse è stata ritirata o è già stata giocata.',
    deckInvalid: 'Il tuo Cielo non è valido: correggilo per accettare la sfida.',
    engine: 'Le Moire non hanno potuto filare la partita. La sfida è ancora valida: riprova.',
    network: 'Non riusciamo a raggiungere il server. Controlla la connessione e riprova.',
    server: 'La partita non è partita per un problema da parte nostra. La sfida resta in attesa.',
    noDeck: 'Ti serve un Cielo per giocare: componilo nella Collezione.',
  },
} as const

/**
 * Quando è arrivata o partita una sfida, con la scadenza se c'è: "ricevuta oggi · scade tra 7 giorni".
 *
 * @param challenge Sfida.
 * @param verb "ricevuta" o "inviata".
 * @returns Il testo.
 */
export function challengeTiming(challenge: Challenge, verb: 'ricevuta' | 'inviata'): string {
  const parts = [`${verb} ${daysAgoLabel(challenge.createdAt)}`]
  if (challenge.expiresAt)
    parts.push(`scade tra ${plural(daysUntil(challenge.expiresAt), 'giorno', 'giorni')}`)
  return parts.join(' · ')
}

/** Come si mostra lo stato di una sfida inviata: icona, colore, nome e spiegazione. */
export interface SentStatusView {
  icon: IconName
  tone: 'gold' | 'muted' | 'warning'
  label: string
  detail: string
}

/**
 * Stato di una sfida inviata, in parole (tavola Sfide-Inviate): mai solo il colore.
 *
 * @param challenge Sfida inviata.
 * @returns Icona, tono, nome dello stato e spiegazione con la data.
 */
export function sentStatusView(challenge: Challenge): SentStatusView {
  const nick = challenge.opponent.nickname
  const when = shortDateLabel(challenge.createdAt)
  switch (challenge.status) {
    case 'PENDING':
      return {
        icon: 'scadenza',
        tone: 'gold',
        label: 'In attesa',
        detail: challengeTiming(challenge, 'inviata'),
      }
    case 'PLAYED':
      return {
        icon: 'rotolo',
        tone: 'gold',
        label: 'Giocata',
        detail: `${nick} ha accettato · ${when}`,
      }
    case 'DECLINED':
      return {
        icon: 'chiudi',
        tone: 'muted',
        label: 'Rifiutata',
        detail: `${nick} ha rifiutato la sfida · ${when}`,
      }
    case 'EXPIRED':
      return {
        icon: 'scadenza',
        tone: 'muted',
        label: 'Scaduta',
        detail: `nessuna risposta in tempo · ${when}`,
      }
    case 'WITHDRAWN':
      return {
        icon: 'chiudi',
        tone: 'muted',
        label: 'Ritirata',
        detail: `l'hai ritirata tu · ${when}`,
      }
    case 'CANCELLED':
      return {
        icon: 'avviso',
        tone: 'warning',
        label: 'Annullata',
        detail:
          challenge.cancelReason === 'DECK_CHANGED'
            ? `una carta del tuo Cielo è cambiata prima che ${nick} accettasse · ${when}`
            : `la sfida è stata annullata · ${when}`,
      }
  }
}
