import { Coin } from '@/components/ui/Coin'
import { Icon } from '@/components/ui/Icon'
import { LineTitle } from '@/components/ui/LineTitle'

/** Un obiettivo giornaliero o settimanale. */
export interface MissionTask {
  id: string
  title: string
  description: string
  done: number
  total: number
  reward: number
}

interface MissionSectionProps {
  title: string
  reset: string
  missions: readonly MissionTask[]
}

/** Elenco degli obiettivi con avanzamento e ricompensa. */
export function MissionSection({ title, reset, missions }: MissionSectionProps) {
  return (
    <section className="mission-section" aria-label={`Missioni ${title.toLowerCase()}`}>
      <header className="mission-section__header">
        <LineTitle as="h2" textClassName="mission-section__title">
          {title}
        </LineTitle>
        <span className="mission-section__reset">
          <Icon name="scadenza" size={14} />
          {reset}
        </span>
      </header>
      <ul className="mission-section__list">
        {missions.map((mission) => (
          <MissionTaskRow key={mission.id} mission={mission} />
        ))}
      </ul>
    </section>
  )
}

function MissionTaskRow({ mission }: { mission: MissionTask }) {
  const completed = mission.done >= mission.total

  return (
    <li className={`mission-task${completed ? ' mission-task--complete' : ''}`}>
      <div className="mission-task__copy">
        <span className="mission-task__name">{mission.title}</span>
        <span className="mission-task__description">{mission.description}</span>
      </div>
      <div className="mission-task__progress">
        <progress
          className="mission-task__track"
          aria-label={`Avanzamento: ${mission.title}`}
          value={Math.min(mission.done, mission.total)}
          max={mission.total}
        />
        <span className="mission-task__count">
          {mission.done}/{mission.total}
        </span>
      </div>
      <span className="mission-task__reward" aria-label={`${mission.reward} crediti`}>
        <Coin size={17} />
        <span>{mission.reward}</span>
      </span>
    </li>
  )
}
