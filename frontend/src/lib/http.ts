/**
 * Client HTTP verso le API del backend.
 *
 * Tutte le chiamate passano da qui: percorso relativo sotto `/api` (inoltrato al backend
 * da Vite in sviluppo e da nginx nel container), JSON in entrata e in uscita, token JWT della
 * sessione aggiunto da solo, errori trasformati in {@link ApiError} con il `code` del contratto
 * API (§1.2).
 */

/** Prefisso delle API: sempre relativo, mai l'indirizzo del backend scritto nel codice. */
const API_BASE = '/api'

/** Corpo d'errore del backend (contratto API §1.2). */
interface ApiErrorBody {
  code?: string
  message?: string
  fieldErrors?: Record<string, string[]>
}

/** Errore di una chiamata alle API, con lo stato HTTP (0 = rete non raggiungibile). */
export class ApiError extends Error {
  /** Stato HTTP della risposta; 0 se la richiesta non è arrivata al server. */
  readonly status: number
  /** Codice dell'errore deciso dal backend (es. `NICKNAME_TAKEN`): sceglie il testo da mostrare. */
  readonly code: string | null
  /**
   * Errori di validazione per campo (400), con il nome del campo del backend (es. `nickName`).
   * I testi sono tecnici: servono a capire quale campo correggere, non vanno mostrati.
   */
  readonly fieldErrors: Record<string, string[]>

  /**
   * @param status Stato HTTP, oppure 0 per un errore di rete.
   * @param message Descrizione tecnica, per il debug: non va mostrata al giocatore.
   * @param body Corpo dell'errore, se il backend l'ha mandato.
   */
  constructor(status: number, message: string, body: ApiErrorBody = {}) {
    super(body.message ?? message)
    this.name = 'ApiError'
    this.status = status
    this.code = body.code ?? null
    this.fieldErrors = body.fieldErrors ?? {}
  }

  /** Vero se la richiesta non ha raggiunto il server (rete assente o server spento). */
  get isNetworkError(): boolean {
    return this.status === 0
  }
}

/** Opzioni di una richiesta. */
export interface RequestOptions {
  /** Metodo HTTP (predefinito GET). */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  /** Header aggiuntivi richiesti da alcuni endpoint. */
  headers?: Record<string, string>
  /** Corpo della richiesta, inviato come JSON. */
  body?: unknown
  /**
   * Token JWT da inviare. Se non è indicato si usa quello della sessione;
   * `null` per una richiesta anonima.
   */
  token?: string | null
  /** Per annullare la richiesta (es. quando il componente si smonta). */
  signal?: AbortSignal
}

/** Chiamato quando una richiesta con token riceve 401: la sessione non è più valida. */
type UnauthorizedHandler = () => void

let onUnauthorized: UnauthorizedHandler | null = null

/** Restituisce il token della sessione corrente. */
type TokenProvider = () => string | null

let tokenProvider: TokenProvider = () => null

/**
 * Registra da dove leggere il token della sessione (lo fa il provider dell'autenticazione),
 * così le funzioni delle API non devono passarlo a mano.
 *
 * @param provider Funzione che restituisce il token corrente, o `null` se non c'è sessione.
 */
export function setTokenProvider(provider: TokenProvider): void {
  tokenProvider = provider
}

/**
 * Registra chi gestisce la sessione scaduta (lo fa il provider dell'autenticazione).
 *
 * @param handler Funzione da chiamare a ogni 401 su una richiesta autenticata; `null` per toglierla.
 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  onUnauthorized = handler
}

/**
 * Esegue una richiesta alle API e restituisce il corpo JSON.
 *
 * @param path Percorso dopo `/api`, con la barra iniziale (es. `/auth/login`).
 * @param options Metodo, corpo, token e segnale di annullamento.
 * @returns Il corpo della risposta già convertito; `undefined` se la risposta è vuota.
 * @throws {ApiError} Se la risposta non è 2xx o se il server non è raggiungibile.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers: extraHeaders, body, signal } = options
  const token = options.token === undefined ? tokenProvider() : options.token
  const headers: Record<string, string> = { Accept: 'application/json', ...extraHeaders }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, `Rete non raggiungibile: ${String(error)}`)
  }

  if (response.status === 401 && token) onUnauthorized?.()

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as ApiErrorBody
    throw new ApiError(response.status, `${method} ${path} → ${response.status}`, errorBody)
  }

  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}
