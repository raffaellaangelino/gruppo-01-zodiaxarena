import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Indirizzo del backend Spring a cui il server di sviluppo inoltra le chiamate `/api`.
 * Si cambia con la variabile d'ambiente `API_TARGET`; nel container lo fa nginx.
 */
const apiTarget = process.env.API_TARGET ?? 'http://localhost:8081'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
    },
  },
})
