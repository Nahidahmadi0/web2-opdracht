// FotoManager.js bevat alle klassen voor de structuur en weergave van foto's
// We gebruiken hier inheritance (overerving) en het observer pattern

// ─── Basisklasse ───────────────────────────────────────────────────────────────

// UIElement is de basisklasse (parent class)
// Elk element in onze UI heeft minstens een naam
class UIElement {
  constructor(naam) {
    this.naam = naam; // sla de naam op als eigenschap
  }
}

// ─── Subklasse van UIElement ───────────────────────────────────────────────────

// Foto erft van UIElement via "extends"
// Dit betekent dat Foto alles heeft wat UIElement heeft, plus extra
export class Foto extends UIElement {
  constructor(naam, url) {
    super(naam); // roept de constructor van UIElement op om this.naam in te stellen

    this.url = url; // extra eigenschap: de base64 afbeeldingsdata of URL
  }

  // render() maakt een HTML element aan en geeft het terug
  // Dit is "dynamisch HTML aanmaken vanuit JavaScript" (eis van de opdracht)
  render() {
    const div = document.createElement("div"); // maak een nieuw div element aan in JS

    div.className = "foto-card"; // geef het een CSS klasse voor styling

    // Zet de HTML inhoud van de div, met de naam en url van deze foto
    div.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 20px;">
        <img src="${this.url}" style="width: 100%; border-radius: 12px;">

        <p style="text-align:center; margin-top:10px;">
          ${this.naam}
        </p>
      </div>
    `;

    return div; // geef het HTML element terug zodat het toegevoegd kan worden aan de pagina
  }
}

// ─── Observer pattern ──────────────────────────────────────────────────────────

// Observer is een basisklasse voor het observer pattern (bonuspunt!)
// Het idee: als de data verandert, worden alle "subscribers" automatisch verwittigd
class Observer {
  constructor() {
    this.listeners = []; // lijst van functies die moeten uitgevoerd worden bij een update
  }

  // subscribe() voegt een functie toe aan de lijst
  // Die functie wordt uitgevoerd telkens als notify() wordt aangeroepen
  subscribe(fn) {
    this.listeners.push(fn);
  }

  // notify() roept alle geregistreerde functies op met de nieuwe data
  notify(data) {
    this.listeners.forEach((fn) => fn(data));
  }
}

// ─── Subklasse van Observer ────────────────────────────────────────────────────

// FotoManager erft van Observer
// Hij beheert de lijst van foto's en zorgt voor de weergave op de pagina
export class FotoManager extends Observer {
  constructor(containerId) {
    super(); // roept de constructor van Observer op (initialiseert this.listeners)

    // Zoek het HTML element op waar de foto's in worden getoond
    this.container = document.getElementById(containerId);

    this.fotos = []; // interne lijst van foto-objecten
  }

  // setFotos() vervangt de huidige lijst en triggert een re-render via notify()
  setFotos(lijst) {
    this.fotos = lijst; // sla de nieuwe lijst op

    // Verwittig alle subscribers (in main.js is dat de tekenLijst functie)
    this.notify(this.fotos);
  }

  // tekenLijst() maakt voor elke foto een HTML element aan en zet het op de pagina
  tekenLijst(lijst) {
    this.container.innerHTML = ""; // leeg de container eerst zodat er geen dubbels komen

    lijst.forEach((item) => {
      if (item.url) {
        // Maak een Foto object aan (onze subklasse van UIElement)
        const foto = new Foto(item.naam, item.url);

        // Voeg het gerenderde HTML element toe aan de container op de pagina
        this.container.appendChild(foto.render());
      }
    });
  }
}
