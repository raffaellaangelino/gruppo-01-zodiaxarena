import { Link } from 'react-router'

/** Proprietà di {@link AuthSwitchLink}. */
export interface AuthSwitchLinkProps {
  /** Domanda (es. "Non hai un account?"). */
  question: string
  /** Testo del collegamento (es. "Registrati"). */
  label: string
  to: string
}

/**
 * Riga in fondo alla colonna d'accesso per passare tra accesso e registrazione
 * (tavole Accedi e Registrati): domanda attenuata, collegamento d'oro.
 */
export function AuthSwitchLink({ question, label, to }: AuthSwitchLinkProps) {
  return (
    <p className="mt-6 text-center text-text-muted type-meta">
      {question}{' '}
      <Link to={to} className="font-extrabold text-gold-bright no-underline">
        {label}
      </Link>
    </p>
  )
}
