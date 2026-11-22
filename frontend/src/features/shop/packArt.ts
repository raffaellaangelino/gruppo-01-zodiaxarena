import costellazione from '@/assets/images/pacchetto-costellazione.webp'
import lunaPiena from '@/assets/images/pacchetto-luna-piena.webp'
import zenit from '@/assets/images/pacchetto-zenit.webp'

/** Le buste del team (art/asset/pacchetti/team): ognuna ha già logo, numero di carte e nome. */
const PACK_ART: Record<string, string> = {
  COSTELLAZIONE: costellazione,
  ZENIT: zenit,
  LUNA_PIENA: lunaPiena,
}

/**
 * La busta di un pacchetto; per un pacchetto nuovo senza busta, quella del Costellazione.
 *
 * @param code Pacchetto.
 * @returns L'indirizzo dell'immagine.
 */
export function packArt(code: string): string {
  return PACK_ART[code] ?? costellazione
}
