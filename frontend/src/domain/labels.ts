import type { Element, GodCode, PlanetCode, SignCode } from '@/domain/game'

/**
 * Nomi in italiano dei codici del gioco: l'API usa codici stabili, l'interfaccia mostra
 * questi testi. Un solo posto per correggerli.
 */

export const ELEMENT_LABELS: Record<Element, string> = {
  FIRE: 'Fuoco',
  WATER: 'Acqua',
  EARTH: 'Terra',
  AIR: 'Aria',
}

/** Dio della Fazione: nome ed effetto in una riga (regolamento, Fazioni). */
export const GOD_LABELS: Record<GodCode, { name: string; effect: string }> = {
  EFESTO: { name: 'Efesto', effect: '+2 ATK al Fuoco' },
  POSEIDONE: { name: 'Poseidone', effect: "+3 DEF all'Acqua" },
  DEMETRA: { name: 'Demetra', effect: '+1 ATK e +1 DEF alla Terra' },
  ERA: { name: 'Era', effect: "+1 ATK e +1 DEF all'Aria" },
}

export const PLANET_LABELS: Record<PlanetCode, string> = {
  SOLE: 'Sole',
  LUNA: 'Luna',
  MARTE: 'Marte',
  GIOVE: 'Giove',
  SATURNO: 'Saturno',
  MERCURIO: 'Mercurio',
  VENERE: 'Venere',
}

export const SIGN_LABELS: Record<SignCode, string> = {
  ARIETE: 'Ariete',
  TORO: 'Toro',
  GEMELLI: 'Gemelli',
  CANCRO: 'Cancro',
  LEONE: 'Leone',
  VERGINE: 'Vergine',
  BILANCIA: 'Bilancia',
  SCORPIONE: 'Scorpione',
  SAGITTARIO: 'Sagittario',
  CAPRICORNO: 'Capricorno',
  ACQUARIO: 'Acquario',
  PESCI: 'Pesci',
}
