## PREREQUISITI

installate e avviate [docker desktop](https://www.docker.com/products/docker-desktop/) se non è già presente  
NB: sulla macchina virtuale non usate WSL2

## COMANDI
i comandi devono essere lanciati dalla cartella root con `docker-compose.yml`

```bash
docker compose up --build -d
```
**avvia tutti i container**  
senza `-d` potete vedere i log nel terminale

```bash
docker compose down
```
**ferma tutti i container**  
con `-v` azzera i dati del database

## EXTRA
potete usare docker desktop per controllare lo stato dei container  
**se avviate un container da docker desktop non verifica se il codice sorgente è cambiato**
```bash
docker compose ps          # show running containers and their health
docker compose logs -f     # follow logs of all services (Ctrl+C to exit)
docker compose logs -f backend   # follow logs of one service
```