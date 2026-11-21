import { NavLink } from 'react-router'
import { Badge } from '@/components/ui/Badge'

/** Una scheda di {@link PageTabs}. */
export interface PageTab {
  to: string
  label: string
  /** Cose da fare in questa scheda (es. sfide da giocare): badge accanto al nome. */
  count?: number
}

/** Proprietà di {@link PageTabs}. */
export interface PageTabsProps {
  tabs: PageTab[]
  /** Nome del gruppo di schede, per gli screen reader (es. "Sezioni delle sfide"). */
  label: string
}

/**
 * Schede di una sezione (tavole Sfide, Scambi): Cinzel maiuscolo, la scheda attiva in oro chiaro
 * con il filo sotto. Ogni scheda è un collegamento vero, così "indietro" del browser e i link
 * diretti funzionano.
 */
export function PageTabs({ tabs, label }: PageTabsProps) {
  return (
    <nav aria-label={label} className="flex gap-7 overflow-x-auto">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) =>
            `relative inline-flex shrink-0 items-center gap-2 py-2 type-button tracking-[0.12em] uppercase no-underline ${isActive ? 'text-nav-ink-active' : 'text-tab-ink hover:text-text'}`
          }
        >
          {({ isActive }) => (
            <>
              {tab.label}
              {!!tab.count && (
                <>
                  <Badge count={tab.count} />
                  <span className="sr-only">, {tab.count} da fare</span>
                </>
              )}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-(image:--za-tab-underline)"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
