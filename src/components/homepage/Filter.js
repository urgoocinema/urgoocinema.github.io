class Filter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._day_of_week = "all-times";
    this._branch = "";
    this._start_time = "";
  }
  static get observedAttributes() { }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "day-of-week" && oldValue !== newValue) {
      this._day_of_week = newValue;
      // this.render();
    }
  }
  async render() {
    try {
      const response = await fetch("/src/data/ongoing/movies-list.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const branchResponse = await fetch("/src/data/branches/branch-list.json");
      if (!branchResponse.ok) {
        throw new Error(`HTTP error! status: ${branchResponse.status}`);
      }
      const branches = await branchResponse.json();
      const films = await response.json();

      const weekDays = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];
      const today = new Date();
      const daysToShow = [];
      for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        if (i === 0) {
          daysToShow.push({ label: "Өнөөдөр", value: "Today" });
        } else if (i === 1) {
          daysToShow.push({ label: "Маргааш", value: "Tomorrow" });
        } else {
          daysToShow.push({
            label: weekDays[date.getDay()],
            value: weekDays[date.getDay()]
          });
        }
      }
      console.log("Days to show:", daysToShow);

      const filterContainer = document.createElement("div");
      filterContainer.classList.add("filter-container");

      const style = document.createElement("style");
      style.textContent = `

 

        .filter-container {
            display: flex;
            justify-content: space-around;
            width:50%;
            gap: 20px;
            margin: clamp(0.5rem, 1rem, 1.5rem) 10rem;
            padding: 1rem 0;
            border-top: 1px solid orange;
        }

        .days-container {
            display: flex;
            flex-direction: row;
            justify-content: start;
            gap: 15px;
            width: 100%;

        }

        .day {
            color: white;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
        }
        .day.active{
          background-color: orange;
        }`;
      const branchSelect = document.createElement("select");
      branchSelect.name = "branch";
      branchSelect.id = "branch";
      branchSelect.innerHTML = `<option value="0">Салбар сонгох</option>
        ${branches.branches
          .map(
            (branch) => `
                <option value = "${branch.id}">${branch.name} (${branch.location})</option>
              `
          )
          .join("")
        }`;
      const daysContainer = document.createElement("div");
      daysContainer.classList.add("days-container");
      daysContainer.innerHTML = `${daysToShow.map(
        (day) => `<div class="day" data-value="${day.value}">${day.label}</div>`
      ).join("")}`;

      // Create the start time container
      const startTimeContainer = document.createElement("div");
      startTimeContainer.classList.add("start-time-container");
      startTimeContainer.innerHTML = `
        <label for="appt">Select start time:</label>
        <input type="time" id="appt" name="appt">
        `;
      branchSelect.addEventListener("change", (e) => {
        this._branch = e.target.value;
        this.setAttribute("branch", e.target.value);
        this.dispatchEvent(
          new CustomEvent("filter-changed", {
            detail: {
              branch: e.target.value,
              dayOfWeek: this._day_of_week,
              startTime: this._start_time,
            },
            bubbles: true,
            composed: true,
          })
        );
      });

      daysContainer.querySelectorAll(".day").forEach((e1) => {
        e1.addEventListener("click", (e) => {
          let day = "";
          if (e.target.classList.contains("active")) {
            e.target.classList.remove("active");
            day = "all-times";
          } else {
            daysContainer
              .querySelectorAll(".day")
              .forEach((dayEl) => dayEl.classList.remove("active"));
            day = e.target.textContent.trim();
            e.target.classList.add("active");
          }

          this._day_of_week = day;
          this.setAttribute("day-of-week", day);
          this.dispatchEvent(
            new CustomEvent("filter-changed", {
              detail: {
                branch: this._branch,
                dayOfWeek: day,
                startTime: this._start_time,
              },
              bubbles: true,
              composed: true,
            })
          );
        });
      });

      startTimeContainer.querySelector("#appt").addEventListener("change", (e) => {
        this.setAttribute("start-time", e.target.value);
        this._start_time = e.target.value;
        this.dispatchEvent(
          new CustomEvent("filter-changed", {
            detail: {
              branch: this._branch,
              dayOfWeek: this._day_of_week,
              startTime: e.target.value,
            },
            bubbles: true,
            composed: true,
          })
        );
      });

      // Append all elements to the filter container
      filterContainer.appendChild(branchSelect);
      filterContainer.appendChild(daysContainer);
      filterContainer.appendChild(startTimeContainer);

      // Clear the shadow root and append the style and filter container
      this.shadowRoot.innerHTML = "";
      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(filterContainer);
    } catch (error) {
      console.error("Error loading filter:", error);
      this.shadowRoot.innerHTML = `< p > Error loading filter.</p > `;
    }
  }
}
customElements.define("film-filter", Filter);
