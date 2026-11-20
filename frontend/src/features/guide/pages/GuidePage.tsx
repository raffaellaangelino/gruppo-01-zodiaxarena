import { useState } from 'react'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { Icon } from '@/components/ui/Icon'
import { GuideBattle } from '@/features/guide/components/GuideBattle'
import { CardFacts } from '@/features/guide/components/CardFacts'
import { GuideChapters } from '@/features/guide/components/GuideChapters'
import { GuideExample } from '@/features/guide/components/GuideExample'
import { GuideFaq } from '@/features/guide/components/GuideFaq'
import { GuideGlossary } from '@/features/guide/components/GuideGlossary'
import { GUIDE_CHAPTERS } from '@/features/guide/chapters'
import soleCard from '@/assets/cards/sole.webp'
import './guide.css'

export function GuidePage() {
  const [search, setSearch] = useState('')
  const [chapterId, setChapterId] = useState('la-carta')
  const [activeTab, setActiveTab] = useState<'regolamento' | 'glossario' | 'faq'>('regolamento')
  const chapterIndex = GUIDE_CHAPTERS.findIndex((chapter) => chapter.id === chapterId)
  const chapter = GUIDE_CHAPTERS[chapterIndex]

  const selectChapter = (index: number) => {
    setChapterId(GUIDE_CHAPTERS[index].id)
  }

  return (
    <main className="guide-page">
      <title>Guida · Zodiax Arena</title>
      <PorticoBackdrop variant="reading" />

      <div className="guide-page__inner">
        <header className="guide-header">
          <h1>Guida</h1>
          <nav className="guide-tabs" aria-label="Sezioni della guida">
            <button
              type="button"
              className={`guide-tab ${activeTab === 'regolamento' ? 'guide-tab--active' : ''}`}
              aria-current={activeTab === 'regolamento' ? 'page' : undefined}
              onClick={() => setActiveTab('regolamento')}
            >
              Regolamento
            </button>
            <button
              type="button"
              className={`guide-tab ${activeTab === 'glossario' ? 'guide-tab--active' : ''}`}
              aria-current={activeTab === 'glossario' ? 'page' : undefined}
              onClick={() => setActiveTab('glossario')}
            >
              Glossario
            </button>
            <button
              type="button"
              className={`guide-tab ${activeTab === 'faq' ? 'guide-tab--active' : ''}`}
              aria-current={activeTab === 'faq' ? 'page' : undefined}
              onClick={() => setActiveTab('faq')}
            >
              FAQ
            </button>
          </nav>
          <label className="guide-search">
            <Icon name="cerca" size={16} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Cerca nella guida"
              aria-label="Cerca nella guida"
            />
          </label>
        </header>

        {activeTab === 'glossario' ? (
          <GuideGlossary search={search} />
        ) : activeTab === 'faq' ? (
          <GuideFaq search={search} />
        ) : (
          <div className="guide-layout">
            <GuideChapters search={search} selectedId={chapter.id} onSelect={setChapterId} />

            <article className="guide-article">
              <p className="guide-eyebrow">
                Capitolo {chapterIndex + 1} di {GUIDE_CHAPTERS.length}
              </p>
              <h2>{chapter.title}</h2>
              <p className="guide-intro">{chapter.intro}</p>

              {chapter.id === 'la-carta' ? (
                <>
                  <div className="guide-card-overview">
                    <figure className="guide-card">
                      <img src={soleCard} alt="Carta Sole in Leone" />
                    </figure>
                    <CardFacts />
                  </div>

                  <section className="guide-copy">
                    <h3>Come si calcolano ATK e DEF</h3>
                    <p>
                      Al valore di partenza del segno si aggiunge il bonus del pianeta. Ogni segno
                      ha 20 punti in tutto: il Leone ne mette di più in attacco, il Toro in difesa.
                    </p>
                  </section>

                  <GuideExample />

                  <p className="guide-copy">
                    Le carte d’Aria non hanno valori fissi: ATK e DEF si tirano con due dadi da 4,
                    moltiplicati per 2 (da 4 a 16), quando la carta entra in gioco. Sulla carta, al
                    posto del numero, c’è il dado.
                  </p>

                  <section className="guide-copy guide-house">
                    <h3>La casa</h3>
                    <p>
                      Dà alla carta un’abilità. Al lancio tutte le carte sono della Casa I: +2 DEF
                      quando entrano in gioco. Ogni tre mesi arriva una casa nuova.
                    </p>
                  </section>
                </>
              ) : chapter.id === 'lo-scontro' ? (
                <GuideBattle />
              ) : (
                <ul className="guide-summary-points">
                  {chapter.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}

              <nav className="guide-pagination" aria-label="Navigazione capitoli">
                <div>
                  <span className="guide-eyebrow">Precedente</span>
                  {chapterIndex > 0 ? (
                    <button
                      type="button"
                      className="guide-pagination__chapter"
                      onClick={() => selectChapter(chapterIndex - 1)}
                    >
                      ‹ &nbsp;{GUIDE_CHAPTERS[chapterIndex - 1].title}
                    </button>
                  ) : (
                    <button type="button" className="guide-pagination__chapter" disabled>
                      ‹ &nbsp;—
                    </button>
                  )}
                </div>
                <div className="guide-pagination__next">
                  <span className="guide-eyebrow">Successivo</span>
                  {chapterIndex < GUIDE_CHAPTERS.length - 1 ? (
                    <button
                      type="button"
                      className="guide-pagination__chapter"
                      onClick={() => selectChapter(chapterIndex + 1)}
                    >
                      {GUIDE_CHAPTERS[chapterIndex + 1].title}&nbsp; ›
                    </button>
                  ) : (
                    <button type="button" className="guide-pagination__chapter" disabled>
                      — &nbsp;›
                    </button>
                  )}
                </div>
              </nav>
            </article>
          </div>
        )}
      </div>
    </main>
  )
}
