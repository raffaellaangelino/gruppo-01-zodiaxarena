import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import { PATHS } from '@/app/paths'
import { TilePanel } from '@/components/panels/TilePanel'
import { Icon } from '@/components/ui/Icon'
import { USE_MOCKS } from '@/config/env'
import { playerSummaryQuery, usePlayerSummary } from '@/features/player/queries'
import './notifications.css'

interface NotificationItem {
  id: string
  icon: 'sfide' | 'missione' | 'ricompensa' | 'scambi' | 'notifiche'
  title: string
  description: string
  time: string
  category: string
  to: string
  unread: boolean
}

interface NotificationGroup {
  title: string
  items: NotificationItem[]
}

interface NotificationsDrawerProps {
  empty?: boolean
}

const INITIAL_GROUPS: readonly NotificationGroup[] = [
  {
    title: 'Oggi',
    items: [
      {
        id: 'challenge-accepted',
        icon: 'sfide',
        title: 'Orione ha accettato la tua sfida',
        description: 'La partita è pronta: entra nell’Arena.',
        time: '10 min fa',
        category: 'Sfide',
        to: PATHS.challenges,
        unread: true,
      },
      {
        id: 'daily-mission',
        icon: 'missione',
        title: 'Hai completato una missione',
        description: 'La ricompensa è stata aggiunta al tuo account.',
        time: '1 ora fa',
        category: 'Missioni',
        to: PATHS.missions,
        unread: false,
      },
    ],
  },
  {
    title: 'Ieri',
    items: [
      {
        id: 'new-trade',
        icon: 'scambi',
        title: 'Maia ti ha proposto uno scambio',
        description: 'Hai ricevuto una nuova proposta di scambio.',
        time: 'Ieri, 18:42',
        category: 'Scambi',
        to: PATHS.trades,
        unread: false,
      },
      {
        id: 'weekly-progress',
        icon: 'missione',
        title: 'Obiettivo settimanale aggiornato',
        description: 'Hai fatto un altro passo verso la ricompensa.',
        time: 'Ieri, 14:06',
        category: 'Missioni',
        to: PATHS.missions,
        unread: false,
      },
    ],
  },
  {
    title: 'Più vecchie',
    items: [
      {
        id: 'new-card',
        icon: 'ricompensa',
        title: 'Una nuova carta ti aspetta',
        description: 'Scopri la carta appena aggiunta alla collezione.',
        time: '20 nov',
        category: 'Collezione',
        to: PATHS.collection,
        unread: false,
      },
      {
        id: 'full-moon',
        icon: 'notifiche',
        title: 'La prossima Luna piena si avvicina',
        description: 'Tra poco potrai scegliere una nuova Fazione.',
        time: '18 nov',
        category: 'Fazione',
        to: PATHS.faction,
        unread: false,
      },
    ],
  },
]

/** Pannello notifiche della Home, apribile dalla campanella. */
export function NotificationsDrawer({ empty = false }: NotificationsDrawerProps) {
  const player = usePlayerSummary()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [groups, setGroups] = useState(INITIAL_GROUPS)
  const unreadCount = groups.reduce(
    (total, group) => total + group.items.filter((item) => item.unread).length,
    0,
  )

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') navigate(PATHS.home)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [navigate])

  function markRead(id: string) {
    const wasUnread = groups.some((group) =>
      group.items.some((item) => item.id === id && item.unread),
    )
    if (!wasUnread) return

    setGroups((current) =>
      current.map((group) => ({
        ...group,
        items: group.items.map((item) => (item.id === id ? { ...item, unread: false } : item)),
      })),
    )
    if (USE_MOCKS) {
      queryClient.setQueryData(playerSummaryQuery.queryKey, {
        ...player,
        unreadNotifications: Math.max(0, player.unreadNotifications - 1),
      })
    }
  }

  function markAllRead() {
    setGroups((current) =>
      current.map((group) => ({
        ...group,
        items: group.items.map((item) => ({ ...item, unread: false })),
      })),
    )
    if (USE_MOCKS) {
      queryClient.setQueryData(playerSummaryQuery.queryKey, {
        ...player,
        unreadNotifications: 0,
      })
    }
  }

  return (
    <TilePanel
      as="aside"
      glass
      aria-label="Notifiche"
      className="notifications-drawer"
    >
      <div className="notifications-drawer__content">
        <header className="notifications-drawer__header">
          <h1 id="notifications-title">Notifiche</h1>
          <div className="notifications-drawer__header-actions">
            {!empty && (
              <button
                type="button"
                className="notifications-drawer__mark-all"
                disabled={unreadCount === 0}
                onClick={markAllRead}
              >
                Segna tutte come lette
              </button>
            )}
            <Link
              to={PATHS.home}
              className="notifications-drawer__close"
              aria-label="Chiudi notifiche"
            >
              <Icon name="chiudi" size={16} />
            </Link>
          </div>
        </header>

        {empty ? (
          <div className="notifications-empty">
            <Icon name="luna" size={48} active className="notifications-empty__moon" />
            <h2>Nessuna notifica</h2>
            <p>Quando riceverai nuove notifiche, le troverai qui.</p>
          </div>
        ) : (
          <div className="notifications-drawer__groups">
            {groups.map((group) => (
              <section key={group.title} className="notifications-group">
                <h2>{group.title}</h2>
                <ul>
                  {group.items.map((item) => (
                    <NotificationRow key={item.id} item={item} onRead={() => markRead(item.id)} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </TilePanel>
  )
}

function NotificationRow({
  item,
  onRead,
}: {
  item: NotificationItem
  onRead: () => void
}) {
  return (
    <li className={`notification-row${item.unread ? ' notification-row--unread' : ''}`}>
      <Link to={item.to} onClick={onRead} className="notification-row__link">
        <span className="notification-row__icon">
          <Icon name={item.icon} size={16} />
        </span>
        <span className="notification-row__copy">
          <span className="notification-row__title">{item.title}</span>
          <span className="notification-row__description">{item.description}</span>
          <span className="notification-row__time">{item.time}</span>
        </span>
        <span className="notification-row__category">{item.category}</span>
        {item.unread && <span className="notification-row__dot" aria-label="Non letta" />}
      </Link>
    </li>
  )
}
