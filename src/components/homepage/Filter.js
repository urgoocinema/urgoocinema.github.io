class Filter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._day_of_week = "all-times";
    this._branch = "";
    this._start_time = "";
  }

  connectedCallback() {
    this.render();
  }

  async _fetchData() {
    const [filmsRes, branchesRes] = await Promise.all([
      fetch("/src/data/ongoing/movies-list.json"),
      fetch("/src/data/branches/branch-list.json")
    ]);
    if (!filmsRes.ok || !branchesRes.ok) {
      throw new Error("Failed to fetch filter data.");
    }
    return {
      films: await filmsRes.json(),
      branches: await branchesRes.json()
    };
  }

  _getUpcomingDays(count = 6) {
    const weekDays = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];
    const today = new Date();
    return Array.from({ length: count }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (i === 0) return { label: "Өнөөдөр", value: "Today" };
      if (i === 1) return { label: "Маргааш", value: "Tomorrow" };
      return { label: weekDays[date.getDay()], value: weekDays[date.getDay()] };
    });
  }

  _createBranchSelect(branches) {
    const select = document.createElement("select");
    select.name = "branch";
    select.innerHTML = `<option value="">Салбар сонгох</option>` +
      branches.branches.map(b => `<option value="${b.id}">${b.name} (${b.location})</option>`).join("");

    select.addEventListener("change", e => {
      this._branch = e.target.value;
      this._dispatchFilterChange();
    });

    return select;
  }

  _createDaysContainer(days) {
    const container = document.createElement("div");
    container.classList.add("days-container");

    days.forEach(day => {
      const div = document.createElement("div");
      div.classList.add("day");
      div.dataset.value = day.value;
      div.textContent = day.label;

      div.addEventListener("click", () => {
        if (div.classList.contains("active")) {
          div.classList.remove("active");
          this._day_of_week = "all-times";
          this._dispatchFilterChange();
          return;
        }
        container.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
        div.classList.add("active");
        this._day_of_week = day.value;
        this._dispatchFilterChange();
      });

      container.appendChild(div);
    });

    return container;
  }

  _createStartTimeInput() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("start-time-container");

    const label = document.createElement("label");
    label.setAttribute("for", "appt");
    label.textContent = "Select start time:";

    const input = document.createElement("input");
    input.type = "time";
    input.id = "appt";
    input.name = "appt";

    input.addEventListener("change", e => {
      this._start_time = e.target.value;
      this._dispatchFilterChange();
    });

    wrapper.append(label, input);
    return wrapper;
  }
  _dispatchFilterChange() {
    this.dispatchEvent(new CustomEvent("filter-changed", {
      detail: {
        _day_of_week: this._day_of_week.toString(),
        _branch: this._branch.toString(),
        _start_time: this._start_time.toString()
      },
      bubbles: true,
      composed: true
    }));
  }

  async render() {
    try {
      const { branches } = await this._fetchData();
      const filterContainer = document.createElement("div");
      filterContainer.classList.add("filter-container");

      filterContainer.appendChild(this._createBranchSelect(branches));
      filterContainer.appendChild(this._createDaysContainer(this._getUpcomingDays()));
      filterContainer.appendChild(this._createStartTimeInput());

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
          gap: 15px;
        }
        .day {
          color: white;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
        }
        .day.active {
          background-color: orange;
        }
      `;


      this.shadowRoot.innerHTML = "";
      this.shadowRoot.append(style, filterContainer);
    } catch (error) {
      console.error(error);
      this.shadowRoot.innerHTML = `<p>Error loading filter.</p>`;
    }
  }
}
customElements.define("film-filter", Filter);
