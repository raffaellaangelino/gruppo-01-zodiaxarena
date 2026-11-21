import type { Element, GodCode, PlanetCode, SignCode, Tier } from '@/domain/game'

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

/** Elemento con l'articolo, per le frasi ("il Fuoco ti appartiene"). */
export const ELEMENT_WITH_ARTICLE: Record<Element, string> = {
  FIRE: 'il Fuoco',
  WATER: "l'Acqua",
  EARTH: 'la Terra',
  AIR: "l'Aria",
}

/**
 * Il regno di ogni Dio (tavole Fazione e Benvenuto-Fazione): il quarto dell'Eclittica,
 * il paesaggio, il nome del potere e il suo effetto per esteso.
 */
export const GOD_REALMS: Record<
  GodCode,
  { realm: string; realmAt: string; land: string; power: string; effect: string }
> = {
  EFESTO: {
    realm: 'La Fucina',
    realmAt: 'alla Fucina',
    land: "Vulcani, colate d'oro fuso, officine di bronzo",
    power: 'Fucina',
    effect: '+2 ATK alle creature di Fuoco',
  },
  POSEIDONE: {
    realm: 'Il Pelago',
    realmAt: 'al Pelago',
    land: 'Abissi luminosi, città sommerse, maree di stelle',
    power: 'Marea',
    effect: "+3 DEF alle creature d'Acqua",
  },
  DEMETRA: {
    realm: 'I Campi',
    realmAt: 'ai Campi',
    land: 'Campi coltivati, foreste-tempio, montagne scolpite',
    power: 'Raccolto',
    effect: '+1 ATK e +1 DEF alla Terra',
  },
  ERA: {
    realm: 'Le Altezze',
    realmAt: 'alle Altezze',
    land: 'Nubi di marmo, palazzi sospesi, venti che parlano',
    power: "Regina dell'Olimpo",
    effect: "+1 ATK e +1 DEF all'Aria",
  },
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

/** Segno con la preposizione, per le frasi ("Il tuo Sole è nel Leone"). */
export const SIGN_IN: Record<SignCode, string> = {
  ARIETE: "nell'Ariete",
  TORO: 'nel Toro',
  GEMELLI: 'nei Gemelli',
  CANCRO: 'nel Cancro',
  LEONE: 'nel Leone',
  VERGINE: 'nella Vergine',
  BILANCIA: 'nella Bilancia',
  SCORPIONE: 'nello Scorpione',
  SAGITTARIO: 'nel Sagittario',
  CAPRICORNO: 'nel Capricorno',
  ACQUARIO: "nell'Acquario",
  PESCI: 'nei Pesci',
}

/**
 * Abilità di ogni elemento, come le applica l'engine (`RuleAbilities.ElementAbility`,
 * `EarthDamageAbility`; i dadi d'Aria nel calcolo d'ingresso). Il frontend le descrive soltanto.
 */
export const ELEMENT_ABILITY: Record<Element, string> = {
  FIRE: '+1 ATK quando attacca.',
  WATER: '+1 DEF quando entra in campo.',
  EARTH: 'Se cade, il giocatore perde 1 PV in meno.',
  AIR: 'ATK e DEF si tirano con i dadi (2d4×2) quando entra in campo.',
}

/**
 * Glifi dei segni, con il selettore di variante testo (U+FE0E): restano segni d'oro,
 * mai emoji colorate. Si scrivono con il font `font-symbol`.
 */
export const SIGN_GLYPHS: Record<SignCode, string> = {
  ARIETE: '♈︎',
  TORO: '♉︎',
  GEMELLI: '♊︎',
  CANCRO: '♋︎',
  LEONE: '♌︎',
  VERGINE: '♍︎',
  BILANCIA: '♎︎',
  SCORPIONE: '♏︎',
  SAGITTARIO: '♐︎',
  CAPRICORNO: '♑︎',
  ACQUARIO: '♒︎',
  PESCI: '♓︎',
}

/** Rarità come la stampano le carte (gli Ascendenti sono "Ultra-rara"). */
export const TIER_LABELS: Record<Tier, string> = {
  COMMON: 'Comune',
  RARE: 'Rara',
  EPIC: 'Epica',
  LEGENDARY: 'Leggendaria',
  ASCENDANT: 'Ultra-rara',
}

/**
 * Nome di una carta come è stampato sopra: "Sole in Leone" per una Creatura,
 * "Ascendente Leone" per un Ascendente.
 *
 * @param planet Pianeta della Creatura, oppure `null` per un Ascendente.
 * @param sign Segno della carta.
 * @returns Il nome.
 */
export function cardName(planet: PlanetCode | null, sign: SignCode): string {
  return planet
    ? `${PLANET_LABELS[planet]} in ${SIGN_LABELS[sign]}`
    : `Ascendente ${SIGN_LABELS[sign]}`
}
