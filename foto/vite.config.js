// defineConfig importeren zodat we de vite configuratie correct kunnen instellen
// vite is de tool die onze frontend draait tijdens development
import { defineConfig } from "vite";

// exporteer de configuratie zodat vite dit bestand kan inlezen bij opstarten
export default defineConfig({
  // root: "." betekent dat de hoofdmap van het project de huidige map is
  // vite zoekt hier naar index.html om de app te starten
  root: ".",
  server: {
    // poort 5173 is de standaard poort van vite
    // de frontend is bereikbaar via http://localhost:5173
    port: 5173,
  },
});
