// ════════════════════════════════════════════════════════════════════════════
// FotoManager.js — Klassen voor de weergave en het beheer van foto's
//
// Dit bestand bevat 4 klassen en gebruikt twee belangrijke OOP-concepten:
// 1. INHERITANCE (overerving): Foto erft van UIElement, FotoManager van Observer
// 2. OBSERVER PATTERN: FotoManager verwittigt automatisch wie geabonneerd is
// ════════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════════
// KLASSE 1: UIElement — de basisklasse
// ════════════════════════════════════════════════════════════════════════════

class UIElement {
  // "class" = definitie van een klasse (een sjabloon/blueprint voor objecten)
  // UIElement is de PARENT klasse (basisklasse)
  // Elk UI-element heeft minstens een naam

  constructor(naam) {
    // constructor() = speciale methode die automatisch loopt als je "new UIElement(naam)" schrijft
    // "naam" = het argument dat je meegeeft bij aanmaken

    this.naam = naam;
    // "this" verwijst naar het object dat aangemaakt wordt
    // this.naam = sla de naam op als eigenschap van dit object
  }
}

// ════════════════════════════════════════════════════════════════════════════
// KLASSE 2: Foto — erft van UIElement (inheritance)
// ════════════════════════════════════════════════════════════════════════════

export class Foto extends UIElement {
  // "extends UIElement" = Foto ERFT van UIElement
  // Foto heeft automatisch alles wat UIElement heeft (this.naam)
  // én kan eigen eigenschappen en methoden toevoegen
  // "export" = deze klasse kan geïmporteerd worden in andere bestanden

  constructor(naam, url) {
    // Foto heeft 2 parameters: naam (van de UIElement) en url (nieuw)

    super(naam);
    // "super(naam)" = roept de constructor van de PARENT klasse (UIElement) aan
    // Dit stelt this.naam in via UIElement's constructor
    // VERPLICHT bij extends: je moet super() altijd EERST aanroepen

    this.url = url;
    // Extra eigenschap van Foto (bestaat niet in UIElement)
    // url = de base64 afbeeldingsdata of een gewone URL
  }

  render() {
    // render() = een methode die een HTML element maakt en teruggeeft
    // Dit is "dynamisch HTML aanmaken vanuit JavaScript"
    // Dynamisch = niet hardgecodeerd in index.html, maar aangemaakt door JS

    const div = document.createElement("div");
    // document.createElement("div") = maak een nieuw <div> element aan in JavaScript
    // Dit element bestaat nog NIET op de pagina, we bouwen het eerst op

    div.className = "foto-card";
    // Geef het div-element de CSS klasse "foto-card"
    // = hetzelfde als class="foto-card" in HTML

    div.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 20px;">
        <img src="${this.url}" style="width: 100%; border-radius: 12px;">
        <p style="text-align:center; margin-top:10px;">
          ${this.naam}
        </p>
      </div>
    `;
    // innerHTML = stel de HTML inhoud van het element in als tekst
    // Template literal (backticks `) = maakt het makkelijk om variabelen in HTML te zetten
    // ${this.url} = de base64 data wordt als src van de <img> ingevuld
    // ${this.naam} = de bestandsnaam wordt getoond onder de foto

    return div;
    // Geef het gebouwde HTML element terug
    // De aanroeper (tekenLijst) kan het dan toevoegen aan de pagina
  }
}

// ════════════════════════════════════════════════════════════════════════════
// KLASSE 3: Observer — het observer patroon
// ════════════════════════════════════════════════════════════════════════════

class Observer {
  // Observer = een basisklasse voor het observer design pattern
  // Idee: wie "geabonneerd" is op een Observer, wordt automatisch verwittigd
  // bij elke verandering. Zoals een nieuwsbrief: je schrijft je in, je krijgt updates.

  constructor() {
    this.listeners = [];
    // listeners = een lege array om abonnee-functies in op te slaan
    // Elke keer iemand subscribe() aanroept, komt zijn functie hier in
  }

  subscribe(fn) {
    // subscribe() = "schrijf je in voor updates"
    // fn = een functie (callback) die wordt opgeroepen bij een update

    this.listeners.push(fn);
    // Voeg de functie toe aan de array van listeners
  }

  notify(data) {
    // notify() = "stuur een update naar alle abonnees"
    // data = de nieuwe data die we doorsturen naar alle listeners

    this.listeners.forEach((fn) => fn(data));
    // Loop over alle geregistreerde functies en roep ze elk aan met "data"
    // In main.js is er 1 listener: (fotos) => manager.tekenLijst(fotos)
    // Dus bij notify(fotos) wordt tekenLijst(fotos) automatisch aangeroepen
  }
}

// ════════════════════════════════════════════════════════════════════════════
// KLASSE 4: FotoManager — erft van Observer
// ════════════════════════════════════════════════════════════════════════════

export class FotoManager extends Observer {
  // "extends Observer" = FotoManager ERFT van Observer
  // FotoManager heeft dus ook subscribe() en notify() beschikbaar
  // Bovenop dat beheert FotoManager de lijst van foto's en de weergave

  constructor(containerId) {
    // containerId = het id van het HTML element waar foto's in getoond worden
    // In main.js wordt dit aangeroepen als: new FotoManager("foto-container")

    super();
    // Roep de constructor van Observer aan → initialiseert this.listeners = []

    this.container = document.getElementById(containerId);
    // Zoek het HTML element op via zijn id
    // document.getElementById("foto-container") → het <section> element uit index.html
    // We bewaren dit element zodat we er later foto's in kunnen plaatsen

    this.fotos = [];
    // Interne lijst van alle foto-objecten (begint leeg)
  }

  setFotos(lijst) {
    // setFotos() = vervang de huidige fotolijst door een nieuwe

    this.fotos = lijst;
    // Sla de nieuwe lijst op als eigenschap van het object

    this.notify(this.fotos);
    // Roep notify() aan (geërfd van Observer)
    // Dit stuurt de nieuwe lijst naar alle subscribers
    // In main.js is de subscriber: (fotos) => manager.tekenLijst(fotos)
    // Dus dit triggert AUTOMATISCH een herweergave van de foto's
  }

  tekenLijst(lijst) {
    // tekenLijst() = leeg de container en vul hem opnieuw met de foto's

    this.container.innerHTML = "";
    // Verwijder alles wat er al in de container stond
    // Zonder dit zou elke update de foto's HERHALEN (duplicaten)

    lijst.forEach((item) => {
      // Loop over elk foto-object in de lijst
      // "item" = één foto-object: { naam: "...", url: "..." }

      if (item.url) {
        // Controleer of er een url is (niet elk object is altijd volledig)

        const foto = new Foto(item.naam, item.url);
        // Maak een nieuw Foto-object aan (onze klasse hierboven)
        // Dit geeft ons toegang tot de render() methode

        this.container.appendChild(foto.render());
        // foto.render() = geeft een HTML element terug (de <div> met <img>)
        // appendChild() = voeg dat HTML element toe BINNEN de container
        // → de foto verschijnt nu op de pagina
      }
    });
  }
}
