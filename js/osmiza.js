(() => {
  "use strict";


  /* =====================================================
     APERTURE

     Gestione:
     from  = primo giorno
     to    = ultimo giorno
     open  = orario apertura
     close = orario chiusura
     ===================================================== */

  const openings = [

    {
      from: "2026-11-04",
      to: "2026-12-13",
      open: "10:00",
      close: "22:00"
    },

    {
      from: "2027-01-29",
      to: "2027-02-07",
      open: "10:00",
      close: "22:00"
    },

    {
      from: "2027-03-05",
      to: "2027-03-14",
      open: "10:00",
      close: "23:00"
    },

    {
      from: "2027-04-02",
      to: "2027-04-11",
      open: "10:00",
      close: "23:00"
    }

  ];


  /* =====================================================
     DOM
     ===================================================== */

  const liveStatus =
    document.querySelector("#liveStatus");

  if (!liveStatus) return;


  const statusPill =
    document.querySelector("#statusPill");

  const statusKicker =
    document.querySelector("#statusKicker");

  const statusTitle =
    document.querySelector("#statusTitle");

  const statusMessage =
    document.querySelector("#statusMessage");

  const todayHours =
    document.querySelector("#todayHours");

  const nextChange =
    document.querySelector("#nextChange");

  const liveClock =
    document.querySelector("#liveClock");

  const openingsList =
    document.querySelector("#openingsList");


  /* =====================================================
     UTILS
     ===================================================== */

  const parseDate = (value) => {

    const [year, month, day] =
      value.split("-").map(Number);

    return new Date(
      year,
      month - 1,
      day
    );

  };


  const parseDateTime = (
    dateValue,
    timeValue
  ) => {

    const [year, month, day] =
      dateValue
        .split("-")
        .map(Number);

    const [hour, minute] =
      timeValue
        .split(":")
        .map(Number);


    return new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      0
    );

  };


  const formatDate = (date) => {

    return new Intl.DateTimeFormat(
      "it-IT",
      {
        day: "numeric",
        month: "long"
      }
    ).format(date);

  };


  const formatShortDate = (date) => {

    return new Intl.DateTimeFormat(
      "it-IT",
      {
        day: "2-digit",
        month: "2-digit"
      }
    ).format(date);

  };


  const formatFullDate = (date) => {

    return new Intl.DateTimeFormat(
      "it-IT",
      {
        weekday: "long",
        day: "numeric",
        month: "long"
      }
    ).format(date);

  };


  openings.sort(
    (a, b) =>
      parseDate(a.from) -
      parseDate(b.from)
  );


  /* =====================================================
     STATO
     ===================================================== */

  function updateStatus() {

    const now = new Date();


    /*
     * Cerca il periodo nel quale cade oggi.
     */

    const currentPeriod =
      openings.find((period) => {

        const start =
          parseDateTime(
            period.from,
            "00:00"
          );

        const end =
          parseDateTime(
            period.to,
            "23:59"
          );

        return (
          now >= start &&
          now <= end
        );

      });


    /*
     * Siamo dentro un periodo di apertura.
     */

    if (currentPeriod) {

      const todayString =
        [
          now.getFullYear(),
          String(
            now.getMonth() + 1
          ).padStart(2, "0"),
          String(
            now.getDate()
          ).padStart(2, "0")
        ].join("-");


      const todayOpening =
        parseDateTime(
          todayString,
          currentPeriod.open
        );


      const todayClosing =
        parseDateTime(
          todayString,
          currentPeriod.close
        );


      /*
       * APERTA ORA
       */

      if (
        now >= todayOpening &&
        now <= todayClosing
      ) {

        liveStatus
          .classList
          .add("is-open");

        liveStatus
          .classList
          .remove("is-closed");


        statusPill.innerHTML = `
          <i aria-hidden="true"></i>
          <span>Aperta ora</span>
        `;


        statusKicker.textContent =
          "Ti aspettiamo";


        statusTitle.textContent =
          "L’osmiza è aperta";


        statusMessage.innerHTML = `
          Oggi siamo aperti fino alle
          <strong>${currentPeriod.close}</strong>.
          Il periodo di apertura continua fino al
          <strong>
            ${formatDate(
              parseDate(currentPeriod.to)
            )}
          </strong>.
        `;


        todayHours.textContent =
          `${currentPeriod.open} – ${currentPeriod.close}`;


        nextChange.textContent =
          `Chiude alle ${currentPeriod.close}`;


        return;
      }


      /*
       * PERIODO ATTIVO MA NON ANCORA APERTA OGGI
       */

      if (now < todayOpening) {

        setClosed();


        statusKicker.textContent =
          "Apriamo oggi";


        statusTitle.textContent =
          `Apriamo alle ${currentPeriod.open}`;


        statusMessage.innerHTML = `
          L’osmiza apre oggi alle
          <strong>${currentPeriod.open}</strong>
          e rimane aperta fino alle
          <strong>${currentPeriod.close}</strong>.
        `;


        todayHours.textContent =
          `${currentPeriod.open} – ${currentPeriod.close}`;


        nextChange.textContent =
          `Apertura ${currentPeriod.open}`;


        return;
      }


      /*
       * ORARIO TERMINATO PER OGGI
       */

      setClosed();


      statusKicker.textContent =
        "Per oggi abbiamo chiuso";


      statusTitle.textContent =
        "Ci vediamo domani";


      statusMessage.innerHTML = `
        L’osmiza riapre domani alle
        <strong>${currentPeriod.open}</strong>.
      `;


      todayHours.textContent =
        `${currentPeriod.open} – ${currentPeriod.close}`;


      nextChange.textContent =
        `Domani ${currentPeriod.open}`;


      return;

    }


    /*
     * NON SIAMO IN UN PERIODO DI APERTURA.
     */

    setClosed();


    const nextPeriod =
      openings.find((period) => {

        return (
          parseDate(period.from) > now
        );

      });


    if (!nextPeriod) {

      statusKicker.textContent =
        "Calendario in aggiornamento";


      statusTitle.textContent =
        "L’osmiza è chiusa";


      statusMessage.textContent =
        "Le nuove date di apertura saranno comunicate presto.";


      todayHours.textContent =
        "Chiuso";


      nextChange.textContent =
        "Da definire";


      return;

    }


    const nextDate =
      parseDate(nextPeriod.from);


    statusKicker.textContent =
      "Prossima apertura";


    statusTitle.textContent =
      "L’osmiza è chiusa";


    statusMessage.innerHTML = `
      La prossima apertura sarà
      <strong>
        ${formatFullDate(nextDate)}
      </strong>
      alle
      <strong>${nextPeriod.open}</strong>.
    `;


    todayHours.textContent =
      "Chiuso";


    nextChange.textContent =
      `${formatDate(nextDate)} · ${nextPeriod.open}`;

  }


  function setClosed() {

    liveStatus
      .classList
      .remove("is-open");

    liveStatus
      .classList
      .add("is-closed");


    statusPill.innerHTML = `
      <i aria-hidden="true"></i>
      <span>Chiusa</span>
    `;

  }


  /* =====================================================
     PROSSIME APERTURE
     ===================================================== */

  function renderOpenings() {

    if (!openingsList) return;


    const now = new Date();


    /*
     * Nascondiamo periodi completamente terminati.
     */

    const future =
      openings.filter((period) => {

        const end =
          parseDateTime(
            period.to,
            period.close
          );

        return end >= now;

      });


    if (!future.length) {

      openingsList.innerHTML = `
        <p class="openings-empty">
          Le prossime date saranno comunicate presto.
        </p>
      `;

      return;

    }


    openingsList.innerHTML =
      future
        .map((period, index) => {

          const from =
            parseDate(period.from);

          const to =
            parseDate(period.to);


          /*
           * Primo periodo futuro evidenziato.
           */

          const current =
            now >=
              parseDateTime(
                period.from,
                "00:00"
              ) &&
            now <=
              parseDateTime(
                period.to,
                "23:59"
              );


          return `
            <article
              class="
                opening-item
                ${current ? "is-current" : ""}
              "
            >

              <span class="opening-item__number">
                ${String(index + 1).padStart(2, "0")}
              </span>


              <div class="opening-item__dates">

                <span>
                  ${formatShortDate(from)}
                </span>

                <i aria-hidden="true">→</i>

                <span>
                  ${formatShortDate(to)}
                </span>

              </div>


              <div class="opening-item__hours">

                <span>Orario</span>

                <strong>
                  ${period.open}
                  –
                  ${period.close}
                </strong>

              </div>


              ${
                current
                  ? `
                    <span class="opening-item__badge">
                      In corso
                    </span>
                  `
                  : ""
              }

            </article>
          `;

        })
        .join("");

  }


  /* =====================================================
     CLOCK TRIESTE
     ===================================================== */

  function updateClock() {

    if (!liveClock) return;


    const time =
      new Intl.DateTimeFormat(
        "it-IT",
        {
          timeZone: "Europe/Rome",
          hour: "2-digit",
          minute: "2-digit"
        }
      )
      .format(new Date());


    liveClock.textContent =
      `Trieste · ${time}`;

  }


  /* =====================================================
     INIT
     ===================================================== */

  updateStatus();

  renderOpenings();

  updateClock();


  setInterval(() => {

    updateClock();

    updateStatus();

  }, 60000);

})();