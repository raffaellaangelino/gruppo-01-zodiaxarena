const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Data ISO a qualche giorno da adesso: i dati di esempio restano credibili in ogni giorno
 * (una sfida "ricevuta oggi" è sempre di oggi).
 *
 * @param days Giorni da aggiungere (negativi = nel passato).
 * @returns La data in formato ISO 8601.
 */
export function daysFromNow(days: number): string {
  return new Date(Date.now() + days * DAY_MS).toISOString()
}
