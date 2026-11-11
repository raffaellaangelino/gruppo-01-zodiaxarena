/**
 * Configurazione letta dalle variabili d'ambiente di Vite (`VITE_*`).
 */

/**
 * Dati di esempio al posto delle API che il backend non ha ancora (crediti, sfide, scambi,
 * missioni, Fazione). Attivi salvo `VITE_USE_MOCKS=false`. Quando sono attivi, l'interfaccia
 * lo segnala con un'etichetta visibile (`MockDataNotice`).
 */
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'
