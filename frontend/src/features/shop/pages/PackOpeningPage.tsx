import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { PATHS } from '@/app/paths'
import { MockDataNotice } from '@/app/shell/MockDataNotice'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { CARD_BACK } from '@/components/game/cardBack'
import { GameCard } from '@/components/game/GameCard'
import { Meridian } from '@/components/progress/Meridian'
import { GoldButton } from '@/components/ui/GoldButton'
import { Icon } from '@/components/ui/Icon'
import { SecondaryLink } from '@/components/ui/SecondaryButton'
import type { Tier } from '@/domain/game'
import { useCatalog } from '@/features/cards/queries'
import type { CardDefinition } from '@/features/cards/types'
import { SHOP_SAMPLE } from '@/features/shop/api'
import { SHOP_COPY } from '@/features/shop/messages'
import { useOpening, useShop } from '@/features/shop/queries'
import type { OpenedCard } from '@/features/shop/types'
import './opening.css'

const COPY = SHOP_COPY.opening

/** La luce di ogni tier (token dei tier, versione testo). */
const TIER_GLOW: Record<Tier, string> = {
  COMMON: 'var(--za-tier-comune-text)',
  RARE: 'var(--za-tier-rara-text)',
  EPIC: 'var(--za-tier-epica-text)',
  LEGENDARY: 'var(--za-tier-leggendaria-text)',
  ASCENDANT: 'var(--za-tier-ascendente)',
}

/** Tempi della rivelazione (ms): attesa iniziale, carte normali, luce della Stella, passaggio al riepilogo. */
const T = { start: 1100, card: 560, anticipation: 1400, summary: 1200 }

/**
 * Apertura del pacchetto (X02): a schermo intero nel portico, con la raggiera dietro le carte. Le
 * carte normali si girano in fretta; le Stelle per ultime, ognuna con la luce del suo tier che
 * filtra dal dorso prima di girarsi da sola. "Rivela tutto" salta l'attesa. Poi il riepilogo: la
 * carta nuova si distingue, i doppioni dicono quanto valgono se li ricicli, sotto il conteggio, il
 * contatore del Sole e le azioni (Vai alla Collezione, Aprine un altro).
 */
export function PackOpeningPage() {
  const id = Number(useParams().openingId)
  const opening = useOpening(id)
  const catalog = useCatalog()

  if (!opening) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
        <PorticoBackdrop />
        <h1 className="text-text type-h1-m">{COPY.notFound}</h1>
        <p className="text-text-muted type-body">{COPY.notFoundHint}</p>
        <SecondaryLink to={PATHS.collection}>{COPY.toCollection}</SecondaryLink>
      </main>
    )
  }
  return <Reveal key={id} cards={opening.cards} catalog={catalog.byId} />
}

/** La rivelazione e il riepilogo di un'apertura. */
function Reveal({
  cards,
  catalog,
}: {
  cards: OpenedCard[]
  catalog: ReadonlyMap<number, CardDefinition>
}) {
  const id = Number(useParams().openingId)
  const opening = useOpening(id) as NonNullable<ReturnType<typeof useOpening>>
  const shop = useShop()
  const navigate = useNavigate()
  const pack = shop.packs.find((p) => p.code === opening.packCode)
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  // Ordine di rivelazione: prima le carte normali, le Stelle per ultime
  const order = useMemo(
    () => [
      ...cards.filter((c) => c.slotType !== 'STAR').map((c) => c.slot),
      ...cards.filter((c) => c.slotType === 'STAR').map((c) => c.slot),
    ],
    [cards],
  )
  const [step, setStep] = useState(reduced ? order.length : 0)
  const [anticipating, setAnticipating] = useState<number | null>(null)
  const [summary, setSummary] = useState(reduced)

  useEffect(() => {
    if (summary) return
    if (step >= order.length) {
      const t = window.setTimeout(() => setSummary(true), T.summary)
      return () => window.clearTimeout(t)
    }
    const slot = order[step]
    const isStar = cards.find((c) => c.slot === slot)?.slotType === 'STAR'
    if (isStar && anticipating !== slot) {
      const t = window.setTimeout(() => setAnticipating(slot), step === 0 ? T.start : T.card)
      return () => window.clearTimeout(t)
    }
    const delay = isStar ? T.anticipation : step === 0 ? T.start : T.card
    const t = window.setTimeout(() => {
      setAnticipating(null)
      setStep((s) => s + 1)
    }, delay)
    return () => window.clearTimeout(t)
  }, [step, order, cards, anticipating, summary])

  const revealed = new Set(order.slice(0, step))
  const revealAll = () => {
    setAnticipating(null)
    setStep(order.length)
    setSummary(true)
  }

  const news = cards.filter((c) => c.isNew).length
  const dups = cards.length - news
  const recycle = cards.filter((c) => !c.isNew).reduce((s, c) => s + c.recycleValue, 0)
  const many = cards.length > 6
  const sunLeft = opening.sunCounter.total - opening.sunCounter.done
  // Una sola carta nuova tra i doppioni si ingrandirà verso l'alto: lo spazio sopra la fila si
  // tiene fin dall'inizio, così quando arriva il riepilogo niente salta
  const heroRow = news === 1 && dups > 0

  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden px-4 pt-6 pb-10 xl:px-8">
      <title>{`${pack?.name ?? 'Pacchetto'} · Zodiax Arena`}</title>
      <PorticoBackdrop />

      <div className="flex h-12 items-center justify-between">
        <Link
          to={PATHS.shop}
          className="inline-flex items-center gap-2 text-gold-bright no-underline type-meta-strong"
        >
          <Icon name="indietro" size={16} />
          {COPY.back}
        </Link>
        {!summary && (
          <button
            type="button"
            onClick={revealAll}
            className="cursor-pointer border-0 bg-transparent text-gold-bright type-meta-strong"
          >
            {COPY.revealAll}
          </button>
        )}
      </div>

      {/* Titolo, carte e riepilogo sono un blocco unico al centro dello schermo, come nella tela:
          su schermi alti non si separano lasciando il vuoto in mezzo */}
      <div className="flex flex-1 flex-col items-center justify-center py-6">
        <header className="flex flex-col items-center gap-2 text-center">
          <p
            key={`e-${summary}`}
            className="pack-fade type-label tracking-[0.12em] text-gold uppercase"
          >
            {summary
              ? COPY.summaryEyebrow(pack?.name ?? '')
              : COPY.progress(Math.min(step + 1, cards.length), cards.length)}
          </p>
          <h1
            key={`t-${summary}`}
            aria-live="polite"
            className="pack-fade text-text type-h1-m xl:type-h1"
          >
            {summary ? COPY.summaryTitle(news) : pack?.name}
          </h1>
        </header>

        <div className="relative mt-10 w-full">
          <div aria-hidden="true" className="pack-burst -z-10" />
          <ul
            className={`relative mx-auto flex flex-wrap ${heroRow ? 'pt-18' : ''} items-end justify-center gap-x-3 gap-y-6 md:gap-x-7 ${many ? 'max-w-[62rem] [--pack-card-w:4.5rem] md:[--pack-card-w:6.5rem] xl:[--pack-card-w:7.25rem]' : 'max-w-[72rem] [--pack-card-w:6.25rem] md:gap-y-8 md:[--pack-card-w:11.5rem]'}`}
          >
            {cards.map((c, i) => {
              const card = catalog.get(c.cardId)
              const shown = revealed.has(c.slot)
              const tier = card?.tier ?? 'COMMON'
              // Nel riepilogo le nuove hanno la luce del tier; una sola tra i doppioni si ingrandisce
              const highlight = summary && c.isNew
              const hero = highlight && news === 1 && dups > 0
              return (
                <li
                  key={c.slot}
                  className="pack-deal flex w-(--pack-card-w) flex-col items-center gap-3 md:w-auto"
                  style={{ ['--i' as string]: i } as CSSProperties}
                >
                  <div
                    className="pack-card"
                    data-revealed={shown}
                    data-anticipation={anticipating === c.slot}
                    data-star={c.slotType === 'STAR'}
                    data-new={highlight}
                    data-hero={hero}
                    style={{ ['--pack-glow' as string]: TIER_GLOW[tier] } as CSSProperties}
                  >
                    <div className="pack-card__inner">
                      <img
                        src={CARD_BACK}
                        alt={shown ? '' : 'Carta coperta'}
                        className="pack-card__face pack-card__back size-full object-cover"
                      />
                      <span className="pack-card__face pack-card__front">
                        {card && (
                          <GameCard
                            size="fluid"
                            imageUrl={card.imageUrl}
                            label={card.name}
                            isNew={highlight}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                  <div
                    key={`c-${shown}`}
                    className="pack-fade flex min-h-11 flex-col items-center gap-0.5 text-center"
                  >
                    {shown ? (
                      <>
                        <b className="type-meta-strong md:type-body-strong">{card?.name}</b>
                        {c.isNew ? (
                          <span className="font-extrabold text-gold-bright type-meta">
                            {COPY.newForYou}
                          </span>
                        ) : (
                          <DuplicateNote value={c.recycleValue} />
                        )}
                      </>
                    ) : (
                      c.slotType === 'STAR' && (
                        <>
                          <b className="text-[0.9375rem]! type-button tracking-[0.1em] text-tier-epica-text uppercase">
                            {COPY.star}
                          </b>
                          <span className="text-text-muted type-meta">{COPY.starNote}</span>
                        </>
                      )
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Il riepilogo c'è fin dall'inizio, nascosto: tiene il suo spazio, così il blocco non si
            ricentra (e non salta) quando appare in dissolvenza */}
        <section
          aria-label="Riepilogo"
          aria-hidden={!summary}
          inert={!summary}
          data-visible={summary}
          className="pack-summary mt-12 flex flex-col items-center gap-5 text-center"
        >
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
            <p className="type-body">
              <b>{COPY.tally(news, dups)}</b>{' '}
              {dups > 0 && <span className="text-text-muted">{COPY.recycle(recycle)}</span>}
            </p>
            <span aria-hidden="true" className="hidden h-8 w-px bg-line-soft md:block" />
            <p className="flex items-center gap-3 type-body">
              <Meridian progress={opening.sunCounter} size={44} />
              <span>
                Sole garantito entro <b className="text-tier-leggendaria-text">{sunLeft}</b>{' '}
                {sunLeft === 1 ? 'Stella' : 'Stelle'}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <SecondaryLink to={PATHS.collection} className="w-60">
              {COPY.toCollection}
            </SecondaryLink>
            {pack && (
              <GoldButton
                className="w-66"
                disabled={!pack.available}
                onClick={() => navigate(PATHS.shop, { state: { reopen: pack.code } })}
              >
                {COPY.another(pack.price)}
              </GoldButton>
            )}
          </div>
          <p className="text-text-muted type-meta">
            {COPY.balance} <b className="text-text">{opening.balance}</b> {SHOP_COPY.credits}
          </p>
        </section>
      </div>
      {SHOP_SAMPLE && <MockDataNotice />}
    </main>
  )
}

/** "Doppione · +5 se lo ricicli". */
function DuplicateNote({ value }: { value: number }) {
  const [before, amount, after] = COPY.duplicate(value)
  return (
    <span className="text-text-muted type-meta">
      {before} <b className="text-text">{amount}</b> {after}
    </span>
  )
}
