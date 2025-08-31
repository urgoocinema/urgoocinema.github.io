import { durationConverter } from "/src/components/utils/duration-converter.js";
class SliderElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._isReminderSet = false;
    this._movieId = null;
  }
  static get observedAttributes() {
    return ["movie-id"];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "movie-id" && oldValue !== newValue) {
      this._movieId = newValue;
      this.render();
    }
  }
  async render() {
    const movieIdAttr = this.getAttribute("movie-id") || this._movieId;

    if (!movieIdAttr) {
      this.shadowRoot.innerHTML = `<p>Movie ID attribute is missing.</p>`;
      return;
    }

    const movieId = parseInt(movieIdAttr, 10);
    if (isNaN(movieId)) {
      this.shadowRoot.innerHTML = `<p>Invalid Movie ID format: "${movieIdAttr}". ID must be an integer.</p>`;
      return;
    }

    this.shadowRoot.innerHTML = `<p>Loading movie details for ID: ${movieId}...</p>`;
    try {
      const response = await fetch("/src/data/ongoing/movies-list.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      const allMoviesData = jsonData.movies;
      const movieData = allMoviesData.find((movie) => movie.id === movieId);

      const getAgeRatingClass = (rating) => {
        if (!rating) return '';
        const upperRating = rating.toUpperCase();
        switch (upperRating) {
          case 'G':
            return 'age-g';
          case 'PG':
            return 'age-pg';
          case 'PG-13':
            return 'age-pg13';
          case 'R':
            return 'age-r';
          default:
            return 'age-rating-badge'; // A generic fallback class you can style if needed
        }
      };

      if (movieData) {
        this.shadowRoot.innerHTML = `
            <style>
            @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
              :host {
                display: none;
                width: 100%;
                
              }

              .mySlides {
                position: relative; /* For positioning .featured-info */
                width: 100%;
                
              }

              .mySlides img {
                width: 100%;
                height: 70vh;
                max-height: 37.5em;
                aspect-ratio: 16 / 9;
                object-fit: cover;
                border-radius: 1em;
                
              }

              .featured-info {
               position: absolute;
              bottom: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background: rgba(0, 0, 0, 0.5);
              padding: 20px;
              text-align: left;
              gap: 0.8rem;
              width: 100%;
              max-height: 30%;
              }
              .play-icon {
    font-size: clamp(3.2rem, 5vw, 4rem);
    cursor: pointer;
    transition: 0.2s ease-in-out;
    animation: pulsing 1s infinite;
  }
    .play-icon:hover {
    text-shadow: 0 0 10px #f08000, 0 0 10px orange;
  }

              .featured-details {
                width: 50%;
              }

              .featured-details .featured-name {
                font-size: clamp(1rem, 4vw, 1.5rem);
                letter-spacing: 0.3rem;
              }

              .featured-details p {
                font-size: clamp(0.8rem, 2.5vw, 1rem);
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                margin: 0.5;
              }

              .button-featured { /* Applied to the remindButton */
                height: 4em;
                background: transparent;
                backdrop-filter: brightness(0.5) blur(2px);
                color: white;
                padding: 0.3em 1em;
                cursor: pointer;
                font-size: clamp(0.9rem, 2.5vw, 1rem);
                border-radius: 0.4em;
                border: 1px solid orange;
                transition: 0.3s ease-in-out;
            
              }
              
              .button-featured img {
                  height: 1.5em;
                  width: 1.5em;
              }

              .button-featured:hover {
                box-shadow: 0 0 100px orange, 0 0 500px yellow;
                text-shadow: 0 0 10px orange;
                backdrop-filter: brightness(0.8) blur(2px);
              }
              
            

              @keyframes pulsing {
                0% { color: white; }
                75% { color: orange; }
                100% { color: white; } /* Ensure smooth loop */
              }

        

              .age-pg13, .PG-13, .age-pg, .PG, .age-g, .G, .age-r, .R {
                display: inline-block;
                font-size: 0.8rem;
                padding: 0.2em 0.6em;
                border-radius: 0.5em;
                backdrop-filter: blur(10px);
                margin-left: 0.5em;
              }
              .age-pg13, .PG-13 { background-color: rgba(255, 238, 0, 0.98); color:black;}
              .age-pg, .PG, .age-g, .G { background-color: rgba(27, 233, 0, 0.5); }
              .age-r, .R { background-color: rgba(255, 5, 5, 0.5); }

              .fade {
                animation-name: fadeEffect;
                animation-duration: 1.5s;
              }

              @keyframes fadeEffect {
                from { opacity: 0.4; }
                to { opacity: 1; }
              }
            </style>
            <article class="mySlides fade">
                <div class="featured-info">
                <span class="material-symbols-outlined play-icon">
                play_circle
                </span>
                <div class="featured-details">
                <h2 class="featured-name">${movieData.title}</h2>
                <p>
                ${durationConverter(movieData.duration)} • ${movieData.genres}
                <span class="${getAgeRatingClass(movieData.age_rating)}">${movieData.age_rating}</span>
                </p>
                </div>
                <button id="remindButton" 
                class="button-featured">
                  <span id="remindButtonText">Захиалах</span>
                </button>
                </div>
                <img src="${movieData.widePosterSource}" alt="${movieData.title}" loading="lazy" />
            </article>
          `;
      } else {
        this.shadowRoot.innerHTML = `<p>Movie with ID ${movieId} not found in the data.</p>`;
      }
    } catch (error) {
      console.error(
        "Error in render method of UpcomingMovie component:",
        error
      );
      this.shadowRoot.innerHTML = `<p>Error loading movie data. ${error.message}</p>`;
    }
  }
}
customElements.define("slider-element", SliderElement);