import { plural } from '@/lib/plural'

/** Testi del Cielo (tavole Collezione-Cielo, Collezione-Cielo-Problemi, Collezione-Cielo-Errore). */
export const SKY_COPY = {
  title: 'Il tuo Cielo',
  deckChoiceLabel: 'Cieli salvati',
  deckChoicePlaceholder: 'Scegli un Cielo',
  deckCount: (current: number, max: number) => `${current} di ${max} Cieli`,
  createDeck: 'Crea un Cielo',
  creatingDeck: 'Creazione…',
  newDeckName: 'Nuovo Cielo',
  createDeckFailed:
    'Non è stato possibile creare il Cielo. Se la connessione è caduta, aggiorna l’elenco prima di riprovare.',
  deckLimitReached: (max: number) => `Hai già raggiunto il limite di ${max} Cieli.`,
  deckLimitHint: 'Hai raggiunto il numero massimo di Cieli.',
  rename: 'Rinomina il Cielo',
  nameLabel: 'Nome del Cielo',
  valid: 'Valido',
  /** @param n Problemi. */
  problems: (n: number) => plural(n, 'problema', 'problemi'),
  notValidForChallenges: 'Non valido per le sfide',
  unsaved: 'Modifiche non salvate',
  saved: 'Salvato',
  cancel: 'Annulla',
  save: 'Salva',
  saving: 'Salvataggio…',
  saveFailed: 'Il Cielo non si è salvato. Le tue scelte restano qui: riprova tra poco.',
  notOwned: "Una carta non è più tua (forse l'hai scambiata). Scegline un'altra.",
  faction: {
    title: 'La tua Fazione',
    /** @param n Carte del Cielo dell'elemento del Dio. */
    benefit: (n: number) =>
      `${plural(n, 'carta', 'carte')} ne ${n === 1 ? 'beneficia' : 'beneficiano'}`,
    none: 'Scegli una Fazione: il Dio dà un bonus alle carte del suo elemento.',
  },
  slot: {
    choose: 'Scegli il segno',
    chooseAscendant: "Scegli l'Ascendente",
    ascendant: 'Ascendente',
    /** @param names Carte del Cielo con lo stesso segno. */
    ascendantTargets: (names: string[]) =>
      names.length > 0
        ? `+1 ATK a: ${names.join(', ')}`
        : 'Nessuna carta di questo segno nel Cielo',
  },
  balance: {
    title: 'Equilibrio degli elementi · da 1 a 3 per elemento',
    ok: 'In equilibrio',
    off: 'Fuori equilibrio',
    range: 'da 1 a 3',
    /** @param count Carte. @param element Elemento. */
    label: (count: number, element: string) => `${element}: ${plural(count, 'carta', 'carte')}`,
  },
  warnings: {
    title: 'Da correggere',
    preview: 'Anteprima: il controllo definitivo lo fa il gioco quando lanci una sfida.',
    /** @param planets Pianeti mancanti. */
    missing: (planets: string) => `Manca${planets.includes(',') ? 'no' : ''} ${planets}.`,
    missingHint: 'Il Cielo ha 7 pianeti e un Ascendente.',
    /** @param name Primo pianeta mancante. */
    missingAction: (name: string) => `Scegli ${name}`,
    /** @param element "d'Acqua". */
    none: (element: string) => `Nessuna carta ${element}`,
    noneHint: '(servono da 1 a 3).',
    /** @param element "d'Acqua". */
    noneAction: (element: string) => `Scegli una carta ${element}`,
    /** @param element "di Fuoco". */
    tooMany: (element: string) => `Troppe carte ${element}`,
    /** @param n Quante. */
    tooManyHint: (n: number) => `(${n}, massimo 3).`,
    tooManyAction: 'Cambia una carta',
    server: 'Il gioco segnala un problema:',
  },
  picker: {
    /** @param name Pianeta o "l'Ascendente". */
    title: (name: string) => `Scegli ${name}`,
    element: 'Elemento',
    allElements: 'Tutti',
    sort: 'Ordina',
    sortCatalog: 'Catalogo',
    sortAtk: 'ATK',
    sortDef: 'DEF',
    showMissing: 'Mostra anche quelle che non hai',
    inSky: 'Nel Cielo',
    printed: 'Stampati',
    missing: 'Non la possiedi: si ottiene da pacchetti o scambi',
    /** @param counts "Fuoco 4/3 · Acqua 0/1". */
    consequence: (counts: string) => `Con questa carta: ${counts}`,
    /** @param name Pianeta. */
    empty: (name: string) => `Non hai ancora carte di ${name}.`,
    emptyHint: 'Le trovi nei pacchetti del Negozio e negli scambi.',
    toShop: 'Vai al Negozio',
    noAscendant: 'Non hai ancora Ascendenti.',
    hint: 'Tocca una casella del Cielo per scegliere la sua carta.',
    ascendantRule:
      "L'Ascendente dà +1 ATK quando attaccano le carte del Cielo con il suo stesso segno.",
  },
  noDeck: {
    title: 'Non hai ancora un Cielo',
    text: 'Crea il tuo primo Cielo e scegli le carte per i sette pianeti e l’Ascendente.',
  },
} as const
