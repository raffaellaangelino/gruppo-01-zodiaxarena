import { toSignCode } from '@/domain/rules'
import { request } from '@/lib/http'
import type {
  NicknameAvailabilityDto,
  RegisterRequestDto,
  RegisterResponseDto,
  RegistrationPreview,
  RegistrationPreviewDto,
} from '@/features/registration/types'

/**
 * Chiamate della registrazione. Sono tutte anonime (`token: null`): si fanno prima di avere
 * una sessione, e un token vecchio rimasto nel browser non deve viaggiare con loro.
 */

/**
 * Il segno e cosa riceverà il giocatore, dalla data di nascita, senza creare l'account:
 * `POST /api/auth/register/preview`.
 *
 * @param birthDate Data `AAAA-MM-GG`, già controllata.
 * @param signal Per annullare la richiesta.
 * @returns Segno, elemento, Fazione proposta, crediti e creature del primo cielo.
 * @throws {import('@/lib/http').ApiError} 400 se la data non è valida, 0 se il server non risponde.
 */
export async function fetchRegistrationPreview(
  birthDate: string,
  signal?: AbortSignal,
): Promise<RegistrationPreview> {
  const dto = await request<RegistrationPreviewDto>('/auth/register/preview', {
    method: 'POST',
    body: { birthDate },
    token: null,
    signal,
  })
  const sign = toSignCode(dto.sunSign)
  if (!sign) throw new Error(`Segno sconosciuto nell'anteprima: ${dto.sunSign}`)
  return {
    sign,
    element: dto.element,
    proposedGod: dto.proposedFaction,
    credits: dto.welcomeCounts.credits,
    creatureCards: dto.welcomeCounts.creatureCards,
    ascendants: dto.welcomeCounts.ascendants,
  }
}

/**
 * Dice se un nickname è libero: `GET /api/auth/nickname-available`.
 * Maiuscole e minuscole non contano ("Lyra" e "lyra" sono lo stesso nome).
 *
 * @param nickname Nickname scritto, già nel formato giusto.
 * @param signal Per annullare la richiesta (ogni lettera nuova annulla la precedente).
 * @returns Vero se è libero.
 */
export async function checkNicknameAvailable(
  nickname: string,
  signal?: AbortSignal,
): Promise<boolean> {
  const query = new URLSearchParams({ nickname })
  const { available } = await request<NicknameAvailabilityDto>(
    `/auth/nickname-available?${query}`,
    { token: null, signal },
  )
  return available
}

/**
 * Crea l'account: `POST /api/auth/register`. Il backend crea anche il giocatore con 300 crediti,
 * il primo cielo e il mazzo, e risponde con il token della sessione.
 *
 * @param data Dati del modulo, nella forma del backend.
 * @returns Il token JWT della nuova sessione.
 * @throws {import('@/lib/http').ApiError} 409 con `EMAIL_TAKEN` o `NICKNAME_TAKEN`, 400 con gli
 *   errori per campo, 0 se il server non risponde.
 */
export async function registerRequest(data: RegisterRequestDto): Promise<string> {
  const { token } = await request<RegisterResponseDto>('/auth/register', {
    method: 'POST',
    body: data,
    token: null,
  })
  return token
}
