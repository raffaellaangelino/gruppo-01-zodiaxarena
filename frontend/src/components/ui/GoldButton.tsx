import { useId, useState, type ComponentPropsWithoutRef } from 'react'
import { Link, type LinkProps } from 'react-router'
import { useElementSize } from '@/hooks/useElementSize'
import { buttonNotchRadius, notchPath } from '@/lib/notchPath'
import './GoldButton.css'

/** Proprietà comuni a pulsante e collegamento d'oro. */
interface GoldCommonProps {
  /**
   * Eroico: aggiunge il fermaglio a rombo sul bordo alto.
   * Uno solo per schermata (FOUNDATIONS §4).
   */
  hero?: boolean
  /** Misura: `l` = 56 px con testo 22 (eroico), `m` = 44 px con testo 15 (primario). */
  size?: 'l' | 'm'
}

/** Proprietà di {@link GoldButton}. */
export interface GoldButtonProps extends GoldCommonProps, ComponentPropsWithoutRef<'button'> {
  /** Azione in corso: resta d'oro ma non risponde ai clic, e lo annuncia agli screen reader. */
  busy?: boolean
}

/** Proprietà di {@link GoldLink}. */
export type GoldLinkProps = GoldCommonProps & LinkProps

const SIZE_CLASSES = { l: 'h-14 type-button-l', m: 'h-11 type-button' } as const

/**
 * Pulsante d'oro del design system (Sigillo): lastra nell'oro delle carte con angoli a incavo,
 * banda di luce satinata, filo chiaro interno. Con `hero` diventa il pulsante eroico.
 * Per andare a un'altra pagina si usa {@link GoldLink}, che ha lo stesso aspetto.
 *
 * @example <GoldButton hero size="l" type="submit" className="w-full">Accedi</GoldButton>
 */
export function GoldButton({
  hero = false,
  size = 'm',
  busy = false,
  type = 'button',
  className = '',
  children,
  onClick,
  ...rest
}: GoldButtonProps) {
  const [element, setElement] = useState<HTMLButtonElement | null>(null)
  return (
    <button
      ref={setElement}
      type={type}
      aria-busy={busy || undefined}
      aria-disabled={busy || undefined}
      onClick={(event) => (busy ? event.preventDefault() : onClick?.(event))}
      className={`gold-button ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      <GoldOrnament element={element} hero={hero} disabled={!!rest.disabled} />
      <span className="gold-button__label">{children}</span>
    </button>
  )
}

/**
 * Collegamento con l'aspetto del pulsante d'oro: per le azioni che portano a un'altra pagina
 * (es. "Nuova sfida").
 *
 * @example <GoldLink hero size="l" to={PATHS.newChallenge}>Nuova sfida</GoldLink>
 */
export function GoldLink({
  hero = false,
  size = 'm',
  className = '',
  children,
  ...rest
}: GoldLinkProps) {
  const [element, setElement] = useState<HTMLAnchorElement | null>(null)
  return (
    <Link ref={setElement} className={`gold-button ${SIZE_CLASSES[size]} ${className}`} {...rest}>
      <GoldOrnament element={element} hero={hero} disabled={false} />
      <span className="gold-button__label">{children}</span>
    </Link>
  )
}

/** Proprietà di {@link GoldOrnament}. */
interface GoldOrnamentProps {
  /** Elemento che riceve l'ornamento: se ne misura la dimensione. */
  element: HTMLElement | null
  hero: boolean
  disabled: boolean
}

/**
 * Lastra d'oro e fili disegnati sulla misura reale dell'elemento: incavo agli angoli,
 * filo chiaro interno, anello di focus a incavo e, per l'eroico, il fermaglio.
 */
function GoldOrnament({ element, hero, disabled }: GoldOrnamentProps) {
  const { width, height } = useElementSize(element)
  const gradientId = useId()
  if (width === 0) return null

  const radius = buttonNotchRadius(height)
  const outer = notchPath(width, height, radius)
  return (
    <>
      <span
        aria-hidden="true"
        className="gold-button__plate"
        style={{ clipPath: `path('${outer}')` }}
      />
      <svg
        aria-hidden="true"
        focusable="false"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 overflow-visible"
      >
        <path className="gold-button__edge" d={outer} fill="none" strokeWidth={1} />
        <path
          className="gold-button__highlight"
          d={notchPath(width, height, radius, 3)}
          fill="none"
          strokeWidth={0.8}
        />
        <path
          className="gold-button__focus"
          d={notchPath(width, height, radius, -4)}
          fill="none"
          strokeWidth={2}
        />
        {hero && <HeroClasp x={width / 2} gradientId={gradientId} disabled={disabled} />}
      </svg>
    </>
  )
}

/** Proprietà di {@link HeroClasp}. */
interface HeroClaspProps {
  /** Centro orizzontale del fermaglio, in px. */
  x: number
  /** Id univoco del gradiente dell'oro delle carte. */
  gradientId: string
  /** Pulsante disattivato: fermaglio spento. */
  disabled: boolean
}

/** Fermaglio del pulsante eroico: rombo nell'oro delle carte con la stella, sul bordo alto. */
function HeroClasp({ x, gradientId, disabled }: HeroClaspProps) {
  const ring = disabled ? 'var(--za-btn-clasp-disabled)' : `url(#${gradientId})`
  const star = disabled ? 'var(--za-btn-clasp-disabled)' : 'var(--za-btn-star)'
  const r = 3.6
  const k = r * 0.3
  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--za-card-gold-light)' }} />
          <stop offset="0.45" style={{ stopColor: 'var(--za-card-gold-mid)' }} />
          <stop offset="1" style={{ stopColor: 'var(--za-card-gold-dark)' }} />
        </linearGradient>
      </defs>
      <rect
        x={x - 7}
        y={-7}
        width={14}
        height={14}
        transform={`rotate(45 ${x} 0)`}
        fill="var(--za-bg)"
        stroke={ring}
        strokeWidth={1.5}
      />
      <path
        d={`M${x} ${-r} L${x + k} ${-k} L${x + r} 0 L${x + k} ${k} L${x} ${r} L${x - k} ${k} L${x - r} 0 L${x - k} ${-k} Z`}
        fill={star}
      />
    </>
  )
}
