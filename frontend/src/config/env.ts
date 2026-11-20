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
 * `GET /api/home` non esiste ancora nel backend (contratto API §3.2): finché non arriva, la Home
 * usa i dati di esempio anche con `VITE_USE_MOCKS=false`, così il resto si prova con il backend
 * vero. Quando l'endpoint esiste, si mette a `true`.
 */
export const HOME_API_AVAILABLE = false

/** Vero se una parte dell'interfaccia mostra dati di esempio: accende l'etichetta. */
export const SHOWS_SAMPLE_DATA = USE_MOCKS || !HOME_API_AVAILABLE
