import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import { DesktopBarFrame, MobileBarFrame } from '@/app/shell/BarFrame'
import { GoldClasp } from '@/components/ornaments/GoldClasp'
import { GoldLink } from '@/components/ui/GoldButton'
import { MEDIA } from '@/config/breakpoints'
import { LANDING_COPY } from '@/features/landing/messages'
import { LANDING_SECTION_IDS, LANDING_SECTIONS } from '@/features/landing/sections'
import { useActiveSection } from '@/features/landing/useActiveSection'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const COPY = LANDING_COPY.bar

/** "Accedi": collegamento testuale, un gradino sotto le voci (Cinzel 13 invece di 15). */
const LOGIN_CLASS =
  'tracking-[0.14em] text-nav-ink uppercase no-underline type-button text-[0.8125rem]! transition-colors duration-(--za-dur-fast) hover:text-text'

/**
 * Barra delle pagine pubbliche (IA §3.3): la stessa cornice della barra di gioco. Su desktop le
 * voci sono le sezioni della landing, con il "sei qui" della barra di gioco sulla sezione che si
 * sta leggendo; a destra Accedi e Gioca gratis. Su telefono restano logo, Accedi e Gioca gratis:
 * le sezioni si raggiungono scorrendo e dalle Tessere sotto la scena.
 */
export function PublicBar() {
  const isDesktop = useMediaQuery(MEDIA.desktop)
  const active = useActiveSection(LANDING_SECTION_IDS)

  if (!isDesktop) {
    return (
      <MobileBarFrame logoTo={PATHS.home}>
        <div className="flex items-center gap-4">
          <Link to={PATHS.login} className={LOGIN_CLASS}>
            {COPY.login}
          </Link>
          <GoldLink size="s" to={PATHS.register}>
            {COPY.play}
          </GoldLink>
        </div>
      </MobileBarFrame>
    )
  }

  return (
    <DesktopBarFrame logoTo={PATHS.home}>
      <nav aria-label={COPY.sections} className="ml-8 flex">
        {LANDING_SECTIONS.map((section) => (
          <Link
            key={section.id}
            to={{ pathname: PATHS.home, hash: section.id }}
            aria-current={active === section.id ? 'page' : undefined}
            className="nav-item"
          >
            {section.label}
            {active === section.id && <GoldClasp className="nav-item__clasp" />}
          </Link>
        ))}
      </nav>
      {/* Come la destra della barra di gioco: elementi più piccoli delle voci, un filo che li separa,
          margine visibile di 32 come il logo a sinistra */}
      <div className="mr-2.5 ml-auto flex items-center gap-6">
        <Link to={PATHS.login} className={LOGIN_CLASS}>
          {COPY.login}
        </Link>
        <span aria-hidden="true" className="h-7.5 w-px bg-divider-gold" />
        <GoldLink size="s" to={PATHS.register}>
          {COPY.play}
        </GoldLink>
      </div>
    </DesktopBarFrame>
  )
}
