import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import { Logo } from '@/components/brand/Logo'

export function LegalHeader() {
  return (
    <header className="legal-header">
      <div className="legal-header__inner">
        <Logo height={40} />
        <Link className="legal-header__login" to={PATHS.login}>
          Accedi
        </Link>
      </div>
    </header>
  )
}
