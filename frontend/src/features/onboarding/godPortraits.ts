import demetra from '@/assets/factions/dio-demetra.webp'
import efesto from '@/assets/factions/dio-efesto.webp'
import era from '@/assets/factions/dio-era.webp'
import poseidone from '@/assets/factions/dio-poseidone.webp'
import type { GodCode } from '@/domain/game'

/** Il ritratto di ogni Dio, dalla sua carta del team (D-030): scelta della Fazione e landing. */
export const GOD_PORTRAITS: Record<GodCode, string> = {
  EFESTO: efesto,
  POSEIDONE: poseidone,
  DEMETRA: demetra,
  ERA: era,
}
