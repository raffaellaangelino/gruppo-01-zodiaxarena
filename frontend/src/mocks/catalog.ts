import { CARD_ART_CODES } from '@/components/game/cardArt'
import type { CardDefinitionDto } from '@/features/cards/dto'

/**
 * Catalogo di esempio, nella forma di `GET /api/cards`, ricavato dai nomi delle 96 illustrazioni
 * (`za-005-sole-leone`, `za-asc-05-ascendente-leone`). Valori di segni e pianeti copiati dai dati
 * iniziali del backend (`data.sql`), così le carte di esempio coincidono con quelle vere.
 */

const SIGNS: Record<string, { type: CardDefinitionDto['sign']['type']; atk: number; def: number }> =
  {
    Ariete: { type: 'FIRE', atk: 13, def: 7 },
    Leone: { type: 'FIRE', atk: 12, def: 8 },
    Sagittario: { type: 'FIRE', atk: 10, def: 10 },
    Toro: { type: 'EARTH', atk: 8, def: 12 },
    Vergine: { type: 'EARTH', atk: 10, def: 10 },
    Capricorno: { type: 'EARTH', atk: 12, def: 8 },
    Gemelli: { type: 'AIR', atk: 10, def: 10 },
    Bilancia: { type: 'AIR', atk: 10, def: 10 },
    Acquario: { type: 'AIR', atk: 10, def: 10 },
    Cancro: { type: 'WATER', atk: 7, def: 13 },
    Scorpione: { type: 'WATER', atk: 8, def: 12 },
    Pesci: { type: 'WATER', atk: 10, def: 10 },
  }

const PLANETS: Record<string, { tier: number; atk: number; def: number }> = {
  Sole: { tier: 1, atk: 9, def: 8 },
  Luna: { tier: 2, atk: 5, def: 6 },
  Marte: { tier: 2, atk: 7, def: 4 },
  Giove: { tier: 3, atk: 4, def: 2 },
  Saturno: { tier: 3, atk: 2, def: 4 },
  Mercurio: { tier: 4, atk: 2, def: 0 },
  Venere: { tier: 4, atk: 0, def: 2 },
}

const SIGN_NAMES = Object.keys(SIGNS)
const PLANET_NAMES = Object.keys(PLANETS)

/** "leone" → "Leone". */
const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

/** Il catalogo di esempio: 84 Creature e 12 Ascendenti, con id progressivi. */
export function catalogMock(): CardDefinitionDto[] {
  return CARD_ART_CODES.map((code, index) => {
    const parts = code.split('-')
    const sign = capitalize(parts[parts.length - 1])
    const signDto = { id: SIGN_NAMES.indexOf(sign) + 1, name: sign, ...SIGNS[sign] }
    if (parts[1] === 'asc') {
      return { id: index + 1, type: 'ASCENDANT', sign: signDto, imgId: `${code}.png` }
    }
    const planet = capitalize(parts[2])
    return {
      id: index + 1,
      type: 'CREATURE',
      house: 'I',
      sign: signDto,
      planet: { id: PLANET_NAMES.indexOf(planet) + 1, name: planet, ...PLANETS[planet] },
      imgId: `${code}.png`,
    }
  })
}
