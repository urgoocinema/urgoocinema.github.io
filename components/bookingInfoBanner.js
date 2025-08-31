import { fetchBranches } from "./fetch.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    .booking-hero-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.3rem;
      background: linear-gradient(180deg, #323232, #000);
      color: white;
      padding: 25px;
    }
    .poster-box {
      height: 120px;
      width: 80px;
      box-shadow: 0 0 100px -10px hsla(0, 0%, 100%, 0.4);

      & .poster {
        aspect-ratio: 2/3;
        object-fit: contain;
        height: 100%;
        width: 100%;
      }
    }
    .info-box {
      flex-grow: 1;
      max-width: 1062px;
    }
    .meta-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      & .meta-info-text {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        & .location {
          display: flex;
          gap: 0.5rem;
          & .movie-hall {
            text-transform: uppercase;
          }
        }
      }
    }
    .now-booking-text {
      font-size: 1.2rem;
      font-weight: 350;
      background-image: linear-gradient(90deg, #dc6a1a, #eec42a);
      background-clip: text;
      color: transparent;
      letter-spacing: 0.145rem;
    }
    .movie-title {
      letter-spacing: 0.14rem;
      font-weight: 450;
      text-transform: uppercase;
    }
    .divider {
      border: none;
      border-top: 1px solid #505050;
      margin: 1rem 0 0.8rem;
    }
    .change-time-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: transparent;
      color: white;
      border: 2px solid #505050;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        border-color: silver;
        color: #a0a0a0;
      }
    }
    @media (max-width: 768px) {
      .poster-box {
        display: none;
      }
    }
  </style>
  <div class="booking-hero-container">
    <div class="poster-box">
      <img
        src="pics/aminch-portrait.webp"
        alt="Movie Poster"
        class="poster"
        width="200"
        height="300"
      />
    </div>
    <div class="info-box">
      <p class="now-booking-text">ОДОО ЗАХИАЛЖ БАЙНА</p>
      <h2 class="movie-title">Movie Title</h2>
      <hr class="divider" />
      <div class="meta-info">
        <span class="meta-info-text">
          <p class="location">
            Салбар:<span class="movie-branch">Movie Branch</span
            >Танхим: <span class="movie-hall">Movie Hall</span>
          </p>
          <p>
            <span class="movie-day">Day: YYYY-MM-DD</span>,
            <span class="movie-hour">Hour: HH:MM-HH:MM</span>
          </p>
        </span>
        <span>
          <button class="change-time-btn">
            <svg width="16" height="16" viewBox="0 0 42 42">
              <g fill="#bbb">
                <path
                  d="M21 0a21 21 0 1 0 21 21A21 21 0 0 0 21 0zm0 38.07A17.07 17.07 0 1 1 38.07 21 17.09 17.09 0 0 1 21 38.07z"
                ></path>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  d="M26.49 23.8L22 20.68v-8.2a2 2 0 0 0-4 0v9.24a2 2 0 0 0 .86 1.64l5.35 3.72a2 2 0 1 0 2.28-3.28z"
                ></path>
              </g>
            </svg>
            <span>Цаг өөрчлөх</span>
          </button>
        </span>
      </div>
    </div>
  </div>
`;

export class BookingInfoBanner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.container = document.createElement("div");
    this.container.classList.add("container");

    this.shadowRoot.appendChild(this.container);
    this.container.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["img_url", "movie_id", "movie_title", "branch_id", "hall_id", "day", "hour", "duration"];
  }

  async attributeChangedCallback(attr, oldVal, newVal) {
    if (attr === "img_url") {
      this.shadowRoot.querySelector(".poster-box img").src = newVal;
    } else if (attr === "movie_title") {
      this.shadowRoot.querySelector(".movie-title").textContent = newVal;
    } else if (attr === "branch_id") {
      this.shadowRoot.querySelector(".movie-branch").textContent = newVal;
    } else if (attr === "hall_id") {
      this.shadowRoot.querySelector(".movie-hall").textContent = newVal;
    } else if (attr === "day") {
    this.shadowRoot.querySelector(".movie-day").textContent = newVal;
    } else if (attr === "hour") {
    if (this.hasAttribute("duration")) {
      const durationInMinutes = parseInt(this.getAttribute("duration"));
      if (!isNaN(durationInMinutes)) {
        const [startHourStr, startMinuteStr] = newVal.split(":");
        let startHour = parseInt(startHourStr);
        let startMinute = parseInt(startMinuteStr);

        if (!isNaN(startHour) && !isNaN(startMinute)) {
        let endMinute = startMinute + durationInMinutes;
        let endHour = startHour + Math.floor(endMinute / 60);
        endMinute %= 60;
        endHour %= 24;

        const formattedEndHour = String(endHour).padStart(2, "0");
        const formattedEndMinute = String(endMinute).padStart(2, "0");
        newVal = `${newVal} - ${formattedEndHour}:${formattedEndMinute}`;
        }
      }
    }
    this.shadowRoot.querySelector(".movie-hour").textContent = newVal;
    }
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    const branches = await fetchBranches();
    const branchId = this.getAttribute("branch_id");
    const branch = branches.branches[branchId-1];
    this.shadowRoot.querySelector(".movie-branch").textContent = branch ? `${branch.name} - ${branch.location},` : `${branchId},`;
  }

  disconnectedCallback() {}
}

customElements.define("booking-info-banner", BookingInfoBanner);
