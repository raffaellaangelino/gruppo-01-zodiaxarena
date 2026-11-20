import fixture from '@/mocks/fixtures/match-engine-4242.json'
import type { MatchDto } from '@/features/matches/dto'

/**
 * Partita di esempio: una partita vera giocata dall'engine del team (seme 4242, Lyra con Efesto
 * contro Orione con Demetra, vittoria per KO al round 3), salvata così com'è nella forma di
 * `GET /api/matches/{id}`. Qualunque id chiesto, risponde con questa.
 *
 * @param id Partita chiesta.
 * @returns La partita, con l'id chiesto.
 */
export function matchMock(id: number): MatchDto {
  return { ...(fixture as MatchDto), id }
}
