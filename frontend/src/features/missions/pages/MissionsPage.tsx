import { Icon } from '@/components/ui/Icon'
import { MissionSection, type MissionTask } from '@/features/missions/components/MissionSection'
import { SpecialMissionPanel } from '@/features/missions/components/SpecialMissionPanel'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import './missions.css'

const DAILY_MISSIONS: readonly MissionTask[] = [
  {
    id: 'daily-battle',
    title: 'Completa una sfida',
    description: 'Entra nell’Arena e affronta un Custode.',
    done: 1,
    total: 1,
    reward: 20,
  },
  {
    id: 'daily-cards',
    title: 'Gioca 5 carte in battaglia',
    description: 'Ogni carta giocata conta per il tuo obiettivo.',
    done: 3,
    total: 5,
    reward: 15,
  },
  {
    id: 'daily-victory',
    title: 'Vinci una battaglia',
    description: 'Conquista la vittoria in una sfida.',
    done: 0,
    total: 1,
    reward: 25,
  },
]

const WEEKLY_MISSIONS: readonly MissionTask[] = [
  {
    id: 'weekly-victories',
    title: 'Vinci 5 sfide',
    description: 'Dimostra la tua strategia nell’Arena.',
    done: 3,
    total: 5,
    reward: 50,
  },
  {
    id: 'weekly-packs',
    title: 'Apri 3 pacchetti',
    description: 'Scopri nuove carte per il tuo Cielo.',
    done: 1,
    total: 3,
    reward: 35,
  },
  {
    id: 'weekly-missions',
    title: 'Completa 10 missioni',
    description: 'Porta a termine gli obiettivi della settimana.',
    done: 6,
    total: 10,
    reward: 75,
  },
]

/** Missioni giornaliere e settimanali del Custode. */
export function MissionsPage() {
  return (
    <main className="missions-page">
      <title>Missioni · Zodiax Arena</title>
      <PorticoBackdrop />
      <div className="missions-page__inner">
        <header className="missions-page__header">
          <h1>Missioni</h1>
          <p>
            <Icon name="scadenza" size={14} />
            Il tuo prossimo aggiornamento tra 12 ore
          </p>
        </header>

        <div className="missions-page__layout">
          <div className="missions-page__sections">
            <MissionSection
              title="Del giorno"
              reset="Si azzerano tra 12 ore"
              missions={DAILY_MISSIONS}
            />
            <MissionSection
              title="Della settimana"
              reset="Si azzerano tra 5 giorni"
              missions={WEEKLY_MISSIONS}
            />
          </div>
          <aside aria-label="Missioni speciali">
            <SpecialMissionPanel />
          </aside>
        </div>
      </div>
    </main>
  )
}
