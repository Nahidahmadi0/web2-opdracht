# Foto Filter App

## Wat heb ik gebouwd?

Ik heb een kleine webapp gemaakt waar je foto's kan uploaden en filters kan geven aan foto's.

Je kan:
- foto's uploaden
- filters toepassen
- foto's downloaden
- foto's bewaren via backend
- foto's terugzien na refresh

Ik gebruikte:
- Express voor backend
- Vite voor frontend
- JavaScript classes
- modules
- fetch API

---

# Hoe starten?

## Backend

Open terminal:

```bash
npm install
node server.js
```

## Frontend

Open tweede terminal:

```bash
npm install
npm run dev
```

---

# Uitleg voor mondelinge vragen

## Waarom classes?

Ik gebruikte classes om mijn code beter te organiseren.

`UIElement` is de basisclass.

`Foto` erft daarvan via `extends`.

Zo toon ik dat ik inheritance begrijp.

---

## Waarom modules?

Ik splitste mijn code op zodat alles overzichtelijk blijft.

- `api.js` = communicatie met backend
- `FotoManager.js` = rendering en classes
- `main.js` = events en opstarten

---

## Waarom fetch?

Met fetch haal ik data op van de backend API.

GET haalt foto's op.
POST voegt foto's toe.

---

## Waarom localStorage?

Als de backend offline is blijven de foto's toch zichtbaar.

Dat is een fallback systeem.

---

## Waarom observer pattern?

Wanneer de lijst verandert moet de pagina automatisch opnieuw renderen.

Daarom gebruikte ik:
- subscribe()
- notify()

Dat is het observer pattern.

---

# Belangrijke code uitgelegd

## 1. extends

```js
export class Foto extends UIElement
```

Hier maakt de Foto class gebruik van inheritance.

De Foto class krijgt eigenschappen van UIElement.

---

## 2. super()

```js
super(naam);
```

Hier roep ik de constructor van de parent class op.

---

## 3. createElement

```js
document.createElement("div");
```

Hier maak ik dynamisch HTML vanuit JavaScript.

---

## 4. addEventListener

```js
btn.addEventListener("click", ...)
```

Hier reageert de app op gebruikersacties.

---

## 5. fetch

```js
fetch(`${this.baseUrl}/fotos`)
```

Hier haal ik data op van de backend.

---

## 6. localStorage

```js
localStorage.setItem("fotos", JSON.stringify(data));
```

Hier sla ik data lokaal op in de browser.

---

## 7. notify()

```js
this.notify(this.fotos);
```

Dit zorgt ervoor dat alle subscribers opnieuw renderen wanneer data verandert.
