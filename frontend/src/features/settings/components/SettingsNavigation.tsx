type SettingsSection = 'account' | 'game' | 'privacy'

interface SettingsNavigationProps {
  activeSection: SettingsSection
  onSelect: (section: SettingsSection) => void
}

const GROUPS: {
  id: SettingsSection
  title: string
  links: { label: string; href: string }[]
}[] = [
  {
    id: 'account',
    title: 'Account',
    links: [
      { label: 'Profilo', href: '#account' },
      { label: 'Password', href: '#account' },
      { label: 'Email', href: '#account' },
    ],
  },
  {
    id: 'game',
    title: 'Gioco',
    links: [
      { label: 'Suoni', href: '#game' },
      { label: 'Notifiche', href: '#game' },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy',
    links: [
      { label: 'I miei dati', href: '#privacy' },
      { label: 'Informativa', href: '/privacy' },
    ],
  },
]

/** Navigazione tra le aree delle impostazioni. */
export function SettingsNavigation({ activeSection, onSelect }: SettingsNavigationProps) {
  return (
    <nav className="settings-navigation" aria-label="Sezioni impostazioni">
      {GROUPS.map((group) => (
        <section key={group.id} className="settings-navigation__group">
          <h2>{group.title}</h2>
          <ul>
            {group.links.map((link, index) => (
              <li key={`${group.id}-${link.label}`}>
                <a
                  href={link.href}
                  className={
                    activeSection === group.id && index === 0
                      ? 'settings-navigation__link settings-navigation__link--active'
                      : 'settings-navigation__link'
                  }
                  aria-current={activeSection === group.id && index === 0 ? 'location' : undefined}
                  onClick={() => onSelect(group.id)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  )
}
