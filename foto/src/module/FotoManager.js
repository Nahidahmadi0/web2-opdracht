// FotoManager.js is een aparte module zodat de code overzichtelijk blijft
// Alle klassen voor structuur en weergave van foto's staan hier
// Als we iets willen aanpassen aan de rendering, doen we dat op één plaats

// ─── Basisklasse ───────────────────────────────────────────────────────────────

// UIElement is de basisklasse (parent class)
// We gebruiken een basisklasse zodat andere klassen zoals Foto hiervan kunnen erven
// Zo hoeven we naam niet opnieuw te schrijven in elke klasse
class UIElement {
  // De constructor wordt automatisch uitgevoerd als je new UIElement() schrijft
  constructor(naam) {
    this.naam = naam; // this betekent "van dit object", zo is naam beschikbaar in de hele klasse
  }
}

// ─── Subklasse van UIElement ───────────────────────────────────────────────────

// Foto erft van UIElement via "extends"
// extends betekent: Foto krijgt alles van UIElement, plus extra eigen dingen
// Dit heet inheritance (overerving)
export class Foto extends UIElement {
  constructor(naam, url) {
    super(naam); // super() roept de constructor van UIElement op zodat this.naam wordt ingesteld
    // zonder super() zou naam niet werken in deze klasse

    this.url = url; // url is een extra eigenschap die alleen Foto heeft, niet UIElement
  }

  // render() maakt een HTML element aan vanuit JavaScript
  // Dit is "dynamisch HTML aanmaken vanuit JS" (eis van de opdracht)
  // We maken het element aan in JS zodat we de naam en url van de foto erin kunnen zetten
  render() {
    const div = document.createElement("div"); // maak een nieuw div element aan in JavaScript

    div.className = "foto-card"; // geef het een CSS klasse voor styling

    // innerHTML vult de div met HTML, we zetten de naam en url van deze foto erin
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

// Observer is de basisklasse voor het observer pattern (bonuspunt!)
// Het idee: als de data verandert, worden alle subscribers automatisch verwittigd
// Zo hoeven we niet manueel tekenLijst() aan te roepen, dat gebeurt automatisch
class Observer {
  constructor() {
    this.listeners = []; // lijst van functies die uitgevoerd worden bij een update
  }

  // subscribe() registreert een functie die uitgevoerd wordt als notify() wordt aangeroepen
  // In main.js doen we: manager.subscribe((fotos) => manager.tekenLijst(fotos))
  subscribe(fn) {
    this.listeners.push(fn);
  }

  // notify() roept alle geregistreerde functies op met de nieuwe data
  // Zo weten alle subscribers dat de lijst veranderd is en moeten ze opnieuw tekenen
  notify(data) {
    this.listeners.forEach((fn) => fn(data));
  }
}

// ─── Subklasse van Observer ────────────────────────────────────────────────────

// FotoManager erft van Observer via extends
// FotoManager beheert de lijst van foto's en zorgt voor de weergave op de pagina
// Door te erven van Observer heeft FotoManager automatisch subscribe() en notify()
export class FotoManager extends Observer {
  constructor(containerId) {
    super(); // roept de constructor van Observer op zodat this.listeners wordt aangemaakt

    // Zoek het HTML element op waar de foto's in worden getoond
    this.container = document.getElementById(containerId);

    this.fotos = []; // interne lijst van foto-objecten, begint leeg
  }

  // setFotos() vervangt de huidige lijst en triggert automatisch een re-render
  // We gebruiken dit in plaats van tekenLijst() rechtstreeks aan te roepen
  // zodat het observer pattern zijn werk kan doen
  setFotos(lijst) {
    this.fotos = lijst; // sla de nieuwe lijst op

    // notify() verwittigt alle subscribers dat de lijst veranderd is
    // In main.js is de subscriber de tekenLijst functie
    // Zo wordt de pagina automatisch opnieuw getekend zonder dat we dat manueel moeten doen
    this.notify(this.fotos);
  }

  // tekenLijst() maakt voor elke foto een HTML element aan en zet het op de pagina
  // Dit is het stuk dat de pagina effectief verandert
  tekenLijst(lijst) {
    this.container.innerHTML = ""; // leeg de container eerst zodat er geen dubbels komen

    lijst.forEach((item) => {
      if (item.url) {
        // Maak een Foto object aan, dit is onze subklasse van UIElement
        const foto = new Foto(item.naam, item.url);

        // render() geeft een HTML element terug
        // appendChild voegt dat element toe aan de container op de pagina
        this.container.appendChild(foto.render());
      }
    });
  }
}
