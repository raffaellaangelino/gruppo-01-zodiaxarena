export interface GlossaryTerm {
  term: string
  definition: string
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Ascendente',
    definition:
      'Carta speciale, una per Cielo. Non combatte: dà +1 ATK alle tue creature del suo segno.',
  },
  { term: 'Astromante', definition: 'Il giocatore: sei tu.' },
  {
    term: 'Casa',
    definition: "Una delle 12 case astrologiche. Dà alla carta un'abilità. Non è la Fazione.",
  },
  { term: 'Cielo', definition: "Il tuo mazzo: 7 creature, una per pianeta, più l'Ascendente." },
  { term: 'Creatura', definition: 'Una carta di gioco: pianeta + segno + casa.' },
  {
    term: 'Elemento',
    definition: 'Fuoco, Acqua, Terra o Aria. Lo decide il segno; ognuno batte un altro elemento.',
  },
  {
    term: 'Fazione',
    definition:
      'Il Dio che hai scelto sull’account. Potenzia le creature del suo elemento in tutti i tuoi Cieli.',
  },
  {
    term: 'PV · Punti Vita',
    definition: "La vita dell'Astromante: 10 a partita. La DEF, invece, è la vita della creatura.",
  },
  {
    term: 'Rotolo di Lachesi',
    definition: 'Il racconto della partita, colpo per colpo, con la spiegazione di ogni numero.',
  },
  { term: 'Round', definition: 'Uno scambio di colpi tra due creature.' },
  {
    term: 'Stella',
    definition:
      'L’ultima carta di ogni pacchetto. La sua rarità è a sorte: Rara, Epica, Leggendaria o Ascendente.',
  },
  {
    term: 'Tier',
    definition: 'La rarità: Comune, Rara, Epica, Leggendaria. La decide il pianeta.',
  },
  {
    term: 'Turno',
    definition: 'Dalla pesca fino a quando una creatura cade: può durare più round.',
  },
]
