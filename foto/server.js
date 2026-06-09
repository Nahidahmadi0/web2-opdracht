// ════════════════════════════════════════════════════════════════════════════
// server.js — De backend van de applicatie
//
// Dit is de Express server die draait met Node.js.
// De frontend (browser) communiceert met deze server via fetch() requests.
// Start de server met: node server.js
// De server is dan bereikbaar op: http://localhost:3000
// ════════════════════════════════════════════════════════════════════════════

const express = require("express");
// require() = importeer een module in Node.js (= het CommonJS equivalent van "import")
// "express" = het webframework dat we gebruiken om een server te maken
// Express maakt het makkelijk om routes (URL-paden) en endpoints te definiëren

const cors = require("cors");
// "cors" = Cross-Origin Resource Sharing
// Dit is een beveiligingsmaatregel van browsers: een pagina op poort 5173 (Vite)
// mag normaal NIET praten met een server op poort 3000.
// Door cors te gebruiken, zeggen we de server: "sta dit wel toe"

const app = express();
// Maak een Express-applicatie aan.
// "app" is het object waarmee we alles instellen: middleware, routes, server starten.

// ─── Middleware ─────────────────────────────────────────────────────────────
// Middleware = code die bij ELKE request uitgevoerd wordt, vóór de routes

app.use(cors());
// Activeer CORS voor alle routes.
// Nu mag de frontend (http://localhost:5173) requests sturen naar deze server.

app.use(express.json({ limit: "10mb" }));
// express.json() = middleware die de JSON body van POST requests automatisch
// omzet naar een JavaScript object (beschikbaar via req.body)
// limit: "10mb" = sta toe dat de JSON body tot 10 megabyte groot is
// Dit is nodig omdat base64 foto's groot zijn (een foto van 1MB → ~1,3MB base64)

// ─── Data opslag ────────────────────────────────────────────────────────────

let fotoLijst = [];
// Een gewone JavaScript array als tijdelijke database.
// "let" = de waarde kan veranderen (we voegen foto's toe)
// BELANGRIJK: dit is in het geheugen (RAM). Als je de server herstart, is alles weg.
// In een echte app zou je hier een database (bv. MongoDB) gebruiken.

// ─── Route 1: GET /api/fotos ─────────────────────────────────────────────────

app.get("/api/fotos", (req, res) => {
  // app.get() = definieer een route die reageert op GET requests
  // "/api/fotos" = het pad in de URL (http://localhost:3000/api/fotos)
  // (req, res) = callback functie met 2 parameters:
  //   req = request: informatie OVER het verzoek van de browser
  //   res = response: het object waarmee we antwoorden NAAR de browser

  res.json(fotoLijst);
  // Stuur de volledige fotoLijst terug als JSON
  // .json() zet het JavaScript array om naar JSON tekst en stuurt het als antwoord
  // De browser ontvangt dit en api.js leest het via response.json()
});

// ─── Route 2: POST /api/fotos ─────────────────────────────────────────────────

app.post("/api/fotos", (req, res) => {
  // app.post() = definieer een route die reageert op POST requests
  // POST requests worden gebruikt om data TE STUREN naar de server

  const nieuweFoto = req.body;
  // req.body = de data die de browser meegestuurd heeft
  // Dankzij express.json() is dit al omgezet naar een JS object
  // Voorbeeld: { naam: "vakantie.jpg", url: "data:image/jpeg;base64,..." }

  fotoLijst.push(nieuweFoto);
  // Voeg het foto-object toe aan onze array in het geheugen

  res.status(201).json(nieuweFoto);
  // res.status(201) = stuur HTTP statuscode 201 mee
  //   200 = OK (standaard bij GET)
  //   201 = Created (standaard bij succesvol aanmaken van iets)
  // .json(nieuweFoto) = stuur de opgeslagen foto terug als bevestiging
  // api.js ontvangt dit via: const data = await response.json()
});

// ─── Server starten ──────────────────────────────────────────────────────────

app.listen(3000, () => {
  // app.listen() = start de server op een bepaalde poort
  // 3000 = poortnummer (= http://localhost:3000)
  // De callback () => {...} wordt uitgevoerd ZODRA de server klaar is om requests te ontvangen

  console.log("Server draait op poort 3000");
  // Toon een melding in de terminal zodat je weet dat de server gestart is
});
