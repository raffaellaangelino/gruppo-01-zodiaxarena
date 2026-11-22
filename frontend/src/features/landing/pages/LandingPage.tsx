import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import ermesUrl from '@/assets/images/ermes.webp'
import keyartUrl from '@/assets/images/keyart-home.webp'
import packUrl from '@/assets/images/pacchetto-costellazione.webp'
import { cardArtUrl } from '@/components/game/cardArt'
import { Coin } from '@/components/ui/Coin'
import { Icon } from '@/components/ui/Icon'
import { Medallion } from '@/components/ui/Medallion'
import { FactionStage } from '@/features/landing/components/FactionStage'
import { MatchSteps } from '@/features/landing/components/MatchSteps'
import { PublicBar } from '@/features/landing/components/PublicBar'
import { Reveal } from '@/features/landing/components/Reveal'
import { SectionHeading } from '@/features/landing/components/SectionHeading'
import { SignPicker } from '@/features/landing/components/SignPicker'
import { CtaBlock } from '@/features/landing/components/CtaBlock'
import '@/features/landing/landing.css'
import { LANDING_COPY } from '@/features/landing/messages'
import { LegalFooter } from '@/features/legal/components/LegalFooter'
import '@/features/legal/pages/legal.css'

const COPY = LANDING_COPY

/** La mano dell'apertura: cinque carte, il Sole in Leone al centro. */
const HAND = [
  { code: 'za-025-marte-ariete', r: -16, y: 9 },
  { code: 'za-024-luna-pesci', r: -8, y: 3 },
  { code: 'za-005-sole-leone', r: 0, y: 0 },
  { code: 'za-045-giove-sagittario', r: 8, y: 3 },
  { code: 'za-asc-05-ascendente-leone', r: 16, y: 9 },
]

/**
 * Landing (S01, `/` per chi non è ancora entrato), sullo schema delle pagine dei giochi: un'azione
 * sola ("Gioca gratis") ripetuta nella barra, nell'apertura e in fondo, accanto a cosa si riceve;
 * pochi testi brevi e le carte vere mostrate in grande. Un solo sfondo per tutta la pagina, il cielo
 * notturno: la key art del trono vive solo nell'apertura e ci sfuma dentro.
 *
 * Ordine: apertura (titolo e la mano di carte servita) · il tuo segno (scegli il segno, compare il
 * tuo Sole) · le Fazioni (un palco per i quattro dèi) · come si gioca (la costellazione dei tre
 * passi) · gratis · l'invito di Ermes. Movimento in `landing.css`, con "riduci movimento" rispettato.
 */
export function LandingPage() {
  const { hash } = useLocation()

  // Le voci della barra portano alle sezioni: si scorre fino all'ancora.
  useEffect(() => {
    if (!hash) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById(hash.slice(1))
      ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }, [hash])

  return (
    <div className="public-shell min-h-dvh bg-scene-base text-text">
      <title>Zodiax Arena · Gioca con il tuo segno</title>
      <PublicBar />
      <main>
        <Hero />
        <Section id="segno" labelledBy="landing-sign">
          <SignPicker />
        </Section>
        <Section id="fazioni" labelledBy="landing-factions">
          <div className="flex flex-col gap-12">
            <SectionHeading
              id="landing-factions"
              eyebrow={COPY.factions.eyebrow}
              title={COPY.factions.title}
              lore={COPY.factions.lore}
              align="center"
            />
            <FactionStage />
          </div>
        </Section>
        <Section id="partita" labelledBy="landing-match">
          <div className="flex flex-col gap-14">
            <SectionHeading
              id="landing-match"
              eyebrow={COPY.match.eyebrow}
              title={COPY.match.title}
              align="center"
            />
            <MatchSteps />
          </div>
        </Section>
        <Section id="gratis" labelledBy="landing-free">
          <FreeContent />
        </Section>
        <JoinSection />
      </main>
      <LegalFooter />
    </div>
  )
}

/** Una sezione della pagina: ancora per la barra, margini comuni, comparsa quando entra in vista. */
function Section({
  id,
  labelledBy,
  children,
}: {
  id: string
  labelledBy: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className="scroll-mt-(--shell-top) px-4 py-16 xl:px-8 xl:py-20"
    >
      <Reveal className="mx-auto max-w-[72rem]">{children}</Reveal>
    </section>
  )
}

/**
 * Apertura: il trono sullo sfondo che sfuma nel cielo della pagina, al centro titolo, una riga,
 * l'unico pulsante eroico con cosa si riceve, e dal bordo basso la mano di carte servita.
 */
function Hero() {
  const h = COPY.hero
  const rise = (i: number) => ({ ['--i' as string]: i }) as CSSProperties
  return (
    <section
      aria-labelledby="landing-title"
      className="relative isolate flex min-h-[46rem] flex-col items-center overflow-hidden pt-(--shell-top) text-center xl:h-dvh xl:min-h-[50rem]"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img
          src={keyartUrl}
          alt=""
          fetchPriority="high"
          className="size-full object-cover object-[50%_20%]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_46rem_26rem_at_50%_38%,rgba(6,9,22,0.72)_0%,rgba(6,9,22,0.35)_70%,rgba(6,9,22,0.2)_100%),linear-gradient(180deg,rgba(6,9,22,0)_45%,var(--za-scene-base)_96%)]" />
      </div>

      <div className="flex max-w-[44rem] flex-col items-center gap-4 px-4 pt-14 xl:pt-[9vh]">
        <p
          className="landing-rise type-label text-gold text-shadow-scene xl:type-eyebrow"
          style={rise(0)}
        >
          {h.eyebrow}
        </p>
        <h1
          id="landing-title"
          className="landing-rise text-text uppercase text-shadow-hero type-display-m xl:type-display"
          style={rise(1)}
        >
          {h.title[0]}
          <br />
          {h.title[1]}
        </h1>
        <p
          className="landing-rise text-text text-shadow-scene type-lore-m xl:type-lore"
          style={rise(2)}
        >
          {h.tagline}
        </p>
        <div className="landing-rise mt-4 w-full" style={rise(3)}>
          <CtaBlock label={h.cta} />
        </div>
      </div>

      <Hand />
    </section>
  )
}

/** La mano di carte: servita dal basso e aperta a ventaglio; al passaggio la carta si alza. */
function Hand() {
  return (
    <div
      aria-hidden="true"
      className="relative mt-auto h-[13rem] w-[22rem] translate-y-[22%] [--card:7.5rem] xl:h-[19rem] xl:w-[36rem] xl:[--card:11rem]"
    >
      {HAND.map((c, i) => (
        <img
          key={c.code}
          src={cardArtUrl(c.code) ?? undefined}
          alt=""
          className="landing-hand__card aspect-card w-(--card) rounded-(--za-card-radius) object-cover shadow-card"
          style={
            {
              left: `calc(50% - var(--card) / 2 + ${(i - 2) * 22}%)`,
              zIndex: 10 - Math.abs(i - 2),
              ['--r' as string]: `${c.r}deg`,
              ['--y' as string]: `${c.y}%`,
              ['--i' as string]: i,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** Gratis, sul serio: la busta e due promesse, senza riquadri in più. */
function FreeContent() {
  const f = COPY.free
  const icons = [
    <Coin key="crediti" size={24} />,
    <Icon key="scambi" name="scambi" size={24} className="text-gold-bright" />,
  ]
  return (
    <div className="grid items-center gap-12 md:grid-cols-[auto_minmax(0,1fr)] xl:gap-20">
      <img
        src={packUrl}
        alt={f.pack}
        width={240}
        height={372}
        loading="lazy"
        className="mx-auto w-44 drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)] transition-transform duration-(--za-dur-base) hover:-translate-y-2 xl:w-60"
      />
      <div className="flex flex-col gap-8">
        <SectionHeading id="landing-free" eyebrow={f.eyebrow} title={f.title} />
        <ul className="flex flex-col">
          {f.rows.map((row, i) => (
            <li key={row.title} className="flex items-start gap-4 border-t border-line-soft py-5">
              <Medallion size={48}>{icons[i]}</Medallion>
              <div className="flex flex-col gap-1">
                <h3 className="type-h3 text-text uppercase">{row.title}</h3>
                <p className="max-w-[34rem] text-text-soft type-body">{row.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** L'invito finale: la voce di Ermes, firmata, e il pulsante eroico. */
function JoinSection() {
  const j = COPY.join
  return (
    <section aria-labelledby="landing-join" className="px-4 pt-8 pb-24 xl:pb-32">
      <Reveal className="mx-auto flex max-w-[40rem] flex-col items-center gap-6 text-center">
        <Medallion size={112} variant="large">
          <img src={ermesUrl} alt={j.hermesAlt} loading="lazy" className="size-full rounded-full" />
        </Medallion>
        <h2 id="landing-join" className="text-text uppercase type-display-m">
          {j.title}
        </h2>
        <figure className="m-0 flex flex-col gap-2">
          <blockquote className="m-0 text-text-soft italic type-lore-m">{j.hermes}</blockquote>
          <figcaption className="type-label text-gold">{j.hermesSign}</figcaption>
        </figure>
        <div className="mt-2 w-full">
          <CtaBlock label={j.cta} withLogin />
        </div>
      </Reveal>
    </section>
  )
}
