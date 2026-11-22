import { cardArtUrl, cardCodeFromImage } from '@/components/game/cardArt'
import type { CardType } from '@/domain/game'
import { cardName } from '@/domain/labels'
import { PLANET_TIER, SIGN_ELEMENT, toPlanetCode, toSignCode } from '@/domain/rules'
import type { SignDto } from '@/features/player/dto'
import type { CardDefinition } from '@/features/cards/types'

/** Pianeta come lo manda il backend (`PlanetResponseDto`); `tier` è la rarità come testo.
 * L'interfaccia non la legge: la ricava dal pianeta (`PLANET_TIER`). */
export interface PlanetDto {
  id: number
  name: string
  tier: 'LEGENDARY' | 'EPIC' | 'RARE' | 'COMMON'
  atk: number
  def: number
}

/** Carta del catalogo come la manda il backend (`GET /api/cards`, `CardDefinitionResponseDto`). */
export interface CardDefinitionDto {
  id: number
  type: CardType
  /** Casa (`"I"`); assente o `null` per gli Ascendenti. */
  house?: string | null
  sign: SignDto
  /** Assente per gli Ascendenti. */
  planet?: PlanetDto | null
  /** Nome dell'immagine (es. `za-005-sole-leone.png`). */
  imgId: string
}

/**
 * Traduce una carta del backend nella forma dell'interfaccia. La rarità viene dal pianeta
 * (regola del gioco), non dal numero del backend, così resta leggibile ovunque.
 *
 * @param dto Carta come la manda il backend.
 * @returns La carta.
 * @throws {Error} Se segno o pianeta non sono conosciuti: meglio fermarsi che mostrare una carta sbagliata.
 */
export function toCardDefinition(dto: CardDefinitionDto): CardDefinition {
  const sign = toSignCode(dto.sign.name)
  if (!sign) throw new Error(`Carta ${dto.id}: segno sconosciuto ${dto.sign.name}`)
  const planet = dto.planet ? toPlanetCode(dto.planet.name) : null
  if (dto.planet && !planet)
    throw new Error(`Carta ${dto.id}: pianeta sconosciuto ${dto.planet.name}`)
  const code = cardCodeFromImage(dto.imgId)
  return {
    id: dto.id,
    code,
    type: dto.type,
    name: cardName(planet, sign),
    sign,
    element: SIGN_ELEMENT[sign],
    planet,
    tier: planet ? PLANET_TIER[planet] : 'ASCENDANT',
    house: dto.house ?? null,
    signStats: { atk: dto.sign.atk, def: dto.sign.def },
    planetStats: dto.planet ? { atk: dto.planet.atk, def: dto.planet.def } : null,
    imageUrl: cardArtUrl(code),
  }
}
