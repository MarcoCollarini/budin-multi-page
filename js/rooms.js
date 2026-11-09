/* Room cards with an embedded fallback for direct file:// use. */
(() => {
  "use strict";
  const fallbackRooms = [
    {
      id: "camera-matrimoniale",
      name: "Camera matrimoniale",
      description:
        "",
      features: ["21 m²", "Cucina", "Bagno privato", "Vista montagna"],
      note: "",
      image: "assets/images/stanze/living_kitchen.jpg",
      imageWebp: "assets/images/stanze/living_kitchen.webp",
    },
    {
      id: "camera-matrimoniale-terrazzo",
      name: "Camera matrimoniale con Terrazza",
      description:
        "",
      features: [
        "23 m²",
        "Bagno privato",
        "Cucina",
        "Vista montagna",
        "Terrazza",
      ],
      note: "",
      image: "assets/images/stanze/room_natural.jpg",
      imageWebp: "assets/images/stanze/room_natural.webp",
    },
    {
      id: "camera-deluxe",
      name: "Camera matrimoniale deluxe",
      description:
        "",
      features: [
        "35 m²",
        "Bagno privato",
        "Cucina",
        "Vista montagna",
        "Terrazza",
      ],
      note: "",
      image: "assets/images/stanze/panoramic_hall.jpg",
      imageWebp: "assets/images/stanze/panoramic_hall.webp",
    },
  ];
  const list = document.querySelector("#room-list");
  if (!list) return;
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
  const render = (rooms) => {
    list.innerHTML = rooms
      .map(
        (room) => `
        <article class="room-card reveal" id="${escape(room.id)}">

          <div class="room-card__media">
            <picture>
              <source
                srcset="${escape(room.imageWebp)}"
                type="image/webp"
              >

              <img
                src="${escape(room.image)}"
                alt="${escape(room.name)} negli spazi dell’agriturismo"
                loading="lazy"
              >
            </picture>
          </div>

          <div class="room-card__body">

            <p class="eyebrow">
              Ospitalità Budin
            </p>

            <h3>${escape(room.name)}</h3>

            <p>${escape(room.description)}</p>

            <ul class="room-features">
              ${room.features
            .map(
              (feature) => `<li>${escape(feature)}</li>`
            )
            .join("")}
            </ul>

            <p class="room-note">
              ${escape(room.note)}
            </p>

            <div class="room-card__actions">

              <a
                class="btn btn-secondary"
                href="contatti.html#modulo-contatti"
              >
                Richiedi informazioni
              </a>

              <a
                class="btn" target="_blank"
                href="https://www.booking.com/hotel/it/agriturismo-budin.it.html"
              >
                Prenota
              </a>

            </div>

          </div>

        </article>
      `,
      )
      .join("");

    list
      .querySelectorAll(".reveal")
      .forEach((el, index) =>
        window.setTimeout(
          () => el.classList.add("is-visible"),
          Math.min(index * 100, 300),
        ),
      );
  };
  render(fallbackRooms);
  if (location.protocol !== "file:") {
    fetch("data/rooms.json")
      .then((response) => {
        if (!response.ok) throw new Error("Alloggi non disponibili");
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length) render(data);
      })
      .catch(() => { });
  }
})();
