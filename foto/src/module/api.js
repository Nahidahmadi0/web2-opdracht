// api.js is verantwoordelijk voor alle communicatie met de backend
// Door dit in een aparte module te zetten, hoeven we fetch-logica niet te herhalen in main.js
// Als we later iets willen aanpassen aan de communicatie, doen we dat op één plaats

export class Api {
  constructor() {
    // Het basisadres van onze Express server
    // Alle endpoints beginnen met dit adres
    // this.baseUrl sla ik op zodat ik het adres overal in de klasse kan gebruiken zonder het elke keer opnieuw te typen
    // De constructor wordt automatisch uitgevoerd als je new Api() schrijft
    this.baseUrl = "http://localhost:3000/api";
  }

  // Methode om alle foto's op te halen van de server (GET)
  // async betekent dat de functie moet wachten op de server zonder de rest van de pagina te blokkeren
  async getFotos() {
    // try gebruiken we om fouten op te vangen
    // als de fetch mislukt omdat de server offline is, valt de code in het catch blok
    try {
      // fetch stuurt een GET request naar de backend
      // await betekent: wacht hier tot de server antwoordt
      const response = await fetch(`${this.baseUrl}/fotos`);

      // zet het antwoord om naar een JavaScript array
      const data = await response.json();

      // Sla de opgehaalde foto's ook op in localStorage als backup
      // JSON.stringify zet een array om naar tekst zodat localStorage het kan bewaren
      // localStorage is zoals een notitieboekje: als de server crasht heb je altijd nog je backup
      localStorage.setItem("fotos", JSON.stringify(data));

      return data; // geef de foto's terug aan main.js
    } catch (error) {
      // Als de server offline is, valt de fetch in de fout en komen we hier
      // Dan gebruiken we localStorage als fallback (plan B)
      console.log("API offline -> localStorage gebruikt");

      // haal de opgeslagen tekst op uit localStorage
      const opgeslagen = localStorage.getItem("fotos");

      // Als er iets in localStorage staat: parse het terug naar een array
      // Anders geven we een lege array terug zodat de app niet crasht
      return opgeslagen ? JSON.parse(opgeslagen) : [];
    }
  }

  // Methode om een nieuwe foto te sturen naar de server (POST)
  // async zodat we kunnen wachten op het antwoord van de server
  async postFoto(foto) {
    try {
      // fetch met method POST stuurt data naar de backend
      const response = await fetch(`${this.baseUrl}/fotos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // we sturen JSON data
        },
        // JSON.stringify zet het foto-object om naar tekst
        // fetch kan geen JavaScript object rechtstreeks versturen over het internet
        // daarom zetten we het eerst om naar tekst zodat de server het kan ontvangen
        body: JSON.stringify(foto),
      });

      const data = await response.json(); // het antwoord van de server

      // Als de server werkt: foto gaat naar de server EN wordt ook lokaal opgeslagen
      // zodat de localStorage fallback altijd up-to-date blijft
      const lokaal = JSON.parse(localStorage.getItem("fotos") || "[]");
      lokaal.push(data);
      localStorage.setItem("fotos", JSON.stringify(lokaal));

      return data;
    } catch (error) {
      // Als de server offline is: foto kan niet naar de server
      // Dan slaan we de foto alleen lokaal op zodat je hem toch nog ziet
      console.log("Offline -> lokaal opgeslagen");

      const lokaal = JSON.parse(localStorage.getItem("fotos") || "[]");
      lokaal.push(foto);
      localStorage.setItem("fotos", JSON.stringify(lokaal));

      return foto;
    }
  }
}
