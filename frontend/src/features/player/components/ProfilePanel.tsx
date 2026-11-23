import type { ReactNode } from 'react'
import { TilePanel } from '@/components/panels/TilePanel'
import { LineTitle } from '@/components/ui/LineTitle'

interface ProfilePanelProps {
  title: string
  children: ReactNode
  className?: string
}

export function ProfilePanel({ title, children, className = '' }: ProfilePanelProps) {
  return (
    <TilePanel as="section" aria-label={title} className={`profile-panel ${className}`}>
      <div className="profile-panel__content">
        <div className="profile-panel__heading">
          <LineTitle textClassName="type-label" stretch>
            {title}
          </LineTitle>
        </div>
        {children}
      </div>
    </TilePanel>
  )
}
