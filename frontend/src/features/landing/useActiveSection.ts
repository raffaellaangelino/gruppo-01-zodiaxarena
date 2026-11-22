import { useEffect, useState } from 'react'

/**
 * La sezione della pagina che si sta leggendo, per segnare "sei qui" nella barra pubblica come la
 * voce attiva della barra di gioco: l'ultima sezione il cui inizio ha superato la metà dello
 * schermo. Nella scena di apertura nessuna; in fondo alla pagina resta accesa l'ultima.
 *
 * @param ids Id delle sezioni, nell'ordine della pagina.
 * @returns L'id della sezione in vista, oppure `null` (in apertura o fuori dalla landing).
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const update = () => {
      const middle = window.innerHeight / 2
      let current: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= middle) current = id
      }
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ids])
  return active
}
