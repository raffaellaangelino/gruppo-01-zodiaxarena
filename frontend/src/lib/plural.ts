/**
 * Numero con la parola al singolare o al plurale: "1 carta", "2 carte".
 *
 * @param n Quantità.
 * @param singular Parola al singolare (es. "carta").
 * @param pluralForm Parola al plurale (es. "carte").
 * @returns Il numero seguito dalla parola giusta.
 */
export function plural(n: number, singular: string, pluralForm: string): string {
  return `${n} ${n === 1 ? singular : pluralForm}`
}
