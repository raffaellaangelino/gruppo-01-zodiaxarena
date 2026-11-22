# Scelte tecniche: perché React + TypeScript

Progetto: **ZodiaxArena** · Parte FrontEnd

## 1. In sintesi

Per il FrontEnd di ZodiaxArena abbiamo scelto **React** con **TypeScript**.
Il motivo principale è la **semplificazione**: è uno stack che ci permette di costruire il portale in modo più rapido, ordinato e con meno errori, lavorando in gruppo e con i tempi di un progetto di corso.

## 2. Contesto: cosa richiede il progetto

Dal brief e dalle regole di gioco il FrontEnd deve gestire:

- molte schermate (home, area personale, negozio pacchetti, collezione, I miei mazzi, composizione mazzo, scambi, sfide, cronaca della partita, storico);
- la stessa **carta** mostrata in punti diversi del portale (collezione, mazzo, scambi, cronaca);
- la **validazione del mazzo** (regole V1–V8: un pianeta per slot, da 1 a 3 carte per elemento, un Ascendente, ecc.) con messaggio immediato sulla regola violata;
- layout **responsive** per desktop e mobile;
- attenzione ad **accessibilità** (WCAG AA) e **SEO**;
- lavoro di più persone sullo stesso codice, in tempi limitati.

## 3. Perché React

**Componenti riutilizzabili.**
La carta (pianeta + segno + ATK/DEF + rarità) si scrive **una volta sola** come componente `Carta` e si riusa ovunque. Lo stesso vale per pulsanti, filtri, liste e schede. Meno codice duplicato, modifiche fatte in un punto solo.

**Gestione semplice dei dati che cambiano.**
Quando il giocatore aggiunge o toglie una carta dal mazzo, React aggiorna da solo solo le parti di schermo coinvolte. Questo rende semplice mostrare in tempo reale se il mazzo è valido o quale regola manca, senza scrivere a mano la manipolazione della pagina.

**Struttura chiara per lavorare in gruppo.**
Ogni schermata e ogni elemento è un componente a sé: i membri del team possono lavorare su parti diverse con pochi conflitti.

**Ecosistema e documentazione.**
React ha una documentazione ampia, moltissimi tutorial e librerie già pronte (routing, form, gestione dello stato). Per un gruppo di studenti significa trovare in fretta la soluzione quando ci si blocca.

**Utile per il futuro lavorativo.**
È una delle tecnologie più richieste nel mercato: usarla nel progetto è anche un esercizio che spendiamo dopo il corso.

## 4. Perché TypeScript

**Descrivere le regole del gioco una volta sola.**
Le entità di ZodiaxArena hanno strutture precise. Con TypeScript le definiamo con dei tipi, ad esempio:

```ts
type Pianeta = "Sole" | "Marte" | "Luna" | "Giove" | "Saturno" | "Mercurio" | "Venere";
type Elemento = "Fuoco" | "Acqua" | "Terra" | "Aria";
type Tier = "Comune" | "Rara" | "Epica" | "Leggendaria";

interface Carta {
  pianeta: Pianeta;
  segno: string;
  elemento: Elemento;
  tier: Tier;
  atk: number;
  def: number;
}
```

**Errori trovati prima di eseguire il codice.**
Se scriviamo un pianeta sbagliato (`"Plutone"`) o dimentichiamo un campo della carta, l'editor lo segnala subito. Perdiamo meno tempo a cercare bug.

**Dati del backend descritti e controllati.**
I dati scambiati con il backend (carte, mazzi, sfide, risultato della partita) possono essere descritti con gli stessi tipi, riducendo gli errori di integrazione tra FrontEnd e BackEnd.

**Codice che si documenta da solo.**
Leggendo i tipi, chiunque nel team capisce che forma hanno i dati senza dover chiedere o rileggere tutto il codice.

## 5. Perché lo abbiamo scelto: semplificare

In sintesi, abbiamo scelto React + TypeScript perché:

1. **riduce il codice da scrivere** grazie ai componenti riutilizzabili;
2. **riduce gli errori** grazie ai tipi e ai controlli automatici;
3. **facilita il lavoro in gruppo** con una struttura a componenti e codice leggibile;
4. **ci fa partire subito**: la configurazione iniziale è rapida e le risorse per imparare sono moltissime;
5. **si adatta ai requisiti** del progetto (molte schermate, stesso componente in più punti, validazione in tempo reale, responsive).

## 6. Alternative considerate

| Alternativa | Perché non l'abbiamo scelta |
| --- | --- |
| HTML, CSS e JavaScript puri | Con tante schermate e la stessa carta in più punti il codice si duplicherebbe e diventerebbe difficile da mantenere in gruppo. |
| JavaScript senza TypeScript | Più veloce all'inizio, ma gli errori sui dati (campi mancanti, valori sbagliati) emergono solo a progetto avviato. |
| Angular | Più completo ma più pesante e con curva di apprendimento più ripida, poco adatto ai tempi del progetto. |
| Vue | Valida alternativa, ma per noi React ha più materiale e più richiesta nel mercato del lavoro. |

## 7. Limiti e compromessi

Per essere onesti, la scelta ha dei limiti:

- **Curva di apprendimento:** chi non conosce React e TypeScript deve dedicare tempo iniziale per imparare. Lo compensiamo con la documentazione e con l'aiuto reciproco nel team.
- **TypeScript richiede più scrittura iniziale** (definire i tipi), ma ripaga in meno bug.
- **SEO:** un'applicazione React "classica" (a pagina singola) è meno semplice da ottimizzare per i motori di ricerca. Il brief richiede SEO sulle pagine pubbliche (home, regolamento, FAQ, pagine statiche): per queste valuteremo soluzioni come il pre-rendering o un framework basato su React. *(Da confermare in base alla scelta finale del team.)*
- **I controlli di TypeScript valgono solo nel FrontEnd:** la validazione dei vincoli del mazzo deve comunque essere ripetuta lato server, come richiesto dal brief.

## 8. Conclusione

React e TypeScript non sono l'unica scelta possibile, ma sono quella che per ZodiaxArena **semplifica di più** la costruzione del portale: meno codice ripetuto, meno errori, lavoro di gruppo più ordinato e tempi di partenza ridotti. Per questo li abbiamo adottati.