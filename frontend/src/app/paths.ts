/** Percorsi dell'applicazione: un solo posto, mai stringhe sparse nel codice. */
export const PATHS = {
  home: '/',
  login: '/accedi',
  register: '/registrati',
  welcomeFaction: '/benvenuto/fazione',
  guide: '/guida',
  /** Regolamento pubblico (S14): la Guida per chi non è ancora entrato, aperta dalla landing. */
  rules: '/regolamento',
  privacy: '/privacy',
  collection: '/collezione',
  deck: '/collezione/cielo',
  challenges: '/sfide',
  challengesSent: '/sfide/inviate',
  newChallenge: '/sfide/nuova',
  /** Modello del percorso: per un link usare {@link playChallengePath}. */
  playChallenge: '/sfide/:challengeId/gioca',
  /** Modello del percorso: per un link usare {@link matchPath}. */
  match: '/partite/:matchId',
  /** Modello del percorso: per un link usare {@link matchVerdictPath}. */
  matchVerdict: '/partite/:matchId/verdetto',
  trades: '/scambi',
  shop: '/negozio',
  missions: '/missioni',
  faction: '/fazione',
  profile: '/profilo',
  notifications: '/notifiche',
} as const

/**
 * Nuova sfida, con l'avversario già scelto se arriva da "Sfida" in una lista.
 *
 * @param opponentId Avversario da proporre.
 * @returns Il percorso.
 */
export function newChallengePath(opponentId?: number): string {
  return opponentId ? `${PATHS.newChallenge}?avversario=${opponentId}` : PATHS.newChallenge
}

/**
 * Accettare una sfida e giocarla (attesa "Cloto fila…", poi il risultato).
 *
 * @param challengeId Sfida ricevuta.
 * @returns Il percorso.
 */
export function playChallengePath(challengeId: number): string {
  return `/sfide/${challengeId}/gioca`
}

/**
 * Una partita giocata: Verdetto e Rotolo.
 *
 * @param matchId Partita.
 * @returns Il percorso.
 */
export function matchPath(matchId: number): string {
  return `/partite/${matchId}`
}

/**
 * Il Verdetto di una partita.
 *
 * @param matchId Partita.
 * @returns Il percorso.
 */
export function matchVerdictPath(matchId: number): string {
  return `/partite/${matchId}/verdetto`
}
