import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { GameCard } from '@/components/game/GameCard'
import { CARD_BACK } from '@/components/game/cardBack'
import { Dialog } from '@/components/overlay/Dialog'
import { Coin } from '@/components/ui/Coin'
import { GoldButton, GoldLink } from '@/components/ui/GoldButton'
import { Icon } from '@/components/ui/Icon'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import { ApiError } from '@/lib/http'
import { useCatalog } from '@/features/cards/queries'
import type { CardDefinition } from '@/features/cards/types'
import {
  type PackGuarantee,
  type PackSlotType,
  type ShopPack,
  type PackOpeningResponse,
} from '@/features/shop/api'
import { useShop } from '@/features/shop/queries'
import packArtworkCostellazione from '@/assets/images/shop/pacchetto-costellazione.jpg'
import packArtworkLunaPiena from '@/assets/images/shop/pacchetto-luna-piena.jpg'
import packArtworkZenit from '@/assets/images/shop/pacchetto-zenit.jpg'
import './shop.css'

const PACK_ARTWORK: Readonly<Record<string, string>> = {
  COSTELLAZIONE: packArtworkCostellazione,
  LUNA_PIENA: packArtworkLunaPiena,
  ZENIT: packArtworkZenit,
}

const SLOT_LABELS: Record<PackSlotType, string> = {
  COMMON: 'Comune',
  RARE: 'Rara',
  EPIC: 'Epica',
  LEGENDARY: 'Leggendaria',
  ASCENDANT: 'Ascendente',
  STAR: 'Stella',
}

const SLOT_PLURALS: Record<PackSlotType, string> = {
  COMMON: 'Comuni',
  RARE: 'Rare',
  EPIC: 'Epiche',
  LEGENDARY: 'Leggendarie',
  ASCENDANT: 'Ascendenti',
  STAR: 'Stelle',
}

const GUARANTEE_LABELS: Record<PackGuarantee, string> = {
  SUN_WITHIN_10_STARS: 'Sole garantito entro 10 Stelle',
  NO_DUPLICATE_EPIC_LEGENDARY: 'Niente doppioni Epici e Leggendari',
  EPIC: 'Epica garantita',
  LEGENDARY: 'Leggendaria garantita',
  ASCENDANT: 'Ascendente garantito',
}

function slotCounts(slots: PackSlotType[]): string {
  const counts = new Map<PackSlotType, number>()
  for (const slot of slots) counts.set(slot, (counts.get(slot) ?? 0) + 1)
  return [...counts]
    .map(([slot, count]) => `${count} ${count === 1 ? SLOT_LABELS[slot] : SLOT_PLURALS[slot]}`)
    .join(' · ')
}

function formatOdds(pack: ShopPack): string {
  return Object.entries(pack.starOdds)
    .filter(([, chance]) => typeof chance === 'number' && chance > 0)
    .map(
      ([rarity, chance]) =>
        `${Math.round((chance ?? 0) * 100)}% ${SLOT_LABELS[rarity as PackSlotType]}`,
    )
    .join(' · ')
}

function unavailableMessage(pack: ShopPack): string {
  switch (pack.unavailableReason) {
    case 'INSUFFICIENT_CREDITS':
      return 'Crediti insufficienti'
    case 'LIMIT_REACHED':
      return pack.availableAgainAt
        ? `Disponibile dal ${new Date(pack.availableAgainAt).toLocaleDateString('it-IT')}`
        : 'Limite di acquisto raggiunto'
    case 'NOT_YET_RELEASED':
      return pack.availableAgainAt
        ? `Disponibile dal ${new Date(pack.availableAgainAt).toLocaleDateString('it-IT')}`
        : 'Non ancora disponibile'
    default:
      return 'Non disponibile'
  }
}

function purchaseErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Non è stato possibile completare l’acquisto. Riprova.'
  if (error.isNetworkError) return 'Connessione non disponibile. Controlla la rete e riprova.'
  switch (error.code) {
    case 'INSUFFICIENT_CREDITS':
      return 'Non hai abbastanza crediti per questo pacchetto.'
    case 'LIMIT_REACHED':
      return 'Hai già acquistato questo pacchetto nel ciclo attuale.'
    case 'NOT_YET_RELEASED':
      return 'Questo pacchetto non è ancora disponibile.'
    case 'CONFLICT':
      return 'La richiesta è in conflitto con un acquisto precedente. Aggiorna lo shop e riprova.'
    default:
      return 'Il server non ha completato l’acquisto. Riprova tra poco.'
  }
}

/** Negozio giocatore: prezzi e composizione arrivano dal backend, le illustrazioni dal catalogo. */
export function ShopPage() {
  const { shop, purchase } = useShop()
  const { byId } = useCatalog()
  const [selectedPack, setSelectedPack] = useState<ShopPack | null>(null)
  const [opening, setOpening] = useState<PackOpeningResponse | null>(null)
  const idempotency = useRef<{ code: string; key: string } | null>(null)
  const oddsPack = shop.packs.find((pack) => Object.keys(pack.starOdds).length > 0)
  const starOdds = oddsPack ? formatOdds(oddsPack) : ''

  const confirmPurchase = () => {
    if (!selectedPack || !selectedPack.available || purchase.isPending) return
    if (!idempotency.current || idempotency.current.code !== selectedPack.code) {
      idempotency.current = { code: selectedPack.code, key: crypto.randomUUID() }
    }
    purchase.mutate(
      { code: selectedPack.code, idempotencyKey: idempotency.current.key },
      {
        onSuccess: (result) => {
          setSelectedPack(null)
          setOpening(result)
          idempotency.current = null
        },
      },
    )
  }

  return (
    <main className="shop-page">
      <title>Negozio · Zodiax Arena</title>
      <PorticoBackdrop />

      <div className="shop-page__inner">
        {opening ? (
          <PackOpening opening={opening} catalog={byId} onBack={() => setOpening(null)} />
        ) : (
          <>
            <header className="shop-heading">
              <div>
                <p className="shop-heading__eyebrow">Il tuo viaggio continua</p>
                <h1>Negozio</h1>
                <p className="shop-heading__copy">
                  Ogni pacchetto custodisce nuove carte per il tuo Cielo.
                </p>
              </div>
              <div className="shop-balance" aria-label={`${shop.balance} crediti disponibili`}>
                <Coin size={24} />
                <span>
                  <small>Il tuo saldo</small>
                  <strong>{shop.balance.toLocaleString('it-IT')}</strong>
                </span>
                <span className="shop-balance__label">crediti</span>
              </div>
            </header>

            <nav className="shop-tabs" aria-label="Sezioni collezione">
              <Link to={PATHS.collection} className="shop-tabs__link">
                Collezione
              </Link>
              <Link to={PATHS.deck} className="shop-tabs__link">
                Il tuo Cielo
              </Link>
              <span className="shop-tabs__link shop-tabs__link--active" aria-current="page">
                Pacchetti
              </span>
            </nav>

            {shop.packs.length > 0 ? (
              <section className="shop-packs" aria-labelledby="shop-packs-title">
                <div className="shop-section-heading">
                  <div>
                    <p className="shop-heading__eyebrow">Scegli il tuo destino</p>
                    <h2 id="shop-packs-title">Pacchetti disponibili</h2>
                  </div>
                  <span>{shop.packs.length} pacchetti</span>
                </div>

                <div className="shop-pack-grid">
                  {shop.packs.map((pack) => (
                    <PackCard
                      key={pack.code}
                      pack={pack}
                      onBuy={() => {
                        idempotency.current = null
                        purchase.reset()
                        setSelectedPack(pack)
                      }}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <section className="shop-empty">
                <Icon name="pacchetto" size={32} />
                <h2>Nessun pacchetto disponibile</h2>
                <p>Torna più tardi: nuovi pacchetti arriveranno presto.</p>
              </section>
            )}

            <section className="shop-promises" aria-label="Regole del Negozio">
              <article>
                <span className="shop-promises__icon" aria-hidden="true">
                  ✦
                </span>
                <div>
                  <strong>Sole garantito entro 10 Stelle</strong>
                  <span>
                    {shop.sunCounter.done} su {shop.sunCounter.total} Stelle verso la prossima
                    Leggendaria
                  </span>
                </div>
              </article>
              <article>
                <span className="shop-promises__icon" aria-hidden="true">
                  ✧
                </span>
                <div>
                  <strong>Niente doppioni di Epiche e Leggendarie</strong>
                  <span>Finché non avrai completato la raccolta di queste rarità.</span>
                </div>
              </article>
              <article>
                <span className="shop-promises__icon" aria-hidden="true">
                  ☼
                </span>
                <div>
                  <strong>La Stella</strong>
                  <span>{starOdds || 'Le probabilità sono indicate su ogni pacchetto.'}</span>
                </div>
              </article>
            </section>
          </>
        )}
      </div>

      {selectedPack && (
        <Dialog
          label={`Conferma acquisto ${selectedPack.name}`}
          onClose={() => {
            if (!purchase.isPending) {
              setSelectedPack(null)
              purchase.reset()
            }
          }}
          className="max-w-[35rem]"
        >
          <div className="shop-confirm">
            <p className="shop-heading__eyebrow">Conferma dell’acquisto</p>
            <h2>Aprire {selectedPack.name}?</h2>
            <p className="shop-confirm__copy">{selectedPack.role}</p>
            <div className="shop-confirm__pack">
              <PackArtwork
                code={selectedPack.code}
                name={selectedPack.name}
                cardCount={selectedPack.cardCount}
              />
              <div>
                <strong>{selectedPack.cardCount} carte</strong>
                <span>{slotCounts(selectedPack.slots)}</span>
                <span className="shop-confirm__cost">
                  <Coin size={18} /> {selectedPack.price} crediti
                </span>
                <span className="shop-confirm__remaining">
                  Saldo dopo l’acquisto: {Math.max(0, shop.balance - selectedPack.price)} crediti
                </span>
              </div>
            </div>
            {purchase.isError && (
              <p className="shop-error" role="alert">
                {purchaseErrorMessage(purchase.error)}
              </p>
            )}
            <div className="shop-confirm__actions">
              <SecondaryButton
                onClick={() => {
                  setSelectedPack(null)
                  purchase.reset()
                }}
                disabled={purchase.isPending}
              >
                Annulla
              </SecondaryButton>
              <GoldButton onClick={confirmPurchase} disabled={purchase.isPending}>
                {purchase.isPending ? 'Apertura…' : 'Apri il pacchetto'}
              </GoldButton>
            </div>
          </div>
        </Dialog>
      )}
    </main>
  )
}

function PackCard({ pack, onBuy }: { pack: ShopPack; onBuy: () => void }) {
  const odds = formatOdds(pack)

  return (
    <article className={`shop-pack-card ${pack.available ? '' : 'shop-pack-card--unavailable'}`}>
      <div className="shop-pack-card__frame">
        <PackArtwork code={pack.code} name={pack.name} cardCount={pack.cardCount} />
        <div className="shop-pack-card__body">
          <p className="shop-pack-card__role">{pack.role}</p>
          <h3>{pack.name}</h3>
          <div className="shop-slot-row" aria-hidden="true">
            {pack.slots.map((slot, index) => (
              <span
                key={`${pack.code}-${index}`}
                className={`shop-slot shop-slot--${slot.toLowerCase()}`}
                title={`${index + 1}. ${SLOT_LABELS[slot]}`}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="shop-pack-card__contents">{slotCounts(pack.slots)}</p>
          {pack.guarantees.length > 0 && (
            <p className="shop-pack-card__guarantee">
              {pack.guarantees.map((guarantee) => GUARANTEE_LABELS[guarantee]).join(' · ')}
            </p>
          )}
          {odds && <p className="shop-pack-card__odds">La Stella: {odds}</p>}
          <div className="shop-pack-card__footer">
            <span className="shop-pack-card__price">
              <Coin size={20} />
              <strong>{pack.price.toLocaleString('it-IT')}</strong>
              <small>crediti</small>
            </span>
            <GoldButton
              size="m"
              className="shop-pack-card__buy"
              onClick={onBuy}
              disabled={!pack.available}
            >
              {pack.available ? 'Acquista' : unavailableMessage(pack)}
            </GoldButton>
          </div>
        </div>
      </div>
    </article>
  )
}

function PackArtwork({ code, name, cardCount }: { code: string; name: string; cardCount: number }) {
  const artwork = PACK_ARTWORK[code]
  if (artwork) {
    return (
      <div className={`shop-pack-art shop-pack-art--${code.toLowerCase()}`}>
        <img
          className="shop-pack-art__image"
          src={artwork}
          alt={`Pacchetto ${name}, ${cardCount} carte`}
        />
      </div>
    )
  }

  return (
    <div className={`shop-pack-art shop-pack-art--${code.toLowerCase()}`}>
      <span className="shop-pack-art__card shop-pack-art__card--left">
        <img src={CARD_BACK} alt="" />
      </span>
      <span className="shop-pack-art__card shop-pack-art__card--right">
        <img src={CARD_BACK} alt="" />
      </span>
      <span className="shop-pack-art__card shop-pack-art__card--center">
        <img src={CARD_BACK} alt="" />
      </span>
      <span className="shop-pack-art__name">{name}</span>
      <span className="shop-pack-art__count">{cardCount} carte</span>
    </div>
  )
}

function PackOpening({
  opening,
  catalog,
  onBack,
}: {
  opening: PackOpeningResponse
  catalog: ReadonlyMap<number, CardDefinition>
  onBack: () => void
}) {
  const newCards = opening.cards.filter((card) => card.isNew).length
  const duplicateCards = opening.cards.length - newCards

  return (
    <section className="shop-opening" aria-labelledby="shop-opening-title">
      <header className="shop-opening__header">
        <p className="shop-heading__eyebrow">Il destino ha parlato</p>
        <h1 id="shop-opening-title">
          {newCards > 0 ? 'Una carta nuova per il tuo Cielo' : 'Il pacchetto è stato aperto'}
        </h1>
        <p>Le carte sono state aggiunte alla tua collezione.</p>
      </header>

      <ul className="shop-opening__cards">
        {opening.cards.map((opened) => {
          const card = catalog.get(opened.cardId)
          const label = card?.name ?? `Carta ${opened.cardId}`
          return (
            <li key={`${opening.openingId}-${opened.slot}`} className="shop-opening-card">
              <GameCard
                size="m"
                imageUrl={card?.imageUrl ?? null}
                label={label}
                aura={card?.tier}
                isNew={opened.isNew}
              />
              <strong>{label}</strong>
              <span>{SLOT_LABELS[opened.slotType]}</span>
              {!opened.isNew && <small>Doppione</small>}
            </li>
          )
        })}
      </ul>

      <div className="shop-opening__summary">
        <span>{opening.cards.length} carte aperte</span>
        <span>
          {newCards} nuove · {duplicateCards} doppioni
        </span>
        {opening.sunFound && <strong>Il Sole è sorto: Stella Leggendaria!</strong>}
        <span className="shop-opening__balance">
          Saldo aggiornato: <Coin size={18} /> {opening.balance.toLocaleString('it-IT')}
        </span>
      </div>

      <div className="shop-opening__actions">
        <SecondaryButton onClick={onBack}>Torna al negozio</SecondaryButton>
        <GoldLink to={PATHS.collection} size="m">
          Vai alla collezione
        </GoldLink>
      </div>
    </section>
  )
}
