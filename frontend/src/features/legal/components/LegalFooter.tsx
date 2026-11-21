import { Link } from 'react-router'
import { PATHS } from '@/app/paths'

export function LegalFooter() {
  return (
    <footer className="legal-footer">
      <nav aria-label="Collegamenti legali">
        <Link to={PATHS.guide}>Guida</Link>
        <span>Termini</span>
        <Link to={PATHS.privacy} aria-current="page">
          Privacy
        </Link>
        <span>Cookie</span>
        <span>Chi siamo</span>
      </nav>
    </footer>
  )
}
