import { useId, useState, type ComponentPropsWithoutRef, type CSSProperties } from 'react'
import { useElementSize } from '@/hooks/useElementSize'
import { buttonNotchRadius, notchPath } from '@/lib/notchPath'
import './SecondaryButton.css'

/** Proprietà di {@link SecondaryButton}. */
export interface SecondaryButtonProps extends ComponentPropsWithoutRef<'button'> {
  /**
   * Misura: `m` = 44 px (predefinita), `l` = 56 px, per stare alla stessa altezza
   * del pulsante eroico accanto (tavola Registrati-Conferma).
   */
  size?: 'm' | 'l'
}

const SIZE_CLASSES = { m: 'h-11', l: 'h-14' } as const

/**
 * Pulsante secondario del design system (Lastra): blu notte a incavo con il doppio filo d'oro,
 * testo d'oro. Sta accanto al primario, per l'azione alternativa (es. "Indietro").
 *
 * @example <SecondaryButton onClick={back}>Indietro</SecondaryButton>
 */
export function SecondaryButton({
  size = 'm',
  type = 'button',
  className = '',
  children,
  ...rest
}: SecondaryButtonProps) {
  const [element, setElement] = useState<HTMLButtonElement | null>(null)
  return (
    <button
      ref={setElement}
      type={type}
      className={`secondary-button type-button ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      <SecondaryOrnament element={element} />
      <span className="secondary-button__label">{children}</span>
    </button>
  )
}

/** Lastra, doppio filo d'oro e anello di focus, disegnati sulla misura reale del pulsante. */
function SecondaryOrnament({ element }: { element: HTMLElement | null }) {
  const { width, height } = useElementSize(element)
  const gradientId = useId()
  if (width === 0) return null

  const radius = buttonNotchRadius(height)
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 overflow-visible"
      style={{ '--secondary-gold': `url(#${gradientId})` } as CSSProperties}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--za-btn-gold-side)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--za-btn-gold-center)' }} />
          <stop offset="1" style={{ stopColor: 'var(--za-btn-gold-side)' }} />
        </linearGradient>
      </defs>
      <path
        className="secondary-button__plate"
        d={notchPath(width, height, radius)}
        strokeWidth={1.2}
      />
      <path
        className="secondary-button__inner"
        d={notchPath(width, height, radius, 3.5)}
        fill="none"
        strokeWidth={0.9}
      />
      <path
        className="secondary-button__focus"
        d={notchPath(width, height, radius, -4)}
        fill="none"
        strokeWidth={2}
      />
    </svg>
  )
}
