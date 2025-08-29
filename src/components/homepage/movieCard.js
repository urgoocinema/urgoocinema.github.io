import { durationConverter } from "/src/components/utils/duration-converter.js";
import { convertToMinutes } from "/src/components/utils/getMinutes.js";
import { isSameDay } from "/src/components/utils/isSameDay.js";
import { day_to_number } from "/src/components/utils/day-to-number.js";
import { Cardtemplate, CardtemplateFooter, allTimes } from '/src/components/templates/movieCard.js'
const template = document.createElement("template");

template.innerHTML = Cardtemplate;

export class MovieCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._initialize();
    this._initialize_element();

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
      "filter-day",
      "filter-branch"
    ];
  }
  _initialize() {
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
    // Filter properties
    this.filterDay = null; // Will hold specific date like "2025-08-28" or day like "monday"
    this.filterBranch = null; // Will hold branch ID
  }
  _initialize_element() {
    this.container = document.createElement("article");
    this.container.classList.add("movie");

    this.shadowRoot.appendChild(this.container);
    this.container.appendChild(template.content.cloneNode(true));

    this.timetableContainer = this.container.querySelector(".timetable-container");
    this.buttonGroup = this.container.querySelector(".button-group");
    this.showtimeDetails = this.container.querySelector(".showtime-details");
  }
  _finishTodaysTime() {
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
        this.renderShowtimes(0);
        const parent = this.container.querySelector(".showtime-details");
        const newChild = document.createElement("div");
        newChild.classList.add("notice-no-today");
        newChild.innerHTML = `<span class="info-icon">ⓘ</span> Өнөөдрийн цаг дууссан. <span class="tomorrow">Маргаашийн цагийг</span> харуулж байна.`;
        parent.insertBefore(newChild, parent.firstChild);
      }
    }
  }
  _dispatchButtonEvent() {
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
              moviePoster: this.getAttribute("poster_url"),
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
      this.container.querySelector(".lang span").textContent = `${newVal === "mongolian" ? "Монгол хэл" : "Англи хэл"
        }`;
    }
    if (attr === "filter-day") {
      this.filterDay = newVal;
      this.applyFilters();
    }
    if (attr === "filter-branch") {
      this.filterBranch = newVal;
      this.applyFilters();
    }
  }

  connectedCallback() {
    this.renderCast();
    if (!this.hasMovieStartedHandler()) return;
    this.renderShowtimes(0, this._selectedBranch);
    this.renderButtons();
    this.noTouchScreenHandler();
    this._finishTodaysTime();
    this._dispatchButtonEvent();
  }

  applyFilters() {
    // Only apply filters if the component is already connected and initialized
    if (this.container && this.container.querySelector(".showtime-details")) {
      // Re-render the showtimes with current filter settings
      this.renderShowtimes(0, this._selectedBranch);
    }
  }

  getFilteredCurrentDay() {
    if (this.filterDay) {
      // Check if it's a specific date (YYYY-MM-DD format)
      if (this.filterDay.includes('-')) {
        return new Date(this.filterDay);
      }
      // Otherwise, it's a day name like "monday", find the next occurrence
      else {
        const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const targetDayIndex = dayNames.indexOf(this.filterDay.toLowerCase());

        if (targetDayIndex !== -1) {
          const today = new Date();
          const currentDayIndex = today.getDay();
          const daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() + daysUntilTarget);
          return targetDate;
        }
      }
    }
    // Default to today
    return new Date();
  }


  renderCast() {
    this.container.querySelector(".cast .gray").textContent =
      (this.cast || []).join();
  }

  renderShowtimes(day) {
    const today = new Date();
    let currentDay;

    // Use filtered day if available, otherwise use the day parameter
    if (this.filterDay) {
      currentDay = this.getFilteredCurrentDay();
    } else {
      currentDay = new Date(today);
      currentDay.setDate(currentDay.getDate() + day);
    }

    const currentTime = today.getHours() * 60 + today.getMinutes();
    const currentDayName = currentDay.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    const todayShowtimes = this.container.querySelector(".showtime-details .timetable-container");

    todayShowtimes.innerHTML = "";

    const selectedDateConstructor = document.createElement("div");
    selectedDateConstructor.classList.add("selected-date");
    selectedDateConstructor.innerHTML = `
      Сонгогдсон<span class="desktop"> өдөр</span>:
      <span class="mo-day">${currentDay.getMonth() + 1}/${currentDay.getDate()}</span> <span class="garig">${this.mongolianWeekdays[currentDay.getDay()]}</span>
    `;
    todayShowtimes.appendChild(selectedDateConstructor);


    const renderBranch = (branchData, branchIndex) => {
      const branchConstructor = document.createElement("div");
      branchConstructor.classList.add("branch", `branch-${branchIndex}`);
      branchConstructor.innerHTML = `<p>${branchData.name} <span class="location">${branchData.location}</span></p><div class="schedule"></div>`;
      const branch = todayShowtimes.appendChild(branchConstructor);

      const hall = this.showtimes[`branch${branchIndex + 1}`]?.hallId;
      const showtimes = this.showtimes?.[`branch${branchIndex + 1}`]?.schedule?.[currentDayName];

      let showtimesHtml;
      if (isSameDay(currentDay, today)) {
        showtimesHtml = showtimes
          ? showtimes
            .map(time =>
              /^[0-2][0-9]:[0-5][0-9]$/.test(time) && convertToMinutes(time) >= currentTime + 30
                ? `<a href="#" class="time" data-day="${currentDay.toISOString().slice(0, 10)}" data-hour="${time}" data-branch="${branchIndex + 1}" data-hall="${hall}">${time}</a>`
                : ''
            )
            .join("")
          : `<span class="time" style="opacity: 0.6; cursor: not-allowed">Цаг тавигдаагүй</span>`;
      } else {
        showtimesHtml = showtimes
          ? showtimes
            .map(time =>
              `<a href="#" class="time" data-day="${currentDay.toISOString().slice(0, 10)}" data-hour="${time}" data-branch="${branchIndex + 1}" data-hall="${hall}">${time}</a>`
            )
            .join("")
          : `<span class="time" style="opacity: 0.6; cursor: not-allowed">Цаг тавигдаагүй</span>`;
      }

      branch.querySelector(".schedule").innerHTML = showtimesHtml;

      if (branch.querySelector(".schedule").innerHTML === "" || (branch.querySelector(".schedule").innerHTML.includes('Цаг тавигдаагүй') && showtimesHtml === `<span class="time" style="opacity: 0.6; cursor: not-allowed">Цаг тавигдаагүй</span>`)) {
        branch.remove();
      }
    };

    this.branches.forEach((branchData, i) => {
      // If filter-branch is set, only render that specific branch
      if (this.filterBranch) {
        if (branchData.id == this.filterBranch) {
          renderBranch(branchData, i);
        }
      } else {
        // No filter, render all branches
        renderBranch(branchData, i);
      }
    });

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
      this.timeButtons[0].classList.add("active");
      this.renderShowtimes(activeChangeIndex, this._selectedBranch);
    }

    if (activeChangeIndex === "tomorrow") {
      this.timeButtons.forEach((button) => {
        button.classList.remove("active");
      });
      if (this.timeButtons[1]) {
        this.timeButtons[1].classList.add("active");
        this.renderShowtimes(1, this._selectedBranch);
      } else {
        this.timeButtons[0].classList.add("active");
        this.renderShowtimes(0, this._selectedBranch);
        alert(
          "Тухайн үзвэрт нэмэлт захиалга байхгүй байна. Та маргааш дахин оролдоно уу."
        );
      }
    }



    /*Choosing the active button*/
    let activeButton =
      this.container.querySelector(".time-button.active") ||
      this.timeButtons[1];
    this.timeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        if (e.target.closest(".time-button") !== activeButton) {
          activeButton.classList.remove("active");
          e.target.closest(".time-button").classList.add("active");
          activeButton = e.target.closest(".time-button");
          const day = parseInt(
            e.target.closest(".time-button").id.split("-")[1]
          );
          this.renderShowtimes(day, this._selectedBranch);
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
  chooseActiveButton() {

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
      nextDayBtn.innerHTML = `<span class="colored">${daysAfterTomorrow.getMonth() + 1
        }/${daysAfterTomorrow.getDate()}</span> ${this.mongolianWeekdays[daysAfterTomorrow.getDay()]
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
      showAllBtn.innerHTML = allTimes;
      showLessBtn.remove();
      btnGrp.appendChild(showAllBtn);
      if (this.container.querySelector(".button-group #day-0")) {
        this.renderButtons(0);
      } else {
        this.container
          .querySelector(".button-group #day-1")
          .classList.add("active");
        this.renderButtons(0);
        this.renderShowtimes(1, this._selectedBranch);
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
        this.renderShowtimes(0, this._selectedBranch);
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

  disconnectedCallback() {
  }
}

customElements.define("movie-card", MovieCard);

const templateShowtimeContainer = document.createElement("template");
templateShowtimeContainer.innerHTML = CardtemplateFooter;
