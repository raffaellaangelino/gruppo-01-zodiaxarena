const FACTS = [
  {
    title: 'Rarità',
    description:
      'La decide il pianeta: il Sole è Leggendario, Luna e Marte Epici, Giove e Saturno Rari, Mercurio e Venere Comuni.',
  },
  {
    title: 'Pianeta in Segno',
    description: 'È il nome della carta. Il segno decide l’elemento e i valori di partenza.',
  },
  {
    title: 'ATK · attacco',
    description: 'Il danno che infliggi a ogni colpo.',
  },
  {
    title: 'DEF · difesa',
    description: 'È la vita della creatura: scende con i colpi e non si rigenera.',
  },
  {
    title: 'Elemento',
    description: 'Fuoco, Acqua, Terra o Aria: conta per i vantaggi e per le abilità.',
  },
]

export function CardFacts() {
  return (
    <ol className="guide-facts">
      {FACTS.map((fact, index) => (
        <li className="guide-fact" key={fact.title}>
          <span className="guide-number" aria-hidden="true">
            <span>{index + 1}</span>
          </span>
          <div>
            <h3>{fact.title}</h3>
            <p>{fact.description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
