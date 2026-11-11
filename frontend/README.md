# ZodiaxArena · Frontend

Interfaccia web del gioco: negozio, collezione, composizione del mazzo, scambi, sfide e storico.
Parla solo con il backend, attraverso le API REST sotto `/api`.

## Stack

| Strumento | Uso |
|---|---|
| React 19 + TypeScript | Interfaccia |
| Vite | Server di sviluppo e build |
| oxlint | Controllo del codice (`npm run lint`) |
| @fontsource | Font Cinzel e Nunito in locale, senza chiamate a servizi esterni |
| nginx | Serve la build nel container e inoltra `/api` al backend |

## Avvio

### Con Docker (tutto il progetto)

Dalla cartella principale del repository (istruzioni complete in `istruzioni docker.md`):

```bash
docker compose up --build -d
```

Il frontend è su <http://localhost:8080>. Le chiamate a `/api` arrivano al container `backend` (porta 8081).

### In locale, per sviluppare

Serve Node.js 22 o successivo.

```bash
cd frontend
npm install
npm run dev
```

Il server di sviluppo è su <http://localhost:5173>, si aggiorna a ogni salvataggio e inoltra `/api` a `http://localhost:8081`.
Se il backend è altrove: `API_TARGET=http://indirizzo:porta npm run dev`.

### Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Server di sviluppo |
| `npm run build` | Controllo dei tipi e build in `dist/` |
| `npm run preview` | Prova la build in locale |
| `npm run lint` | Controllo del codice |

## Struttura

```
frontend/
├── Dockerfile          build con Node, poi nginx
├── nginx.conf          file statici, inoltro di /api, ritorno a index.html
├── index.html
├── vite.config.ts      inoltro di /api in sviluppo
└── src/
    ├── main.tsx        punto di ingresso: font, stili, App
    ├── App.tsx
    └── styles/
        ├── tokens.css  token del design system (colori, tipografia, spazi)
        └── global.css  stili di base
```

## Regole

- **Design token:** colori, misure e font si prendono solo da `src/styles/tokens.css` (variabili `--za-*`). Il file è una copia del design system: si modifica lì e poi si ricopia.
- **JSDoc:** obbligatorio da brief per componenti, funzioni e tipi esportati.
- **API:** si chiamano con percorsi relativi (`/api/...`), mai con l'indirizzo del backend scritto nel codice.
- **Git:** branch `feature/<n-issue>-descrizione` da `dev`, commit `feat: ...` / `fix: ...`, Pull Request verso `dev` (vedi "Metodo di lavoro Agile" nel Drive del team).
