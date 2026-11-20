import { useParams } from 'react-router'
import { MockDataNotice } from '@/app/shell/MockDataNotice'
import { PATHS, matchVerdictPath } from '@/app/paths'
import { ArenaBackdrop } from '@/components/arena/ArenaBackdrop'
import { ArenaTopBar } from '@/components/arena/ArenaTopBar'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { TilePanel } from '@/components/panels/TilePanel'
import { GoldLink } from '@/components/ui/GoldButton'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Medallion } from '@/components/ui/Medallion'
import { SecondaryLink } from '@/components/ui/SecondaryButton'
import { GOD_LABELS } from '@/domain/labels'
import { buildChronicle, type ChronicleLine } from '@/features/matches/chronicle'
import { MatchCardImage } from '@/features/matches/components/MatchCardImage'
import { MATCH_COPY } from '@/features/matches/messages'
import { MATCH_IS_SAMPLE, useMatch } from '@/features/matches/queries'
import type { Match, MatchSide } from '@/features/matches/types'

/** Icona di ogni tipo di riga della cronaca. */
const LINE_ICONS: Record<ChronicleLine['kind'], IconName> = {
  enter: 'carta',
  attack: 'atk',
  damage: 'def',
  defeat: 'sconfitta',
  hp: 'vita',
}

/**
 * Colore della frase: cadute e PV persi sono rossi se toccano a te, d'oro se toccano all'avversario.
 *
 * @param line Riga della cronaca.
 * @param me Lato di chi guarda.
 * @returns La classe del colore.
 */
function lineTone(line: ChronicleLine, me: MatchSide): string {
  if (line.kind !== 'defeat' && line.kind !== 'hp') return 'text-text'
  return line.side === me ? 'text-danger-soft' : 'text-gold-bright'
}

/** Un giocatore nell'intestazione del Rotolo: stemma, nome e Fazione (ormai scoperta). */
function PlayerPlate({ match, side }: { match: Match; side: MatchSide }) {
  const player = match.players[side]
  const isMe = side === match.me
  return (
    <div className={`flex items-center gap-3 ${isMe ? '' : 'flex-row-reverse text-right'}`}>
      <span aria-hidden="true">
        <Medallion size={48}>
          <ElementEmblem element={player.faction.element} size={40} />
        </Medallion>
      </span>
      <span className="flex flex-col">
        <span className="type-h3 text-text">
          {player.nickname}
          {isMe && ' · tu'}
        </span>
        <span className="text-text-muted type-meta">{GOD_LABELS[player.faction.god].name}</span>
      </span>
    </div>
  )
}

/**
 * Il Rotolo di Lachesi, versione SAL (tavole Sfide-Rotolo e Sfide-Rotolo-Cronaca): la partita
 * raccontata round per round, con le carte, i colpi, i danni e da dove vengono i numeri.
 * "Salta al risultato" porta subito al Verdetto; in fondo, "Vai al Verdetto".
 *
 * L'arena animata della tavola (carte in campo, round al centro, controlli di riproduzione)
 * arriva dopo il SAL: legge gli stessi eventi.
 */
export function MatchReplayPage() {
  const { matchId } = useParams()
  const match = useMatch(Number(matchId))
  const rounds = buildChronicle(match)
  const opponent: MatchSide = match.me === 'A' ? 'B' : 'A'
  const verdict = matchVerdictPath(match.id)

  return (
    <main className="relative min-h-dvh px-4 pt-24 pb-12 md:px-8">
      <title>Il Rotolo · Zodiax Arena</title>
      <ArenaBackdrop />
      <ArenaTopBar
        backTo={PATHS.challenges}
        backLabel={MATCH_COPY.back}
        action={<SecondaryLink to={verdict}>{MATCH_COPY.skip}</SecondaryLink>}
      />

      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="flex flex-col items-center gap-2 text-center text-shadow-scene">
          <h1 className="text-text type-h1-m md:type-h1">{MATCH_COPY.chronicleTitle}</h1>
          <p className="text-text-soft type-body">
            {MATCH_COPY.chronicleSubtitle(
              match.players[match.me].nickname,
              match.players[opponent].nickname,
            )}
          </p>
        </header>

        <TilePanel glass as="div">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <PlayerPlate match={match} side={match.me} />
            <span
              aria-hidden="true"
              className="font-display text-[1.5rem] font-bold text-nav-ink-active"
            >
              VS
            </span>
            <PlayerPlate match={match} side={opponent} />
          </div>
        </TilePanel>

        <ol className="flex flex-col gap-4">
          {rounds.map((round) => (
            <li key={round.round}>
              <TilePanel glass as="article" aria-label={`${MATCH_COPY.round} ${round.round}`}>
                <div className="flex flex-col gap-3 px-5 py-4">
                  <header className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="type-h2 tracking-[0.08em] text-gold-bright uppercase">
                      {MATCH_COPY.round} {round.round}
                    </h2>
                    {round.hp && (
                      <p className="text-text-muted type-meta">
                        {MATCH_COPY.startHp}: {match.players[match.me].nickname}{' '}
                        <b className="text-text">{round.hp[match.me]}</b> ·{' '}
                        {match.players[opponent].nickname}{' '}
                        <b className="text-text">{round.hp[opponent]}</b>
                      </p>
                    )}
                  </header>
                  <ul className="flex flex-col">
                    {round.lines.map((line, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 border-t border-line-soft py-2.5"
                      >
                        {line.kind === 'enter' ? (
                          <MatchCardImage card={line.card} />
                        ) : (
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 flex size-10 shrink-0 items-center justify-center ${line.side === match.me ? 'text-gold-bright' : 'text-text-muted'}`}
                          >
                            <Icon name={LINE_ICONS[line.kind]} size={20} />
                          </span>
                        )}
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className={`type-body ${lineTone(line, match.me)}`}>
                            {line.text}
                          </span>
                          {line.detail && (
                            <span className="text-text-muted type-meta">{line.detail}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TilePanel>
            </li>
          ))}
        </ol>

        <footer className="flex flex-col items-center gap-4 pt-4 text-center text-shadow-scene">
          <p className="text-text-soft type-body">{MATCH_COPY.end}</p>
          <GoldLink hero size="l" to={verdict} className="w-72">
            {MATCH_COPY.toVerdict}
          </GoldLink>
        </footer>
      </div>
      {MATCH_IS_SAMPLE && <MockDataNotice />}
    </main>
  )
}
