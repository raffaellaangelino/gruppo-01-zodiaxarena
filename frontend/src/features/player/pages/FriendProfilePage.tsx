import { useParams } from 'react-router'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { GameCard } from '@/components/game/GameCard'
import { Medallion } from '@/components/ui/Medallion'
import { SecondaryLink } from '@/components/ui/SecondaryButton'
import { PATHS } from '@/app/paths'
import { useCatalog } from '@/features/cards/queries'
import { PROFILE_FRIENDS } from '@/features/player/profileFriends'
import { GOD_LABELS, SIGN_LABELS } from '@/domain/labels'

export function FriendProfilePage() {
  const { playerId } = useParams()
  const friend = PROFILE_FRIENDS.find((item) => item.id === Number(playerId))
  const { byId } = useCatalog()

  if (!friend) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[90rem] flex-col items-center justify-center px-4 pt-(--shell-top) pb-(--shell-bottom) text-center">
        <title>Profilo utente · Zodiax Arena</title>
        <PorticoBackdrop />
        <h1 className="text-text type-h1-m xl:type-h1">Giocatore non trovato</h1>
        <SecondaryLink to={PATHS.profile} className="mt-5 w-60">
          Torna al profilo
        </SecondaryLink>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-[90rem] px-4 pt-(--shell-top) pb-[calc(var(--shell-bottom)+2rem)] xl:px-8">
      <title>{friend.nickname} · Zodiax Arena</title>
      <PorticoBackdrop />
      <header className="flex flex-wrap items-end justify-between gap-4 pt-6 xl:pt-8">
        <div className="flex items-center gap-4">
          <Medallion size={72} variant="avatar">
            <ElementEmblem element={friend.element} size={56} />
          </Medallion>
          <div>
            <p className="type-eyebrow tracking-[0.12em] text-gold uppercase">Profilo giocatore</p>
            <h1 className="mt-1 text-text type-h1-m xl:type-h1">{friend.nickname}</h1>
          </div>
        </div>
        <SecondaryLink to={PATHS.profile} size="m">Torna al tuo profilo</SecondaryLink>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <section className="glass rounded-[14px] p-5">
          <p className="type-eyebrow tracking-[0.12em] text-gold uppercase">Casa</p>
          <h2 className="mt-3 text-text type-h2-m">{GOD_LABELS[friend.faction].name}</h2>
          <p className="mt-1 text-text-muted type-body">{GOD_LABELS[friend.faction].effect}</p>
          <p className="mt-3 text-gold type-meta">Sole in {SIGN_LABELS[friend.sign]}</p>
        </section>
        <section className="glass rounded-[14px] p-5">
          <p className="type-eyebrow tracking-[0.12em] text-gold uppercase">Statistiche</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[14px] border border-line-soft bg-bg-deep/35 p-4 text-center">
              <p className="tabular-nums text-success type-stat">{friend.wins}</p>
              <p className="text-text-muted type-meta">Vittorie</p>
            </div>
            <div className="rounded-[14px] border border-line-soft bg-bg-deep/35 p-4 text-center">
              <p className="tabular-nums text-danger type-stat">{friend.losses}</p>
              <p className="text-text-muted type-meta">Sconfitte</p>
            </div>
          </div>
        </section>
      </div>

      <section className="glass mt-5 rounded-[14px] p-5" aria-label={`Vetrina di ${friend.nickname}`}>
        <p className="type-eyebrow tracking-[0.12em] text-gold uppercase">Vetrina</p>
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {friend.showcaseCardIds.map((cardId) => {
            const card = byId.get(cardId)
            return card ? (
              <li key={card.id} className="flex justify-center">
                <GameCard size="fluid" imageUrl={card.imageUrl} label={card.name} aura={card.tier} />
              </li>
            ) : null
          })}
        </ul>
      </section>
    </main>
  )
}
