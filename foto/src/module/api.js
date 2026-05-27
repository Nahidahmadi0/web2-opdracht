// api.js is verantwoordelijk voor alle communicatie met de backend
// Door dit in een aparte module te zetten, hoeven we fetch-logica niet te herhalen in main.js

export class Api {
  constructor() {
    // Het basisadres van onze Express server
    // Alle endpoints beginnen met dit adres
    this.baseUrl = "http://localhost:3000/api";
  }

  // Methode om alle foto's op te halen van de server (GET)
  async getFotos() {
    try {
      // fetch stuurt een GET request naar de backend
      const response = await fetch(`${this.baseUrl}/fotos`);
      const data = await response.json(); // zet het antwoord om naar een JS object/array

      // Sla de opgehaalde foto's ook op in localStorage als backup
      // JSON.stringify zet een array om naar tekst zodat localStorage het kan bewaren
      localStorage.setItem("fotos", JSON.stringify(data));

      return data; // geef de foto's terug aan main.js
    } catch (error) {
      // Als de server offline is, valt de fetch in de fout
      // Dan gebruiken we localStorage als fallback (bonuspunt!)
      console.log("API offline -> localStorage gebruikt");

      const opgeslagen = localStorage.getItem("fotos"); // haal de opgeslagen tekst op

      // Als er iets in localStorage staat: parse het terug naar een array, anders lege array
      return opgeslagen ? JSON.parse(opgeslagen) : [];
    }
  }

  // Methode om een nieuwe foto te sturen naar de server (POST)
  async postFoto(foto) {
    try {
      // fetch met method POST stuurt data naar de backend
      const response = await fetch(`${this.baseUrl}/fotos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // we sturen JSON data
        },
        body: JSON.stringify(foto), // het foto-object omzetten naar tekst voor de server
      });

      const data = await response.json(); // het antwoord van de server

      // Ook lokaal opslaan zodat de fallback up-to-date blijft
      const lokaal = JSON.parse(localStorage.getItem("fotos") || "[]");
      lokaal.push(data);
      localStorage.setItem("fotos", JSON.stringify(lokaal));

      return data;
    } catch (error) {
      // Als de server offline is: alleen lokaal opslaan
      console.log("Offline -> lokaal opgeslagen");

      const lokaal = JSON.parse(localStorage.getItem("fotos") || "[]");
      lokaal.push(foto);
      localStorage.setItem("fotos", JSON.stringify(lokaal));

      return foto;
    }
  }
}
