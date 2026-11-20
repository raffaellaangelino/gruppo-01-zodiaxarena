# ZodiaxArena · Frontend

Interfaccia web del gioco: negozio, collezione, composizione del mazzo, scambi, sfide e storico.
Parla solo con il backend, attraverso le API REST sotto `/api`.

## Stack

| Strumento             | Uso                                                                 |
| --------------------- | ------------------------------------------------------------------- |
| React 19 + TypeScript | Interfaccia                                                         |
| Vite                  | Server di sviluppo e build                                          |
| Tailwind CSS 4        | Classi di stile, collegate ai design token del gioco                |
| TanStack Query        | Dati dal server: caricamento, errori, cache condivisa tra le pagine |
| oxlint                | Controllo del codice, anche accessibilità e JSDoc                   |
| Prettier              | Formattazione del codice e ordine delle classi Tailwind             |
| @fontsource           | Font Cinzel e Nunito in locale, senza chiamate a servizi esterni    |
| nginx                 | Serve la build nel container e inoltra `/api` al backend            |

## Avvio

### Con Docker (tutto il progetto)

Dalla cartella principale del repository (istruzioni complete in `istruzioni docker.md`):

```bash
docker compose up --build -d
```

Il frontend è su <http://localhost:8080>. Le chiamate a `/api` arrivano al container `backend` (porta 8081).

### In locale, per sviluppare

Serve Node.js 22.12 o successivo.

```bash
cd frontend
npm install
npm run dev
```

Il server di sviluppo è su <http://localhost:5173>, si aggiorna a ogni salvataggio e inoltra `/api` a `http://localhost:8081`.
Se il backend è altrove: `API_TARGET=http://indirizzo:porta npm run dev`.

### Comandi

| Comando                | Cosa fa                                                                       |
| ---------------------- | ----------------------------------------------------------------------------- |
| `npm run dev`          | Server di sviluppo                                                            |
| `npm run build`        | Controllo dei tipi e build in `dist/`                                         |
| `npm run preview`      | Prova la build in locale                                                      |
| `npm run lint`         | Controllo del codice: si ferma anche sui soli avvisi (accessibilità compresa) |
| `npm run format`       | Formatta i file e ordina le classi Tailwind                                   |
| `npm run format:check` | Controlla la formattazione senza cambiare nulla                               |

Prima di ogni Pull Request: `npm run format`, `npm run lint`, `npm run build`.

Nell'editor (VS Code) servono le estensioni **Tailwind CSS IntelliSense**, che suggerisce le nostre classi mentre si scrive, e **Prettier**.
Nelle impostazioni di VS Code va aggiunto `"files.associations": { "*.css": "tailwindcss" }`: senza, il controllo CSS integrato segna come errori la sintassi di Tailwind (`source()`, `@theme`, `@utility`), che invece è corretta.

## Struttura

```
frontend/
├── Dockerfile            build con Node, poi nginx
├── nginx.conf            file statici, inoltro di /api, ritorno a index.html
├── index.html
├── vite.config.ts        plugin React e Tailwind, alias @/, inoltro di /api (dev e preview)
├── .oxlintrc.json        regole del controllo del codice
├── .prettierrc.json      regole di formattazione
└── src/
    ├── main.tsx          punto di ingresso: font, stili, App
    ├── app/              avvio e guscio dell'applicazione
    │   ├── App.tsx       provider condivisi (dati del server, sessione, navigazione)
    │   ├── AppRoutes.tsx mappa delle pagine
    │   ├── paths.ts      percorsi: mai stringhe sparse nel codice
    │   ├── queryClient.ts  regole della cache dei dati
    │   ├── boot/         ingresso nel gioco: BootGate, schermata di caricamento
    │   ├── PageLoading.tsx · PageErrorBoundary.tsx  attesa ed errore di una pagina
    │   └── shell/        barre di gioco: GameBar (desktop), MobileHeader e MobileTabBar
    ├── features/         una cartella per funzione del gioco
    │   ├── auth/         accesso e sessione
    │   ├── registration/ registrazione a tre passi (account, segno, conferma)
    │   ├── onboarding/   primi passi con Ermes: scelta della Fazione
    │   ├── player/       riepilogo del giocatore (crediti, Fazione, contatori)
    │   └── home/         Home: scena, "Ti aspettano", Banda e Tessere
    ├── pages/            pagine che non appartengono a una funzione (segnaposto delle sezioni)
    ├── components/       componenti riusabili, senza logica di gioco
    │   ├── ui/           GoldButton/GoldLink, SecondaryButton, TertiaryButton/TertiaryLink, TextField, SelectField, Checkbox, Badge, Icon…
    │   ├── panels/       TilePanel (Tessera), BandPanel (Banda)
    │   ├── progress/     Constellation, Meridian, LoadingConstellation, StepIndicator
    │   ├── game/         CardFan, ElementEmblem, SignMedallion
    │   ├── layout/       AuthLayout
    │   ├── brand/        Logo
    │   └── ornaments/    GoldClasp
    ├── hooks/            hook generici (useElementSize, useMediaQuery, useDebouncedValue)
    ├── lib/              funzioni senza React: http, jwt, validazione, plurali, geometria
    ├── domain/           tipi, nomi italiani e regole fisse del gioco (segni, elementi, Dei)
    ├── config/           variabili d'ambiente e breakpoint
    ├── mocks/            dati di esempio, finché il backend non ha le API
    ├── assets/           immagini (WebP), carte, stemmi, sprite delle icone
    └── styles/
        ├── index.css     ingresso degli stili: Tailwind, token, tema, stili di base
        ├── tokens.css    design token (i valori): copia del design system
        └── theme.css     tema Tailwind: collega le classi ai token
```

Tailwind cerca le classi solo in `src/`.

### Dove va il codice

| Cosa                                              | Dove                                 | Regola                                                                           |
| ------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| Chiamata a un'API                                 | `features/<funzione>/api.ts`         | Solo tramite `request()` di `lib/http.ts`, con percorsi relativi                 |
| Dati letti da una pagina                          | `features/<funzione>/queries.ts`     | `queryOptions` + hook con `useSuspenseQuery`: la pagina riceve i dati già pronti |
| Dato di esempio                                   | `mocks/`                             | Solo dentro `api.ts`, mai importato dalle pagine                                 |
| Componente che legge i dati del giocatore (barre) | `app/shell/`                         | `components/` resta indipendente dal gioco                                       |
| Stato e comportamento di un modulo                | `features/<funzione>/hooks/`         | Il componente disegna, l'hook decide                                             |
| Testi mostrati al giocatore per errori e avvisi   | `features/<funzione>/messages.ts`    | Dicono cosa è successo e cosa fare                                               |
| Componente usato da più funzioni                  | `components/`                        | Non conosce il gioco: riceve tutto dalle proprietà                               |
| Funzione senza React                              | `lib/`                               | Pura e riusabile                                                                 |
| Nuovo percorso                                    | `app/paths.ts` e `app/AppRoutes.tsx` | Le pagine riservate stanno sotto `RequireAuth`                                   |

Un file, una responsabilità: tutto ciò che si riusa ha il suo file.

### Dati dal server e dati di esempio

- Ogni funzione definisce le sue richieste in `queries.ts` (chiave della cache e funzione) e un hook per leggerle (`usePlayerSummary`, `useHomeSummary`). Gli hook usano la Suspense di TanStack Query: la pagina riceve i dati già pronti e non gestisce lo stato "in arrivo".
- Gli endpoint, le richieste e le risposte sono nel **contratto API**, sul Drive del progetto: [Contratto API · frontend e backend](https://docs.google.com/document/d/1uxGZ1eYt0agcypYPsjD7N_ohplPN1JSrCoXyPCYXKBU/edit). I tipi del frontend hanno le stesse forme, e ogni `api.ts` chiama già l'endpoint del contratto.
- Finché il backend non li ha, le risposte arrivano dai dati di esempio di `src/mocks/`, attivi salvo `VITE_USE_MOCKS=false`; mentre sono attivi compare l'etichetta **"Dati di esempio"**.
- **Due modi di avviare:** `npm run dev` usa i dati di esempio (si lavora anche senza backend: il giocatore è sempre "Lyra", Fazione Efesto); `npm run dev:backend` usa il backend vero per tutto quello che esiste (`.env.backend`, funziona anche su Windows). Per provare registrazione e scelta della Fazione serve il secondo.
- Le risposte del backend passano da un traduttore (es. `features/player/dto.ts`) prima di arrivare alle pagine: se il backend cambia un nome (`nickName`, `god`…) si corregge in un punto solo.
- `GET /api/home` non esiste ancora: la Home usa i dati di esempio anche con `VITE_USE_MOCKS=false` (`HOME_API_AVAILABLE` in `config/env.ts`), così il resto si prova con il backend vero.
- I codici del gioco arrivano come nel contratto (`FIRE`, `EFESTO`, `LEONE`…); i nomi italiani stanno in `domain/labels.ts`. Le date arrivano in ISO 8601 e diventano parole ("ricevuta oggi", "tra 17 g") con `lib/dates.ts`.
- All'uscita la cache si svuota: i dati di un giocatore non restano per chi accede dopo.

### Ingresso nel gioco (come nei client di gioco)

- `BootGate` scarica **in parallelo** i dati essenziali (riepilogo del giocatore, Home) prima di mostrare le pagine: la Home compare intera, tutta insieme, con una dissolvenza.
- Se i dati arrivano in meno di 150 ms non si vede nulla; altrimenti compare la schermata di caricamento (key art, logo, costellazione che si accende) per almeno 400 ms, così non ci sono lampi.
- Dopo, i dati restano in memoria: cambiare pagina è istantaneo e gli aggiornamenti avvengono in silenzio.
- Una pagina che ha bisogno dei suoi dati subito aggiunge la sua richiesta a `BOOT_QUERIES` in `app/boot/BootGate.tsx`; le altre mostrano `PageLoading` dentro il guscio.
- Se il caricamento iniziale fallisce, la schermata mostra l'errore con "Riprova"; se fallisce una pagina, `PageErrorBoundary` mostra l'errore al posto della pagina, lasciando le barre.

### Desktop e mobile

- Sotto i 1280 px (`xl`) il guscio è quello mobile (intestazione e barra in basso), da 1280 quello desktop (barra di gioco).
- Se cambia solo lo stile si usano i prefissi di Tailwind; se cambiano i contenuti (testi più brevi, componenti diversi) si usa `useMediaQuery(MEDIA.desktop)`, con le media query in `config/breakpoints.ts`.

### Sessione

- Il token JWT dell'accesso sta in `localStorage` (`features/auth/tokenStorage.ts`): si resta connessi anche chiudendo il browser, finché il token non scade.
- La sessione si chiude da sola alla scadenza del token, quando il backend risponde 401 e quando si esce da un'altra scheda.
- Le pagine riservate stanno sotto `RequireAuth`: senza sessione portano all'accesso e poi riportano alla pagina richiesta.
- La registrazione apre la sessione con il token che restituisce il backend. Chi ha appena creato l'account (o non ha ancora scelto) passa da `OnboardingGate` alla scelta della Fazione, poi entra nel gioco.

### Copie dal design system

`styles/tokens.css` e `assets/icons/zodiax-icons.svg` sono copie dei file del design system: si cambiano lì e poi si ricopiano, mai a mano qui.

## Design system e Tailwind

I valori (colori, misure, font) stanno **solo** in `src/styles/tokens.css`, come variabili `--za-*`.
`theme.css` non contiene valori: collega le classi di Tailwind a quei token.
`tokens.css` è una copia del design system del progetto: si modifica prima lì e poi si ricopia, mai a mano qui.

**Unità:** testo, spazi e misure che contengono testo sono in rem (1rem = 16 px), così seguono il carattere scelto dall'utente nel browser. Linee, ombre e raggi sono in px.

### Cosa è nostro e cosa è standard

|                                      | Nel tema                                  | Esempi                                                                                                                  |
| ------------------------------------ | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Colori                               | **Solo i nostri**                         | `bg-surface`, `text-gold`, `border-line-soft`, `text-el-fuoco`, `text-tier-rara-text`                                   |
| Testo                                | **Solo i nostri**, una classe per livello | `type-h1`, `type-body`, `type-label`                                                                                    |
| Font e pesi                          | **Solo i nostri** (i pesi caricati)       | `font-display`, `font-body`, `font-normal` · `semibold` · `bold` · `extrabold` · `black`                                |
| Raggi                                | **Solo i nostri**                         | `rounded-pill`, `rounded-control`, `rounded-thumb`, `rounded-full`                                                      |
| Ombre e sfocature                    | **Solo le nostre**                        | `shadow-panel`, `shadow-raised`, `shadow-overlay`, `backdrop-blur-glass`                                                |
| Curve di movimento                   | **Solo le nostre**                        | `ease-out`, `ease-in`, `ease-in-out`; `transition` usa già durata e curva del sistema                                   |
| Spazi                                | Standard (base 4, in rem)                 | `p-4` = 16, `gap-6` = 24, `h-11` = 44, `w-72` = 288                                                                     |
| Breakpoint                           | Standard, `2xl` portato a 1440            | vedi sotto                                                                                                              |
| Contenitori, animazioni, proporzioni | Standard, più i nostri                    | `max-w-md`, `@container`, `animate-spin`, `aspect-video`, `max-w-content`, `aspect-card`                                |
| Varianti                             | Tutte quelle di Tailwind                  | `hover:`, `focus-visible:`, `disabled:`, `aria-*:`, `motion-reduce:`, `landscape:`, `pointer-coarse:`, `forced-colors:` |

**Regola dei nomi:** la classe ha il nome del token senza `--za-` (`--za-surface` → `bg-surface`, `--za-type-h1` → `type-h1`).

### Tipografia

Una classe per livello, che imposta insieme famiglia, peso, misura, interlinea, spaziatura e maiuscolo:

`type-display` · `type-h1` · `type-h2` · `type-h3` · `type-h3-compact` · `type-eyebrow` · `type-label` · `type-button` · `type-button-l` · `type-body` · `type-body-strong` · `type-meta` · `type-caption` · `type-number` · `type-number-l` · `type-stat`

Le varianti mobile hanno il suffisso `-m` (`type-display-m`, `type-h1-m`, `type-h2-m`).
Esempio: `<h1 className="type-h1-m lg:type-h1">`.

### Spazi

Padding, margini e gap usano **solo i passi della scala**: `1` (4) · `2` (8) · `3` (12) · `4` (16) · `5` (20) · `6` (24) · `8` (32) · `10` (40) · `12` (48) · `14` (56) · `16` (64).
Altezze e larghezze sono libere: `h-11` (44, pulsante e area di tocco), `h-9` (36, pulsante terziario), `w-72`.
Tailwind non può bloccare `p-7` o `gap-9`: si controlla in revisione.

### Breakpoint

Si scrive prima il mobile, poi si aggiunge il resto: `p-4 lg:p-8`.

| Prefisso  | Da               | Per                                                            |
| --------- | ---------------- | -------------------------------------------------------------- |
| (nessuno) | 0                | mobile (le tavole sono a 390; provare anche 360)               |
| `sm:`     | 640 px           | telefoni grandi in orizzontale, tablet piccoli                 |
| `md:`     | 768 px           | tablet                                                         |
| `lg:`     | 1024 px          | desktop                                                        |
| `xl:`     | 1280 px          | portatili                                                      |
| `2xl:`    | 1440 px          | schermi larghi (misura delle tavole desktop)                   |
| `short:`  | altezza ≤ 800 px | schermi bassi: le schermate desktop senza scroll si compattano |

Varianti utili su mobile: `landscape:` / `portrait:` (orientamento), `pointer-coarse:` (schermi touch, aree di tocco più grandi), `min-h-dvh` / `h-dvh` (altezza reale con le barre del browser).

### Aree sicure dei telefoni

La pagina usa `viewport-fit=cover`, quindi il contenuto arriva sotto il notch e la barra di sistema. Le barre fisse devono lasciare spazio:

- `pt-safe` sulla barra in alto, `pb-safe` sulla barra in basso (anche `pl-safe`, `pr-safe` in orizzontale).

### Cosa non esiste (di proposito)

Queste classi **non producono CSS**:

- colori di Tailwind: `text-blue-500`, `bg-red-600`, `text-white`, `bg-black`
- misure del testo, interlinee e spaziature: `text-sm`, `leading-tight`, `tracking-wide` (si usano le classi `type-*`)
- raggi, ombre, sfocature e font predefiniti: `rounded-xl`, `shadow-lg`, `drop-shadow-md`, `text-shadow-lg`, `blur-sm`, `font-sans`
- pesi non caricati: `font-light`, `font-thin`, `font-medium`

Se serve un colore o una misura che manca, si aggiunge prima al design system, non qui.

### Valori arbitrari

Tailwind non può bloccarli, quindi vale una regola: **solo con un token**.

- Sì: `h-(--za-btn-h)`, `duration-(--za-dur-fast)`, `bg-(image:--za-gold-fill)`
- No: `w-[320px]`, `text-[#fff]`, `mt-[13px]`

### Ornamenti

Pannelli a incavo, fili d'oro e pulsanti dorati non si costruiscono con le classi di base: avranno classi dedicate (`@utility`) definite una volta e riusate, insieme ai componenti.

## Regole

- **JSDoc:** obbligatorio da brief per componenti, funzioni e tipi esportati. Il lint controlla che i commenti siano scritti correttamente; che ci siano si controlla in revisione.
- **Import:** da `src` si importa con `@/` (`import { Icon } from '@/components/Icon'`), mai con lunghe catene di `../`.
- **API:** si chiamano con percorsi relativi (`/api/...`), mai con l'indirizzo del backend scritto nel codice.
- **Accessibilità:** focus sempre visibile (già impostato negli stili di base), contrasto dei token già verificato, mai il solo colore per dare un'informazione, area di tocco di almeno 44 px.
- **Git:** branch `feature/<n-issue>-descrizione` da `dev`, commit `feat: ...` / `fix: ...`, Pull Request verso `dev` (vedi "Metodo di lavoro Agile" nel Drive del team).
