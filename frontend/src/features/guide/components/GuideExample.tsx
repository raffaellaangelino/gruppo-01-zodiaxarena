import { BandPanel } from '@/components/panels/BandPanel'

export function GuideExample() {
  return (
    <BandPanel className="guide-example" aria-label="Esempio dei valori della carta">
      <span className="guide-example__label">Esempio</span>
      <p>
        <strong>Sole in Leone</strong>
        <span> · ATK 12 del Leone + 9 del Sole = </span>
        <strong className="guide-atk">21</strong>
        <span className="guide-example__def">DEF 8 + 8 = </span>
        <strong className="guide-def">16</strong>
      </p>
    </BandPanel>
  )
}
