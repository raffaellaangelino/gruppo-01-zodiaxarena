# Istruzioni frontend

Questa guida descrive come avviare il frontend di ZodiaxArena in locale o con Docker.

## Prerequisiti

Per lo sviluppo in locale serve:

- Node.js 22.12 o successivo
- npm, incluso con Node.js
- Git

Per avviare tutto il progetto con Docker serve anche Docker Desktop.

Verificare Node.js e npm con:

```powershell
node --version
npm --version
```

## Avvio rapido con dati di esempio

Questa modalità non richiede il backend e permette di usare la maggior parte dell'interfaccia.

1. Aprire un terminale nella cartella principale del repository.
2. Entrare nella cartella del frontend:

```powershell
cd frontend
```

3. Installare le dipendenze:

```powershell
npm install
```

Il comando va eseguito una sola volta dopo il download del progetto oppure quando cambiano `package.json` o `package-lock.json`.

4. Avviare il server di sviluppo:

```powershell
npm run dev
```

5. Aprire nel browser:

<http://localhost:5173>

Il server Vite si aggiorna automaticamente dopo ogni modifica ai file del frontend.

Per fermare il frontend premere `Ctrl+C` nel terminale.

In questa modalità i dati vengono letti dai file presenti in `frontend/src/mocks`. Il giocatore di esempio è Lyra ed è associato alla Fazione Efesto.

## Avvio con il backend reale

Usare questa modalità per provare login, registrazione, scelta della Fazione e gli endpoint effettivamente implementati dal backend.

### Opzione 1: backend avviato con Docker

1. Dalla cartella principale del repository avviare tutti i servizi:

```powershell
docker compose up --build -d
```

2. Dal terminale avviare il frontend in modalità backend:

```powershell
cd frontend
npm install
npm run dev:backend
```

3. Aprire:

<http://localhost:5173>

In questa modalità Vite inoltra le richieste `/api` al backend su `http://localhost:8081`.

Il frontend avviato con Docker, invece, è disponibile su <http://localhost:8080>.

L'area di gestione automatica delle API di Spring Boot è disponibile su:

<http://localhost:8081/swagger-ui/index.html>

Per conoscere gli account di prova vedere `istruzioni backend.md`.

### Opzione 2: backend avviato separatamente

Se il backend viene avviato in locale o su un altro indirizzo, usare la modalità backend indicando l'indirizzo di destinazione:

```powershell
cd frontend
$env:API_TARGET="http://localhost:8081"
npm run dev:backend
```

Con PowerShell è necessario impostare `API_TARGET` nella stessa finestra del terminale in cui si avvia Vite.

Per un backend su un altro computer o porte diverse:

```powershell
$env:API_TARGET="http://indirizzo:porta"
npm run dev:backend
```

Per rimuovere la variabile dalla sessione PowerShell:

```powershell
Remove-Item Env:API_TARGET
```

## Avvio completo con Docker

Dalla cartella principale del repository:

```powershell
docker compose up --build -d
```

Aprire <http://localhost:8080>.

Questa modalità avvia database, motore, backend e frontend tramite Docker. I log dei servizi possono essere letti con:

```powershell
docker compose logs -f frontend
docker compose logs -f backend
```

Per fermare i contenitori:

```powershell
docker compose down
```

Attenzione: `docker compose down -v` cancella anche i dati del database locale.

## Comandi frontend utili

Dalla cartella `frontend`:

| Comando | Descrizione |
|---|---|
| `npm run dev` | Avvia il server locale con i dati di esempio |
| `npm run dev:backend` | Avvia il server locale usando il backend reale |
| `npm run build` | Controlla i tipi TypeScript e crea la build in `frontend/dist` |
| `npm run preview` | Mostra localmente la build prodotta da `npm run build` |
| `npm run lint` | Controlla il codice, inclusi avvisi e accessibilità |
| `npm run format` | Formatta i file del frontend |
| `npm run format:check` | Verifica la formattazione senza modificare i file |

Prima di una Pull Request è consigliato eseguire:

```powershell
npm run format
npm run lint
npm run build
```

## Risoluzione dei problemi

### `npm` non viene riconosciuto

Verificare l'installazione di Node.js. Dopo l'installazione o l'aggiornamento chiudere e riaprire il terminale.

### Il frontend parte ma le API non funzionano

Verificare che il backend sia raggiungibile su `http://localhost:8081` e che `npm run dev:backend` sia stato usato al posto di `npm run dev`.

### Il backend con Docker non risponde

Dalla cartella principale controllare lo stato dei servizi:

```powershell
docker compose ps
docker compose logs -f backend
```

Attendere che i servizi risultino healthy prima di usare le API.

### Porta già occupata

Se la porta `5173` è occupata, Vite può scegliere automaticamente una porta diversa. Leggere nel terminale l'indirizzo effettivamente mostrato da Vite.

Se la porta `8081`, `8082`, `8080` o `3307` è occupata da un altro servizio Docker o applicazione, modificare la relativa porta nel file `.env` della cartella principale oppure fermare il processo che occupa quella porta.
