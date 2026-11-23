import { useSearchParams } from 'react-router'
import { HomePage } from '@/features/home/pages/HomePage'
import { NotificationsDrawer } from '@/features/notifications/components/NotificationsDrawer'

/** Home con il pannello delle notifiche aperto. */
export function NotificationsPage() {
  const [searchParams] = useSearchParams()
  const empty = searchParams.get('vista') !== 'elenco'

  return (
    <>
      <title>Notifiche · Zodiax Arena</title>
      <HomePage pageTitle={null} />
      <NotificationsDrawer empty={empty} />
    </>
  )
}
