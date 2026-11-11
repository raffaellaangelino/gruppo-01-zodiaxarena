/**
 * Conservazione del token JWT nel browser.
 *
 * Si usa `localStorage`: il giocatore resta connesso anche chiudendo il browser, finché il
 * token non scade. Il backend non ha ancora il rinnovo del token (issue #50), quindi non
 * ci sono alternative più sicure a parità di comportamento (un cookie HttpOnly richiederebbe
 * modifiche al backend). Se lo storage non è disponibile (es. navigazione privata con
 * restrizioni), la sessione dura solo finché la pagina resta aperta.
 */

const STORAGE_KEY = 'za.auth.token'

/** Token salvato, oppure `null`. */
export function readToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

/**
 * Salva il token.
 *
 * @param token Token JWT ricevuto dall'accesso.
 */
export function saveToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, token)
  } catch {
    // Storage non disponibile: la sessione resta solo in memoria.
  }
}

/** Cancella il token (uscita o sessione scaduta). */
export function clearToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Niente da cancellare.
  }
}

/**
 * Avvisa quando il token cambia in un'altra scheda (accesso o uscita altrove),
 * così tutte le schede restano allineate.
 *
 * @param listener Riceve il nuovo token, oppure `null` se è stato cancellato.
 * @returns Funzione per smettere di ascoltare.
 */
export function onTokenChangedElsewhere(listener: (token: string | null) => void): () => void {
  const handler = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener(event.newValue)
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}
