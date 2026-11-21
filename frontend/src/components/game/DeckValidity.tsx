import { Icon } from '@/components/ui/Icon'

/** Proprietà di {@link DeckValidity}. */
export interface DeckValidityProps {
  valid: boolean
}

/**
 * Se un Cielo si può giocare, accanto al suo nome: "Valido" in verde con la spunta, oppure
 * "Da correggere" con l'avviso. Il giudizio è del backend (regole V1–V8).
 */
export function DeckValidity({ valid }: DeckValidityProps) {
  return valid ? (
    <span className="inline-flex items-center gap-1 font-extrabold text-success">
      <Icon name="conferma" size={14} />
      Valido
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 font-extrabold text-danger">
      <Icon name="avviso" size={14} />
      Da correggere
    </span>
  )
}
