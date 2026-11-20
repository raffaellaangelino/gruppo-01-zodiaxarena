/**
 * Configurazione letta dalle variabili d'ambiente di Vite (`VITE_*`).
 */

/**
 * Dati di esempio al posto delle API che il backend non ha ancora (crediti, sfide, scambi,
 * missioni, Fazione). Attivi salvo `VITE_USE_MOCKS=false`. Quando sono attivi, l'interfaccia
 * lo segnala con un'etichetta visibile (`MockDataNotice`).
 */
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'

/**
 * Endpoint del contratto API che il backend in `dev` non ha ancora. Finché valgono `false`, la
 * parte che li usa resta sui dati di esempio (o fa a meno di quel dato) anche con
 * `VITE_USE_MOCKS=false`, così il resto si prova con il backend vero. Quando un endpoint arriva,
 * si mette a `true` qui e basta: le pagine non cambiano.
 */
export const BACKEND_READY = {
  /** `GET /api/home` (contratto §3.2): dati della Home. */
  home: false,
  /** `GET /api/players/search?q=` (§10.1): cercare l'avversario. */
  playerSearch: false,
  /** `GET /api/decks/me` (§5.1): il tuo Cielo con le carte. */
  myDeck: false,
  /** `GET /api/matches/{id}` (§8.2): una partita giocata. */
  match: false,
} as const
