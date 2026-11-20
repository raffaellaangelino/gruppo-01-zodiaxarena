import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { nicknameAvailabilityQuery } from '@/features/registration/queries'
import type { NicknameStatus } from '@/features/registration/types'
import { isNicknameFormatValid } from '@/features/registration/validation'

/** Pausa nella scrittura prima di chiedere al server (ms). */
const CHECK_DELAY_MS = 400

/**
 * Controlla se il nickname è libero mentre il giocatore lo scrive (tavola Registrati:
 * "Disponibile"). Chiede al server solo quando il formato è giusto e la scrittura si ferma.
 *
 * @param nickname Nickname scritto.
 * @returns `idle` se il formato non è ancora giusto, poi `checking`, `available`, `taken`,
 *   oppure `unknown` se il server non risponde (non blocca: il controllo vero è alla fine).
 */
export function useNicknameCheck(nickname: string): NicknameStatus {
  const trimmed = nickname.trim()
  const formatValid = isNicknameFormatValid(trimmed)
  const settled = useDebouncedValue(trimmed, CHECK_DELAY_MS)
  const isSettled = settled === trimmed

  const query = useQuery({
    ...nicknameAvailabilityQuery(settled),
    enabled: formatValid && isSettled,
  })

  if (!formatValid) return 'idle'
  if (!isSettled || query.isPending) return 'checking'
  if (query.isError) return 'unknown'
  return query.data ? 'available' : 'taken'
}
