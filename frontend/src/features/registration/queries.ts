import { queryOptions } from '@tanstack/react-query'
import { checkNicknameAvailable, fetchRegistrationPreview } from '@/features/registration/api'

/** Chiavi e funzioni delle richieste della registrazione, in un posto solo. */

/**
 * Disponibilità di un nickname. La chiave è in minuscolo: per il backend "Lyra" e "lyra"
 * sono lo stesso nome, quindi la risposta vale per entrambi.
 *
 * @param nickname Nickname nel formato giusto.
 * @returns Le opzioni della richiesta.
 */
export const nicknameAvailabilityQuery = (nickname: string) =>
  queryOptions({
    queryKey: ['registration', 'nickname', nickname.toLowerCase()],
    queryFn: ({ signal }) => checkNicknameAvailable(nickname, signal),
  })

/**
 * Anteprima di cosa riceve il giocatore dal suo giorno di nascita. Per una data la risposta
 * non cambia mai: non si riscarica.
 *
 * @param birthDate Data `AAAA-MM-GG`.
 * @returns Le opzioni della richiesta.
 */
export const registrationPreviewQuery = (birthDate: string) =>
  queryOptions({
    queryKey: ['registration', 'preview', birthDate],
    queryFn: ({ signal }) => fetchRegistrationPreview(birthDate, signal),
    staleTime: Infinity,
  })
