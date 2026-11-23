import { Link } from 'react-router'
import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { GameCard } from '@/components/game/GameCard'
import { Medallion } from '@/components/ui/Medallion'
import { CollectionProgress } from '@/features/collection/components/CollectionProgress'
import { useCollectionEntries } from '@/features/collection/queries'
import { usePlayerSummary } from '@/features/player/queries'
import { profileStatsMock } from '@/mocks/profile'
import { GOD_LABELS, SIGN_LABELS } from '@/domain/labels'
import { PROFILE_FRIENDS } from '@/features/player/profileFriends'

export function ProfilePage() {
  const player = usePlayerSummary()
  const { entries, collection } = useCollectionEntries()
  const stats = profileStatsMock()
  const ownedEntries = entries.filter((entry) => entry.owned)
  const showcase = ownedEntries.slice(0, 6)

  return (
    <main className="mx-auto w-full max-w-[90rem] px-4 pt-(--shell-top) pb-[calc(var(--shell-bottom)+2rem)] xl:px-8">
      <title>Profilo · Zodiax Arena</title>
      <PorticoBackdrop />

      <header className="flex flex-wrap items-end justify-between gap-6 pt-6 xl:pt-8">
        <div>
          <p className="type-eyebrow tracking-[0.12em] text-gold uppercase">Area utente</p>
          <h1 className="mt-2 text-text type-h1-m xl:type-h1">Profilo</h1>
        </div>
        <LogoutButton />
      </header>

      <div className="mt-6 grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <section className="glass rounded-[14px] p-5" aria-labelledby="profile-user">
          <div className="flex items-center gap-4">
            <Medallion size={72} variant="avatar">
              {player.faction ? (
                <ElementEmblem element={player.faction.element} size={56} />
              ) : (
                <span className="font-display text-[1.5rem] text-gold-bright">
                  {player.nickname.charAt(0).toUpperCase()}
                </span>
              )}
            </Medallion>
            <div>
              <p id="profile-user" className="text-text type-h2-m xl:type-h2">
                {player.nickname}
              </p>
              <p className="mt-1 text-text-muted type-meta">
                Sole in {SIGN_LABELS[player.sign]}
              </p>
              {player.faction && (
                <p className="mt-1 text-gold type-meta-strong">
                  Fazione {GOD_LABELS[player.faction.god].name}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="glass rounded-[14px] p-5" aria-labelledby="profile-progress">
          <h2 id="profile-progress" className="type-eyebrow tracking-[0.12em] text-gold uppercase">
            Avanzamento
          </h2>
          <div className="mt-4">
            <CollectionProgress progress={collection.progress} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ProfileStat label="Vittorie" value={stats.wins} tone="success" />
            <ProfileStat label="Sconfitte" value={stats.losses} tone="danger" />
            <ProfileStat label="Scambi" value={stats.tradesCompleted} />
            <ProfileStat label="Amici" value={stats.friends} />
          </div>
        </section>
      </div>

      <section className="glass mt-5 rounded-[14px] p-5" aria-labelledby="profile-showcase">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="type-eyebrow tracking-[0.12em] text-gold uppercase">Vetrina</p>
            <h2 id="profile-showcase" className="mt-2 text-text type-h2-m xl:type-h2">
              Le tue carte preferite
            </h2>
          </div>
          <span className="text-text-muted type-meta">{showcase.length} in mostra</span>
        </div>

        {showcase.length > 0 ? (
          <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8">
            {showcase.map((entry) => (
              <li key={entry.card.id} className="flex justify-center">
                <GameCard
                  size="fluid"
                  imageUrl={entry.card.imageUrl}
                  label={entry.card.name}
                  aura={entry.card.tier}
                  copies={entry.owned?.quantity ?? 1}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 rounded-[14px] border border-dashed border-line-soft px-4 py-10 text-center">
            <p className="text-text type-body-strong">La tua vetrina è vuota</p>
            <p className="mt-1 text-text-muted type-body">
              Apri pacchetti o completa scambi per ottenere le prime carte.
            </p>
          </div>
        )}
      </section>

      <section className="glass mt-5 rounded-[14px] p-5" aria-labelledby="profile-friends">
        <div>
          <p className="type-eyebrow tracking-[0.12em] text-gold uppercase">Amici in evidenza</p>
          <h2 id="profile-friends" className="mt-2 text-text type-h2-m xl:type-h2">
            Tre compagni del tuo cielo
          </h2>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {PROFILE_FRIENDS.map((friend) => (
            <li key={friend.id}>
              <Link
                to={`/profilo/giocatore/${friend.id}`}
                aria-label={`Visualizza il profilo di ${friend.nickname}`}
                className="flex min-h-24 items-center gap-3 rounded-[14px] border border-line-soft bg-bg-deep/35 p-4 text-text no-underline hover:border-gold/55"
              >
                <Medallion size={56} variant="avatar">
                  <ElementEmblem element={friend.element} size={42} />
                </Medallion>
                <span className="min-w-0">
                  <span className="block truncate type-body-strong">{friend.nickname}</span>
                  <span className="mt-1 block text-gold type-meta">
                    {GOD_LABELS[friend.faction].name}
                  </span>
                  <span className="mt-1 block text-text-muted type-meta">
                    Sole in {SIGN_LABELS[friend.sign]}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

function ProfileStat({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone?: 'success' | 'danger'
}) {
  const valueClass =
    tone === 'success' ? 'text-success' : tone === 'danger' ? 'text-danger' : 'text-text'
  return (
    <div className="rounded-[14px] border border-line-soft bg-bg-deep/35 px-3 py-4 text-center">
      <p className={`tabular-nums type-stat ${valueClass}`}>{value}</p>
      <p className="mt-1 text-text-muted type-meta">{label}</p>
    </div>
  )
}
