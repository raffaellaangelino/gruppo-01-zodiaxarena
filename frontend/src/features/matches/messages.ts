import type { MatchOutcome } from '@/features/matches/types'

/** Testi del Rotolo (cronaca) e del Verdetto (tavole Sfide-Rotolo, Sfide-Verdetto, Sconfitta, Pareggio). */
export const MATCH_COPY = {
  back: 'Torna alle sfide',
  skip: 'Salta al risultato',
  replay: 'Riguarda il Rotolo',
  chronicleTitle: 'Il Rotolo di Lachesi',
  toVerdict: 'Vai al Verdetto',
  moments: {
    WIN: 'Cosa ha deciso la partita',
    LOSS: 'Cosa puoi cambiare',
    DRAW: 'Il filo della partita',
  } satisfies Record<MatchOutcome, string>,
  rematch: 'Rivincita',
  editSky: 'Modifica il Cielo',
  outcome: {
    WIN: { word: 'Vittoria', phrase: '«Il filo è tagliato. Il cielo, per stanotte, è tuo.»' },
    LOSS: { word: 'Sconfitta', phrase: '«Ogni filo si riannoda: il cielo resta da contendere.»' },
    DRAW: { word: 'Pareggio', phrase: '«Due fili della stessa lunghezza. Li taglio insieme.»' },
  } satisfies Record<MatchOutcome, { word: string; phrase: string }>,
  atropo: 'Atropo',
  /** Racconto nell'arena (tavola Sfide-Rotolo). */
  arena: {
    exit: 'Esci dal Rotolo',
    you: 'tu',
    /** @param n Carte ancora nel mazzo. */
    toDraw: (n: number) => `${n} da pescare`,
    /** @param left Da pescare. @param inPlay In gioco. @param fallen Cadute. */
    deckLabel: (left: number, inPlay: number, fallen: number) =>
      `${left} da pescare, ${inPlay} in gioco, ${fallen} cadute`,
    /** @param hp PV rimasti. @param total PV iniziali. */
    hpLabel: (hp: number, total: number) => `${hp} PV su ${total}`,
    round: 'Round',
    turn: 'Turno',
    fallsNow: 'Cade in questo round',
    fallen: 'Caduta',
    /** @param max DEF all'ingresso. */
    ofMax: (max: number) => `su ${max}`,
    atk: 'ATK',
    def: 'DEF',
    attackOf: (name: string) => `Attacco di ${name}`,
    defenseOf: (name: string) => `Difesa di ${name}`,
    /** @param label Voce della base ("Leone" o "Dadi d'Aria"). */
    base: (label: string) => (label === "Dadi d'Aria" ? label : `${label}, base`),
    atEntry: "All'ingresso",
    hit: (name: string) => `Colpo di ${name}`,
    roundShort: (n: number) => `round ${n}`,
    now: 'Ora',
    thisRound: 'Questo round',
    /** @param stat ATK o DEF. @param value Valore. @param name Carta. */
    openBreakdown: (stat: string, value: string, name: string) =>
      `${stat} ${value} di ${name}: mostra il calcolo`,
    closeBreakdown: 'Chiudi il calcolo',
    chronicle: 'Cronaca',
    expand: 'Espandi la cronaca',
    collapse: 'Riduci la cronaca',
    /** @param turn Turno. @param round Round. */
    turnRound: (turn: number, round: number) => `Turno ${turn} · Round ${round}`,
    previous: 'Evento precedente',
    next: 'Evento successivo',
    play: 'Riprendi',
    pause: 'Pausa',
    restart: 'Riguarda da capo',
    stay: 'Resta nel Rotolo',
    verdictSoon: 'Tra poco si apre il Verdetto. Premi Pausa per restare nel Rotolo.',
    /** @param speed Velocità attuale. */
    speed: (speed: number) => `Velocità ${speed}×, passa a ${speed === 1 ? 2 : 1}×`,
    /** @param turn Turno. @param round Round. @param total Round della partita. */
    progress: (turn: number, round: number, total: number) =>
      `Turno ${turn}, round ${round} di ${total}`,
    goToRound: (n: number) => `Vai al round ${n}`,
    /** @param me Chi guarda. @param opponent Avversario. */
    title: (me: string, opponent: string) => `Rotolo di Lachesi: ${me} contro ${opponent}`,
  },
  notFound: {
    title: 'Questa partita non è qui',
    text: 'Non esiste, oppure è una partita tra altri giocatori.',
  },
} as const
