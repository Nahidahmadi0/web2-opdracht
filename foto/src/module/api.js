// api.js is verantwoordelijk voor alle communicatie met de backend
// Door dit in een aparte module te zetten, hoeven we fetch-logica niet te herhalen in main.js

export class Api {
  constructor() {
    // Het basisadres van onze Express server
    // Alle endpoints beginnen met dit adres
    this.baseUrl = "http://localhost:3000/api";
  }

  async getFotos() {
    try {
      const response = await fetch(`${this.baseUrl}/fotos`);
      const data = await response.json();
      localStorage.setItem("fotos", JSON.stringify(data));
      return data;
    } catch (error) {
      console.log("API offline -> localStorage gebruikt");
      const opgeslagen = localStorage.getItem("fotos");
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
