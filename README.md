# Treeloc frontend

Pro korektní běh aplikace je potřeba mít spuštěný [Treeloc Backend](https://github.com/prixladi/treeloc-backend).

# Spuštění projektu

## Docker (docker-compose)

Spuštění projektu pomocí `docker-compose up`

Vytvoření nových imagů a spuštění projektu pomocí `docker-compose up --build`

Služba poběží na portu 80. Mapování portů se dá změnit v souboru **/docker-compose.yml**.

[Dokumentace docker-compose.](https://docs.docker.com/compose/)

---

## Yarn

Inicializace projektu pomocí `yarn`

Spuštění projektu pomocí `yarn start`

Aplikace se spustí na portu 3000 pokud je dostupný. V případě že není dostupný vyzkouší další v pořadí 3001 atd..

---

# Proměnné prostředí
Proměnné prostředí se dají změnit editací souboru **/docker-compose.yml**.

|Název|Povinná|Popis|Výchozí hodnota
|---|---|---|---|
|API_URL|ano|Adresa **Api** služby (viz. [Treeloc Backend](https://github.com/prixladi/treeloc-backend))|/|
|LOADER_URL|ano|Adresa **Loader** služby (viz. [Treeloc Backend](https://github.com/prixladi/treeloc-backend))|/|