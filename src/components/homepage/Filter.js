class Filter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._day_of_week = "all-times";
    this._branch = "";
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

  _getUpcomingDays(count = 7) {
    const weekDays = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];
    const englishDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const today = new Date();
    
    return Array.from({ length: count }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      
      if (i === 0) return { label: "Өнөөдөр", value: englishDays[dayOfWeek], date: date };
      if (i === 1) return { label: "Маргааш", value: englishDays[dayOfWeek], date: date };
      return { label: weekDays[dayOfWeek], value: englishDays[dayOfWeek], date: date };
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

    // Add "All Days" option
    const allDaysDiv = document.createElement("div");
    allDaysDiv.classList.add("day", "active"); // Start with "All Days" active
    allDaysDiv.dataset.value = "all-times";
    allDaysDiv.textContent = "Бүх өдөр";
    
    allDaysDiv.addEventListener("click", () => {
      container.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
      allDaysDiv.classList.add("active");
      this._day_of_week = "all-times";
      this._dispatchFilterChange();
    });
    
    container.appendChild(allDaysDiv);

    days.forEach(day => {
      const div = document.createElement("div");
      div.classList.add("day");
      div.dataset.value = day.value;
      div.textContent = day.label;

      div.addEventListener("click", () => {
        container.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
        div.classList.add("active");
        this._day_of_week = day.value;
        this._dispatchFilterChange();
      });

      container.appendChild(div);
    });

    return container;
  }

  _dispatchFilterChange() {
    this.dispatchEvent(new CustomEvent("filter-changed", {
      detail: {
        dayOfWeek: this._day_of_week,
        branch: this._branch
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

      const style = document.createElement("style");
      style.textContent = `
        .filter-container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          width: 90%;
          max-width: 1200px;
          gap: 20px;
          margin: clamp(0.5rem, 1rem, 1.5rem) auto;
          padding: 1rem;
          border-top: 1px solid orange;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
        
        .days-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .day {
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 165, 0, 0.3);
          font-size: 0.9rem;
          white-space: nowrap;
        }
        
        .day:hover {
          background-color: rgba(255, 165, 0, 0.2);
          border-color: orange;
        }
        
        .day.active {
          background-color: orange;
          color: black;
          font-weight: bold;
        }
        
        select {
          padding: 8px 12px;
          border-radius: 5px;
          border: 1px solid rgba(255, 165, 0, 0.3);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          font-size: 0.9rem;
        }
        
        select option {
          background: #1a1a1a;
          color: white;
        }
        
        @media (max-width: 768px) {
          .filter-container {
            flex-direction: column;
            gap: 15px;
          }
          
          .days-container {
            justify-content: center;
          }
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
