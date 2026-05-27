// main.js is het startpunt van de frontend
// Hier worden alle modules samengebracht en events afgehandeld

// Importeer de Api klasse uit de api module
import { Api } from "./module/api.js";

// Importeer de FotoManager klasse uit de FotoManager module
import { FotoManager } from "./module/FotoManager.js";

// Maak een instantie van Api aan om te communiceren met de backend
// new Api() maakt een object aan zodat we getFotos() en postFoto() kunnen gebruiken
const api = new Api();

// Maak een instantie van FotoManager aan, gekoppeld aan het HTML element met id "foto-container"
// new FotoManager() zoekt het container element op en houdt de fotolijst bij
const manager = new FotoManager("foto-container");

// Observer pattern: registreer een functie die uitgevoerd wordt telkens de fotolijst verandert
// subscribe() slaat deze functie op zodat notify() hem later automatisch kan oproepen
// Elke keer als manager.setFotos() wordt aangeroepen, tekent dit automatisch de lijst opnieuw
manager.subscribe((fotos) => {
  manager.tekenLijst(fotos);
});

// Haal de HTML elementen op die we nodig hebben voor events
const fileInput = document.getElementById("file-input"); // het verborgen bestandskiezer inputveld
const uploadTrigger = document.getElementById("upload-trigger"); // de zichtbare uploadknop
const downloadBtn = document.getElementById("download-btn"); // de downloadknop

// ─── App opstarten ─────────────────────────────────────────────────────────────

// async betekent dat de functie mag wachten op fetch zonder de pagina te blokkeren
// zonder async/await zou manager.setFotos() een lege waarde krijgen want de data is nog niet binnen
async function initApp() {
  // await wacht hier totdat de server antwoordt voor we verdergaan
  // zonder await zou fotos een Promise zijn in plaats van de echte data
  const fotos = await api.getFotos();

  // stel de lijst in, dit triggert automatisch tekenLijst() via het observer pattern
  manager.setFotos(fotos);
}

// roep initApp aan zodat de foto's meteen geladen worden bij page-load
initApp();

// ─── Upload knop ───────────────────────────────────────────────────────────────

// klik op de zichtbare knop → activeer het verborgen file input element
// we verbergen het echte input veld omdat het er lelijk uitziet in de browser
if (uploadTrigger) {
  uploadTrigger.addEventListener("click", () => {
    // programmatisch klikken op het verborgen file input zodat de file picker opent
    fileInput.click();
  });
}

// ─── Bestand kiezen ────────────────────────────────────────────────────────────

// wordt uitgevoerd wanneer de gebruiker een bestand kiest via de file picker
if (fileInput) {
  fileInput.addEventListener("change", (e) => {
    // files[0] omdat de index bij 0 begint, we nemen het eerste gekozen bestand
    const file = e.target.files[0];

    // stop als er geen bestand gekozen is, zo crasht de rest van de code niet
    if (!file) return;

    // FileReader kan een bestand inlezen als base64 tekst
    // we hebben base64 nodig omdat fetch geen raw bestanden kan versturen
    const reader = new FileReader();

    // onload wordt uitgevoerd wanneer het bestand volledig ingelezen is
    reader.onload = async (event) => {
      // event.target.result bevat de volledige base64 string van de afbeelding
      const afbeeldingData = event.target.result;

      // maak een foto-object met naam en base64 url
      const nieuweFoto = {
        naam: file.name,
        url: afbeeldingData,
      };

      // stuur de foto naar de backend via POST
      await api.postFoto(nieuweFoto);

      // spread operator: maak een nieuwe array met alle bestaande foto's + de nieuwe erbij
      // we gebruiken spread zodat we de originele array niet rechtstreeks aanpassen
      const nieuweLijst = [...manager.fotos, nieuweFoto];

      // setFotos() slaat de nieuwe lijst op en triggert automatisch tekenLijst() via observer
      manager.setFotos(nieuweLijst);
    };

    // start het inlezen van het bestand, resultaat komt terug in onload hierboven
    reader.readAsDataURL(file);
  });
}

// ─── Filter knoppen ────────────────────────────────────────────────────────────

// querySelectorAll geeft alle knoppen met klasse "filter-btn" terug
// forEach loopt door elke knop zodat we niet voor elke knop apart code moeten schrijven
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // lees het data-filter attribuut van de geklikte knop (bv. "f-grayscale")
    const filter = e.target.getAttribute("data-filter");

    // verwijder de actieve klasse van alle knoppen zodat er maar één actief is
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("filter-active"));

    // zet de actieve klasse op de knop die net geklikt werd
    e.target.classList.add("filter-active");

    // zoek het foto element op de pagina
    const img = document.querySelector(".foto-card img");

    if (img) {
      // verwijder alle vorige filter klassen van de afbeelding
      img.className = "";

      // voeg het nieuwe filter toe als CSS klasse op de afbeelding
      if (filter) {
        img.classList.add(filter);
      }
    }
  });
});

// ─── Download knop ─────────────────────────────────────────────────────────────

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const img = document.querySelector(".foto-card img");

    // stop als er nog geen foto is en toon een melding aan de gebruiker
    if (!img) {
      return alert("Upload eerst een foto");
    }

    // canvas gebruiken omdat CSS filters de echte pixels niet aanpassen
    // op canvas branden we het filter er echt op zodat de download het filter bevat
    const canvas = document.createElement("canvas");
    // "2d" betekent we werken in twee dimensies
    const ctx = canvas.getContext("2d");

    // naturalWidth/naturalHeight is de echte pixelgrootte, niet de weergavegrootte op het scherm
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // lees het CSS filter van de afbeelding uit (bv. "grayscale(100%)")
    // en pas dat filter toe op de canvas context zodat de pixels echt veranderen
    ctx.filter = getComputedStyle(img).filter;

    // teken de afbeelding op de canvas met het filter erop
    ctx.drawImage(img, 0, 0);

    // maak een tijdelijke download link aan
    const link = document.createElement("a");
    // stel de bestandsnaam in voor de download
    link.download = "foto.png";
    // toDataURL() zet de canvas pixels om naar een downloadbare URL
    link.href = canvas.toDataURL();
    // klik automatisch op de link zodat de download start
    link.click();
  });
}
