/* BUDIN — global offline interactions. Update only confirmed contact values here. */
window.BUDIN_CONFIG = {
  phone: "+393208327276", // Example format after confirmation: +39 ...
  email: "gregorbudin@gmail.com", // Add the official address after confirmation
  facebook: "https://www.facebook.com/ViniBudin/",
  instagram: "https://www.instagram.com/budin_aziendaagricola/",
  booking: "https://www.booking.com/hotel/it/agriturismo-budin.it.html",
  maps: "https://www.google.com/maps/search/?api=1&query=Localit%C3%A0%20Sales%20122%2C%2034010%20Sales%2C%20Trieste",
};

(() => {
  "use strict";
  const doc = document;
  const body = doc.body;
  const header = doc.querySelector(".site-header");
  const menuButton = doc.querySelector(".menu-toggle");
  const nav = doc.querySelector(".main-nav");
  const topButton = doc.querySelector(".back-to-top");
  let menuLastFocus = null;

  const setScrollState = () => {
    const scrolled = window.scrollY > 35;
    header?.classList.toggle("is-scrolled", scrolled);
    topButton?.classList.toggle("is-visible", window.scrollY > 650);
  };
  setScrollState();
  window.addEventListener("scroll", setScrollState, { passive: true });

  const openMenu = () => {
    if (!menuButton || !nav) return;
    menuLastFocus = doc.activeElement;
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Chiudi menu");
    nav.classList.add("is-open");
    header?.classList.add("menu-open");
    body.classList.add("is-locked");
    nav.querySelector("a")?.focus();
  };
  const closeMenu = (restore = true) => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Apri menu");
    nav.classList.remove("is-open");
    header?.classList.remove("menu-open");
    body.classList.remove("is-locked");
    if (restore && menuLastFocus instanceof HTMLElement) menuLastFocus.focus();
  };
  menuButton?.addEventListener("click", () => menuButton.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu());
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => closeMenu(false)));

  // Current page state works on web servers and with direct file:// opening.
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  doc.querySelectorAll(".main-nav a[data-page]").forEach(link => {
    if (link.dataset.page === page) link.setAttribute("aria-current", "page");
  });

  // Visual language selector, prepared for future translations.
  doc.querySelectorAll(".lang-switch button").forEach(button => {
    button.addEventListener("click", () => {
      doc.querySelectorAll(".lang-switch button").forEach(item => item.setAttribute("aria-pressed", item.dataset.lang === button.dataset.lang ? "true" : "false"));
      const live = doc.querySelector("#site-live");
      if (live) live.textContent = button.dataset.lang === "IT" ? "Italiano selezionato." : `${button.dataset.lang}: traduzione predisposta, contenuti in arrivo.`;
    });
  });

  topButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  doc.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  // Reveal transitions are skipped when the user asks for reduced motion.
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = doc.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealItems.forEach(el => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: "0px 0px -30px" });
    revealItems.forEach(el => observer.observe(el));
  }

  // Fill configurable contact links without inventing public details.
  // const cleanPhone = window.BUDIN_CONFIG.phone.replace(/[^+\d]/g, "");
  // doc.querySelectorAll("[data-contact-phone]").forEach(el => {
  //   const fallback = el.dataset.fallback || "Telefono da confermare";
  //   if (cleanPhone) {
  //     el.textContent = window.BUDIN_CONFIG.phone;
  //     if (el.tagName === "A") el.href = `tel:${cleanPhone}`;
  //   } else {
  //     el.textContent = fallback;
  //     if (el.tagName === "A") {
  //       el.href = "contatti.html#modulo-contatti";
  //       el.dataset.missingContact = "phone";
  //     }
  //   }
  // });
  // doc.querySelectorAll("[data-contact-email]").forEach(el => {
  //   const fallback = el.dataset.fallback || "Email da confermare";
  //   if (window.BUDIN_CONFIG.email) {
  //     el.textContent = window.BUDIN_CONFIG.email;
  //     if (el.tagName === "A") el.href = `mailto:${window.BUDIN_CONFIG.email}`;
  //   } else {
  //     el.textContent = fallback;
  //     if (el.tagName === "A") {
  //       el.href = "contatti.html#modulo-contatti";
  //       el.dataset.missingContact = "email";
  //     }
  //   }
  // });
  document.querySelectorAll("[data-contact-phone]").forEach((el) => {
    el.href = `tel:${window.BUDIN_CONFIG.phone}`;
  });

  document.querySelectorAll("[data-contact-email]").forEach((el) => {
    el.href = `mailto:${window.BUDIN_CONFIG.email}`;
  });

  document.querySelectorAll("[data-facebook]").forEach((el) => {
    el.href = window.BUDIN_CONFIG.facebook;
  });

  document.querySelectorAll("[data-instagram]").forEach((el) => {
    el.href = window.BUDIN_CONFIG.instagram;
  });

  document.querySelectorAll("[data-booking]").forEach((el) => {
    el.href = window.BUDIN_CONFIG.booking;
  });

  document.querySelectorAll("[data-maps]").forEach((el) => {
    el.href = window.BUDIN_CONFIG.maps;
  });


  // Dialog helpers shared by wine details and room lightbox.
  let activeDialog = null;
  let dialogOrigin = null;
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const openDialog = dialog => {
    if (!dialog) return;
    dialogOrigin = doc.activeElement;
    activeDialog = dialog;
    dialog.setAttribute("aria-hidden", "false");
    body.classList.add("is-locked");
    const first = dialog.querySelector(focusableSelector);
    window.setTimeout(() => first?.focus(), 30);
  };
  const closeDialog = dialog => {
    if (!dialog) return;
    dialog.setAttribute("aria-hidden", "true");
    body.classList.remove("is-locked");
    activeDialog = null;
    if (dialogOrigin instanceof HTMLElement) dialogOrigin.focus();
  };
  window.BudinDialog = { open: openDialog, close: closeDialog };
  doc.querySelectorAll(".modal").forEach(modal => {
    modal.querySelectorAll("[data-modal-close]").forEach(el => el.addEventListener("click", () => closeDialog(modal)));
  });
  doc.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (activeDialog) closeDialog(activeDialog);
      else if (menuButton?.getAttribute("aria-expanded") === "true") closeMenu();
    }
    if (event.key === "Tab" && activeDialog) {
      const focusable = [...activeDialog.querySelectorAll(focusableSelector)].filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Room gallery lightbox.
  const lightbox = doc.querySelector("#room-lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxCaption = lightbox?.querySelector("figcaption");
  doc.querySelectorAll("[data-lightbox]").forEach(button => {
    button.addEventListener("click", () => {
      if (!lightbox || !lightboxImage || !lightboxCaption) return;
      lightboxImage.src = button.dataset.full || button.querySelector("img")?.src || "";
      lightboxImage.alt = button.querySelector("img")?.alt || "";
      lightboxCaption.textContent = button.dataset.caption || lightboxImage.alt;
      openDialog(lightbox);
    });
  });

  // Accessible validation and front-end form routing.
  const messages = {
    required: "Questo campo è obbligatorio.",
    email: "Inserisci un indirizzo email valido.",
    privacy: "È necessario accettare l’informativa privacy.",
    dates: "La partenza deve essere successiva all’arrivo."
  };
  const showError = (field, message = "") => {
    field.setAttribute("aria-invalid", message ? "true" : "false");
    const error = field.closest(".field, .check-field")?.querySelector(".field-error");
    if (error) error.textContent = message;
  };
  const validateField = field => {
    let message = "";
    if (field.required && (field.type === "checkbox" ? !field.checked : !field.value.trim())) message = field.type === "checkbox" ? messages.privacy : messages.required;
    if (!message && field.type === "email" && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) message = messages.email;
    showError(field, message);
    return !message;
  };
  doc.querySelectorAll("form[data-budin-form]").forEach(form => {
    form.querySelectorAll("input, select, textarea").forEach(field => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => field.getAttribute("aria-invalid") === "true" && validateField(field));
    });
    const arrival = form.querySelector("[name='arrivo']");
    const departure = form.querySelector("[name='partenza']");
    if (arrival) {
      const today = new Date();
      const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      arrival.min = local;
      if (departure) departure.min = local;
      arrival.addEventListener("change", () => { if (departure) departure.min = arrival.value || local; });
    }
    form.addEventListener("submit", event => {
      event.preventDefault();
      const fields = [...form.querySelectorAll("input, select, textarea")];
      let valid = fields.map(validateField).every(Boolean);
      if (arrival && departure && arrival.value && departure.value && departure.value <= arrival.value) {
        showError(departure, messages.dates);
        valid = false;
      }
      if (!valid) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      const status = form.querySelector(".form-status");
      const data = new FormData(form);
      const title = form.dataset.formTitle || "Richiesta dal sito Budin";
      const bodyText = [...data.entries()].filter(([key]) => key !== "privacy").map(([key, value]) => `${key}: ${value}`).join("\n");
      if (window.BUDIN_CONFIG.formProvider === "mailto" && window.BUDIN_CONFIG.email) {
        location.href = `mailto:${window.BUDIN_CONFIG.email}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(bodyText)}`;
      } else if (window.BUDIN_CONFIG.formEndpoint && ["formspree", "php"].includes(window.BUDIN_CONFIG.formProvider)) {
        fetch(window.BUDIN_CONFIG.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } }).catch(() => { });
      } else if (window.BUDIN_CONFIG.formProvider === "emailjs" && window.emailjs && window.BUDIN_CONFIG.emailjsServiceId && window.BUDIN_CONFIG.emailjsTemplateId) {
        window.emailjs.send(
          window.BUDIN_CONFIG.emailjsServiceId,
          window.BUDIN_CONFIG.emailjsTemplateId,
          Object.fromEntries(data.entries()),
          { publicKey: window.BUDIN_CONFIG.emailjsPublicKey }
        ).catch(() => { });
      }
      if (status) {
        status.textContent = title.toLowerCase().includes("soggiorno")
          ? "Grazie. La tua richiesta è stata preparata correttamente. Verrai ricontattato per verificare disponibilità e condizioni del soggiorno."
          : "Grazie. La tua richiesta è stata preparata correttamente. Verrai ricontattato per ricevere le informazioni richieste.";
        status.classList.add("is-visible");
        status.focus();
      }
      form.reset();
      if (departure) departure.min = arrival?.min || "";
    });
  });

  // Carry a selected wine or topic from catalog links into the contact form.
  const params = new URLSearchParams(location.search);
  const reason = doc.querySelector("#contact-reason");
  const message = doc.querySelector("#contact-message");
  if (reason && params.get("motivo") === "vini") reason.value = "Informazioni sui vini";
  if (message && params.get("vino")) message.value = `Vorrei ricevere informazioni su ${params.get("vino")}.`;
})();
