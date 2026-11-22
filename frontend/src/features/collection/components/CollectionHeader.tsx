import type { ReactNode } from 'react'
import { PATHS } from '@/app/paths'
import { PageTabs } from '@/components/navigation/PageTabs'
import { COLLECTION_COPY } from '@/features/collection/messages'

/**
 * Intestazione della sezione Collezione (tavole Collezione e Collezione-Cielo): titolo e schede
 * "Carte" e "Il tuo Cielo"; a destra quello che serve alla scheda aperta.
 */
export function CollectionHeader({ aside }: { aside?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 pt-6 xl:pt-8">
      <div className="flex flex-wrap items-end gap-x-10 gap-y-2">
        <h1 className="text-text type-h1-m xl:type-h1">{COLLECTION_COPY.title}</h1>
        <PageTabs
          label={COLLECTION_COPY.tabsLabel}
          tabs={[
            { to: PATHS.collection, label: COLLECTION_COPY.tabs.cards },
            { to: PATHS.deck, label: COLLECTION_COPY.tabs.sky },
          ]}
        />
      </div>
      {aside}
    </header>
  )
}
