import type { Element, GodCode, PlanetCode, SignCode, Tier } from '@/domain/game'

/**
 * Relazioni fisse tra i codici del gioco (regolamento): l'elemento di ogni segno e il Dio
 * che favorisce ogni elemento. Sono regole, non dati del giocatore: non arrivano dal backend.
 */

/** Elemento di ogni segno (come `Sign.type` nel backend). */
export const SIGN_ELEMENT: Record<SignCode, Element> = {
  ARIETE: 'FIRE',
  LEONE: 'FIRE',
  SAGITTARIO: 'FIRE',
  TORO: 'EARTH',
  VERGINE: 'EARTH',
  CAPRICORNO: 'EARTH',
  GEMELLI: 'AIR',
  BILANCIA: 'AIR',
  ACQUARIO: 'AIR',
  CANCRO: 'WATER',
  SCORPIONE: 'WATER',
  PESCI: 'WATER',
}

/** Elemento favorito da ogni Dio: è anche l'elemento della sua Fazione. */
export const GOD_ELEMENT: Record<GodCode, Element> = {
  EFESTO: 'FIRE',
  POSEIDONE: 'WATER',
  DEMETRA: 'EARTH',
  ERA: 'AIR',
}

/**
 * Il Dio proposto a chi è nato sotto un elemento (Ermes, primo passo): lo stesso
 * `proposedFaction` del backend.
 */
export const ELEMENT_GOD: Record<Element, GodCode> = {
  FIRE: 'EFESTO',
  WATER: 'POSEIDONE',
  EARTH: 'DEMETRA',
  AIR: 'ERA',
}

/**
 * Ciclo degli elementi (regolamento, "Ciclo delle fazioni"): l'Acqua spegne il Fuoco, il Fuoco
 * cuoce la Terra, la Terra ferma i venti, i venti sollevano le onde. Fuoco–Aria e Acqua–Terra
 * sono coppie neutre. Chi batte l'altro prende +1 ATK (lo calcola l'engine).
 */
export const ELEMENT_BEATS: Record<Element, Element> = {
  WATER: 'FIRE',
  FIRE: 'EARTH',
  EARTH: 'AIR',
  AIR: 'WATER',
}

/** I Dei nell'ordine delle tavole (Fuoco, Acqua, Terra, Aria). */
export const GODS: readonly GodCode[] = ['EFESTO', 'POSEIDONE', 'DEMETRA', 'ERA']

/**
 * I tre segni di un elemento, nell'ordine dello zodiaco.
 *
 * @param element Elemento.
 * @returns I codici dei segni.
 */
export function signsOf(element: Element): SignCode[] {
  return (Object.keys(SIGN_ELEMENT) as SignCode[]).filter((sign) => SIGN_ELEMENT[sign] === element)
}

/**
 * Codice di un segno a partire dal nome che usa il backend (es. `"Leone"` → `LEONE`).
 *
 * @param name Nome del segno, come in `Sign.name`.
 * @returns Il codice, oppure `null` se il nome non è un segno conosciuto.
 */
export function toSignCode(name: string): SignCode | null {
  const code = name.trim().toUpperCase()
  return code in SIGN_ELEMENT ? (code as SignCode) : null
}

/** Rarità decisa dal pianeta (regolamento: Sole Leggendario, Luna e Marte Epici, Giove e Saturno Rari, Mercurio e Venere Comuni). */
export const PLANET_TIER: Record<PlanetCode, Tier> = {
  SOLE: 'LEGENDARY',
  LUNA: 'EPIC',
  MARTE: 'EPIC',
  GIOVE: 'RARE',
  SATURNO: 'RARE',
  MERCURIO: 'COMMON',
  VENERE: 'COMMON',
}

/**
 * Codice di un pianeta a partire dal nome che usa il backend (es. `"Sole"` → `SOLE`).
 *
 * @param name Nome del pianeta, come in `Planet.name`.
 * @returns Il codice, oppure `null` se il nome non è un pianeta conosciuto.
 */
export function toPlanetCode(name: string): PlanetCode | null {
  const code = name.trim().toUpperCase()
  return code in PLANET_TIER ? (code as PlanetCode) : null
}
