import { TilePanel } from '@/components/panels/TilePanel'

/**
 * L'esempio dei valori della carta (tavola gen_gd, "gli esempi in una Riga"): una Riga del design
 * system, tutto su una fila con 24 px tra le parti; su schermi stretti le formule vanno a capo.
 */
export function GuideExample() {
  return (
    <TilePanel as="div" variant="row" aria-label="Esempio dei valori della carta" className="mt-4">
      <p className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 text-text type-body">
        <span className="text-[0.8125rem]! type-button tracking-[0.1em] text-gold uppercase">
          Esempio
        </span>
        <span>
          <b>Sole in Leone</b> · ATK{' '}
          <span className="text-text-muted">12 del Leone + 9 del Sole =</span>{' '}
          <b className="guide-atk">21</b>
        </span>
        <span>
          DEF <span className="text-text-muted">8 + 8 =</span> <b className="guide-def">16</b>
        </span>
      </p>
    </TilePanel>
  )
}
