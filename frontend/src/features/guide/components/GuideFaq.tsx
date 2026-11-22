import { useState, type ReactNode } from 'react'
import { TilePanel } from '@/components/panels/TilePanel'
import { Coin } from '@/components/ui/Coin'
import { Icon } from '@/components/ui/Icon'
import { SecondaryButton } from '@/components/ui/SecondaryButton'

const FAQ_TOPICS = [
  'Account e accesso',
  'Pacchetti e probabilità',
  'Crediti',
  'Sfide',
  'Scambi',
  'Fazione',
  'Problemi tecnici',
]

const PACKS = [
  {
    name: 'Costellazione',
    price: 100,
    rarities: ['common', 'common', 'common', 'rare', 'star'],
    summary: '3 Comuni · 1 Rara · 1 Stella',
    guarantee: '—',
  },
  {
    // Economia del 12/11 (DECISIONS): 300 crediti, 4 Stelle, nessuna garanzia
    name: 'Zenit',
    price: 300,
    rarities: [
      'common',
      'common',
      'common',
      'rare',
      'rare',
      'rare',
      'star',
      'star',
      'star',
      'star',
    ],
    summary: '3 Comuni · 3 Rare · 4 Stelle',
    guarantee: '—',
  },
  {
    // 12 carte con un Ascendente garantito, una volta per ciclo lunare (composizione della tela,
    // da confermare con il team)
    name: 'Luna Piena',
    price: 600,
    rarities: [
      'common',
      'common',
      'common',
      'common',
      'common',
      'common',
      'rare',
      'rare',
      'rare',
      'epic',
      'star',
      'ascendant',
    ],
    summary: '6 Comuni · 3 Rare · 1 Epica · 1 Ascendente · 1 Stella',
    guarantee: '1 Ascendente garantito',
  },
]

const RARITY_CLASS: Record<string, string> = {
  common: 'guide-pack-card--common',
  rare: 'guide-pack-card--rare',
  epic: 'guide-pack-card--epic',
  ascendant: 'guide-pack-card--ascendant',
  star: 'guide-pack-card--star',
}

interface FaqItem {
  id: string
  question: string
  searchText: string
  answer: ReactNode
}

const FAQS: FaqItem[] = [
  {
    id: 'pack-details',
    question: 'Cosa c’è in un pacchetto, e con che probabilità?',
    searchText:
      'Costellazione Zenit Luna Piena Comune Rara Epica Leggendaria Ascendente Stella prezzo carte probabilità garanzia 60 30 8 2',
    answer: <PackProbabilities />,
  },
  {
    id: 'duplicates',
    question: 'Cosa succede alle carte doppie?',
    searchText: 'doppioni doppie Epiche Leggendarie',
    answer: (
      <p>
        Non trovi doppioni di Epiche e Leggendarie finché non le hai tutte. Le carte doppie delle
        altre rarità possono comparire nei pacchetti.
      </p>
    ),
  },
  {
    id: 'sun-guarantee',
    question: 'Dove vedo quanto manca al Sole garantito?',
    searchText: 'Sole garantito 10 Stelle Leggendaria contatore Negozio',
    answer: (
      <p>
        Il Sole è garantito entro 10 Stelle: se in 9 Stelle non esce una Leggendaria, la decima lo
        è. Il contatore è nel Negozio.
      </p>
    ),
  },
  {
    id: 'real-money',
    question: 'Posso comprare crediti con denaro vero?',
    searchText: 'crediti acquisto soldi pagamento denaro reale Negozio',
    answer: <p>Le modalità disponibili sono indicate nel Negozio.</p>,
  },
]

function PackProbabilities() {
  return (
    <div className="guide-faq-pack-content">
      <p>
        Ogni pacchetto ha una struttura fissa: sai sempre quante carte di ogni rarità trovi.
        L’ultima carta è la Stella, l’unica con una probabilità.
      </p>

      <div className="guide-pack-table-wrap">
        <table className="guide-pack-table">
          <thead>
            <tr>
              <th scope="col">Pacchetto</th>
              <th scope="col">Prezzo</th>
              <th scope="col">Carte</th>
              <th scope="col">Garanzia</th>
            </tr>
          </thead>
          <tbody>
            {PACKS.map((pack) => (
              <tr key={pack.name}>
                <th scope="row">{pack.name}</th>
                <td className="guide-pack-price">
                  <Coin size={16} />
                  {pack.price}
                </td>
                <td>
                  <span className="guide-pack-cards" aria-hidden="true">
                    {pack.rarities.map((rarity, index) => (
                      <span
                        key={`${pack.name}-${index}`}
                        className={`guide-pack-card ${RARITY_CLASS[rarity]}`}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                  <span className="guide-pack-summary">{pack.summary}</span>
                </td>
                <td className={pack.guarantee === '—' ? 'guide-pack-guarantee--none' : ''}>
                  {pack.guarantee}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="guide-star-title">La Stella</h3>
      <div className="guide-star-probability" aria-hidden="true">
        <span className="guide-star-probability__rare" />
        <span className="guide-star-probability__epic" />
        <span className="guide-star-probability__legendary" />
        <span className="guide-star-probability__ascendant" />
      </div>
      <ul className="guide-star-legend">
        <li className="guide-star-legend__rare">Rara 60%</li>
        <li className="guide-star-legend__epic">Epica 30%</li>
        <li className="guide-star-legend__legendary">Leggendaria 8%</li>
        <li className="guide-star-legend__ascendant">Ascendente 2%</li>
      </ul>
      <ul className="guide-faq-bullets">
        <li>
          <strong>Sole garantito entro 10 Stelle:</strong> se in 9 Stelle non esce una Leggendaria,
          la decima lo è. Il contatore è nel Negozio.
        </li>
        <li>Niente doppioni di Epiche e Leggendarie finché non le hai tutte.</li>
      </ul>
    </div>
  )
}

export function GuideFaq({ search }: { search: string }) {
  const [openId, setOpenId] = useState<string | null>('pack-details')
  const query = search.trim().toLocaleLowerCase('it')
  const questions = FAQS.filter(
    ({ question, searchText }) =>
      question.toLocaleLowerCase('it').includes(query) ||
      searchText.toLocaleLowerCase('it').includes(query),
  )

  return (
    <div className="guide-layout guide-faq-layout">
      <aside className="guide-faq-topics" aria-label="Argomenti FAQ">
        <p className="guide-eyebrow">Argomenti</p>
        <ul>
          {FAQ_TOPICS.map((topic) => {
            const active = topic === 'Pacchetti e probabilità'
            return (
              <li key={topic}>
                <span
                  className={`guide-faq-topic ${active ? 'guide-faq-topic--active' : ''}`}
                  aria-current={active ? 'location' : undefined}
                >
                  <span aria-hidden="true">{active ? '◆' : '◇'}</span>
                  {topic}
                </span>
              </li>
            )
          })}
        </ul>
      </aside>

      <section className="guide-faq" aria-labelledby="guide-faq-title">
        <p className="guide-eyebrow">
          {questions.length} {questions.length === 1 ? 'domanda' : 'domande'}
        </p>
        <h2 id="guide-faq-title">Pacchetti e probabilità</h2>
        <div className="guide-faq-list">
          {questions.map(({ id, question, answer }) => {
            const expanded = openId === id
            return (
              <section className="guide-faq-item" key={id}>
                <h3>
                  <button
                    type="button"
                    className="guide-faq-question"
                    aria-expanded={expanded}
                    aria-controls={`faq-answer-${id}`}
                    onClick={() => setOpenId(expanded ? null : id)}
                  >
                    <span>{question}</span>
                    <span
                      aria-hidden="true"
                      className={
                        expanded ? 'guide-faq-chevron guide-faq-chevron--open' : 'guide-faq-chevron'
                      }
                    />
                  </button>
                </h3>
                {expanded && (
                  <div className="guide-faq-answer" id={`faq-answer-${id}`}>
                    {answer}
                  </div>
                )}
              </section>
            )
          })}
          {questions.length === 0 && (
            <p className="guide-glossary-empty">Nessuna domanda trovata.</p>
          )}
        </div>

        {/* Riga d'azione della tavola FAQ (gen_gd): segno, frase, un'azione, tutto su una fila */}
        <TilePanel as="div" variant="row" aria-label="Contatta l’assistenza" className="mt-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 py-3.5 pr-5 pl-6.5">
            <Icon name="aiuto" size={24} className="shrink-0 text-gold-bright" />
            <p className="min-w-0 flex-1 basis-56 text-text type-body">
              <b>Non trovi la risposta?</b> Scrivici: ti rispondiamo per email.
            </p>
            <SecondaryButton
              type="button"
              className="h-10! w-full text-[0.8125rem]! sm:w-38"
              onClick={() => {
                window.location.href = 'mailto:'
              }}
            >
              Scrivici
            </SecondaryButton>
          </div>
        </TilePanel>
      </section>
    </div>
  )
}
