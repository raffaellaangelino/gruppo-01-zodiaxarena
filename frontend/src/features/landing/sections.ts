/** Le sezioni della landing: voci della barra pubblica e ancore della pagina. */
export const LANDING_SECTIONS = [
  { id: 'segno', label: 'Il tuo segno' },
  { id: 'fazioni', label: 'Le Fazioni' },
  { id: 'partita', label: 'Come si gioca' },
  { id: 'gratis', label: 'Gratis' },
] as const

/** Id delle sezioni, nell'ordine della pagina. */
export const LANDING_SECTION_IDS = LANDING_SECTIONS.map((s) => s.id)
