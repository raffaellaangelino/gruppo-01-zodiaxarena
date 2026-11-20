import { GLOSSARY_TERMS } from '@/features/guide/glossary'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface GuideGlossaryProps {
  search: string
}

export function GuideGlossary({ search }: GuideGlossaryProps) {
  const query = search.trim().toLocaleLowerCase('it')
  const terms = GLOSSARY_TERMS.filter(
    ({ term, definition }) =>
      term.toLocaleLowerCase('it').includes(query) ||
      definition.toLocaleLowerCase('it').includes(query),
  )
  const availableLetters = new Set(terms.map(({ term }) => term[0].toLocaleUpperCase('it')))
  const displayedLetters = new Set<string>()

  return (
    <div className="guide-layout guide-glossary-layout">
      <aside className="guide-glossary-index" aria-label="Indice alfabetico del glossario">
        <p className="guide-eyebrow">Dalla A alla Z</p>
        <nav className="guide-glossary-alphabet" aria-label="Lettere">
          {ALPHABET.map((letter) =>
            availableLetters.has(letter) ? (
              <a key={letter} href={`#glossary-${letter}`} aria-label={`Termini con la ${letter}`}>
                {letter}
              </a>
            ) : (
              <span key={letter} aria-hidden="true">
                {letter}
              </span>
            ),
          )}
        </nav>
        <p className="guide-glossary-note">
          Nella guida e nel Rotolo i termini sottolineati portano qui.
        </p>
      </aside>

      <section className="guide-glossary" aria-labelledby="guide-glossary-title">
        <p className="guide-eyebrow">
          {terms.length} {terms.length === 1 ? 'termine' : 'termini'}
        </p>
        <h2 id="guide-glossary-title">Le parole del gioco</h2>
        {terms.length > 0 ? (
          <dl className="guide-glossary-list">
            {terms.map(({ term, definition }) => {
              const letter = term[0].toLocaleUpperCase('it')
              const firstOfLetter = !displayedLetters.has(letter)
              displayedLetters.add(letter)

              return (
                <div className="guide-glossary-row" key={term}>
                  <span className="guide-glossary-initial">
                    {firstOfLetter ? <span id={`glossary-${letter}`}>{letter}</span> : null}
                  </span>
                  <dt className="guide-glossary-term">{term}</dt>
                  <dd className="guide-glossary-definition">{definition}</dd>
                </div>
              )
            })}
          </dl>
        ) : (
          <p className="guide-glossary-empty">Nessun termine trovato.</p>
        )}
      </section>
    </div>
  )
}
