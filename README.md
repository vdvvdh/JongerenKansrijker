# Jongeren Kansrijker

Jongeren Kansrijker is een webapp voor administratief medewerkers. De frontend is gebouwd met React, TypeScript en Vite. De backend gebruikt Laravel en levert de API.

## Benodigdheden

- PHP 8.2 of hoger
- Composer 2
- Node.js `^20.19.0` of `>=22.12.0` en npm
- SQLite voor de standaard lokale setup, of MySQL als je XAMPP gebruikt

Controleer de versies vanuit PowerShell:

```powershell
php -v
composer --version
node --version
npm --version
```

## Snel starten met SQLite

SQLite is de eenvoudigste lokale optie; je hoeft hiervoor geen MySQL-server te starten. Voer de backendstappen uit vanuit de projectmap:

```powershell
cd server
composer install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
php artisan key:generate
if (-not (Test-Path database\database.sqlite)) { New-Item -ItemType File database\database.sqlite | Out-Null }
php artisan migrate --seed
```

De voorbeelddata bevat een testmedewerker, jongeren en activiteiten. Start daarna **twee terminals** vanuit de projectmap.

Terminal 1, Laravel API:

```powershell
cd server
php artisan serve
```

Terminal 2, React-frontend:

```powershell
cd client
npm install
npm run dev
```

Open vervolgens **http://localhost:5173** en log in met:

- E-mailadres: `n.mulder@jongerenkansrijker.nl`
- Wachtwoord: `Welkom123!`

Gebruik `localhost` in plaats van `127.0.0.1`; de lokale sessie- en CORS-configuratie is daarop ingesteld. Het testaccount is alleen bedoeld voor ontwikkeling.

## MySQL met XAMPP

Als je MySQL wilt gebruiken:

1. Start MySQL vanuit het XAMPP Control Panel.
2. Maak in phpMyAdmin een lege database aan, bijvoorbeeld `jongeren_kansrijker`.
3. Open `server\.env` en zet de database-instellingen. Gebruik `DB_DATABASE` (niet `DB_NAME`):

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=jongeren_kansrijker
DB_USERNAME=root
DB_PASSWORD=
```

4. Voer vanuit `server` de migraties en voorbeelddata uit:

```powershell
php artisan migrate --seed
```

Vul `DB_USERNAME` en `DB_PASSWORD` in als jouw lokale MySQL-configuratie andere gegevens gebruikt. Laat `SANCTUM_STATEFUL_DOMAINS=localhost:5173` staan en open de frontend via `http://localhost:5173`.

## Wat werkt er

- Inloggen en uitloggen
- Jongeren bekijken en beheren
- Activiteiten bekijken, toevoegen, wijzigen en verwijderen
- Jongeren aan activiteiten koppelen
- Per jongere de gekoppelde activiteiten, inschrijfdatum en het resultaat bekijken

Instituut- en medewerkersbeheer zijn nog niet uitgewerkt.

## Tests en productiebuild

Backendtests uitvoeren:

```powershell
cd server
php artisan test
```

Frontend controleren en bouwen:

```powershell
cd client
npm run lint
npm run build
```

De frontendbuild komt in `client\dist`. Je kunt die lokaal bekijken met:

```powershell
npm run preview
```

## Database resetten

Om lokaal alle tabellen te verwijderen en de voorbeelddata opnieuw aan te maken:

```powershell
cd server
php artisan migrate:fresh --seed
```

**Let op:** `migrate:fresh` verwijdert alle gegevens in de ingestelde database. Gebruik dit niet op een database met gegevens die je wilt bewaren.
