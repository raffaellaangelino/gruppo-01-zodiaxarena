import {
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Link, type LinkProps } from 'react-router'
import { Icon, type IconName } from '@/components/ui/Icon'
import { useElementSize } from '@/hooks/useElementSize'
import { buttonNotchRadius, notchPath } from '@/lib/notchPath'
import './TertiaryButton.css'

/** Proprietà comuni a pulsante e collegamento terziario. */
interface TertiaryCommonProps {
  /** Icona Zodiax dell'azione, davanti al testo (es. Gioca = `sfide`, Guarda = `rotolo`). */
  icon?: IconName
  /** Misura: `s` = 32 px (righe fitte desktop), `m` = 36 px (predefinita). */
  size?: 's' | 'm'
  /** `risk`: azione che toglie qualcosa (Rifiuta, Ritira): rossa, mai d'oro (gen_s.btn, tono "rischio"). */
  tone?: 'default' | 'risk'
  children: ReactNode
}

/** Proprietà di {@link TertiaryButton}. */
export type TertiaryButtonProps = TertiaryCommonProps & ComponentPropsWithoutRef<'button'>

/** Proprietà di {@link TertiaryLink}. */
export type TertiaryLinkProps = TertiaryCommonProps & LinkProps

const SIZE_CLASSES = { s: 'h-8', m: 'h-9' } as const
const TONE_CLASSES = { default: '', risk: 'tertiary--risk' } as const

/**
 * Pulsante terziario: contorno a incavo con l'icona dell'azione davanti al testo (variante
 * "icona", scelta il 07/11). Per le azioni dentro righe e Tessere ("Gioca", "Guarda", "Rispondi").
 * Per andare a un'altra pagina si usa {@link TertiaryLink}, che ha lo stesso aspetto.
 */
export function TertiaryButton({
  icon,
  size = 'm',
  tone = 'default',
  type = 'button',
  className = '',
  children,
  ...rest
}: TertiaryButtonProps) {
  const [element, setElement] = useState<HTMLButtonElement | null>(null)
  return (
    <button
      ref={setElement}
      type={type}
      className={`tertiary type-label ${SIZE_CLASSES[size]} ${TONE_CLASSES[tone]} ${className}`}
      {...rest}
    >
      <TertiaryOrnament element={element} />
      <TertiaryLabel icon={icon}>{children}</TertiaryLabel>
    </button>
  )
}

/** Collegamento con l'aspetto del pulsante terziario. */
export function TertiaryLink({
  icon,
  size = 'm',
  tone = 'default',
  className = '',
  children,
  ...rest
}: TertiaryLinkProps) {
  const [element, setElement] = useState<HTMLAnchorElement | null>(null)
  return (
    <Link
      ref={setElement}
      className={`tertiary type-label ${SIZE_CLASSES[size]} ${TONE_CLASSES[tone]} ${className}`}
      {...rest}
    >
      <TertiaryOrnament element={element} />
      <TertiaryLabel icon={icon}>{children}</TertiaryLabel>
    </Link>
  )
}

/** Icona e testo del pulsante. */
function TertiaryLabel({ icon, children }: { icon?: IconName; children: ReactNode }) {
  return (
    <span className="tertiary__label">
      {icon && <Icon name={icon} size={16} />}
      {children}
    </span>
  )
}

/** Contorno a incavo e filo interno (hover e focus). */
function TertiaryOrnament({ element }: { element: HTMLElement | null }) {
  const { width, height } = useElementSize(element)
  const gradientId = useId()
  if (width === 0) return null

  const radius = buttonNotchRadius(height)
  const outer = notchPath(width, height, radius)
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 overflow-visible"
      style={{ '--tertiary-gold': `url(#${gradientId})` } as CSSProperties}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--za-btn-gold-side)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--za-btn-gold-center)' }} />
          <stop offset="1" style={{ stopColor: 'var(--za-btn-gold-side)' }} />
        </linearGradient>
      </defs>
      <path className="tertiary__fill tertiary__edge" d={outer} strokeWidth={1} />
      <path
        className="tertiary__inner"
        d={notchPath(width, height, radius, 3)}
        fill="none"
        strokeWidth={0.8}
      />
    </svg>
  )
}
