# BUDIN – Azienda Agricola / Kmetija

Sito multipagina premium, responsive e utilizzabile offline per la cantina e l’agriturismo Budin a Sales, nel Carso triestino.

## Avvio rapido

### Modalità completamente offline

1. Decomprimi il progetto.
2. Apri `index.html` con un browser moderno.
3. Navigazione, cataloghi, galleria, modali e validazione funzionano anche con protocollo `file://`.

I browser possono bloccare `fetch()` sui file locali. Per questo `js/wines.js` e `js/rooms.js` includono una copia di fallback dei dati JSON.

### Modalità server locale consigliata

Da terminale, nella cartella del progetto:

```bash
python3 -m http.server 8000
```

Poi visita `http://localhost:8000/`.

Non sono richiesti build, framework, CDN o installazioni npm.

## Struttura

- `index.html` — home
- `storia.html` — storia della famiglia e linea temporale
- `vini.html` — catalogo con filtri e modal
- `stanze.html` — galleria, alloggi e richiesta soggiorno
- `contatti.html` — recapiti, mappa statica, modulo e testi legali provvisori
- `css/style.css` — design system e responsive design
- `js/main.js` — configurazione, menu, modali, moduli, lightbox e interazioni globali
- `js/wines.js` — catalogo vini e fallback offline
- `js/rooms.js` — alloggi e fallback offline
- `data/wines.json` — dati vini modificabili
- `data/rooms.json` — dati alloggi modificabili
- `assets/images/` — immagini JPG e WebP
- `assets/logo/` e `assets/icons/` — marchio e icone locali

## 1. Sostituire le immagini

Le immagini dimostrative sono originali e generate per questa anteprima. Sono coerenti con il Carso ma **non documentano gli spazi, le persone o i prodotti reali dell’azienda**. Prima della pubblicazione vanno sostituite con fotografie ufficiali approvate da Budin.

Per ogni immagine esistono due file con lo stesso nome:

- `.webp` per i browser moderni;
- `.jpg` come fallback.

Mantieni nomi e cartelle per non modificare l’HTML. In alternativa aggiorna i percorsi nei file HTML e JSON. Formati consigliati:

- hero e paesaggi: 1600 × 1067 px o superiore;
- stanze e galleria: almeno 1400 px sul lato lungo;
- ritratti e bottiglie verticali: rapporto 2:3 o 3:4;
- JPG qualità 80–85, WebP qualità 75–82.

## 2. Modificare telefono, email e social

Apri `js/main.js` e aggiorna `window.BUDIN_CONFIG`:

```js
window.BUDIN_CONFIG = {
  phone: "+39 ...",
  email: "...@...",
  facebook: "https://www.facebook.com/ViniBudin/",
  maps: "https://www.google.com/maps/search/?api=1&query=...",
  formProvider: "mailto",
  formEndpoint: "",
  emailjsServiceId: "",
  emailjsTemplateId: "",
  emailjsPublicKey: ""
};
```

Telefono ed email restano volutamente vuoti fino alla conferma dell’azienda. Non inserire chiavi private nel frontend.

## 3. Aggiornare vini e prezzi

Modifica `data/wines.json`. Ogni voce usa:

- `id`: identificatore univoco senza spazi;
- `name`: nome del vino;
- `category`: categoria visibile;
- `filter`: `bianchi`, `rossi` o `macerati`;
- `description` e `notes`;
- `price`: prezzo o dicitura “Prezzo disponibile su richiesta”;
- `availability`;
- `image` e `imageWebp`;
- `position`: ritaglio CSS opzionale.

Per mantenere il funzionamento aprendo direttamente i file, aggiorna anche l’array `fallbackWines` in `js/wines.js` con gli stessi dati.

Non pubblicare prezzi, annate, gradazioni, disponibilità o caratteristiche tecniche prima della conferma.

## 4. Aggiornare alloggi e dotazioni

Modifica `data/rooms.json`:

- `id` e `name`;
- `description`;
- `features`;
- `note`;
- `image` e `imageWebp`.

Aggiorna anche `fallbackRooms` in `js/rooms.js` per il fallback `file://`.

Le denominazioni correnti sono volutamente neutrali. Confermare nomi ufficiali, capienza, configurazioni, accessibilità, servizi, dotazioni e disponibilità.

## 5. Collegare i moduli email

I moduli non simulano una prenotazione confermata. Preparano una richiesta e possono essere instradati in quattro modi.

### Mailto — fallback più semplice

In `js/main.js`:

```js
formProvider: "mailto",
email: "indirizzo-ufficiale@dominio.it"
```

Il browser apre il programma email dell’utente.

### Formspree

```js
formProvider: "formspree",
formEndpoint: "https://formspree.io/f/ID-CONFERMATO"
```

### EmailJS

1. Aggiungi localmente il client ufficiale EmailJS oppure caricalo solo nella versione online.
2. Configura `formProvider: "emailjs"`.
3. Inserisci service ID, template ID e public key nei campi predisposti.
4. Non inserire mai chiavi private.

### Endpoint PHP futuro

```js
formProvider: "php",
formEndpoint: "/api/richiesta.php"
```

L’endpoint deve validare e sanificare i dati lato server, applicare protezione anti-spam, inviare l’email e restituire un esito JSON. Prima della pubblicazione va aggiunta una gestione di successo/errore collegata alla risposta reale del backend.

## 6. Informazioni da confermare prima della pubblicazione

- telefono ed email ufficiali;
- ragione sociale completa, partita IVA/codice fiscale e dati obbligatori;
- nome e ruolo dei referenti;
- testi definitivi di privacy policy, cookie policy e note legali;
- consenso e diritti d’uso per tutte le fotografie;
- URL social e Google Maps definitivi;
- configurazioni, nomi, capienza, prezzi e dotazioni delle tre camere/alloggi;
- accessibilità fisica e servizi disponibili;
- modalità e orari di visite, degustazioni, osmiza e soggiorni;
- listino, annate e disponibilità dei vini;
- schede tecniche, processi produttivi e ogni eventuale certificazione;
- disponibilità commerciale attuale di Chardonnay e Merlot;
- dati strutturati Schema.org dopo la conferma dei dati aziendali.

## Accessibilità e responsive

Il progetto include HTML semantico, skip link, focus visibile, menu e modali da tastiera, focus trap, chiusura con `Escape`, testi alternativi, campi di almeno 44 px, contrasto elevato, `prefers-reduced-motion`, lazy loading e layout da 320 a 1920 px.

## Nota editoriale

Le informazioni aziendali inserite seguono il brief: attività ripresa nel 2015, nuova struttura dal 2020, apertura dell’agriturismo alla fine del 2022, circa 3,5 ettari, cantina su due livelli sotterranei, tre camere, vitigni e vini indicati. Quantità, prezzi e servizi non confermati non vengono presentati come attuali o certi.
