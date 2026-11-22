import type { SlotType } from '@/features/shop/types'

/** Rarità degli slot: singolare e plurale ("3 Comuni · 1 Rara · 1 Stella"). */
export const SLOT_LABELS: Record<SlotType, [string, string]> = {
  COMMON: ['Comune', 'Comuni'],
  RARE: ['Rara', 'Rare'],
  EPIC: ['Epica', 'Epiche'],
  ASCENDANT: ['Ascendente', 'Ascendenti'],
  STAR: ['Stella', 'Stelle'],
}

/** Testi del Negozio (tavole Negozio, Negozio-Conferma, Negozio-Apertura, Negozio-Riepilogo). */
export const SHOP_COPY = {
  title: 'Negozio',
  credits: 'crediti',
  open: 'Apri',
  cards: (n: number) => `${n} carte`,
  balanceAfter: 'Saldo dopo:',
  short: (n: number) => `Ti mancano ${n} crediti`,
  limitReached: (days: number) => `Già aperto in questo ciclo · torna tra ${days} giorni`,
  oncePerCycle: '1 per ciclo lunare',
  ascendantGuaranteed: '1 Ascendente garantito',
  band: {
    sun: (n: number) => ['Sole garantito entro', `${n}`, n === 1 ? 'Stella' : 'Stelle'] as const,
    sunNote: 'ogni pacchetto ha una Stella; vale su tutti',
    noDuplicates: 'Niente doppioni di Epiche e Leggendarie',
    noDuplicatesNote: 'finché non le hai tutte',
    star: 'La Stella: Rara 60% · Epica 30%',
    starNote: 'Leggendaria 8% · Ascendente 2% ·',
    allOdds: 'Tutte le probabilità ›',
  },
  confirm: {
    title: (name: string) => `Aprire ${name}?`,
    balance: (from: number, to: number) => [`saldo ${from} →`, `${to}`] as const,
    reassure: 'Le carte sono tue appena le apri, anche se chiudi prima della fine.',
    cancel: 'Annulla',
    open: (price: number) => `Apri · ${price}`,
    opening: 'Apertura…',
    failed: 'Il pacchetto non si è aperto. Non ti abbiamo tolto crediti: riprova.',
  },
  opening: {
    back: 'Negozio',
    revealAll: 'Rivela tutto',
    progress: (n: number, total: number) => `Apertura · ${n} di ${total}`,
    star: 'La Stella',
    starNote: 'si gira per ultima',
    summaryEyebrow: (name: string) => `${name} · Riepilogo`,
    summaryTitle: (n: number) =>
      n === 0
        ? 'Nessuna carta nuova questa volta'
        : n === 1
          ? 'Una carta nuova per il tuo cielo'
          : `${n} carte nuove per il tuo cielo`,
    newForYou: 'Nuova per te',
    duplicate: (v: number) => ['Doppione ·', `+${v}`, 'se lo ricicli'] as const,
    tally: (news: number, dups: number) =>
      `${news} ${news === 1 ? 'nuova' : 'nuove'} · ${dups} ${dups === 1 ? 'doppione' : 'doppioni'}`,
    recycle: (v: number) => `(+${v} crediti se li ricicli)`,
    toCollection: 'Vai alla Collezione',
    another: (price: number) => `Aprine un altro · ${price}`,
    balance: 'Saldo:',
    notFound: 'Questa apertura non si trova più.',
    notFoundHint: 'Le carte aperte sono nella tua Collezione.',
  },
} as const
