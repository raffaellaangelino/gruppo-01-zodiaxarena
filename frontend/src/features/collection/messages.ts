import { plural } from '@/lib/plural'

/** Testi della Collezione (tavole Collezione, Collezione-Filtrata, Collezione-Dettaglio, Collezione-Vuota). */
export const COLLECTION_COPY = {
  title: 'Collezione',
  tabs: { cards: 'Carte', sky: 'Il tuo Cielo' },
  tabsLabel: 'Sezioni della Collezione',
  progress: {
    creatures: 'Carte',
    ascendants: 'Ascendenti',
    /** @param done Fatte. @param total In tutto. @param what "carte" o "Ascendenti". */
    label: (done: number, total: number, what: string) => `${what}: ${done} su ${total}`,
  },
  filters: {
    label: 'Filtri della Collezione',
    element: 'Elemento',
    tier: 'Rarità',
    more: 'Altri filtri',
    sign: 'Segno',
    state: 'Stato',
    anySign: 'Tutti i segni',
    onlyOwned: 'Solo possedute',
    reset: 'Azzera',
    /** @param n Filtri attivi in "Altri filtri". */
    moreActive: (n: number) => `${n} attivi`,
    /** @param label Filtro. */
    remove: (label: string) => `Togli il filtro ${label}`,
  },
  /** @param n Copie in più. */
  duplicates: (n: number) => plural(n, 'doppione', 'doppioni'),
  /** @param total Carte nella lista. @param owned Possedute. */
  count: (total: number, owned: number) =>
    `${plural(total, 'carta', 'carte')} · ${plural(owned, 'posseduta', 'possedute')}`,
  albumLabel: 'Album delle carte',
  /** @param owned Possedute. @param total Del gruppo. */
  groupCount: (owned: number, total: number) => `${owned} / ${total}`,
  empty: {
    title: 'La tua collezione è vuota',
    text: 'Apri un pacchetto nel Negozio per avere le prime carte.',
  },
  noResults: {
    title: 'Nessuna carta corrisponde',
    text: 'Togli un filtro per vedere più carte.',
    action: 'Azzera i filtri',
  },
  detail: {
    attack: 'Attacco',
    defense: 'Difesa',
    planet: 'Pianeta',
    sign: 'Segno',
    house: 'Casa',
    ascendant: 'Ascendente',
    previous: 'Carta precedente',
    next: 'Carta successiva',
    /** @param n Copie possedute. */
    owned: (n: number) => (n > 1 ? `Ne hai ${n}.` : "Ce l'hai."),
    missing: "Non ce l'hai ancora.",
    inDeck: 'È nel tuo Cielo.',
    isNew: "Nuova: non l'avevi ancora vista.",
  },
} as const
