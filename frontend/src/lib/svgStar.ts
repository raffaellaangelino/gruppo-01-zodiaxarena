/**
 * Stella a quattro punte del design system (costellazioni, fermagli, meridiana), come tracciato SVG.
 *
 * @param cx Centro orizzontale.
 * @param cy Centro verticale.
 * @param r Raggio delle punte.
 * @returns L'attributo `d` del tracciato.
 */
export function starPath(cx: number, cy: number, r: number): string {
  const k = r * 0.3
  const f = (n: number) => n.toFixed(2)
  return (
    `M${f(cx)} ${f(cy - r)} L${f(cx + k)} ${f(cy - k)} L${f(cx + r)} ${f(cy)} L${f(cx + k)} ${f(cy + k)} ` +
    `L${f(cx)} ${f(cy + r)} L${f(cx - k)} ${f(cy + k)} L${f(cx - r)} ${f(cy)} L${f(cx - k)} ${f(cy - k)} Z`
  )
}
