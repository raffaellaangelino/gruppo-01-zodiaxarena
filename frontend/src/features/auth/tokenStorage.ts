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

/** Copia in memoria: vale anche quando lo storage del browser non è disponibile. */
let memoryToken: string | null = null

/**
 * Token salvato, oppure `null`. Se lo storage funziona vale solo lui (così un'uscita fatta in
 * un'altra scheda vale anche qui); la copia in memoria serve solo se lo storage non è disponibile.
 */
export function readToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return memoryToken
  }
}

/**
 * Salva il token.
 *
 * @param token Token JWT ricevuto dall'accesso.
 */
export function saveToken(token: string): void {
  memoryToken = token
  try {
    localStorage.setItem(STORAGE_KEY, token)
  } catch {
    // Storage non disponibile: la sessione resta solo in memoria.
  }
}

/** Cancella il token (uscita o sessione scaduta). */
export function clearToken(): void {
  memoryToken = null
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
