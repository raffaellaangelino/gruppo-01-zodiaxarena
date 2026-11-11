/**
 * Radice dell'applicazione.
 *
 * Per ora mostra solo il nome del gioco, per verificare che progetto, token e font
 * siano caricati. Le schermate arrivano con le issue successive (prima #55, accesso
 * e registrazione).
 *
 * @returns La pagina iniziale provvisoria.
 */
function App() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeContent: 'center',
        gap: 'var(--za-space-4)',
        padding: 'var(--za-page-pad-m)',
        textAlign: 'center',
      }}
    >
      <h1 style={{ font: 'var(--za-type-h1)', color: 'var(--za-gold-bright)' }}>
        Zodiax Arena
      </h1>
      <p style={{ color: 'var(--za-text-muted)' }}>Frontend in costruzione.</p>
    </main>
  )
}

export default App
