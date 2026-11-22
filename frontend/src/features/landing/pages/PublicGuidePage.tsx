import { GuidePage } from '@/features/guide/pages/GuidePage'
import { PublicPage, PublicTrail } from '@/features/landing/components/PublicPage'

/**
 * Regolamento pubblico (S14, `/regolamento`): la Guida per chi non è ancora entrato, aperta dal piede
 * della landing, nel guscio delle pagine pubbliche.
 */
export function PublicGuidePage() {
  return (
    <PublicPage current="rules">
      <GuidePage variant="public" trail={<PublicTrail label="Guida" />} />
    </PublicPage>
  )
}
