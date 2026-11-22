/** Proprietà di {@link SectionHeading}. */
export interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: string
  lore?: string
  align?: 'start' | 'center'
}

/** Intestazione di sezione: sopratitolo d'oro, titolo Cinzel, al massimo una frase. */
export function SectionHeading({ id, eyebrow, title, lore, align = 'start' }: SectionHeadingProps) {
  const center = align === 'center'
  return (
    <div
      className={`flex max-w-[42rem] flex-col gap-3 ${center ? 'mx-auto items-center text-center' : ''}`}
    >
      <p className="type-label text-gold xl:type-eyebrow">{eyebrow}</p>
      <h2 id={id} className="text-text uppercase type-h1-m xl:type-h1">
        {title}
      </h2>
      {lore && <p className="text-text-soft type-body">{lore}</p>}
    </div>
  )
}
