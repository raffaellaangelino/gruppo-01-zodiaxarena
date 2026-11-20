/** Ritardo simulato: abbastanza per vedere gli stati di caricamento, non per rallentare il lavoro. */
const MOCK_DELAY_MS = 250

/**
 * Risponde con un dato di esempio come farebbe una chiamata al backend: in modo asincrono
 * e con una copia, così nessuno modifica per sbaglio il dato condiviso.
 *
 * @param data Dato di esempio.
 * @param signal Per annullare, come una richiesta vera.
 * @returns Una promessa con la copia del dato.
 */
export function mockResponse<T>(data: T, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(structuredClone(data)), MOCK_DELAY_MS)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Richiesta annullata', 'AbortError'))
    })
  })
}
