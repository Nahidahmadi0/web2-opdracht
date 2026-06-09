// ════════════════════════════════════════════════════════════════════════════
// main.js — Het startpunt van de frontend applicatie
// Dit is het eerste JavaScript bestand dat de browser uitvoert.
// Het brengt alle onderdelen samen: de API, de FotoManager, en de events.
// ════════════════════════════════════════════════════════════════════════════

// ─── Imports ────────────────────────────────────────────────────────────────

import { Api } from "./module/api.js";
// We importeren de klasse "Api" uit het bestand api.js
// Api bevat alle code om met de backend (server.js) te communiceren via fetch

import { FotoManager } from "./module/FotoManager.js";
// We importeren de klasse "FotoManager" uit FotoManager.js
// FotoManager beheert de lijst van foto's en toont ze op de pagina

// ─── Instanties aanmaken ────────────────────────────────────────────────────

const api = new Api();
// Maak één Api-object aan. Dit object gebruiken we later om
// getFotos() en postFoto() op aan te roepen.

const manager = new FotoManager("foto-container");
// Maak één FotoManager-object aan.
// "foto-container" = het id van het HTML element waar de foto's in komen
// (zie index.html: <section id="foto-container">)

// ─── Observer pattern ───────────────────────────────────────────────────────

manager.subscribe((fotos) => {
  // subscribe() zegt: "als de fotolijst verandert, voer dan deze functie uit"
  // Dit is het observer pattern: manager verwittigt ons automatisch bij elke update

  manager.tekenLijst(fotos);
  // tekenLijst() verwijdert de oude foto's en toont de nieuwe lijst op de pagina
});

// ─── HTML elementen ophalen ─────────────────────────────────────────────────

const fileInput = document.getElementById("file-input");
// Haal het VERBORGEN bestandskiezer-inputveld op via zijn id
// (zie index.html: <input type="file" id="file-input" style="display:none">)

const uploadTrigger = document.getElementById("upload-trigger");
// Haal de zichtbare uploadknop op via zijn id
// (zie index.html: <button id="upload-trigger">)

const downloadBtn = document.getElementById("download-btn");
// Haal de downloadknop op via zijn id
// (zie index.html: <button id="download-btn">)

// ════════════════════════════════════════════════════════════════════════════
// App opstarten
// ════════════════════════════════════════════════════════════════════════════

async function initApp() {
  // "async" = deze functie bevat code die moet wachten (async = asynchronous)
  // Zonder async/await zou de pagina bevriezen terwijl we wachten op de server

  const fotos = await api.getFotos();
  // "await" = wacht hier tot de server geantwoord heeft
  // api.getFotos() stuurt een GET request naar http://localhost:3000/api/fotos
  // het resultaat (een array van foto-objecten) wordt opgeslagen in "fotos"

  manager.setFotos(fotos);
  // Geef de opgehaalde foto's aan de manager.
  // setFotos() slaat de lijst op EN roept notify() aan
  // notify() verwittigt onze subscriber → tekenLijst() wordt uitgevoerd
  // → de foto's verschijnen op de pagina
}

initApp();
// Roep initApp() onmiddellijk aan zodra de pagina geladen is.
// Dit is het startschot: de app haalt de foto's op en toont ze.

// ════════════════════════════════════════════════════════════════════════════
// Event: Klik op de uploadknop
// ════════════════════════════════════════════════════════════════════════════

if (uploadTrigger) {
  // Controleer eerst of het element bestaat (veiligheidscheck)

  uploadTrigger.addEventListener("click", () => {
    // "click" = luister naar muisklikken op uploadTrigger

    fileInput.click();
    // Simuleer programmatisch een klik op het VERBORGEN file-input element
    // Dit opent het venster waarmee de gebruiker een bestand kan kiezen
    // We doen dit via JavaScript omdat we het file-input element zelf verborgen hebben
  });
}

// ════════════════════════════════════════════════════════════════════════════
// Event: Gebruiker kiest een bestand
// ════════════════════════════════════════════════════════════════════════════

if (fileInput) {
  // Controleer of het element bestaat

  fileInput.addEventListener("change", (e) => {
    // "change" = dit event vuurt af zodra de gebruiker een bestand gekozen heeft
    // "e" = het event object, bevat info over wat er is gebeurd

    const file = e.target.files[0];
    // e.target = het file-input element zelf
    // .files = een lijst van gekozen bestanden
    // [0] = we nemen het eerste (en enige) bestand

    if (!file) return;
    // Als de gebruiker het venster sluit zonder een bestand te kiezen,
    // is "file" leeg. Dan stoppen we hier.

    const reader = new FileReader();
    // FileReader is een ingebouwde browser API om bestanden in te lezen
    // We gebruiken het om de afbeelding om te zetten naar base64 tekst

    reader.onload = async (event) => {
      // onload wordt uitgevoerd wanneer het inlezen KLAAR is (async!)
      // "event" bevat het resultaat van het inlezen

      const afbeeldingData = event.target.result;
      // event.target.result = de afbeelding als base64 string
      // Voorbeeld: "data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."

      const nieuweFoto = {
        naam: file.name, // de bestandsnaam, bv. "vakantie.jpg"
        url: afbeeldingData, // de base64 data van de afbeelding
      };
      // Maak een foto-object aan met naam en url eigenschappen

      await api.postFoto(nieuweFoto);
      // Stuur de nieuwe foto via POST naar de backend (server.js)
      // await = wacht tot de server bevestigt dat het ontvangen is

      const nieuweLijst = [...manager.fotos, nieuweFoto];
      // Spread operator "..." = kopieer alle bestaande foto's in een nieuwe array
      // dan voegen we nieuweFoto toe achteraan
      // Resultaat: nieuwe array = alle oude foto's + de nieuwe foto

      manager.setFotos(nieuweLijst);
      // Update de manager met de nieuwe lijst
      // Dit triggert automatisch tekenLijst() via de observer
      // → de nieuwe foto verschijnt onmiddellijk op de pagina
    };

    reader.readAsDataURL(file);
    // Start het inlezen van het bestand als een base64 data URL
    // Wanneer dit klaar is, wordt reader.onload automatisch aangeroepen
  });
}

// ════════════════════════════════════════════════════════════════════════════
// Event: Filter knoppen
// ════════════════════════════════════════════════════════════════════════════

document.querySelectorAll(".filter-btn").forEach((btn) => {
  // querySelectorAll(".filter-btn") = zoek ALLE elementen met klasse "filter-btn"
  // forEach = voor elke gevonden knop, voer de volgende code uit

  btn.addEventListener("click", (e) => {
    // Luister naar klikken op elke filterknop

    const filter = e.target.getAttribute("data-filter");
    // Lees het data-filter attribuut van de geklitte knop
    // bv. data-filter="f-grayscale" → filter = "f-grayscale"
    // bv. data-filter="" → filter = "" (geen filter)

    document.querySelectorAll(".filter-btn").forEach((b) => {
      b.classList.remove("filter-active");
    });
    // Loop over ALLE filterknoppen en verwijder de "filter-active" klasse van elk
    // Dit "reset" de actieve staat van alle knoppen

    e.target.classList.add("filter-active");
    // Voeg "filter-active" toe aan ALLEEN de knop waarop geklikt is
    // Dit markeert visueel welk filter actief is

    const img = document.querySelector(".foto-card img");
    // Zoek het foto-element op de pagina
    // ".foto-card img" = de <img> tag die binnen een element met klasse "foto-card" staat

    if (img) {
      // Controleer of er al een foto op de pagina is

      img.className = "";
      // Verwijder ALLE CSS klassen van de afbeelding
      // Dit verwijdert ook het vorige filter

      if (filter) {
        // Als er een filter gekozen is (niet de lege string "")

        img.classList.add(filter);
        // Voeg de filter-klasse toe aan de afbeelding
        // bv. img.classList.add("f-grayscale")
        // In style.css is .f-grayscale gedefinieerd als filter: grayscale(100%)
      }
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// Event: Download knop
// ════════════════════════════════════════════════════════════════════════════

if (downloadBtn) {
  // Controleer of het element bestaat

  downloadBtn.addEventListener("click", () => {
    // Luister naar klikken op de downloadknop

    const img = document.querySelector(".foto-card img");
    // Zoek de foto op de pagina

    if (!img) {
      return alert("Upload eerst een foto");
      // Als er nog geen foto is, toon een melding en stop
    }

    const canvas = document.createElement("canvas");
    // Maak een nieuw <canvas> element aan in JavaScript (niet zichtbaar op de pagina)
    // Canvas = een "tekenvlak" waarop je pixels kan manipuleren

    const ctx = canvas.getContext("2d");
    // Haal de 2D tekencontext op van de canvas
    // ctx is het object waarmee je dingen KAN tekenen op de canvas

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    // Stel de canvas in op de ECHTE pixels van de originele afbeelding
    // naturalWidth/Height = de werkelijke grootte, niet de weergavegrootte

    ctx.filter = getComputedStyle(img).filter;
    // Lees het huidige CSS filter van de afbeelding (bv. "grayscale(100%)")
    // en pas hetzelfde filter toe op de canvas
    // Zo bevat de gedownloade foto ook het gekozen filter

    ctx.drawImage(img, 0, 0);
    // Teken de afbeelding op de canvas, startend op positie (0,0)
    // Het filter wordt automatisch mee toegepast

    const link = document.createElement("a");
    // Maak een onzichtbare <a> (link) aan in JavaScript

    link.download = "foto.png";
    // Stel de bestandsnaam in die gebruikt wordt bij het downloaden

    link.href = canvas.toDataURL();
    // Zet de volledige canvas (met filter) om naar een downloadbare URL
    // canvas.toDataURL() → "data:image/png;base64,..."

    link.click();
    // Simuleer een klik op de link → de browser start de download
  });
}
