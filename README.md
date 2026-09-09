# Jongeren Kansrijker

Webapplicatie voor de administratie van Jongeren Kansrijker (Almere). Gebouwd met **React + TypeScript** (frontend) en **Node.js + Express + TypeScript** (backend).

## Vereisten

Zorg dat je de volgende software hebt geïnstalleerd voordat je begint:

- [Node.js](https://nodejs.org/) 18 of hoger (`node -v`)
- npm (komt mee met Node, `npm -v`)
- Git
- Een code-editor, bijv. [VS Code](https://code.visualstudio.com/)

## Project clonen

```powershell
git clone https://gitlabsrv05.stichtingpraktijkleren.nl/<jouw-groep>/jongeren-kansrijker.git
cd jongeren-kansrijker
```

## Structuur van het project

```
jongeren-kansrijker/
├── client/          → React + TypeScript frontend (Vite)
├── server/          → Node/Express + TypeScript backend
└── documentatie/    → Functioneel/technisch ontwerp, user stories, scrumbord, etc.
```

## Backend opstarten (`server/`)

```powershell
cd server
npm install
```

Maak een `.env`-bestand aan in `server/` op basis van `.env.example` (dit bestand wordt **niet** meegecommit in Git):

```powershell
copy .env.example .env
```

Vul in `.env` de juiste waarden in (vraag deze op bij een teamgenoot als je ze niet hebt):

```
PORT=3000
DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_NAME=jongeren_kansrijker
```

> De database-koppeling wordt in een latere stap toegevoegd — voor nu is `.env` alleen nodig voor de `PORT`.

Start de server:

```powershell
npm run dev
```

Test of het werkt door in de browser naar [http://localhost:3000/api/health](http://localhost:3000/api/health) te gaan. Je zou moeten zien:

```json
{"status":"ok"}
```

## Frontend opstarten (`client/`)

Open een **tweede** terminal (laat de backend gewoon draaien):

```powershell
cd client
npm install
npm run dev
```

Vite toont een lokale URL, meestal:

```
http://localhost:5173
```

Open die URL in je browser. Je zou de inlogpagina moeten zien. Ga naar `http://localhost:5173/jongeren` om het (nog lege) overzicht van jongeren te bekijken.

## Veelvoorkomende problemen

| Probleem | Oplossing |
|---|---|
| `&&` werkt niet in PowerShell | Gebruik losse regels of `;` in plaats van `&&` |
| `Cannot find module 'src/index.ts'` | Zorg dat `server/src/index.ts` bestaat |
| `ts-node-dev` crasht met een TypeScript-foutmelding | Zorg dat `typescript` op versie `5.x` staat (niet `7.x`): `npm install -D typescript@5.4.5` |
| Poort 3000 of 5173 al in gebruik | Sluit het proces dat de poort gebruikt, of wijzig `PORT` in `.env` |

## Committen en pushen

- Commit regelmatig (minimaal elke sessie) met een korte, duidelijke beschrijving van wat er is gedaan.
- Doe elk uur een `git pull` om zo min mogelijk merge-conflicten te krijgen.
- Commit nooit `node_modules/` of `.env` (deze staan al in `.gitignore`).

```powershell
git add .
git commit -m "Korte beschrijving van wat je hebt gedaan"
git pull
git push
```

## Documentatie

Alle projectdocumentatie (functioneel ontwerp, technisch ontwerp, user stories, scrumbord-screenshots, retrospectives, database-schema) staat in de map [`documentatie/`](./documentatie).
