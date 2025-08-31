import { durationConverter } from "../utils/duration-converter.js";
import { convertToMinutes } from "../utils/getMinutes.js";
import { isSameDay } from "../utils/isSameDay.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :root {
      --primary-color: #ffa500;
      --secondary-color: #ffb733;
      --text-color: white;
      --bg-color: rgb(22, 22, 22);

      --black-text: black;
      --gray-text: gray;
      --white-text: white;
    }
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }

    .movie {
      display: flex;
      max-width: 750px;
      gap: 1rem;
      border-left: 5px rgb(228, 155, 15) dashed;
      border-top: 2px rgb(228, 155, 15) solid;
      border-right: rgb(228, 155, 15) solid;
      border-bottom: rgb(228, 155, 15) solid;
      border-radius: 1em;
      padding: 1.5rem 0.8rem;
      transition: all 0.3s ease;
      box-shadow: 0 0 20px rgb(228, 155, 15), 0 0 40px rgba(255, 255, 255, 0.1),
        0 8px 16px rgba(255, 255, 255, 0.08);

      & .poster {
        min-width: 40%;
        max-width: 300px;
        max-height: 700px;
        aspect-ratio: 3 / 4;

        & img {
          border-radius: 1em;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      & .info-details {
        color: var(--gray-text);
      }

      /*
      & .title-flex {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        gap: 0.4rem;
      }*/

      & .title {
        display: inline;
        letter-spacing: 0.1rem;
        color: var(--white-text);
      }

      & .info .caption {
        margin: 1.3rem 0;
        margin-right: 0.5rem;
        color: var(--white-text);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      & .info .cast {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      & .info .duration {
        margin-bottom: 0.5rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      & .duration-text {
        display: inline-block;
      }
    }

    .movie:hover {
      transform: translateY(-20px);
      box-shadow: 0 0 40px rgba(255, 255, 255, 0.4),
        0 0 80px rgba(255, 255, 255, 0.2), 0 12px 24px rgba(255, 255, 255, 0.1);
    }
    .info {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .location {
      display: inline-block;
      background-color: var(--secondary-color);
      color: var(--black-text);
      padding: 0 10px;
      border-radius: 0.5em;
      backdrop-filter: blur(10px);
      font-size: 0.9rem;
    }

    .showtime-details {
      min-height: 50%;
      & .button-group {
        display: flex;
        flex-wrap: wrap;
        margin: 1rem 0 1.2rem;
        gap: 8px;
      }

      & .timetable-container {
        position: relative;
        & .selected-date {
          position: absolute;
          top: -1px;
          right: 0;
          font-size: 0.9rem;
          color: var(--gray-text);
          margin-right: 1.3rem;
          & .mo-day,
          .garig {
            font-size: 1rem;
            color: var(--primary-color);
          }
        }
      }

      & .time-button,
      .show-all-times {
        height: 2rem;
        padding: 0.4rem 1rem;
        border: 2px solid #ccc;
        border-radius: 8px;
        background-color: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--white-text);
        font-size: 0.85rem;
      }

      & .time-button:hover {
        border-color: #e49b0f;
        background-color: var(--secondary-color);
        color: var(--black-text);
        & svg {
          color: #ffff8f;
        }
        & .colored {
          color: var(--white-text);
        }
      }

      & .time-button.active {
        background-color: #e49b0f;
        color: black;
        border-color: #e49b0f;
        opacity: 1;
        & svg {
          color: white;
        }
        & .colored {
          color: var(--white-text);
        }
      }

      & .show-all-times {
        display: inline-flex;
        align-items: center;
        opacity: 0.6;
        & svg {
          color: var(--primary-color);
        }
        & .colored {
          color: #ffbf00;
        }
      }

      & .time-button .colored {
        color: var(--primary-color);
      }

      & .show-all-times:hover {
        opacity: 1;
        & .colored {
          color: var(--black-text);
        }
      }
      & .show-all-times.active {
        color: var(--black-text);
        & .colored {
          color: var(--black-text);
        }
      }

      & .show-less-times {
        padding-left: 2px;
        padding-top: 10px;
        font-size: 0.8rem;
        background-color: transparent;
        border: none;
        cursor: pointer;
        color: var(--primary-color);
      }

      & #forbidden {
        cursor: not-allowed;
        opacity: 0.5;
      }

      & .schedule {
        display: flex;
        flex-wrap: wrap;
      }

      & .day,
      .schedule {
        margin: 0.5rem 0;
      }

      & .branch {
        margin: 0.8rem 0;
        & p {
          font-size: 1rem;
          font-weight: bold;
        }
      }

      & .time {
        margin: 0.4rem;
        padding: 0 10px;
        border: 1px rgb(228, 155, 15) solid;
        border-radius: 0.5em;
        backdrop-filter: blur(10px);
        font-size: 1.2rem;
        line-height: 1.5rem;
        color: white;
        text-decoration: none;
        transition: 0.1s ease-in-out;
      }

      & .time:hover {
        background-color: rgba(228, 155, 15, 0.8);
      }
    }

    .lang {
      display: flex;
      align-items: center;
      // & .flag-container {
      //   max-height: 18px;
      //   max-width: 20px;

      //   & img {
      //   height: 18px;
      //     object-fit: contain;
      //   }
      }
    }

    .gray {
      /* opacity: 0.5; */
      color: var(--white-text);
    }
    .rating {
      display: inline-block;
      font-size: 0.8rem;
      font-family: "Roboto Condensed";
      letter-spacing: normal;
      color: var(--white-text);
      padding: 0 10px;
      border-radius: 0.5em;
      backdrop-filter: blur(10px);
    }

    .age-pg13,
    .PG-13 {
      background-color: rgba(233, 0, 78, 0.5);
    }

    .age-pg,
    .PG {
      background-color: rgba(27, 233, 0, 0.5);
    }

    .age-g,
    .G {
      background-color: rgba(27, 233, 0, 0.5);
    }

    .age-r,
    .R {
      background-color: rgba(255, 5, 5, 0.5);
    }

    .mobile-poster {
      display: none;
    }

    .notice-no-today {
      font-size: 0.9rem;
      margin: 1rem;
      opacity: 0.8;
      & .tomorrow {
        color: var(--primary-color);
      }
    }

    #touch .time-button:hover {
      background-color: transparent;
      color: var(--white-text);
      border-color: #ccc;
      & .colored {
        color: var(--primary-color);
      }
    }

    #touch .time-button.active {
        background-color: #e49b0f;
        color: black;
        border-color: #e49b0f;
        opacity: 1;
        & svg {
          color: white;
        }
        & .colored {
          color: var(--white-text);
        }
      }

    #touch .time:hover {
      background-color: transparent;
    }

    @media (max-width: 750px) {
      .selected-date {
        & .desktop {
          display: none;
        }
      }
    }

    @media (max-width: 695px) {
      .movie {
        padding: 1.5rem 1.5rem;
        max-width: 500px;
      }
      .mobile-poster {
        display: block;
        max-height: 220px;
        min-height: 220px;
        aspect-ratio: 3 / 4;
      }
      .desktop-poster {
        display: none;
      }
      .info-details {
        display: flex;
        gap: 1rem;
      }
      .info-text {
        font-size: clamp(0.8rem, 3vw, 1rem);
      }
      .rating {
        font-size: clamp(0.6rem, 2.5vw, 0.8rem);
      }
      .selected-date {
        margin-right: 0 !important;
      }
    }

    @media (max-width: 470px) {
      .time-button, .show-all-times {
        padding: 0.2rem 0.7rem !important;
      }
    }

    @media (max-width: 440px) {
      .time-button {
        max-height: 2rem;
        font-size: 0.8rem !important;
      }
      .selected-date {
        font-size: 0.9rem;
        top: 0;
      }
      .show-all-times {
        max-height: 2rem;
        font-size: 0.8rem !important;
      }
    }

    @media (max-width: 425px) {
      .mobile-poster {
        max-height: 180px;
        min-height: 180px;
        margin: auto 0;
      }
      .info-text {
        font-size: clamp(0.7rem, 3vw, 1rem);
      }
      .info {
        .title {
          margin-bottom: 0;
        }
        .caption {
          margin: 0.8rem 0 !important;
        }
      }
      .time {
        font-size: clamp(0.7rem, 4vw, 1rem) !important;
      }
      .time-button, .show-all-times {
        font-size: clamp(0.6rem, 3vw, 0.8rem) !important;
      }
    }

    @media (max-width: 381px) {
      .selected-date {
        position: static !important;
        text-align: center;
      }
    }

    @media (max-width: 350px) {
      #cast {
        display: none;
      }
      .lang {
        display: none;
      }
      .timetable-container {
        max-height: 265px;
        overflow: scroll;
      }
    }

    @media (max-width: 340px) {
      .duration-caption {
        display: none;
      }
      .duration-text {
        color: var(--gray-text);
      }
    }

    @media (max-width: 305px) {
      .mobile-poster {
        max-height: 120px;
        min-width: 120px;
        margin: 0 auto;
      }
      .info-text {
        display: none;
      }
    }
  </style>
  <div class="poster desktop-poster">
    <img />
  </div>
  <div class="info">
    <div class="info-details">
      <div class="mobile-poster">
        <div class="poster">
          <img />
        </div>
      </div>
      <div class="info-text">
        <div class="title-flex">
          <h2 class="title"></h2>
          <sup class="rating"></sup>
        </div>
        <p class="caption"></p>
        <p class="cast" id="cast">
          <span class="white">Гол дүр:</span>
          <span class="gray"></span>
        </p>
        <p class="duration">
          <span class="duration-caption">Үргэлжлэх хугацаа:</span>
          <span class="gray duration-text"></span>
        </p>
        <p class="lang">
          <svg
            class="cc-icon gray"
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="white"
          >
            <path
              d="M200-160q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h560q33 0 56.5 23.5T840-720v480q0 33-23.5 56.5T760-160H200Zm0-80h560v-480H200v480Zm80-120h120q17 0 28.5-11.5T440-400v-40h-60v20h-80v-120h80v20h60v-40q0-17-11.5-28.5T400-600H280q-17 0-28.5 11.5T240-560v160q0 17 11.5 28.5T280-360Zm280 0h120q17 0 28.5-11.5T720-400v-40h-60v20h-80v-120h80v20h60v-40q0-17-11.5-28.5T680-600H560q-17 0-28.5 11.5T520-560v160q0 17 11.5 28.5T560-360ZM200-240v-480 480Z"
            />
          </svg>
          <span class="gray flag-container"></span>
        </p>
      </div>
    </div>
    <div class="showtime-details">
      <div class="button-group">
        <button class="time-button active" id="day-0">ӨНӨӨДӨР</button>
        <button class="time-button" id="day-1">МАРГААШ</button>
        <button class="show-all-times">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="currentColor"
          >
            <path
              d="M421-421H206v-118h215v-215h118v215h215v118H539v215H421v-215Z"
            />
          </svg>
          БҮХ ЦАГ (<span></span>)
        </button>
      </div>
      <div class="timetable-container">
      </div>
      </div>
    </div>
  </div>
`;

export class MovieCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.container = document.createElement("article");
    this.container.classList.add("movie");

    this.shadowRoot.appendChild(this.container);
    this.container.appendChild(template.content.cloneNode(true));

    this.cast = [];
    this.genres = [];
    this.showtimes = {};
    this.allowedPreorderDays = 3;
    this.startDate = new Date();
    this.endDate = new Date();
    this.branches = [];
    this.mongolianWeekdays = [
      "Ням",
      "Даваа",
      "Мягмар",
      "Лхагва",
      "Пүрэв",
      "Баасан",
      "Бямба",
    ];
  }

  static get observedAttributes() {
    return [
      "id",
      "title",
      "description",
      "duration",
      "poster_url",
      "age_rating",
      "cc",
      "imdb_rating",
    ];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (attr === "title") {
      this.container.querySelector(".title").textContent = newVal;
    }
    if (attr === "description") {
      this.container.querySelector(".caption").textContent = newVal;
    }
    if (attr === "duration") {
      this.container.querySelector(".duration-text").textContent =
        durationConverter(newVal);
    }
    if (attr === "poster_url") {
      this.container
        .querySelectorAll(".poster img")
        .forEach((img) => (img.src = newVal));
      this.container
        .querySelectorAll(".poster img")
        .forEach((img) => (img.alt = `${newVal}'s poster`));
    }
    if (attr === "age_rating") {
      this.container.querySelector(".rating").textContent = newVal;
      this.container
        .querySelector(".title-flex .rating")
        .classList.add(`${newVal}`);
    }
    if (attr === "cc") {
      this.container.querySelector(".lang span").textContent = `${
        newVal === "mongolian" ? "Монгол хэл" : "Англи хэл"
      }`;
      // this.container.querySelector(".lang .flag-container").innerHTML = `<img src="./pics/mongolia-flag.png" alt="flag of mongolia" height="20px" width="20px">`;
    }
  }

  connectedCallback() {
    this.renderCast();
    if (!this.hasMovieStartedHandler()) return;
    this.renderShowtimes(0);
    this.renderButtons();
    this.noTouchScreenHandler();

    if (this.container.querySelector(".timetable-container .branch") === null) {
      if (
        this.container.querySelector(".time-button.active") &&
        this.container.querySelector(".button-group #day-1")
      ) {
        this.container
          .querySelector(".time-button.active")
          .classList.remove("active");
        this.container.querySelector(".button-group #day-0").remove();
        this.container
          .querySelector(".button-group #day-1")
          .classList.add("active");
        this.renderShowtimes(1);
        const parent = this.container.querySelector(".showtime-details");
        const newChild = document.createElement("div");
        newChild.classList.add("notice-no-today");
        newChild.innerHTML = `<span class="info-icon">ⓘ</span> Өнөөдрийн цаг дууссан. <span class="tomorrow">Маргаашийн цагийг</span> харуулж байна.`;
        parent.insertBefore(newChild, parent.firstChild);
      }
    }

    this.container
      .querySelector(".showtime-details")
      .addEventListener("click", (e) => {
        const btn = e.target.closest("[data-day]");
        if (!btn) return;
        const branch = btn.dataset.branch;
        const hall = btn.dataset.hall;
        const day = btn.dataset.day;
        const hour = btn.dataset.hour;
        this.dispatchEvent(
          new CustomEvent("time-selected", {
            detail: {
              movieTitle: this.getAttribute("title"),
              movieId: this.getAttribute("id"),
              branch,
              hall,
              day,
              hour,
            },
            bubbles: true,
            composed: true,
          })
        );
      });
  }

  renderCast() {
    this.container.querySelector(".cast .gray").textContent =
      this.cast.join(", ");
  }

  renderShowtimes(day) {
    const today = new Date();

    const currentDay = new Date(today);
    currentDay.setDate(currentDay.getDate() + day);
    const currentTime = today.getHours() * 60 + today.getMinutes();

    const currentDayName = currentDay
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const todayShowtimes = this.container.querySelector(
      ".showtime-details .timetable-container"
    );
    todayShowtimes.innerHTML = "";

    const selectedDateConstructor = document.createElement("div");
    selectedDateConstructor.classList.add("selected-date");
    selectedDateConstructor.innerHTML = `
    Сонгогдсон<span class="desktop"> өдөр</span>:
    <span class="mo-day"></span> <span class="garig"></span>
    `;
    const selectedDate = todayShowtimes.appendChild(selectedDateConstructor);

    for (let i = 0; i < this.branches.length; i++) {
      const branchConstructor = document.createElement("div");
      branchConstructor.classList.add("branch", `branch-${i + 1}`);
      branchConstructor.innerHTML = `<p>${this.branches[i].name} <span class="location">${this.branches[i].location}</span></p><div class="schedule"></div>`;
      const branch = todayShowtimes.appendChild(branchConstructor);
      const hall = this.showtimes[`branch${i + 1}`]?.hallId;
      const showtimes =
        this.showtimes?.[`branch${i + 1}`]?.schedule?.[currentDayName];
      if (isSameDay(currentDay, today)) {
        branch.querySelector(".schedule").innerHTML = showtimes
          ? showtimes
              .map((time) =>
                /^[0-2][0-9]:[0-5][0-9]$/.test(time) &&
                convertToMinutes(time) >= currentTime + 30
                  ? `<a href="#" class="time" data-day="${currentDay
                      .toISOString()
                      .slice(0, 10)}" data-hour="${time}" data-branch="${
                      i + 1
                    }" data-hall="${hall}">${time}</a>`
                  : ``
              )
              .join("")
          : `<span class="time" style="opacity: 0.6; cursor: not-allowed">Цаг тавигдаагүй</span>`;
        if (branch.querySelector(".schedule").innerHTML === "") {
          branch.remove();
        }
      } else {
        branch.querySelector(".schedule").innerHTML = showtimes
          ? showtimes
              .map(
                (time) =>
                  `<a href="#" class="time" data-day="${currentDay
                    .toISOString()
                    .slice(0, 10)}" data-hour="${time}" data-branch="${
                    i + 1
                  }" data-hall="${hall}">${time}</a>`
              )
              .join("")
          : `<span class="time" style="opacity: 0.6; cursor: not-allowed">Цаг тавигдаагүй</span>`;
        if (branch.querySelector(".schedule").innerHTML === "") {
          branch.remove();
        }
      }
    }

    if (todayShowtimes.querySelector(".branch") === null) {
      todayShowtimes.innerHTML = `
        <p style="font-style: italic;"><span style="opacity: 0.5">Захиалга байхгүй байна.</span> <span class="select-other-day" style="color:orange; cursor:pointer;">Өөр өдөр сонгоно уу.</span></p>
      `;
      todayShowtimes
        .querySelector(".select-other-day")
        .addEventListener("click", () => {
          if (this.container.querySelector(".show-all-times")) {
            this.renderMoreButtons();
          } else {
            this.renderButtons("tomorrow");
          }
        });
    }

    const selectedDateMoDay = selectedDate.querySelector(".mo-day");
    const selectedDateGarig = selectedDate.querySelector(".garig");

    selectedDateMoDay.innerHTML = `${
      currentDay.getMonth() + 1
    }/${currentDay.getDate()}`;
    selectedDateGarig.innerHTML = `${
      this.mongolianWeekdays[currentDay.getDay()]
    }`;
  }

  renderButtons(activeChangeIndex = -1) {
    this.timeButtons = Array.from(
      this.container.querySelectorAll(".time-button")
    );

    if (
      activeChangeIndex !== -1 &&
      !this.container.querySelector(".time-button.active")
    ) {
      this.timeButtons.forEach((button) => {
        button.classList.remove("active");
      });
      this.timeButtons[activeChangeIndex].classList.add("active");
      this.renderShowtimes(activeChangeIndex);
    }

    if (activeChangeIndex === "tomorrow") {
      this.timeButtons.forEach((button) => {
        button.classList.remove("active");
      });
      if (this.timeButtons[1]) {
        this.timeButtons[1].classList.add("active");
        this.renderShowtimes(1);
      } else {
        this.timeButtons[0].classList.add("active");
        this.renderShowtimes(0);
        alert(
          "Тухайн үзвэрт нэмэлт захиалга байхгүй байна. Та маргааш дахин оролдоно уу."
        );
      }
    }

    let activeButton =
      this.container.querySelector(".time-button.active") ||
      this.timeButtons[0];
    this.timeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        if (e.target.closest(".time-button") !== activeButton) {
          activeButton.classList.remove("active");
          e.target.closest(".time-button").classList.add("active");
          activeButton = e.target.closest(".time-button");
          const day = parseInt(
            e.target.closest(".time-button").id.split("-")[1]
          );
          this.renderShowtimes(day);
        }
      });
    });

    if (this.container.querySelector(".show-all-times")) {
      if (this.allowedPreorderDays > 2) {
        this.container
          .querySelector(".show-all-times")
          .addEventListener("click", () => {
            setTimeout(() => {
              this.renderMoreButtons();
            }, 0);
          });
        this.container.querySelector(".show-all-times span").textContent =
          this.allowedPreorderDays - 2;
      } else if (this.allowedPreorderDays === 2) {
        this.container.querySelector(".show-all-times").remove();
      } else if (this.allowedPreorderDays === 1) {
        this.container.querySelector(".show-all-times").remove();
        this.container
          .querySelector(".showtime-details .button-group #day-1")
          .remove();
      } else if (this.allowedPreorderDays === 0) {
        this.container.querySelector(".desktop-poster").style.maxHeight =
          "350px";
        this.container.querySelector(".showtime-details").innerHTML = `<div
          style="display:flex;justify-content:center;align-items:center;padding-top:1rem;text-align:center;cursor:not-allowed;height:100%;"
        >
          <span
            ><h3 style="">Тасалбарын хуваарь тавигдаагүй байна.</h3>
            <p>☎️7010-7711</p></span
          >
        </div>`;
        this.container.querySelector(".showtime-details").style.height = "100%";
      }
    }
  }

  renderMoreButtons() {
    const btnGrp = this.container.querySelector(
      ".showtime-details .button-group"
    );
    this.container.querySelector(".show-all-times").remove();

    for (let i = 0; i < this.allowedPreorderDays - 2; i++) {
      const nextDayBtn = document.createElement("button");
      nextDayBtn.classList.add("time-button");
      nextDayBtn.classList.add("additional-day");
      nextDayBtn.id = `day-${i + 2}`;
      const daysAfterTomorrow = new Date();
      daysAfterTomorrow.setDate(daysAfterTomorrow.getDate() + (i + 2));
      nextDayBtn.innerHTML = `<span class="colored">${
        daysAfterTomorrow.getMonth() + 1
      }/${daysAfterTomorrow.getDate()}</span> ${
        this.mongolianWeekdays[daysAfterTomorrow.getDay()]
      }`;
      btnGrp.appendChild(nextDayBtn);
    }

    this.renderButtons();
    this.buttonResetter();
  }

  buttonResetter() {
    const btnGrp = this.container.querySelector(
      ".showtime-details .button-group"
    );
    const showLessBtn = document.createElement("button");
    showLessBtn.classList.add("show-less-times");
    showLessBtn.textContent = "⤺ Хураах";
    btnGrp.appendChild(showLessBtn);
    showLessBtn.addEventListener("click", () => {
      this.container.querySelectorAll(".additional-day").forEach((btn) => {
        btn.remove();
      });
      const showAllBtn = document.createElement("button");
      showAllBtn.classList.add("show-all-times");
      showAllBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M421-421H206v-118h215v-215h118v215h215v118H539v215H421v-215Z"/></svg>БҮХ ЦАГ (<span></span>)`;
      showLessBtn.remove();
      btnGrp.appendChild(showAllBtn);
      if (this.container.querySelector(".button-group #day-0")) {
        this.renderButtons(0);
      } else {
        this.container
          .querySelector(".button-group #day-1")
          .classList.add("active");
        this.renderButtons(0);
        this.renderShowtimes(1);
      }
    });
  }

  hasMovieStartedHandler() {
    if (this.hasMovieStarted(this.startDate) === false) {
      this.container.querySelector(".showtime-details").innerHTML = `<div
        style="display:flex;justify-content:center;align-items:center;text-align:center;cursor:not-allowed;height:100%;"
      >
        <span style="margin: 2rem 0;"
          ><h2 style="margin-bottom: 1rem;">Тасалбар захиалга нээгдэхэд</h2>
          <countdown-live
            start-date="${this.startDate.toISOString()}"
          ></countdown-live
        ></span>
      </div>`;
      this.container.querySelector(".showtime-details").style.height = "100%";
      this.addEventListener("countdown-ended", (e) => {
        this.container.querySelector(".showtime-details").innerHTML =
          templateShowtimeContainer.innerHTML;
        this.renderShowtimes(0);
        this.renderButtons();
        this.noTouchScreenHandler();
        this.addEventListener("click", (e) => {
          const btn = e.target.closest("a[data-day]");
          if (!btn) return;
          const day = btn.dataset.day;
          const hour = btn.dataset.hour;
          this.dispatchEvent(
            new CustomEvent("time-selected", {
              detail: {
                movieId: this.getAttribute("id"),
                day,
                hour,
              },
              bubbles: true,
              composed: true,
            })
          );
        });
      });
      return false;
    }
    return true;
  }

  hasMovieStarted(startDate) {
    const today = new Date();
    return startDate <= today;
  }

  noTouchScreenHandler() {
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) {
      this.container.id = "touch";
    }
  }

  disconnectedCallback() {}
}

customElements.define("movie-card", MovieCard);

const templateShowtimeContainer = document.createElement("template");
templateShowtimeContainer.innerHTML = ` <div class="button-group">
    <button class="time-button active" id="day-0">ӨНӨӨДӨР</button>
    <button class="time-button" id="day-1">МАРГААШ</button>
    <button class="show-all-times">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20px"
        viewBox="0 -960 960 960"
        width="20px"
        fill="currentColor"
      >
        <path
          d="M421-421H206v-118h215v-215h118v215h215v118H539v215H421v-215Z"
        />
      </svg>
      БҮХ ЦАГ (<span></span>)
    </button>
  </div>
  <div class="timetable-container">
  </div>`;
