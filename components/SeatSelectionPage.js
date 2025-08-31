export class SeatSelectionPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    
    // Create the template
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100vh;
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        .page-container {
          background-color: #f8f8f8;
          font-family: "Roboto Condensed", sans-serif;
          color: #ffa500;
          min-height: 100vh;
        }
        
        .main-container {
          display: flex;
          justify-content: center;
          min-width: 335px;
          min-height: 100vh;
        }
        
        seat-selector {
          width: 66%;
          min-width: 335px;
          background-color: black;
          box-shadow: 0 0 20px rgb(228, 155, 15), 0 0 40px rgba(255, 255, 255, 0.1),
          0 8px 16px rgba(255, 255, 255, 0.08);
        }
        
        order-steps {
          width: 34%;
          border: 3px rgb(228, 155, 15) solid;
          border-left: 5px rgb(228, 155, 15) dashed;
          box-shadow: 0 0 20px rgb(228, 155, 15),
            0 0 40px rgba(255, 255, 255, 0.1),
            0 8px 16px rgba(255, 255, 255, 0.08);
        }
        
        footer {
          background-color: black;
          color: white;
          padding: 10px 0;
          text-align: center;
        }

        @media (max-width: 1280px) {
          seat-selector {
            width: 60%;
          }
          order-steps {
            width: 40%;
          }
        }
        
        @media (max-width: 1025px) {
          seat-selector {
            width: 70%;
          }
          order-steps {
            width: 30%;
          }
        }

        @media (max-width: 1028px) {
          .main-container {
            flex-direction: column;
            align-items: center;
          }
          seat-selector {
            width: 100%;
          }
          order-steps {
            width: 100%;
            border: none;
            border-top: 5px rgb(228, 155, 15) dashed;
            box-shadow: none;
          }
        }
      </style>
      
      <div class="page-container">
        <header>
          <booking-info-banner></booking-info-banner>
        </header>
        <main class="main-container">
          <seat-selector></seat-selector>
          <order-steps></order-steps>
        </main>
        <footer>
          © 2024 URGOO Cinema. All rights reserved.
        </footer>
      </div>
    `;
    
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // Set up URL parameters for child components
    this.setupComponentAttributes();
  }

  setupComponentAttributes() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    const movieId = urlParams.get("movie_id");
    const movieTitle = urlParams.get("movie_title");
    const moviePoster = urlParams.get("movie_poster");
    const branchId = urlParams.get("branch_id");
    const hallId = urlParams.get("hall_id");
    const day = urlParams.get("day");
    const hour = urlParams.get("hour");

    // Set attributes for booking-info-banner
    const bookingInfoBannerElement = this.shadowRoot.querySelector("booking-info-banner");
    if (bookingInfoBannerElement) {
      if (movieId) bookingInfoBannerElement.setAttribute("movie_id", movieId);
      if (movieTitle) bookingInfoBannerElement.setAttribute("movie_title", movieTitle);
      if (moviePoster) bookingInfoBannerElement.setAttribute("img_url", moviePoster);
      if (branchId) bookingInfoBannerElement.setAttribute("branch_id", branchId);
      if (hallId) bookingInfoBannerElement.setAttribute("hall_id", hallId);
      if (day) bookingInfoBannerElement.setAttribute("day", day);
      if (hour) bookingInfoBannerElement.setAttribute("hour", hour);
    }

    // Set attributes for seat-selector
    const seatSelectorElement = this.shadowRoot.querySelector("seat-selector");
    if (seatSelectorElement) {
      if (movieTitle) seatSelectorElement.setAttribute("movie_title", movieTitle);
      if (movieId) seatSelectorElement.setAttribute("movie_id", movieId);
      if (moviePoster) seatSelectorElement.setAttribute("movie_poster", moviePoster);
      if (branchId) seatSelectorElement.setAttribute("branch_id", branchId);
      if (hallId) seatSelectorElement.setAttribute("hall_id", hallId);
      if (day) seatSelectorElement.setAttribute("day", day);
      if (hour) seatSelectorElement.setAttribute("hour", hour);
    }

    // Set attributes for order-steps
    const orderStepsElement = this.shadowRoot.querySelector("order-steps");
    if (orderStepsElement && movieId && branchId && hallId && day && hour) {
      const formattedDay = day.replace(/-/g, "");
      const formattedHour = hour.replace(":", "");
      const showtimeId = `${movieId}_${branchId}_${hallId}_${formattedDay}_${formattedHour}`;
      orderStepsElement.setAttribute("showtime-id", showtimeId);
      if (moviePoster) orderStepsElement.setAttribute("movie-poster", moviePoster);
    }
  }

  static get observedAttributes() {
    return ['movie_id', 'movie_title', 'movie_poster', 'branch_id', 'hall_id', 'day', 'hour'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.setupComponentAttributes();
    }
  }
}

customElements.define('seat-selection-page', SeatSelectionPage);
