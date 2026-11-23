import { GUIDE_CHAPTERS } from '@/features/guide/chapters'

interface GuideChaptersProps {
  search: string
  selectedId: string
  onSelect: (id: string) => void
}

export function GuideChapters({ search, selectedId, onSelect }: GuideChaptersProps) {
  const chapters = GUIDE_CHAPTERS.filter((chapter) =>
    chapter.title.toLocaleLowerCase('it').includes(search.trim().toLocaleLowerCase('it')),
  )

  return (
    <aside className="guide-chapters" aria-label="Capitoli">
      <p className="guide-eyebrow">Capitoli</p>
      <ol>
        {chapters.map((chapter) => {
          const active = chapter.id === selectedId
          return (
            <li key={chapter.id}>
              <button
                type="button"
                className={`guide-chapter ${active ? 'guide-chapter--active' : ''}`}
                aria-current={active ? 'location' : undefined}
                onClick={() => onSelect(chapter.id)}
              >
                <span aria-hidden="true">{active ? '◆' : '◇'}</span>
                {chapter.title}
              </button>
            </li>
          )
        })}
        {chapters.length === 0 && <li className="guide-no-results">Nessun capitolo trovato</li>}
      </ol>
    </aside>
  )
}
