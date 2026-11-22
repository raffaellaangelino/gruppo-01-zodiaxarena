/**
 * Testi della landing (S01). Partono da quelli della landing del team su `main` (PR #95).
 */
export const LANDING_COPY = {
  gifts: {
    label: 'In regalo',
    items: ['Il Sole del tuo segno', '7 carte', '300 crediti'],
  },
  bar: {
    sections: 'Sezioni della pagina',
    login: 'Accedi',
    play: 'Gioca gratis',
  },
  hero: {
    eyebrow: 'Gioco di carte collezionabili · Astrologia e mito greco',
    title: ['Gioca con', 'il tuo segno'],
    tagline: 'Il destino fa il resto.',
    cta: 'Gioca gratis',
    hasAccount: 'Hai già un account?',
    login: 'Accedi',
    scroll: 'Scopri il gioco',
  },
  sign: {
    eyebrow: 'Il tuo segno',
    title: 'Il tuo Sole ti aspetta.',
    lore: "Il Sole del tuo segno è la prima carta del tuo Cielo: è tuo dal primo istante e nessuno può portartelo via. Gli altri sei pianeti e l'Ascendente li scegli tu.",
    pick: 'Scegli un segno',
    hint: 'Scegli il tuo segno sulla ruota',
    element: 'Elemento',
    faction: 'Fazione proposta',
  },
  factions: {
    eyebrow: 'Le Fazioni',
    title: 'Quattro dèi, un solo trono.',
    lore: 'Ognuno potenzia le carte del suo elemento. Nessuno ammetterà mai di aver bisogno di te.',
    tabs: 'Scegli un Dio',
    signs: 'I suoi segni',
  },
  match: {
    eyebrow: 'Come si gioca',
    title: 'Tu componi il cielo. La partita si gioca da sola.',
    steps: [
      {
        title: 'Componi il cielo',
        text: 'Sette pianeti, un Ascendente e un Dio: combina gli elementi per potenziare il mazzo.',
      },
      {
        title: 'Lancia la sfida',
        text: 'Sfida un amico o un altro Astromante: si gioca appena accetta.',
      },
      {
        title: 'Lascia fare alle Moire',
        text: 'Mescolano i mazzi, giocano la partita e te la raccontano round per round.',
      },
    ],
  },
  free: {
    eyebrow: 'Gratis',
    title: 'Gratis, sul serio.',
    pack: 'Pacchetto Costellazione',
    rows: [
      {
        title: 'Niente paga per vincere',
        text: 'I pacchetti si aprono con i crediti, e i crediti si guadagnano giocando. Qui il portafoglio non sposta nemmeno una stella.',
      },
      {
        title: 'Scambia le carte',
        text: 'Ti manca un pianeta? Trattate, scambiate e restate amici, se ci riuscite.',
      },
    ],
  },
  join: {
    hermes:
      '«Il trono è vuoto, lassù litigano e cercano Astromanti. Dimmi quando sei nato e ti consegno il Sole del tuo segno. Il resto del cielo te lo guadagni.»',
    hermesSign: 'Ermes, messaggero degli dèi',
    hermesAlt: 'Ermes',
    title: 'Diventa un Astromante',
    cta: 'Gioca gratis',
  },
} as const
