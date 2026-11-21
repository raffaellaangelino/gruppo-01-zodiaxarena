import { useId } from 'react'

/** Colori della gemma, dal sorgente della carta (500×700): ATK rosso, DEF blu. */
const GEM = {
  atk: { top: '#FF5A4E', bottom: '#9E1838' },
  def: { top: '#3D6BFF', bottom: '#16206E' },
} as const

/** Icone stampate sulla carta, in alto nella gemma. */
const ICON = {
  atk: 'M0 -10 L2.4 -5 L2.4 3 L6 3 L6 5 L1.6 5 L1.6 9 L-1.6 9 L-1.6 5 L-6 5 L-6 3 L-2.4 3 L-2.4 -5 Z',
  def: 'M0 -9 L8 -6 L8 0 Q8 7 0 10 Q-8 7 -8 0 L-8 -6 Z',
} as const

/** Proprietà di {@link StatMedal}. */
export interface StatMedalProps {
  kind: 'atk' | 'def'
  /** Valore già formattato ("12", "−2"). */
  value: string
  /** DEF sotto quella d'ingresso: numero in rosso chiaro, come nei card game. */
  hurt?: boolean
}

/**
 * Medaglione di ATK o DEF della carta, replicato 1:1 dal sorgente (bordo notte r33, gemma r29
 * con anello d'oro, icona crema, numero Cinzel 900): nel Rotolo si posa sopra quello stampato
 * con il valore del momento (tavola Sfide-Rotolo). Riempie il contenitore; è decorativo, il
 * valore lo dice chi lo usa.
 */
export function StatMedal({ kind, value, hurt = false }: StatMedalProps) {
  const id = useId()
  const gem = GEM[kind]
  return (
    <svg viewBox="-33 -33 66 66" aria-hidden="true" className="block size-full overflow-visible">
      <defs>
        <linearGradient id={`${id}-gem`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={gem.top} />
          <stop offset="1" stopColor={gem.bottom} />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--za-card-gold-light)" />
          <stop offset=".45" stopColor="var(--za-card-gold-mid)" />
          <stop offset="1" stopColor="var(--za-card-gold-dark)" />
        </linearGradient>
      </defs>
      <circle r="33" fill="var(--za-medallion-core)" />
      <circle r="29" fill={`url(#${id}-gem)`} stroke={`url(#${id}-gold)`} strokeWidth="3.5" />
      <path d={ICON[kind]} transform="translate(0 -16) scale(.8)" fill="var(--za-clasp-light)" />
      <text
        y="17"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontWeight="900"
        fontSize={value.length > 2 ? 21 : 25}
        fill={hurt ? 'var(--za-stat-hurt)' : '#FFFFFF'}
        stroke="#2A0A1A"
        strokeWidth={hurt ? 3 : 0.6}
        paintOrder="stroke"
        className="tabular-nums"
      >
        {value}
      </text>
    </svg>
  )
}
