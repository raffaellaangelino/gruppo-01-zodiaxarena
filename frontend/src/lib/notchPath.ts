/**
 * Geometria dell'incavo: la forma degli angoli di pannelli e pulsanti del design system
 * (FOUNDATIONS §4, "l'architettura è a incavo"). Stessa formula dei generatori delle tavole.
 */

/**
 * Tracciato SVG di un rettangolo con gli angoli a incavo (archi concavi centrati sugli angoli).
 *
 * @param width Larghezza del rettangolo in px.
 * @param height Altezza del rettangolo in px.
 * @param radius Raggio dell'incavo in px.
 * @param inset Distanza della linea dal bordo esterno: positiva verso l'interno (fili interni),
 *   negativa verso l'esterno (anello di focus).
 * @returns L'attributo `d` del tracciato.
 */
export function notchPath(width: number, height: number, radius: number, inset = 0): string {
  const r = radius + inset
  const e = Math.sqrt(Math.max(r * r - inset * inset, 0))
  const d = inset
  const f = (n: number) => n.toFixed(2)
  return [
    `M${f(e)} ${d}`,
    `H${f(width - e)}`,
    `A${r} ${r} 0 0 0 ${width - d} ${f(e)}`,
    `V${f(height - e)}`,
    `A${r} ${r} 0 0 0 ${f(width - e)} ${height - d}`,
    `H${f(e)}`,
    `A${r} ${r} 0 0 0 ${d} ${f(height - e)}`,
    `V${f(e)}`,
    `A${r} ${r} 0 0 0 ${f(e)} ${d}`,
    'Z',
  ].join(' ')
}

/**
 * Raggio dell'incavo di un pulsante: il 17% dell'altezza, minimo 5 px
 * (token `--za-notch-button`, D-020).
 *
 * @param height Altezza del pulsante in px.
 * @returns Il raggio in px.
 */
export function buttonNotchRadius(height: number): number {
  return Math.max(5, Math.round(height * 0.17))
}
