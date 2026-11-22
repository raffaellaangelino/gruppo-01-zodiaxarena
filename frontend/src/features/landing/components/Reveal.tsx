import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Proprietà di {@link Reveal}. */
export interface RevealProps {
  children: ReactNode
  className?: string
}

/**
 * Fa comparire il contenuto una volta, quando entra in vista (classe `landing-reveal`). Passa
 * `data-visible` anche ai figli, così il filo della costellazione si traccia nello stesso momento.
 */
export function Reveal({ children, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} data-visible={visible} className={`landing-reveal ${className}`}>
      {children}
    </div>
  )
}
