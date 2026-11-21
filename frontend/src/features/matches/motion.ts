/**
 * Tempi delle micro-animazioni del Rotolo, in ms a velocità 1× (a 2× durano la metà).
 * Un solo posto: ogni movimento del Racconto legge da qui, così la sequenza del colpo resta
 * coerente (ux/challenge-replay.md, "Momenti con un trattamento dedicato").
 *
 * Colpo simultaneo, in ordine: le carte scattano insieme → il danno compare e la DEF scende →
 * chi va a 0 cade → il danno in eccesso vola ai PV → le stelle si spengono una alla volta.
 */
export const MOTION = {
  enter: {
    /** La carta sale sulla pozza. */
    card: 420,
    /** I bonus all'ingresso compaiono uno dopo l'altro. */
    bonusDelay: 280,
    bonusStagger: 120,
    bonus: 260,
    /** Il dado d'Aria gira e si ferma sul valore dell'engine. */
    dice: 700,
  },
  advantage: {
    /** Gli stemmi pulsano, la freccia passa dall'uno all'altro, "+1" sale dal medaglione ATK. */
    pulse: 600,
    boostDelay: 180,
    boost: 900,
  },
  clash: {
    lunge: 450,
    /** Il colpo arriva a metà dello scatto. */
    impact: 225,
    float: 900,
    count: 600,
    fall: 1050,
    chipDelay: 1150,
    chip: 600,
    starsDelay: 1650,
    starStagger: 90,
    star: 240,
  },
  round: { flip: 300 },
  end: {
    cut: 700,
    ctaDelay: 500,
    cta: 360,
    /**
     * Se la partita è arrivata alla fine da sola, si passa al Verdetto dopo questo tempo
     * (dall'inizio dell'ultimo momento): si vedono il filo tagliato e l'ultima riga, poi il
     * pulsante con il filo che si riempie.
     */
    autoVerdict: 3000,
  },
} as const

/** Uscita morbida per le entrate (token --za-ease-out). */
export const EASE_OUT = 'cubic-bezier(0.2, 0.7, 0.2, 1)'
/** Andata e ritorno (token --za-ease-inout). */
export const EASE_INOUT = 'cubic-bezier(0.65, 0, 0.35, 1)'
