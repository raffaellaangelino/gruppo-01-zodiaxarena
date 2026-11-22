import { PublicPage, PublicTrail } from '@/features/landing/components/PublicPage'
import { LegalNoticePanel } from '@/features/legal/components/LegalNoticePanel'
import '@/features/guide/pages/guide.css'
import './legal.css'

const SECTIONS = [
  { id: 'chi-tratta-i-dati', title: 'Chi tratta i tuoi dati' },
  { id: 'dati-raccolti', title: 'Quali dati raccogliamo' },
  { id: 'data-di-nascita', title: 'La data di nascita' },
  { id: 'conservazione', title: 'Per quanto tempo' },
  { id: 'diritti', title: 'I tuoi diritti' },
  { id: 'contatti', title: 'Contatti' },
]

const LEGAL_PLACEHOLDER =
  'Testo dell’informativa, a cura del team. Paragrafi brevi, una sola idea per paragrafo, termini spiegati la prima volta che compaiono.'

export function PrivacyPage() {
  return (
    <PublicPage current="privacy">
      <title>Informativa Privacy · Zodiax Arena</title>
      {/* Lo schema di lettura della Guida (FOUNDATIONS §6b-undecies): stessa griglia, stessa testata */}
      <main className="guide-page">
        <div className="guide-page__inner">
          <PublicTrail label="Privacy" />
          <header className="guide-header">
            <h1>Informativa privacy</h1>
          </header>
          <div className="guide-layout">
            <aside className="legal-index" aria-label="Indice dell’informativa">
              <p className="legal-eyebrow">In questa pagina</p>
              <nav>
                <ol>
                  {SECTIONS.map((section, index) => (
                    <li key={section.id}>
                      {index < 4 ? (
                        <a
                          className={
                            index === 0
                              ? 'legal-index__link legal-index__link--active'
                              : 'legal-index__link'
                          }
                          href={`#${section.id}`}
                          aria-current={index === 0 ? 'location' : undefined}
                        >
                          <span aria-hidden="true">{index === 0 ? '◆' : '◇'}</span>
                          {section.title}
                        </a>
                      ) : (
                        <span className="legal-index__link">
                          <span aria-hidden="true">◇</span>
                          {section.title}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <article className="legal-article">
              <p className="legal-eyebrow">Ultimo aggiornamento: da definire</p>

              <LegalNoticePanel />

              <section id="chi-tratta-i-dati" className="legal-section">
                <h2>1 · Chi tratta i tuoi dati</h2>
                <p>{LEGAL_PLACEHOLDER}</p>
              </section>

              <section id="dati-raccolti" className="legal-section">
                <h2>2 · Quali dati raccogliamo</h2>
                <p>
                  Email, nickname, le tue carte, i tuoi Cieli, le partite e gli scambi.{' '}
                  {LEGAL_PLACEHOLDER}
                </p>
              </section>

              <section id="data-di-nascita" className="legal-section">
                <h2>3 · La data di nascita</h2>
                <p>
                  Ci serve solo per calcolare il tuo segno.{' '}
                  <strong>Non la conserviamo: salviamo il segno.</strong>{' '}
                  <span className="legal-note">
                    (Da allineare con il backend, che oggi ha un campo per la data: punto 17b della
                    riunione.)
                  </span>
                </p>
              </section>

              <section id="conservazione" className="legal-section">
                <h2>4 · Per quanto tempo</h2>
                <p>{LEGAL_PLACEHOLDER}</p>
              </section>
            </article>
          </div>
        </div>
      </main>
    </PublicPage>
  )
}
