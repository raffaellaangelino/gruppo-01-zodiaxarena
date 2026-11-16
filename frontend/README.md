# ZodiaxArena · Frontend

Interfaccia web del gioco: negozio, collezione, composizione del mazzo, scambi, sfide e storico.
Parla solo con il backend, attraverso le API REST sotto `/api`.

## Stack

| Strumento             | Uso                                                              |
| --------------------- | ---------------------------------------------------------------- |
| React 19 + TypeScript | Interfaccia                                                      |
| Vite                  | Server di sviluppo e build                                       |
| Tailwind CSS 4        | Classi di stile, collegate ai design token del gioco             |
| oxlint                | Controllo del codice, anche accessibilità e JSDoc                |
| Prettier              | Formattazione del codice e ordine delle classi Tailwind          |
| @fontsource           | Font Cinzel e Nunito in locale, senza chiamate a servizi esterni |
| nginx                 | Serve la build nel container e inoltra `/api` al backend         |

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
├── Dockerfile          build con Node, poi nginx
├── nginx.conf          file statici, inoltro di /api, ritorno a index.html
├── index.html
├── vite.config.ts      plugin React e Tailwind, alias @/, inoltro di /api in sviluppo
├── .oxlintrc.json      regole del controllo del codice
├── .prettierrc.json    regole di formattazione
└── src/
    ├── main.tsx        punto di ingresso: font, stili, App
    ├── App.tsx
    └── styles/
        ├── index.css   ingresso degli stili: Tailwind, token, tema, stili di base
        ├── tokens.css  design token (i valori): copia del design system
        └── theme.css   tema Tailwind: collega le classi ai token
```

Tailwind cerca le classi solo in `src/`.

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
