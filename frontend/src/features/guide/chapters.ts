export interface GuideChapter {
  id: string
  title: string
  intro: string
  points: string[]
}

export const GUIDE_CHAPTERS: GuideChapter[] = [
  {
    id: 'in-breve',
    title: 'In breve',
    intro:
      'Prepara il tuo Cielo prima della partita: durante lo scontro le creature si affrontano una alla volta.',
    points: [
      'Scegli le carte con cui vuoi giocare.',
      'Ogni creatura attacca e difende usando i propri valori.',
      'Porta a zero i Punti Vita dell’Astromante avversario per vincere.',
    ],
  },
  {
    id: 'la-carta',
    title: 'La carta',
    intro: 'Ogni carta è una creatura. La definiscono tre cose: il pianeta, il segno e la casa.',
    points: [],
  },
  {
    id: 'gli-elementi',
    title: 'Gli elementi',
    intro:
      'Fuoco, Acqua, Terra e Aria identificano la natura di una creatura e contribuiscono alle sue abilità.',
    points: [
      'L’elemento è determinato dal segno.',
      'Gli elementi possono ottenere vantaggi durante lo scontro.',
      'Le carte d’Aria hanno valori variabili, determinati dal lancio dei dadi.',
    ],
  },
  {
    id: 'il-tuo-cielo',
    title: 'Il tuo Cielo',
    intro:
      'Il Cielo è il mazzo che prepari prima di entrare in partita: scegli le creature con cui affrontare l’avversario.',
    points: [
      'Rivedi le carte disponibili nella tua Collezione.',
      'Componi il mazzo prima che inizi lo scontro.',
      'Le creature del Cielo entrano in gioco una alla volta.',
    ],
  },
  {
    id: 'lo-scontro',
    title: 'Lo scontro',
    intro:
      'Durante la partita non giochi tu: le creature escono dal mazzo mescolato e si affrontano una contro una. Le tue scelte le fai prima, quando componi il Cielo.',
    points: [],
  },
  {
    id: 'fine-della-partita',
    title: 'Fine della partita',
    intro:
      'Vinci quando l’Astromante avversario raggiunge zero Punti Vita. Se le carte finiscono prima, vince chi ha più Punti Vita.',
    points: [
      'La partita finisce quando un Astromante arriva a 0 PV.',
      'Se entrambi gli Astromanti restano senza carte, si confrontano i PV rimasti.',
      'Il capitolo sullo scontro spiega come si assegnano i danni.',
    ],
  },
  {
    id: 'fazioni',
    title: 'Fazioni',
    intro:
      'La tua Fazione rappresenta l’alleanza divina scelta dal tuo Astromante e influenza le creature del suo elemento.',
    points: [
      'Efesto favorisce il Fuoco con +2 ATK.',
      'Poseidone favorisce l’Acqua con +3 DEF.',
      'Demetra e Era danno rispettivamente +1 ATK e +1 DEF a Terra e Aria.',
    ],
  },
  {
    id: 'case',
    title: 'Case',
    intro:
      'Ogni carta appartiene a una Casa, che le assegna un’abilità. Al lancio tutte le carte sono della Casa I.',
    points: [
      'La Casa I assegna +2 DEF quando la carta entra in gioco.',
      'Le abilità della Casa si applicano alla creatura durante la partita.',
      'Ogni tre mesi arriva una Casa nuova.',
    ],
  },
]
