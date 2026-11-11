/**
 * Radice dell'applicazione.
 *
 * Per ora mostra solo il nome del gioco, per verificare che progetto, token, tema
 * Tailwind e font siano caricati. Le schermate arrivano con le issue successive
 * (prima #55, accesso e registrazione).
 *
 * @returns La pagina iniziale provvisoria.
 */
function App() {
  return (
    <main className="grid min-h-dvh place-content-center gap-4 p-4 text-center">
      <h1 className="text-gold-bright type-h1">Zodiax Arena</h1>
      <p className="text-text-muted">Frontend in costruzione.</p>
    </main>
  )
}

export default App
