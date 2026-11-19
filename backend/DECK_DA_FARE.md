# Deck – Cosa manca per rispettare il contratto

Riferimenti: Contratto API §1 (regole comuni), §5 "Il tuo Cielo", §7.3 (sfide) e il documento
"Deck – Step 1: Entity e Controller". Cosa è già stato fatto è descritto in `DECK_MODIFICHE.md`.

Stato attuale: entity, DTO, controller e service (step 1 e 2) sono scritti e compilano.
L'applicazione non è ancora stata avviata con il database, quindi nessun endpoint è stato
provato.

**Aggiornamento:** sono già stati fatti i punti 5.1, 5.2, 6.1 e 10.1, e il punto 4 in parte
(JSON non leggibile). Sono segnati con ✅ nelle tabelle. Il progetto compila; queste modifiche
non sono ancora state provate con l'app avviata. Il riepilogo di queste modifiche è in fondo,
nella sezione 12.

Ogni voce indica la priorità:

- **Bloccante:** senza questa voce il Deck non rispetta il contratto o il frontend non può usarlo.
- **Importante:** va fatta prima della consegna.
- **Dopo:** è prevista dal contratto, ma per uno sprint successivo.

---

## 1. Decisioni da prendere prima di continuare

| # | Decisione | Dettagli | Priorità |
|---|---|---|---|
| 1.1 | ✅ **Carte nello slot sbagliato** | **Deciso:** il mazzo è un insieme di carte e gli slot non si salvano. Una carta "fuori posto" si salva e diventa un problema delle regole (ad esempio V4: 2 Lune e 0 Soli), non un errore. Il controllo `WRONG_SLOT` è stato tolto dal codice. Dettagli in `DECK_MODIFICHE.md`, sezione 9.4. | Fatto |
| 1.4 | **Campo `planet` in `DeckProblem`** | Per dire quale pianeta viola V4 (ad esempio `LUNA`), `DeckProblem` avrebbe bisogno di un campo `planet`, come `element` per V8. Da concordare con il frontend. | Importante |
| 1.2 | **Codici dei problemi V1–V8** | Il contratto mostra solo due esempi: `ELEMENT_MISSING` (V8) e `ASCENDANT_MISSING` (V2). Gli altri codici vanno concordati con il frontend (elenco proposto al punto 2). | Bloccante |
| 1.3 | **Forma di `fieldErrors` in `ApiError`** | Oggi è una lista di `{ field, message }`. Va confrontata con il §1.2 del contratto. | Importante |

---

## 2. Validazione V1–V8: `valid` e `problems` (step 3)

**Bloccante.** Il contratto (§1, §5.2) vuole che le regole del gioco le calcoli solo il backend
e che il frontend mostri `valid` e `problems` così come arrivano. Oggi `problemsOf()` in
`DeckServiceImpl` restituisce sempre una lista vuota, quindi **ogni mazzo risulta `valid: true`**
e nell'elenco `problemCount` è sempre 0.

Un mazzo non valido **non** è un errore: si salva come bozza e la risposta dice `valid: false`
(§5.2). Le regole quindi producono `problems`, non eccezioni. L'unica eccezione è V6, che è
già gestita (422 `CARD_NOT_OWNED`).

| Regola | Cosa controlla | Codice proposto | Note |
|---|---|---|---|
| V1 | Il giocatore ha scelto una casa (Dio) | `GOD_MISSING` | `player.getGod() == null` |
| V2 | C'è esattamente 1 Ascendente | `ASCENDANT_MISSING` (dal contratto) | Campo `ascendant` vuoto: chiave `ASCENDANT` vuota o con una carta che non è un Ascendente |
| V3 | Ci sono esattamente 7 carte di gioco | `CARD_COUNT` | Carte diverse da 7: meno in una bozza, 8 se una creatura è stata inviata nella chiave `ASCENDANT` |
| V4 | 1 carta per ciascun pianeta | `PLANET_DUPLICATE` / `PLANET_MISSING` | **Da scrivere** (decisione 1.1): ad esempio 2 Lune e 0 Soli. Per indicare il pianeta serve il campo `planet` (punto 1.4) |
| V5 | Nessuna carta (pianeta + segno) ripetuta | `CARD_DUPLICATE` | **Da scrivere**: la stessa carta inviata in due chiavi, se il giocatore ne possiede due copie |
| V6 | Il giocatore possiede le carte | `CARD_NOT_OWNED` | **Già fatto**: è un errore 422, non un problema |
| V7 | Le carte di gioco sono creature con un pianeta | `NOT_A_CREATURE` | **Da scrivere**: un Ascendente inviato in una chiave pianeta finisce tra le carte di gioco |
| V8 | Da 1 a 3 creature per elemento | `ELEMENT_MISSING` (dal contratto), `ELEMENT_EXCESS` | Ogni problema riporta `element` (`FIRE`, `EARTH`, `AIR`, `WATER`). Da decidere se va controllata solo a mazzo completo, come faceva il vecchio codice. |

Cosa fare:

- scrivere `problemsOf(Deck)` in `DeckServiceImpl`. La vecchia logica (`check()`, commit
  `2ce28b9`) è una buona base, ma restituiva messaggi in testo libero invece di `DeckProblem`
  con `rule` e `code`;
- usare la stessa logica per `valid`, `problems` e `problemCount` dell'elenco;
- aggiornare il contratto con i codici concordati (punto 1.2).

---

## 3. Statistiche effettive: `effectiveStats` (§5.1)

**Bloccante per §5.1.** Oggi `effectiveStatsOf()` restituisce una mappa vuota.

Il contratto vuole, per ogni carta (la chiave è l'id della `CardDefinition`, scritto come
stringa), l'elenco dei contributi ad `atk` e `def`, ognuno con la sua origine:
`SIGN_BASE`, `AIR_ROLL`, `PLANET`, `ELEMENT`, `ADVANTAGE`, `ASCENDANT`, `GOD`, `HOUSE_I`.

Cosa fare:

- concordare con chi conosce il regolamento come si calcola ogni contributo. Sono già
  disponibili `Sign.atk/def` e `Planet.atk/def`; il resto (elemento, vantaggio, Ascendente,
  Dio, Casa I) dipende dal regolamento v2;
- verificare se esiste già un calcolo nel motore (`integration/engine`) da riutilizzare, invece
  di scriverne un secondo.

---

## 4. Formato degli errori (§1.2, step 3)

**Bloccante.** Il contratto vuole errori nella forma `{ status, code, message, fieldErrors }`
(`ApiError`). Oggi `GlobalExceptionHandler` restituisce ancora
`ErrorResponse(status, message, details)`, e codici come `DECK_LIMIT_REACHED` compaiono solo
dentro il testo del messaggio.

| Stato | Codice | Da dove arriva oggi | Cosa fare |
|---|---|---|---|
| 400 | `VALIDATION_ERROR` | `MethodArgumentNotValidException` (`@Valid`) | Riempire `fieldErrors` con i campi sbagliati |
| 400 | `VALIDATION_ERROR` | JSON non leggibile (`HttpMessageNotReadableException`) | ✅ Gestito nell'advice (400, "JSON non leggibile"). Manca solo il codice |
| 401 | `UNAUTHORIZED` | `SecurityConfig` (`HttpStatusEntryPoint`) | Oggi la risposta è vuota: va dato un corpo in formato `ApiError` |
| 404 | `NOT_FOUND` | `ResourceNotFoundException` | Aggiungere il codice |
| 409 | `DECK_LIMIT_REACHED` | `ConflictException` | Serve un modo per portare il codice (eccezione con campo `code`, o eccezioni dedicate) |
| 409 | `LAST_DECK` | `ConflictException` | Come sopra |
| 422 | `CARD_NOT_OWNED` | `RuleViolationException` | Come sopra |

Attenzione: `GlobalExceptionHandler` è usato anche dalle altre parti del backend (player,
carte, autenticazione). Cambiare il formato cambia le risposte anche di quegli endpoint: va
concordato con il team.

---

## 5. Sicurezza e configurazione

| # | Cosa | Perché | File | Priorità |
|---|---|---|---|---|
| 5.1 | ✅ **Rendere pubblico `/error`** | Spring inoltra ogni errore a `/error`. Se quell'indirizzo è protetto, i 404, 409 e 422 arrivano al frontend come 401 (§1.2, issue #48). **Fatto:** `/error` è tra gli endpoint pubblici. Vale per tutto il backend. | `SecurityConfig` | Fatto |
| 5.2 | ✅ Definire lo schema `bearerAuth` | Il controller lo dichiara (`@SecurityRequirement`), ma lo schema non era definito: in Swagger mancava il pulsante "Authorize". **Fatto:** schema HTTP bearer con formato JWT. | `OpenApiConfig` | Fatto |

---

## 6. Robustezza del service

| # | Cosa | Dettagli | Priorità |
|---|---|---|---|
| 6.1 | ✅ **409 su salvataggi contemporanei** | Se due richieste salvano lo stesso mazzo insieme, `@Version` blocca la seconda con `ObjectOptimisticLockingFailureException`. **Fatto:** l'advice risponde 409 invece di 500. Manca il codice di errore, da concordare insieme al formato `ApiError` (punto 4). | Fatto (codice da concordare) |
| 6.2 | **Copie bloccate per gli scambi** | Il PDF dice che dal database si vede se una copia è bloccata per gli scambi. Da decidere se una copia in uno scambio aperto può entrare in un mazzo. Dipende da come verranno fatti gli scambi. | Dopo |
| 6.3 | **Cancellazione di un mazzo usato in una sfida** | Lasciato come TODO in `deleteDeck`. Da fare quando esisteranno le sfide (§7). | Dopo |
| 6.4 | Query mirata per il possesso | Oggi si carica tutta la collezione del giocatore. Per collezioni grandi conviene un metodo nuovo in `PlayerCardRepo`. | Dopo |

---

## 7. Endpoint previsti più avanti

| Endpoint | Cosa fa | Quando |
|---|---|---|
| `GET /api/decks/{deckId}/candidates?slot=` | Carte del giocatore utilizzabili in uno slot | Sprint 4 |
| `POST /api/decks/validate` | Valida un mazzo senza salvarlo | Dopo |

Servono DTO propri e riusano la validazione del punto 2. `validate` restituisce `valid` e
`problems` senza salvare nulla.

---

## 8. Contratto da aggiornare insieme al frontend

**Importante.** Il contratto prevede un solo mazzo (D-022), mentre il team ha deciso fino a 3.
Vanno aggiunti o modificati:

- i percorsi al plurale: `/api/deck` diventa `/api/decks/{deckId}`;
- gli endpoint nuovi: `GET /api/decks` (elenco, con `max`), `POST /api/decks` (creazione),
  `DELETE /api/decks/{deckId}` (cancellazione);
- i campi `id` e `updatedAt` nella risposta;
- i codici di errore `DECK_LIMIT_REACHED` e `LAST_DECK` (con la decisione 1.1 non serve un
  codice nuovo per le carte nello slot sbagliato);
- l'eventuale campo `planet` nei problemi V4 (punto 1.4);
- i codici dei problemi V1–V8 (punto 1.2).

---

## 9. Database

| # | Cosa | Priorità |
|---|---|---|
| 9.1 | Ricreare il database di sviluppo, oppure eliminare a mano la vecchia tabella `deck_player_card` e la colonna `ascendant_id`. Con `ddl-auto=update` Hibernate non le toglie. Se `deck` contiene già righe, la nuova colonna obbligatoria `updated_at` può bloccare l'avvio. | Bloccante per avviare l'app |
| 9.2 | Aggiornare l'export del database previsto dalla consegna, con le tabelle `deck` e `deck_card`. | Importante |

---

## 10. Pulizia del codice

| # | Cosa | Priorità |
|---|---|---|
| 10.1 | ✅ Cancellare i vecchi DTO non più usati: `DeckRequestDto`, `DeckResponseDto`, `DeckValidationDto`. **Fatto**, dopo aver verificato che nessun altro file li usasse. | Fatto |
| 10.2 | Rinominare il campo `playerCards` in `cards` nel `Deck`, come nel PDF. Va cambiato anche `DeckRepo` (`@EntityGraph`, `existsByPlayerCardsId`, la query JPQL). | Dopo |

---

## 11. Verifiche e test

**Bloccante prima del commit finale.** Nessuna di queste verifiche è stata ancora fatta, perché
MySQL non era avviato.

Con l'applicazione avviata:

1. su `/swagger-ui` compare il gruppo **Decks** con 5 endpoint, e i tipi `DeckSaveRequest` e
   `DeckResponse` hanno gli stessi campi dei JSON del contratto;
2. nel database esistono le tabelle `deck` e `deck_card`;
3. `GET /api/decks` senza token risponde 401;
4. `POST /api/decks` con token e corpo `{ "slots": {} }` (senza `name`) risponde 400, non 500;
5. creazione di un mazzo completo: 201, con `slots` a 8 chiavi ed `elementBalance` corretto;
6. creazione del quarto mazzo: 409 `DECK_LIMIT_REACHED`;
7. carta non posseduta: 422 `CARD_NOT_OWNED`;
8. mazzo di un altro giocatore (`GET`, `PUT`, `DELETE`): 404;
9. cancellazione dell'unico mazzo: 409 `LAST_DECK`;
10. modifica di un mazzo: `updatedAt` cambia e i mazzi nell'elenco si riordinano.

Test automatici da scrivere:

- test unitari del service con repository finti (limite di 3, ultimo mazzo, possesso, slot
  sbagliato, regole V1–V8);
- test del controller (`@WebMvcTest`) per gli stati 201, 204, 400, 401 e 404.

---

## Riepilogo in ordine di lavoro

1. Decidere i punti 1.2 e 1.4 insieme al frontend (il punto 1.1 è deciso ✅).
2. Ricreare il database e fare le verifiche del punto 11 sul codice attuale.
3. Scrivere la validazione V1–V8 (punto 2).
4. Passare al formato errori `ApiError` (punto 4). `/error` è già pubblico ✅.
5. Scrivere le statistiche effettive (punto 3).
6. Aggiornare il contratto (punto 8). Il 409 sui salvataggi contemporanei è già fatto ✅.
7. Più avanti: `candidates`, `validate`, scambi e sfide, rinomina `playerCards` → `cards`.

---

## 12. Modifiche già fatte dello step 3

Queste modifiche non dipendevano da decisioni del collega o del frontend. Il progetto compila,
ma non sono ancora state provate con l'app avviata.

| Punto | File | Modifica |
|---|---|---|
| 5.1 | `auth/config/SecurityConfig.java` | `/error` aggiunto agli endpoint pubblici. |
| 5.2 | `config/OpenApiConfig.java` | Aggiunto lo schema `bearerAuth` (HTTP bearer, JWT) e la costante `BEARER_AUTH`. |
| 4 (in parte) | `exception/GlobalExceptionHandler.java` | `HttpMessageNotReadableException` → 400 "JSON non leggibile". Prima Spring lo trasformava già in 400, ma lo inoltrava a `/error`, che era protetto, quindi al client arrivava 401. |
| 6.1 | `exception/GlobalExceptionHandler.java` | `ObjectOptimisticLockingFailureException` → 409 invece di 500. |
| 10.1 | `dto/` | Cancellati `DeckRequestDto`, `DeckResponseDto`, `DeckValidationDto`. |

**Attenzione:** `SecurityConfig` e `GlobalExceptionHandler` sono condivisi con il resto del
backend. Le due modifiche valgono anche per gli endpoint dei player, delle carte e
dell'autenticazione: conviene avvisare il team prima del commit. I due nuovi casi usano ancora
il formato attuale `ErrorResponse(status, message, details)`; passeranno ad `ApiError` insieme
al resto del punto 4.
