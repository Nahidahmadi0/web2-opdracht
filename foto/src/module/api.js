// ════════════════════════════════════════════════════════════════════════════
// api.js — Communicatie met de backend
//
// Dit bestand bevat ALLE code om te praten met de server (server.js).
// Door dit apart te zetten (modulair), hoeven we fetch-code niet te
// herhalen telkens in main.js. Dit maakt de code overzichtelijker.
// ════════════════════════════════════════════════════════════════════════════

export class Api {
  // "export" = deze klasse mag gebruikt worden in andere bestanden (bv. main.js)
  // "class Api" = een klasse met de naam Api

  constructor() {
    // constructor() wordt automatisch uitgevoerd als je "new Api()" schrijft
    // Hier stel je de begintoestand van het object in

    this.baseUrl = "http://localhost:3000/api";
    // this.baseUrl = het basisadres van onze Express server
    // Alle API endpoints beginnen met dit adres
    // Voorbeeld: http://localhost:3000/api/fotos
  }

  // ─── GET: alle foto's ophalen ──────────────────────────────────────────

  async getFotos() {
    // "async" = deze methode doet iets dat tijd nodig heeft (wachten op server)
    // We moeten "await" kunnen gebruiken in een async functie

    try {
      // "try" = probeer de code hieronder uit te voeren
      // Als er iets misgaat (server offline), gaan we naar "catch"

      const response = await fetch(`${this.baseUrl}/fotos`);
      // fetch() stuurt een GET request naar de server
      // `${this.baseUrl}/fotos` = "http://localhost:3000/api/fotos"
      // "await" = wacht tot de server een antwoord stuurt
      // response = het antwoord van de server (nog niet als JS data)

      const data = await response.json();
      // .json() zet het antwoord om van tekst naar een JavaScript array
      // "await" = wachten tot dit omzetten klaar is
      // data = een array van foto-objecten: [{naam: "...", url: "..."}, ...]

      localStorage.setItem("fotos", JSON.stringify(data));
      // localStorage is een opslagplaats in de browser die blijft bestaan
      // .setItem(key, value) slaat een waarde op
      // JSON.stringify(data) = zet de array om naar tekst (localStorage bewaart alleen tekst)
      // Dit dient als BACKUP: als de server later offline is, hebben we nog data

      return data;
      // Geef de foto's terug aan wie deze methode aanriep (= main.js)
    } catch (error) {
      // "catch" wordt uitgevoerd ALS de fetch mislukt (server offline, netwerkfout...)
      // "error" bevat informatie over wat er misging

      console.log("API offline -> localStorage gebruikt");
      // Toon een boodschap in de browser-console (F12 > Console)
      // Dit is handig voor debugging

      const opgeslagen = localStorage.getItem("fotos");
      // Probeer de eerder opgeslagen foto's op te halen uit localStorage
      // Als er niets opgeslagen is, geeft dit null terug

      return opgeslagen ? JSON.parse(opgeslagen) : [];
      // Ternaire operator: als "opgeslagen" iets bevat → parse het terug naar array
      //                    als "opgeslagen" leeg is (null) → geef lege array terug
      // JSON.parse() is het omgekeerde van JSON.stringify(): tekst → JS array
    }
  }

  // ─── POST: een nieuwe foto uploaden ───────────────────────────────────

  async postFoto(foto) {
    // "foto" = het foto-object dat we naar de server sturen
    // Bevat: { naam: "bestandsnaam.jpg", url: "data:image/...base64..." }

    try {
      // Probeer de foto te sturen naar de server

      const response = await fetch(`${this.baseUrl}/fotos`, {
        // fetch() met extra opties = POST request (standaard is het GET)

        method: "POST",
        // Stel in dat we een POST request sturen (data STUREN naar server)
        // GET = data ophalen, POST = data sturen

        headers: {
          "Content-Type": "application/json",
          // Vertel de server dat we JSON data sturen
          // Zonder dit begrijpt de server het body formaat niet
        },

        body: JSON.stringify(foto),
        // JSON.stringify(foto) = zet het foto-object om naar JSON tekst
        // Voorbeeld: '{"naam":"test.jpg","url":"data:image/jpeg;base64,..."}'
        // body = de inhoud van ons verzoek (wat we sturen)
      });

      const data = await response.json();
      // Lees het antwoord van de server (de opgeslagen foto terug)
      // De server stuurt in server.js: res.status(201).json(nieuweFoto)

      const lokaal = JSON.parse(localStorage.getItem("fotos") || "[]");
      // Haal de lokale backup op uit localStorage
      // "|| '[]'" = als er niets staat, gebruik een lege array als tekst

      lokaal.push(data);
      // Voeg de nieuwe foto ook toe aan de lokale backup

      localStorage.setItem("fotos", JSON.stringify(lokaal));
      // Sla de bijgewerkte backup op in localStorage

      return data;
      // Geef de opgeslagen foto terug aan main.js
    } catch (error) {
      // Als de server offline is, slaan we de foto ALLEEN lokaal op

      console.log("Offline -> lokaal opgeslagen");
      // Melding in de console

      const lokaal = JSON.parse(localStorage.getItem("fotos") || "[]");
      // Haal huidige lokale lijst op

      lokaal.push(foto);
      // Voeg de nieuwe foto toe aan de lokale lijst

      localStorage.setItem("fotos", JSON.stringify(lokaal));
      // Sla de bijgewerkte lijst op

      return foto;
      // Geef het foto-object terug zodat main.js verder kan werken
    }
  }
}
