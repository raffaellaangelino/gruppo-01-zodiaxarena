import type { ReactNode } from 'react'
import { CARD_BACK } from '@/components/game/cardBack'
import { GoldClasp } from '@/components/ornaments/GoldClasp'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Pill } from '@/components/ui/Pill'
import { Spark } from '@/components/ui/Spark'
import { plural } from '@/lib/plural'
import './GameCard.css'

/**
 * Taglie della carta (COMPONENTS, Carta): larghezza in px; l'altezza segue il 5:7.
 * `fluid` riempie la colonna di una griglia (album della Collezione) con i segni della M.
 */
const SIZES = { xs: 40, m: 132, l: 260, fluid: 132 } as const

/** Etichetta di contesto al centro in basso (es. "Nel mazzo", "Non scambiabile"). */
export interface CardTag {
  text: string
  icon?: IconName
}

/** Proprietà di {@link GameCard}. */
export interface GameCardProps {
  /** Illustrazione; `null` mostra il dorso. */
  imageUrl: string | null
  /** Nome della carta ("Sole in Leone"): è il nome accessibile, a cui si aggiungono gli stati. */
  label: string
  /**
   * `xs` 40: solo immagine (ventaglio, cronaca) · `m` 132: Collezione, selettore, scambi ·
   * `l` 260: dettaglio e rivelazioni · `fluid`: larga quanto la colonna (album). Sotto 120 i
   * dati della carta vanno ripetuti fuori.
   */
  size?: keyof typeof SIZES
  /** Non posseduta: l'illustrazione vera, spenta, con "Mancante". */
  missing?: boolean
  /** Testo sulla carta mancante al posto di "Mancante" (album: il numero di catalogo, "003"). */
  missingLabel?: string
  /** Mai vista: pillola d'oro "Nuova" sopra il bordo, al centro. */
  isNew?: boolean
  /** Copie possedute: da 2 in su compare "×N" sul bordo destro. */
  copies?: number
  /** Etichetta di contesto al centro in basso. */
  tag?: CardTag
  /** Carta presente ma non utilizzabile qui (es. non scambiabile): più trasparente. */
  dimmed?: boolean
  /** Scelta: filo acceso e fermaglio, come la voce attiva della barra. */
  selected?: boolean
  /** Rende la carta un pulsante (si alza al passaggio del mouse). */
  onSelect?: () => void
  className?: string
}

/**
 * Carta del gioco (COMPONENTS, Carta; tavola "Carta"). L'immagine è un asset finito con la
 * cornice del suo tier: l'interfaccia non la ridisegna, la incornicia e aggiunge solo segni
 * di stato, fuori dalle zone che servono al gioco (rarità, elemento, ATK, DEF, nome).
 * Regola: al massimo due segni per carta; sotto la taglia M non ce ne sono.
 *
 * @example <GameCard imageUrl={card.imageUrl} label={card.name} copies={2} isNew />
 */
export function GameCard({
  imageUrl,
  label,
  size = 'm',
  missing = false,
  missingLabel = 'Mancante',
  isNew = false,
  copies = 1,
  tag,
  dimmed = false,
  selected = false,
  onSelect,
  className = '',
}: GameCardProps) {
  const width = SIZES[size]
  const withMarks = size !== 'xs'
  const states = [
    missing && 'mancante',
    isNew && 'nuova',
    copies > 1 && plural(copies, 'copia', 'copie'),
    tag?.text.toLowerCase(),
    selected && 'scelta',
  ].filter(Boolean)
  const accessibleName = [label, ...states].join(', ')

  const content: ReactNode = (
    <>
      <img
        src={imageUrl ?? CARD_BACK}
        alt={onSelect ? '' : accessibleName}
        width={width}
        height={Math.round(width * 1.4)}
        loading="lazy"
        decoding="async"
        className={`game-card__image ${missing ? 'game-card__image--missing' : ''}`}
      />
      {/* I segni ripetono gli stati già detti nel nome accessibile: per gli screen reader si nascondono */}
      <span aria-hidden="true" className="contents">
        {withMarks && missing && (
          <Pill tone="muted" className="absolute bottom-2.5 left-1/2 -translate-x-1/2 tabular-nums">
            {missingLabel}
          </Pill>
        )}
        {withMarks && isNew && (
          <Pill
            tone="gold"
            icon={<Spark />}
            className="absolute -top-2.5 left-1/2 -translate-x-1/2"
          >
            Nuova
          </Pill>
        )}
        {withMarks && copies > 1 && (
          <Pill tone="outline" className="absolute top-[44%] -right-2">
            ×{copies}
          </Pill>
        )}
        {withMarks && tag && (
          <Pill
            tone="muted"
            icon={tag.icon && <Icon name={tag.icon} size={14} className="text-gold-bright" />}
            className="absolute bottom-[30%] left-1/2 -translate-x-1/2 text-text"
          >
            {tag.text}
          </Pill>
        )}
        {selected && <GoldClasp className="absolute -top-2.75 left-1/2 z-10 -translate-x-1/2" />}
      </span>
    </>
  )

  const classes = [
    'game-card',
    `game-card--${size}`,
    selected && 'game-card--selected',
    dimmed && 'opacity-55',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (onSelect) {
    return (
      <button
        type="button"
        aria-pressed={selected}
        aria-label={accessibleName}
        onClick={onSelect}
        className={`${classes} game-card--interactive`}
        style={{ width: size === 'fluid' ? '100%' : width }}
      >
        {content}
      </button>
    )
  }
  return (
    <span className={classes} style={{ width: size === 'fluid' ? '100%' : width }}>
      {content}
    </span>
  )
}
