/* Wine catalog with an embedded fallback for direct file:// use. */
(() => {
  "use strict";
  const fallbackWines = [
    {
      id: "vitovska",
      name: "Vitovska",
      category: "Vino bianco",
      filter: "bianchi",
      description:
        "Vitigno simbolo del Carso, interpretato con uno stile essenziale e territoriale. Un vino pensato per esprimere freschezza, mineralità e il carattere della pietra carsica.",
      notes:
        "Annata, caratteristiche tecniche e disponibilità sono da confermare con l’azienda.",
      price: "Prezzo disponibile su richiesta",
      availability: "Disponibilità da verificare",
      image: "assets/images/vini/bottles_limestone.jpg",
      imageWebp: "assets/images/vini/bottles_limestone.webp",
      position: "34% center",
    },
    {
      id: "malvasia",
      name: "Malvasia",
      category: "Vino bianco",
      filter: "bianchi",
      description:
        "Prodotta da vigneti che beneficiano dell’influenza del mare e della ventilazione del Carso. Un vino aromatico, fresco e avvolgente.",
      notes:
        "Annata, caratteristiche tecniche e disponibilità sono da confermare con l’azienda.",
      price: "Prezzo disponibile su richiesta",
      availability: "Disponibilità da verificare",
      image: "assets/images/vini/bottles_limestone.jpg",
      imageWebp: "assets/images/vini/bottles_limestone.webp",
      position: "47% center",
    },
    {
      id: "terrano",
      name: "Terrano",
      category: "Vino rosso",
      filter: "rossi",
      description:
        "Il rosso più rappresentativo del territorio carsico. Vinificato attraverso fermentazione spontanea e affinato più a lungo in barrique usate.",
      notes:
        "Fermentazione spontanea e affinamento in barrique usate sono informazioni documentate; annata e disponibilità sono da confermare.",
      price: "Prezzo disponibile su richiesta",
      availability: "Disponibilità da verificare",
      image: "assets/images/vini/bottles_limestone.jpg",
      imageWebp: "assets/images/vini/bottles_limestone.webp",
      position: "62% center",
    },
    {
      id: "loza",
      name: "Loza",
      category: "Vino macerato",
      filter: "macerati",
      description:
        "Un vino legato alla memoria familiare, ottenuto principalmente da Vitovska e Malvasia coltivate nello stesso appezzamento. Il nome Loza significa vite ed era anche il nome della vecchia casa dei nonni.",
      notes:
        "Uvaggio storico di Vitovska e Malvasia. Annata e disponibilità sono da confermare con l’azienda.",
      price: "Prezzo disponibile su richiesta",
      availability: "Disponibilità da verificare",
      image: "assets/images/vini/bottles_limestone.jpg",
      imageWebp: "assets/images/vini/bottles_limestone.webp",
      position: "center",
    },
    {
      id: "chardonnay",
      name: "Chardonnay",
      category: "Vino bianco",
      filter: "bianchi",
      description:
        "Una piccola produzione proveniente da una vigna in affitto, affinata in legno per valorizzarne struttura e profondità.",
      notes:
        "Non è presentato come referenza sempre disponibile. Contattare l’azienda per la disponibilità commerciale attuale.",
      price: "Prezzo disponibile su richiesta",
      availability: "Disponibilità da verificare",
      image: "assets/images/vini/bottles_limestone.jpg",
      imageWebp: "assets/images/vini/bottles_limestone.webp",
      position: "78% center",
    },
  ];

  const grid = document.querySelector("#wine-grid");
  const modal = document.querySelector("#wine-modal");
  if (!grid || !modal) return;
  let wines = fallbackWines;
  let activeFilter = "tutti";

  const escape = (value) =>
    String(value).replace(
      /[&<>'"]/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[char],
    );
  const card = (wine) => `
    <article class="wine-card reveal" id="${escape(wine.id)}" data-category="${escape(wine.filter)}">
      <div class="wine-card__image">
        <picture>
          <source srcset="${escape(wine.imageWebp)}" type="image/webp">
          <img src="${escape(wine.image)}" alt="Composizione editoriale di bottiglie su pietra carsica per ${escape(wine.name)}" loading="lazy" style="object-position:${escape(wine.position || "center")}">
        </picture>
      </div>
      <div class="wine-card__body">
        <span class="wine-card__category">${escape(wine.category)}</span>
        <h3>${escape(wine.name)}</h3>
        <p class="wine-card__description">${escape(wine.description)}</p>
        <p class="wine-card__availability">${escape(wine.price)}</p>
        <div class="wine-card__actions">
          <button class="btn btn--ghost" type="button" data-wine-id="${escape(wine.id)}">Dettagli</button>
          <a class="btn" href="contatti.html?motivo=vini&vino=${encodeURIComponent(wine.name)}#modulo-contatti">Richiedi informazioni</a>
        </div>
      </div>
    </article>`;

  const render = () => {
    const shown =
      activeFilter === "tutti"
        ? wines
        : wines.filter((wine) => wine.filter === activeFilter);
    grid.innerHTML = shown.map(card).join("");
    grid
      .querySelectorAll("[data-wine-id]")
      .forEach((button) =>
        button.addEventListener("click", () => openWine(button.dataset.wineId)),
      );
    grid
      .querySelectorAll(".reveal")
      .forEach((el, index) =>
        window.setTimeout(
          () => el.classList.add("is-visible"),
          Math.min(index * 80, 320),
        ),
      );
  };

  const openWine = (id) => {
    const wine = wines.find((item) => item.id === id);
    if (!wine) return;
    modal.querySelector("[data-modal-category]").textContent = wine.category;
    modal.querySelector("[data-modal-name]").textContent = wine.name;
    modal.querySelector("[data-modal-description]").textContent =
      wine.description;
    modal.querySelector("[data-modal-notes]").textContent = wine.notes;
    modal.querySelector("[data-modal-price]").textContent = wine.price;
    modal.querySelector("[data-modal-availability]").textContent =
      wine.availability;
    const image = modal.querySelector("[data-modal-image]");
    image.src = wine.image;
    image.alt = `Composizione editoriale per ${wine.name}`;
    image.style.objectPosition = wine.position || "center";
    const request = modal.querySelector("[data-modal-request]");
    request.href = `contatti.html?motivo=vini&vino=${encodeURIComponent(wine.name)}#modulo-contatti`;
    window.BudinDialog.open(modal);
  };

  document.querySelectorAll("[data-wine-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.wineFilter;
      document.querySelectorAll("[data-wine-filter]").forEach((item) => {
        const on = item === button;
        item.classList.toggle("is-active", on);
        item.setAttribute("aria-pressed", on ? "true" : "false");
      });
      render();
    });
  });

  render();
  if (location.protocol !== "file:") {
    fetch("data/wines.json")
      .then((response) => {
        if (!response.ok) throw new Error("Catalogo non disponibile");
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          wines = data;
          render();
        }
      })
      .catch(() => {
        /* embedded data already rendered */
      });
  }
})();
