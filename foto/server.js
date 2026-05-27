// We importeren express, dat is het framework waarmee we een server maken
const express = require("express");

// We importeren cors zodat de frontend (Vite) mag communiceren met de backend
// Zonder cors zou de browser de verbinding blokkeren
const cors = require("cors");

// We maken een express app aan, dit is onze server
const app = express();

// cors activeren zodat de frontend requests mag sturen
app.use(cors());

// express.json zorgt ervoor dat we JSON data kunnen ontvangen via POST
// limit: "10mb" zodat grote foto's (base64) ook doorkomen
app.use(express.json({ limit: "10mb" }));

// Dit is onze tijdelijke opslag: een array waar alle foto-objecten in komen
// Let op: als de server herstart, is deze lijst leeg
let fotoLijst = [];

// GET endpoint: de frontend vraagt alle opgeslagen foto's op
// req = het verzoek van de browser, res = ons antwoord terug
app.get("/api/fotos", (req, res) => {
  res.json(fotoLijst); // stuur de hele lijst terug als JSON
});

// POST endpoint: de frontend stuurt een nieuwe foto naar de server
app.post("/api/fotos", (req, res) => {
  const nieuweFoto = req.body; // haal het foto-object op uit de request body

  fotoLijst.push(nieuweFoto); // voeg de foto toe aan de lijst

  res.status(201).json(nieuweFoto); // stuur 201 (created) terug met de nieuwe foto
});

// Start de server op poort 3000
// Je kan de app dan bereiken via http://localhost:3000
app.listen(3000, () => {
  console.log("Server draait op poort 3000");
});
