# Deck – Step 1, Step 2 e inizio Step 3: modifiche apportate e motivazioni

Lo step 1 (entity, DTO, controller) è descritto nelle sezioni 1–8. Lo step 2 (il service)
è nella sezione 9, che finisce con una scelta ancora da approvare. La sezione 10 descrive le
prime modifiche dello step 3: quelle che non dipendevano da decisioni del collega o del
frontend. Cosa manca ancora è elencato in `DECK_DA_FARE.md`.

Riferimenti: documento "Deck – Step 1: Entity e Controller" e Contratto API §1 (regole comuni)
e §5 "Il tuo Cielo".

Il contratto prevede un solo mazzo per giocatore (D-022). Il team ha deciso di permetterne
**fino a 3 in fase 1**. Per questo:

- la forma dei JSON resta quella del contratto §5.1;
- i percorsi passano al plurale (`/api/deck` diventa `/api/decks/{deckId}`);
- ogni mazzo ha un `id` e un `updatedAt`, che servono a distinguere i 3 mazzi.

Gli endpoint nuovi (`GET /api/decks`, `POST /api/decks`, `DELETE /api/decks/{deckId}`) vanno
aggiunti al contratto insieme a chi fa il frontend.

---

## 1. Entity `Deck`

File: `src/main/java/com/l9_anagrams/entity/Deck.java`

| Campo | Prima | Dopo | Motivo |
|---|---|---|---|
| `player` | `@ManyToOne` senza `unique` | invariato | Un giocatore ha da 1 a 3 mazzi. Il limite di 3 lo controlla il service, non il database. |
| `name` | obbligatorio, lunghezza predefinita (255) | obbligatorio, `length = 40` | Deve coincidere con il `@Size(max = 40)` del DTO `DeckSaveRequest`. |
| `ascendant` | colonna `ascendant_id` | colonna `ascendant_card_id`, sempre facoltativo | Nome allineato al documento. Facoltativo perché un mazzo senza Ascendente si può salvare come bozza (§5.2) e risulta `valid: false`. |
| carte | `List<PlayerCard>`, tabella `deck_player_card` | `Set<PlayerCard>`, tabella `deck_card` | La stessa copia (`PlayerCard`) può stare in più mazzi dello stesso giocatore, quindi serve una tabella di collegamento. Il `Set` impedisce di avere due volte la stessa copia nello stesso mazzo. |
| `version` | assente | `@Version` | Aumenta a ogni salvataggio. La sfida lo userà per accorgersi che il mazzo è cambiato (`CHALLENGER_DECK_CHANGED`, §7.3). |
| `updatedAt` | assente | `Instant`, impostato da `@PrePersist` / `@PreUpdate` | Va nella risposta del contratto e serve a ordinare i mazzi. |
| indice | assente | `idx_deck_player` su `player_id` | Tutte le letture cercano i mazzi di un giocatore. |

Altre scelte:

- **Niente `@Data` di Lombok**, solo `@Getter`, `@Setter` e `@NoArgsConstructor`. `@Data`
  genera `equals`, `hashCode` e `toString` su tutte le relazioni, e con le relazioni lazy
  provoca query inattese o cicli infiniti.
- **Le carte sono copie possedute (`PlayerCard`)**, non definizioni del catalogo. Così dal
  database si vede subito se il giocatore possiede le carte del mazzo (regola V6) e se una
  copia è bloccata per gli scambi.
- **Il campo si chiama ancora `playerCards`** (il documento lo chiama `cards`). Rinominarlo
  avrebbe richiesto modifiche a `DeckRepo` e al vecchio `DeckResponseDto`. Si può fare nello
  step 2.

`Player` non è stato modificato: ha già `List<Deck> decks` con `mappedBy = "player"`, come
chiede il documento. Il lato che comanda la relazione è `Deck.player`.

### Tabelle che ne risultano

| Tabella | Colonne |
|---|---|
| `deck` | `id`, `player_id` (FK → `player`), `name`, `ascendant_card_id` (FK → `player_card`, può essere null), `version`, `updated_at` |
| `deck_card` | `deck_id` (FK → `deck`), `player_card_id` (FK → `player_card`) |

---

## 2. Enum `DeckSlot` (nuovo)

File: `src/main/java/com/l9_anagrams/entity/DeckSlot.java`

Elenca le 8 posizioni fisse del mazzo (Regolamento v2, regole V2–V4): `SOLE`, `LUNA`, `MARTE`,
`GIOVE`, `SATURNO`, `MERCURIO`, `VENERE`, `ASCENDANT`.

- I nomi sono **gli stessi delle chiavi JSON del contratto**, così Jackson converte `"SOLE"` in
  `DeckSlot.SOLE` senza configurazione.
- I pianeti sono in italiano maiuscolo perché il contratto (§1.1) vuole i nomi propri del gioco
  in italiano. `ASCENDANT` è in inglese perché coincide con il `CardType` già presente nel
  backend.
- `PLANET_SLOTS` e `isPlanet()` serviranno al service per distinguere le 7 creature
  dall'Ascendente.

---

## 3. DTO (nuovi, package `dto/deck`)

Il controller non riceve e non restituisce mai l'entity: usa questi record, che riproducono
campo per campo i JSON del contratto.

### `DeckSaveRequest` (richiesta di creazione e salvataggio)

```json
{ "name": "Cielo di Fuoco",
  "slots": { "SOLE": 9, "LUNA": 17, "...": "...", "ASCENDANT": 101 } }
```

- I numeri sono gli **id delle carte del catalogo** (`CardDefinition`); uno slot vuoto è `null`.
- Le annotazioni controllano **solo la forma**: `@NotBlank @Size(max = 40)` sul nome, `@NotNull`
  sugli slot. Le regole del mazzo (V1–V8) non vanno qui, perché un mazzo incompleto deve poter
  essere salvato come bozza (§5.2).

### `DeckResponse` (risposta di lettura e salvataggio)

Contiene `id`, `name`, `updatedAt`, `slots`, `valid`, `problems`, `elementBalance` ed
`effectiveStats`, come nel contratto §5.1. Gli unici campi aggiunti rispetto al contratto sono
`id` e `updatedAt`.

- `@JsonInclude(content = ALWAYS)` su `slots`: anche gli slot vuoti escono come `"LUNA": null`,
  quindi ci sono sempre 8 chiavi e il frontend sa quali slot aprire.
- `DeckProblem` con `NON_NULL`: `element` compare solo nei problemi V8, come nell'esempio del
  contratto.
- Gli elementi usano l'enum già esistente **`SignType`** (`FIRE`, `WATER`, `EARTH`, `AIR`), senza
  crearne un secondo.
- Le chiavi `Long` di `effectiveStats` vengono scritte da Jackson come stringhe (`"9"`), come
  nel contratto.
- `valid`, `problems` ed `effectiveStats` li calcola solo il backend (§1): il frontend li mostra
  così come arrivano.

### `DeckListResponse` (elenco)

```json
{ "items": [ { "id": 3, "name": "Cielo di Fuoco", "valid": true,
               "problemCount": 0, "updatedAt": "2026-11-17T18:00:00Z" } ],
  "max": 3 }
```

L'elenco è leggero apposta: carte e statistiche si caricano aprendo il singolo mazzo. `max` dice
al frontend quanti mazzi si possono avere, così il numero 3 non va scritto anche nel frontend.

I record piccoli (`DeckProblem`, `DeckSummary`, ecc.) sono **annidati** nel DTO a cui
appartengono. Lo stile è lo stesso per tutti i DTO del Deck.

---

## 4. `ApiError` (nuovo)

File: `src/main/java/com/l9_anagrams/exception/ApiError.java`

È il formato errori del contratto (§1.2): `status`, `code`, `message`, `fieldErrors`. Per ora
serve solo a Swagger per documentare le risposte di errore; a riempirlo sarà il
`@RestControllerAdvice` nello step 3.

**Da verificare:** `fieldErrors` è una lista di coppie `{ field, message }`. Va controllato che
corrisponda alla forma esatta del §1.2.

---

## 5. `DeckService` e `DeckServiceImpl`

- **`DeckService`** è stata riscritta con i 5 metodi del documento (`listDecks`, `getDeck`,
  `createDeck`, `updateDeck`, `deleteDeck`) e la costante `MAX_DECKS = 3`. Ogni metodo riceve
  **chi chiede** (l'email presa dal token) e, quando serve, **quale mazzo**. Il controllo che il
  mazzo appartenga a chi chiede lo farà il service.
- **`DeckServiceImpl`** per ora contiene solo un'implementazione provvisoria: ogni metodo lancia
  `UnsupportedOperationException("step 2")`. Serve a far compilare e partire l'applicazione. Il
  corpo vero si scrive nello step 2.
- La vecchia implementazione, compreso il metodo `check()` con le regole V1–V8, si recupera dal
  commit `2ce28b9`. Servirà come base negli step 2 e 3.

---

## 6. `DeckController`

File: `src/main/java/com/l9_anagrams/controller/DeckController.java`

| Metodo | Endpoint | Riceve | Restituisce | Stato |
|---|---|---|---|---|
| `listMyDecks` | `GET /api/decks` | solo il token | `DeckListResponse` | 200 |
| `createDeck` | `POST /api/decks` | token + `DeckSaveRequest` | `DeckResponse` del mazzo creato | 201 |
| `getDeck` | `GET /api/decks/{deckId}` | token + `deckId` | `DeckResponse` | 200 |
| `updateDeck` | `PUT /api/decks/{deckId}` | token + `deckId` + `DeckSaveRequest` | `DeckResponse` aggiornato | 200 |
| `deleteDeck` | `DELETE /api/decks/{deckId}` | token + `deckId` | niente | 204 |

Rispetto alla versione precedente sono stati tolti:

- `GET /api/decks/me`: l'elenco dei miei mazzi ora è `GET /api/decks`;
- il `GET /api/decks` "solo admin" che restituiva tutti i mazzi: il contratto non lo prevede.

Motivi delle scelte:

- **L'utente viene sempre dal token, mai dalla richiesta.** `@AuthenticationPrincipal
  AppUserPrincipal` legge l'utente messo nel contesto dal filtro JWT, e `getUsername()`
  restituisce l'email. Nel percorso e nel corpo non c'è mai un `playerId`, che chiunque potrebbe
  cambiare. `AppUserPrincipal` è lo stesso tipo usato negli altri controller del progetto.
- **`{deckId}` dice quale mazzo, non di chi è.** Il service risponderà **404** se il mazzo è di
  un altro giocatore (§1: 404, non 403).
- **`@Valid`** fa scattare i controlli del DTO prima di entrare nel metodo. Se falliscono, Spring
  lancia `MethodArgumentNotValidException`, che l'advice trasformerà in 400 `VALIDATION_ERROR`.
- **`@ResponseStatus`** imposta 201 e 204 senza bisogno di `ResponseEntity<?>`. Restituire
  direttamente il DTO rende il codice più corto e la documentazione Swagger più precisa.
- **Iniezione da costruttore** (`private final DeckService` con `@RequiredArgsConstructor`),
  senza `@Autowired` sul campo. Il controller dipende dall'interfaccia, non
  dall'implementazione.
- **Niente `try/catch`, niente repository, niente regole del gioco.** Le eccezioni del service
  salgono fino al `@RestControllerAdvice`, che produce il formato errori del contratto.
- Le annotazioni Swagger (`@Tag`, `@Operation`, `@ApiResponse`) documentano gli errori del
  contratto:

| Stato | Codice | Quando |
|---|---|---|
| 400 | `VALIDATION_ERROR` | `name` mancante o troppo lungo, `slots` mancante, JSON non leggibile |
| 401 | `UNAUTHORIZED` | Token assente o scaduto |
| 404 | `NOT_FOUND` | Mazzo inesistente o di un altro giocatore |
| 409 | `DECK_LIMIT_REACHED` | Creazione con 3 mazzi già salvati |
| 409 | `LAST_DECK` | Cancellazione dell'unico mazzo |
| 422 | `CARD_NOT_OWNED` | Una carta non è del giocatore (V6, §5.2) |

Un mazzo non valido **non** è un errore: si salva come bozza e la risposta dice `valid: false`
(§5.2).

---

## 7. Punti aperti (file non modificati)

1. **Database di sviluppo.** Con `ddl-auto=update` Hibernate crea le tabelle e le colonne nuove,
   ma **non toglie** la vecchia tabella `deck_player_card` né la colonna `ascendant_id`. Inoltre
   `updated_at` è obbligatoria (`NOT NULL`): se in `deck` ci sono già righe, l'aggiornamento
   automatico può fallire. Conviene ricreare il database di sviluppo e aggiornare l'export
   previsto dalla consegna.
2. ✅ **`SecurityConfig`: `/error` non è pubblico.** Spring inoltra ogni errore a `/error`; se
   quell'indirizzo è protetto, i 404, 409 e 422 arrivano al frontend come 401 (§1.2, issue #48).
   Va aggiunto `/error` agli endpoint pubblici. **Risolto nello step 3 (sezione 10).**
3. ✅ **`OpenApiConfig`: manca lo schema `bearerAuth`.** Il controller dichiara
   `@SecurityRequirement(name = "bearerAuth")`, ma lo schema non è definito. Gli endpoint
   compaiono comunque in Swagger, però senza il pulsante "Authorize". **Risolto nello step 3
   (sezione 10).**
4. ✅ **Vecchi DTO non più usati:** `DeckRequestDto`, `DeckResponseDto` e `DeckValidationDto`. Si
   possono cancellare dopo lo step 2, insieme alla rinomina `playerCards` → `cards`. **I DTO
   sono stati cancellati nello step 3 (sezione 10); la rinomina è ancora da fare.**
5. **Contratto.** Vanno aggiunti gli endpoint nuovi (elenco, creazione, cancellazione), i campi
   `id` e `updatedAt` e i codici `DECK_LIMIT_REACHED` e `LAST_DECK`.

---

## 8. Stato alla fine dello step 1

- Il codice del Deck compila. È stato verificato su una copia del progetto in cui i service dei
  player, che hanno modifiche in corso, erano presi dall'ultimo commit.
- L'applicazione può partire grazie all'implementazione provvisoria di `DeckServiceImpl`, ma
  ogni chiamata agli endpoint `/api/decks` fallisce finché non si scrive lo step 2.
  (Superato: lo step 2 è descritto nella sezione 9.)
- Le verifiche da fare con l'applicazione avviata (non ancora eseguite):
  1. su `/swagger-ui` compare il gruppo **Decks** con 5 endpoint;
  2. nel database esistono le tabelle `deck` e `deck_card`;
  3. `GET /api/decks` senza token risponde 401;
  4. `POST /api/decks` con token e corpo `{ "slots": {} }` (senza `name`) risponde 400, non 500.

**Step 2:** `DeckServiceImpl` vero (trovare il giocatore, controllare che il mazzo sia suo, il
limite di 3, il possesso delle carte e la costruzione della risposta).
**Step 3:** validazione V1–V8 e advice con il formato errori del contratto.

---

# Step 2 – Il service

## 9. `DeckServiceImpl`

File: `src/main/java/com/l9_anagrams/service/impl/DeckServiceImpl.java`

L'implementazione provvisoria dello step 1 è stata sostituita da quella vera. Non sono stati
modificati altri file: il service usa solo metodi che esistevano già in `DeckRepo`,
`PlayerRepo` e `PlayerCardRepo`, e le eccezioni già presenti (`ResourceNotFoundException`,
`ConflictException`, `RuleViolationException`). Il progetto compila. L'applicazione non è
ancora stata avviata e gli endpoint non sono ancora stati provati.

### 9.1 Cosa fa ogni metodo

| Metodo | Cosa fa | Errori |
|---|---|---|
| `listDecks` | Restituisce i mazzi del giocatore dal più recente (`updatedAt` decrescente), con `max = 3`. | – |
| `getDeck` | Legge un mazzo del giocatore. | 404 se il mazzo non esiste o è di un altro giocatore |
| `createDeck` | Blocca la riga del giocatore, conta i suoi mazzi, crea il mazzo anche se incompleto. | 409 `DECK_LIMIT_REACHED` con 3 mazzi già salvati; 422 `CARD_NOT_OWNED` |
| `updateDeck` | Controlla che il mazzo sia di chi chiede e lo salva anche se incompleto. | 404; 422 `CARD_NOT_OWNED` |
| `deleteDeck` | Blocca la riga del giocatore e cancella il mazzo. | 404; 409 `LAST_DECK` se è l'unico mazzo |

### 9.2 Scelte e motivazioni

- **Il giocatore viene dall'email del token.** `currentPlayer(email)` usa
  `PlayerRepo.findByAppUserEmail`. Il controller non passa mai un `playerId` (contratto §1).
- **Un mazzo di un altro giocatore risponde 404, non 403** (contratto §1). Il mazzo si cerca
  con `findByIdAndPlayerId`: se non è del giocatore, per il service non esiste.
- **Il limite di 3 lo controlla il service, non il database.** Prima di contare i mazzi si
  blocca la riga del giocatore (`PlayerRepo.findByForUpdate`, `SELECT ... FOR UPDATE`). Senza
  il blocco, due creazioni in parallelo potrebbero leggere entrambe "2 mazzi" e arrivare a 4.
  Lo stesso blocco protegge la cancellazione, che non deve togliere l'ultimo mazzo.
- **Dagli id del catalogo alle copie possedute.** La richiesta contiene gli id delle
  `CardDefinition` (quelli di `GET /api/cards`), mentre il mazzo salva copie possedute
  (`PlayerCard`). Il service carica la collezione del giocatore e, per ogni id, prende la copia
  con l'id più basso. Se il giocatore non possiede una carta, la risposta è 422
  `CARD_NOT_OWNED` (V6, contratto §5.2). Il messaggio elenca tutte le carte mancanti, non solo
  la prima.
- **Un mazzo incompleto si salva comunque.** Gli slot `null` o assenti sono ammessi: il mazzo
  resta una bozza (contratto §5.2).
- **`saveAndFlush` e `updatedAt`.** Il salvataggio viene scritto subito sul database, così
  `version` e `updatedAt` nella risposta sono già quelli aggiornati. `updatedAt` viene impostato
  anche nel service: se cambiano solo le carte, Hibernate considera comunque il mazzo modificato
  e aumenta `version`.
- **Forma della risposta.** `slots` ha sempre 8 chiavi nell'ordine del regolamento, con `null`
  negli slot vuoti. `elementBalance` ha sempre le 4 chiavi `FIRE`, `EARTH`, `AIR`, `WATER` e
  conta solo le 7 creature, non l'Ascendente (V8).
- **Lo slot di una creatura si ricava dal suo pianeta.** Il nome del pianeta nel database,
  scritto in maiuscolo, coincide con `DeckSlot` (`"Sole"` → `SOLE`).

### 9.3 Cosa manca ancora (step 3)

1. **Regole V1–V8.** Per ora `problems` è sempre vuoto e quindi **`valid` è sempre `true`**,
   anche per un mazzo incompleto. Nell'elenco, `problemCount` è sempre 0.
2. **`effectiveStats`** è sempre vuoto.
3. **Formato degli errori.** L'handler attuale (`GlobalExceptionHandler`) restituisce ancora
   `ErrorResponse(status, message, details)`. Codici come `DECK_LIMIT_REACHED` per ora compaiono
   solo dentro il testo del messaggio. Con l'advice dello step 3 diventeranno il campo `code` di
   `ApiError` (contratto §1.2). **In parte risolto nello step 3 (sezione 10):** il JSON non
   leggibile ha ora una risposta 400 nello stesso formato degli altri errori. Il passaggio ad
   `ApiError` è ancora da fare.
4. ✅ **Due salvataggi contemporanei dello stesso mazzo.** `@Version` blocca il secondo, ma oggi
   l'errore (`ObjectOptimisticLockingFailureException`) diventa un 500. Conviene restituire 409.
   **Risolto nello step 3 (sezione 10):** ora la risposta è 409.
5. **Possesso delle carte.** Per controllarlo si carica tutta la collezione del giocatore. Per
   collezioni piccole va bene. Una query mirata richiederebbe un metodo nuovo in
   `PlayerCardRepo`.

### 9.4 Scelta da approvare: carte nello slot sbagliato

**Il problema.** Il `Deck` del PDF non salva in quale slot sta una creatura: salva solo
l'insieme delle carte (`deck_card`), e lo slot si ricava dal pianeta della carta. Se la
richiesta mettesse una carta Luna nello slot `SOLE`, al salvataggio quella posizione andrebbe
persa: rileggendo il mazzo, la carta comparirebbe nello slot `LUNA`. Lo stesso vale per un
Ascendente messo in uno slot creatura, o per una creatura messa nello slot `ASCENDANT`.

**Cosa fa oggi il codice.** Il service rifiuta la richiesta con **422** e il codice
**`WRONG_SLOT`**, e nel messaggio elenca tutte le carte fuori posto. È lo stesso controllo che
il PDF suggerisce per il service (`slot.name().equals(planet...)`). Se nella stessa richiesta ci
sono anche carte non possedute, viene restituito prima `CARD_NOT_OWNED`.

**Effetto utile.** Con questo controllo le regole V4 (un pianeta per slot) e V5 (nessuna carta
pianeta + segno ripetuta) sono sempre rispettate per costruzione, perché ogni slot accetta solo
carte del suo pianeta e contiene al massimo una carta.

**Perché va deciso.** `WRONG_SLOT` non esiste nel contratto. Le opzioni sono:

| Opzione | Come funziona | Pro | Contro |
|---|---|---|---|
| **A. 422 `WRONG_SLOT`** (attuale) | Nuovo codice di errore, da aggiungere al contratto. | Il frontend riceve un codice preciso e sa quale slot correggere. | Serve una riga nuova nel contratto, da concordare con il frontend. |
| **B. 400 `VALIDATION_ERROR`** | Si tratta come un errore di forma della richiesta, con lo slot in `fieldErrors` (ad esempio `slots.SOLE`). | Usa un codice già previsto dal contratto. | Serve un'eccezione nuova (oggi solo gli errori di `@Valid` diventano 400). Il frontend riceve un errore generico. |
| **C. Salvare comunque e segnalarlo in `problems`** | La carta fuori posto si salva e la risposta dice `valid: false`. | È coerente con l'idea di bozza (§5.2). | Con l'entity attuale non funziona: lo slot non viene salvato, quindi la posizione si perde lo stesso. Bisognerebbe aggiungere a `deck_card` una colonna con lo slot, cioè cambiare l'entity e il database. |

Il frontend, se costruisce la richiesta mostrando per ogni slot solo le carte di quel pianeta
(l'endpoint `candidates` dello Sprint 4 serve proprio a questo), non dovrebbe mai produrre
questo errore. In quel caso l'errore protegge solo da richieste costruite a mano.

**Decisione:** _da compilare dopo il confronto con il collega._

---

# Step 3 – Prime modifiche

## 10. Modifiche che non dipendevano da altre decisioni

Lo step 3 prevede la validazione V1–V8, le statistiche effettive e il formato errori del
contratto. Gran parte di questo lavoro dipende da decisioni ancora aperte (la scelta della
sezione 9.4, i codici dei problemi, la forma di `ApiError`). Queste quattro modifiche invece non
ne dipendevano e non toccano il lavoro già fatto.

Il progetto compila. Le modifiche non sono ancora state provate con l'applicazione avviata.

### 10.1 `/error` pubblico

File: `src/main/java/com/l9_anagrams/auth/config/SecurityConfig.java`

`/error` è stato aggiunto agli endpoint pubblici (`PUBLIC_ENDPOINTS`).

**Motivo.** Quando un controller o l'advice restituisce un errore, Spring inoltra la richiesta a
`/error`. Se quell'indirizzo è protetto, il filtro di sicurezza la blocca e al client arriva
sempre 401, qualunque fosse l'errore vero. Il contratto lo segnala al §1.2 (issue #48). Senza
questa correzione, i 404, 409 e 422 del Deck non arriverebbero mai al frontend.

`/error` non espone dati: restituisce solo la descrizione dell'errore della richiesta in corso.

### 10.2 Schema `bearerAuth` in Swagger

File: `src/main/java/com/l9_anagrams/config/OpenApiConfig.java`

Aggiunto lo schema di sicurezza `bearerAuth` (HTTP, `bearer`, formato `JWT`) e la costante
`BEARER_AUTH`.

**Motivo.** Il `DeckController` dichiara `@SecurityRequirement(name = "bearerAuth")`, come
indica il PDF, ma lo schema non era definito. Ora Swagger UI mostra il pulsante "Authorize": si
incolla il token e le chiamate di prova partono con `Authorization: Bearer <jwt>`, come vuole il
contratto (§1).

### 10.3 Due nuovi casi nell'handler degli errori

File: `src/main/java/com/l9_anagrams/exception/GlobalExceptionHandler.java`

| Eccezione | Prima | Dopo | Quando succede |
|---|---|---|---|
| `HttpMessageNotReadableException` | 400 inoltrato a `/error`, che arrivava al client come 401 | 400, messaggio "JSON non leggibile" | Corpo assente o JSON non valido. Ad esempio uno slot che non esiste (`"PLUTONE": 3`) in `DeckSaveRequest`. |
| `ObjectOptimisticLockingFailureException` | 500 | 409, messaggio "Dati modificati da un'altra richiesta: ricarica e riprova" | Due richieste salvano lo stesso mazzo insieme: `@Version` blocca la seconda. |

**Motivo.** Il contratto prevede 400 `VALIDATION_ERROR` per il JSON non leggibile (vedi la
tabella degli errori nella sezione 6). Il 409 sostituisce un 500 che sarebbe sembrato un
errore del server, mentre è un conflitto previsto: il client deve solo ricaricare il mazzo e
riprovare.

Entrambi i casi usano ancora il formato attuale `ErrorResponse(status, message, details)`.
Riceveranno il campo `code` quando l'handler passerà ad `ApiError`. Il codice del 409 va ancora
concordato.

### 10.4 Vecchi DTO cancellati

Cancellati `dto/DeckRequestDto.java`, `dto/DeckResponseDto.java` e
`dto/DeckValidationDto.java`.

**Motivo.** Sono stati sostituiti dai DTO di `dto/deck` (sezione 3), che seguono il contratto.
Prima di cancellarli è stato verificato che nessun altro file li usasse. Tenerli avrebbe creato
confusione su quali classi sono quelle valide.

### 10.5 Attenzione: file condivisi

`SecurityConfig` e `GlobalExceptionHandler` non sono solo del Deck: le modifiche 10.1 e 10.3
valgono anche per gli endpoint dei player, delle carte e dell'autenticazione. Sono correzioni
(nessuna risposta che prima funzionava cambia forma), ma conviene avvisare il team prima del
commit.
