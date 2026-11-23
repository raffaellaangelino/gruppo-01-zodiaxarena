import giove from '@/assets/cards/giove.webp'
import saturno from '@/assets/cards/saturno.webp'
import marte from '@/assets/cards/marte.webp'
import sole from '@/assets/cards/sole.webp'
import venere from '@/assets/cards/venere.webp'
import luna from '@/assets/cards/luna.webp'

const SHOWCASE_CARDS = [
  { src: venere, name: 'Venere in Toro' },
  { src: sole, name: 'Sole in Leone' },
  { src: saturno, name: 'Saturno in Capricorno' },
  { src: marte, name: 'Marte in Ariete' },
  { src: luna, name: 'Luna in Pesci' },
  { src: giove, name: 'Giove in Sagittario' },
]

export function ProfileShowcase() {
  return (
    <section className="profile-showcase" aria-labelledby="profile-showcase-title">
      <div className="profile-showcase__heading">
        <h2 id="profile-showcase-title">
          <span aria-hidden="true">✦</span>
          Vetrina
        </h2>
      </div>

      <div className="profile-showcase__cards">
        {SHOWCASE_CARDS.map((card) => (
          <img
            key={card.name}
            className="profile-showcase__card"
            src={card.src}
            alt={card.name}
            loading="lazy"
          />
        ))}
      </div>
    </section>
  )
}
