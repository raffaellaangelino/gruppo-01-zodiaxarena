import type { CSSProperties } from 'react'
import spriteUrl from '@/assets/icons/zodiax-icons.svg?url'

/**
 * Nomi delle icone Zodiax (set v0.1, design/system/icons).
 * Lo sprite è una copia di `design/system/icons/zodiax-icons.svg`: si rigenera lì, non si modifica qui.
 */
export type IconName =
  | 'home'
  | 'collezione'
  | 'sfide'
  | 'scambi'
  | 'negozio'
  | 'rotolo'
  | 'notifiche'
  | 'profilo'
  | 'gruppo'
  | 'crediti'
  | 'impostazioni'
  | 'esci'
  | 'cerca'
  | 'filtri'
  | 'ordina'
  | 'chiudi'
  | 'indietro'
  | 'avanti'
  | 'espandi'
  | 'aggiungi'
  | 'rimuovi'
  | 'modifica'
  | 'elimina'
  | 'ricicla'
  | 'condividi'
  | 'info'
  | 'aiuto'
  | 'conferma'
  | 'avviso'
  | 'errore'
  | 'bloccato'
  | 'scadenza'
  | 'riproduci'
  | 'pausa'
  | 'passo'
  | 'salta'
  | 'velocita'
  | 'mazzo'
  | 'carta'
  | 'pacchetto'
  | 'fazione'
  | 'cambio-fazione'
  | 'casa'
  | 'ascendente'
  | 'sole'
  | 'luna'
  | 'luna-piena'
  | 'doppione'
  | 'carta-nuova'
  | 'non-scambiabile'
  | 'dado'
  | 'atk'
  | 'def'
  | 'vita'
  | 'missione'
  | 'ricompensa'
  | 'vittoria'
  | 'sconfitta'
  | 'pareggio'
  | 'fuoco'
  | 'acqua'
  | 'terra'
  | 'aria'

/** Misure ammesse: quelle del set (16 · 20 · 24 · 32 · 48) più 14 e 18, usate nei messaggi dei moduli. */
export type IconSize = 14 | 16 | 18 | 20 | 24 | 32 | 48

/** Proprietà di {@link Icon}. */
export interface IconProps {
  /** Nome dell'icona nello sprite. */
  name: IconName
  /** Misura in px (predefinita 24). */
  size?: IconSize
  /** Testo per gli screen reader. Senza `label` l'icona è decorativa e viene nascosta. */
  label?: string
  /** Stato attivo: le forme principali si riempiono al 20%. */
  active?: boolean
  /** Classi Tailwind; il colore è quello del testo (`text-gold`, `text-danger-soft`…). */
  className?: string
}

/** Compensazione ottica: il tratto resta percepito uguale (circa 1,2–1,6 px) a ogni misura. */
const STROKE: Record<IconSize, number> = {
  14: 1.9,
  16: 1.8,
  18: 1.7,
  20: 1.6,
  24: 1.5,
  32: 1.3,
  48: 1.1,
}

/**
 * Icona del set Zodiax, a tratto, nel colore del testo (`currentColor`).
 *
 * @example <Icon name="avviso" size={18} className="text-danger-soft" />
 * @example <Icon name="notifiche" label="Notifiche, 3 non lette" />
 */
export function Icon({ name, size = 24, label, active = false, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE[size]}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={className}
      style={{ flex: 'none', '--za-icon-fill': active ? 0.2 : 0 } as CSSProperties}
    >
      <use href={`${spriteUrl}#za-${name}`} />
    </svg>
  )
}
