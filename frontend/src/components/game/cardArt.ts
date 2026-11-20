/**
 * Illustrazioni delle 96 carte del catalogo (`assets/cards/catalog`, copiate da
 * `design/art/asset/carte-mini` e convertite in WebP, 360 × 504). Vite crea un indirizzo per file:
 * il browser scarica solo le carte che compaiono davvero.
 */
const ART = import.meta.glob<string>('@/assets/cards/catalog/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** Codice della carta (nome del file senza estensione) → indirizzo dell'immagine. */
const ART_BY_CODE = new Map(
  Object.entries(ART).map(([path, url]) => [path.replace(/^.*\/|\.webp$/g, ''), url]),
)

/**
 * Codice stabile di una carta a partire da `imgId` del backend (`za-005-sole-leone.png` →
 * `za-005-sole-leone`): è anche il nome del file dell'illustrazione.
 *
 * @param imgId Nome dell'immagine come lo manda il backend.
 * @returns Il codice della carta.
 */
export function cardCodeFromImage(imgId: string): string {
  return imgId.replace(/\.[a-z]+$/i, '')
}

/**
 * Indirizzo dell'illustrazione di una carta.
 *
 * @param code Codice della carta (es. `za-005-sole-leone`).
 * @returns L'indirizzo, oppure `null` se l'immagine non c'è: chi la mostra usa il dorso.
 */
export function cardArtUrl(code: string): string | null {
  return ART_BY_CODE.get(code) ?? null
}

/** Codici di tutte le carte di cui c'è l'illustrazione (servono al catalogo di esempio). */
export const CARD_ART_CODES: readonly string[] = [...ART_BY_CODE.keys()].sort()
