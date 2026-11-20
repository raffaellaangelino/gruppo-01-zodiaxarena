import acqua from '@/assets/elements/acqua.webp'
import aria from '@/assets/elements/aria.webp'
import fuoco from '@/assets/elements/fuoco.webp'
import terra from '@/assets/elements/terra.webp'
import type { Element } from '@/domain/game'

const EMBLEMS: Record<Element, string> = { FIRE: fuoco, WATER: acqua, EARTH: terra, AIR: aria }

/** Proprietà di {@link ElementEmblem}. */
export interface ElementEmblemProps {
  element: Element
  /** Lato in px. */
  size: number
  /** Testo alternativo; vuoto se lo stemma accompagna un testo che dice già l'elemento. */
  alt?: string
}

/** Stemma illustrato di un elemento (icone approvate delle carte), anche per la Fazione. */
export function ElementEmblem({ element, size, alt = '' }: ElementEmblemProps) {
  return <img src={EMBLEMS[element]} alt={alt} width={size} height={size} />
}
