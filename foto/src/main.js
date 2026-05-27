// main.js is het startpunt van de frontend
// Hier worden alle modules samengebracht en events afgehandeld

// Importeer de Api klasse uit de api module
import { Api } from "./module/api.js";

// Importeer de FotoManager klasse uit de FotoManager module
import { FotoManager } from "./module/FotoManager.js";

// Maak een instantie van Api aan om te communiceren met de backend
const api = new Api();

// Maak een instantie van FotoManager aan, gekoppeld aan het HTML element met id "foto-container"
const manager = new FotoManager("foto-container");

// Observer pattern: registreer een functie die uitgevoerd wordt telkens de fotolijst verandert
// Elke keer als manager.setFotos() wordt aangeroepen, tekent dit automatisch de lijst opnieuw
manager.subscribe((fotos) => {
  manager.tekenLijst(fotos);
});

// Haal de HTML elementen op die we nodig hebben voor events
const fileInput = document.getElementById("file-input"); // het verborgen bestandskiezer inputveld
const uploadTrigger = document.getElementById("upload-trigger"); // de zichtbare uploadknop
const downloadBtn = document.getElementById("download-btn"); // de downloadknop

// ─── App opstarten ─────────────────────────────────────────────────────────────

// initApp wordt aangeroepen bij page-load (eis van de opdracht)
// async betekent dat de functie mag wachten op fetch zonder de pagina te blokkeren
async function initApp() {
  const fotos = await api.getFotos(); // haal bestaande foto's op van de server

  manager.setFotos(fotos); // stel de lijst in → dit triggert automatisch tekenLijst via observer
}

// Start de app onmiddellijk als de pagina laadt
initApp();

// ─── Events afhandelen ─────────────────────────────────────────────────────────

// Klik op de uploadknop → activeer het verborgen file input element
if (uploadTrigger) {
  uploadTrigger.addEventListener("click", () => {
    fileInput.click(); // programmatisch klikken op het file input veld
  });
}

// Wanneer de gebruiker een bestand kiest via de file picker
if (fileInput) {
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0]; // het eerste gekozen bestand

    if (!file) return; // stop als er geen bestand gekozen is

    // FileReader kan een bestand inlezen als base64 data
    const reader = new FileReader();

    // onload wordt uitgevoerd wanneer het bestand volledig ingelezen is
    reader.onload = async (event) => {
      const afbeeldingData = event.target.result; // de base64 string van de afbeelding

      // Maak een foto-object met naam en base64 data
      const nieuweFoto = {
        naam: file.name,
        url: afbeeldingData,
      };

      // Stuur de foto naar de backend via POST
      await api.postFoto(nieuweFoto);

      // Voeg de nieuwe foto toe aan de bestaande lijst en update de weergave
      const nieuweLijst = [...manager.fotos, nieuweFoto]; // spread operator: kopieer lijst + voeg toe
      manager.setFotos(nieuweLijst); // triggert automatisch re-render via observer
    };

    reader.readAsDataURL(file); // start het inlezen van het bestand als base64
  });
}

// ─── Filter knoppen ────────────────────────────────────────────────────────────

// Voeg een click event toe aan elke filterknop
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const filter = e.target.getAttribute("data-filter"); // welk filter is gekozen (bv. "f-grayscale")

    // Verwijder de actieve klasse van alle filterknoppen
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("filter-active"));

    // Zet de actieve klasse op de geklikte knop
    e.target.classList.add("filter-active");

    const img = document.querySelector(".foto-card img"); // het foto element op de pagina

    if (img) {
      img.className = ""; // verwijder alle vorige filter klassen

      if (filter) {
        img.classList.add(filter); // voeg het nieuwe filter toe als CSS klasse
      }
    }
  });
});

// ─── Download knop ─────────────────────────────────────────────────────────────

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const img = document.querySelector(".foto-card img"); // haal de foto op

    if (!img) {
      return alert("Upload eerst een foto"); // stop als er nog geen foto is
    }

    // Canvas gebruiken om de foto met filter erop op te slaan
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d"); // 2D tekencontext van de canvas

    // Stel de canvas grootte in op de echte afmetingen van de foto
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Kopieer het CSS filter van de afbeelding naar de canvas context
    ctx.filter = getComputedStyle(img).filter;

    // Teken de afbeelding op de canvas (inclusief het filter)
    ctx.drawImage(img, 0, 0);

    // Maak een download link aan en klik er automatisch op
    const link = document.createElement("a");
    link.download = "foto.png"; // de bestandsnaam bij download
    link.href = canvas.toDataURL(); // zet de canvas om naar een downloadbare URL
    link.click(); // start de download
  });
}
