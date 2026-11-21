porta 8081

## documentazione API  
http://localhost:8081/swagger-ui/index.html



## Account di prova per il SAL

Creati da `backend/src/main/resources/data-dev.sql` (solo con il profilo `dev`, quello del docker compose) a ogni avvio, se non esistono già.

| Giocatore | Email (login) | Password | Segno | Fazione | Crediti |
|---|---|---|---|---|---|
| **Vega** | `vega@zodiax.test` | `Vega2026sal` | Leone | EFESTO (Fuoco) | 450 |
| **Antares** | `antares@zodiax.test` | `Antares2026sal` | Scorpione | POSEIDONE (Acqua) | 380 |

Entrambi hanno già completato i primi passi (Fazione scelta).

**Mazzi** (2 per giocatore, tutti validi: 7 creature una per pianeta, da 1 a 3 per elemento, più l'Ascendente)

| Giocatore | Mazzo | Ascendente | Elementi |
|---|---|---|---|
| Vega | Cielo di Fuoco | Leone | Fuoco 2 · Terra 2 · Aria 2 · Acqua 1 |
| Vega | Marea d'Agosto | Ariete | Fuoco 2 · Acqua 2 · Terra 2 · Aria 1 |
| Antares | Abisso | Scorpione | Acqua 2 · Terra 2 · Aria 2 · Fuoco 1 |
| Antares | Terra e Vento | Toro | Acqua 2 · Terra 2 · Fuoco 2 · Aria 1 |

Oltre alle carte dei mazzi, ognuno ha 5 carte in più (con un doppione: Vega Marte-Ariete, Antares Luna-Cancro).

**Sfida pronta da accettare**: Vega ha sfidato Antares con il mazzo "Cielo di Fuoco".
Per giocarla: accedere come **Antares** → Sfide → Da giocare → Accetta, scegliendo uno dei suoi mazzi.

La sfida si crea una sola volta: dopo averla giocata non si ricrea al riavvio.
Per ripartire da zero: `docker compose down -v` e poi `docker compose up -d` (cancella tutto il database locale).

L'account di test precedente (`mail@example.com`) è stato rimosso.
