import { plural } from '@/lib/plural'

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Giorni interi che mancano a una data (arrotondati per eccesso: "tra 1 giorno" finché non è passata).
 *
 * @param iso Data in formato ISO 8601, come la manda il backend.
 * @param now Istante di riferimento (predefinito: adesso).
 * @returns I giorni mancanti, mai negativi.
 */
export function daysUntil(iso: string, now: number = Date.now()): number {
  return Math.max(0, Math.ceil((Date.parse(iso) - now) / DAY_MS))
}

/**
 * Da quanto tempo è successo qualcosa, in parole: "oggi", "ieri", "3 giorni fa".
 *
 * @param iso Data in formato ISO 8601.
 * @param now Istante di riferimento (predefinito: adesso).
 * @returns Il testo da mostrare.
 */
export function daysAgoLabel(iso: string, now: number = Date.now()): string {
  const startOfDay = (t: number) => new Date(t).setHours(0, 0, 0, 0)
  const days = Math.round((startOfDay(now) - startOfDay(Date.parse(iso))) / DAY_MS)
  if (days <= 0) return 'oggi'
  if (days === 1) return 'ieri'
  return `${plural(days, 'giorno', 'giorni')} fa`
}

/** Giorno e mese brevi, all'italiana ("8 nov"). */
const SHORT_DATE = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' })

/**
 * Data breve per le righe delle liste: "oggi", "ieri", poi "8 nov".
 *
 * @param iso Data in formato ISO 8601.
 * @param now Istante di riferimento (predefinito: adesso).
 * @returns Il testo da mostrare.
 */
export function shortDateLabel(iso: string, now: number = Date.now()): string {
  const ago = daysAgoLabel(iso, now)
  return ago === 'oggi' || ago === 'ieri'
    ? ago
    : SHORT_DATE.format(Date.parse(iso)).replace('.', '')
}
