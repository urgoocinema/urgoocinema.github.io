class UpcomingMovie extends HTMLElement {
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
      const response = await fetch("../data/upcoming/upcoming.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allMoviesData = await response.json();
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
            return 'age-rating-badge';
        }
      };

      if (movieData) {
        this.shadowRoot.innerHTML = `
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

                        .upcoming-movie-container {
                            height: 60vh;
                            display: flex;
                            gap:1.5em;
                            margin-bottom: 20px;
                            padding: 1.5rem 0.8rem;
                            border: 1px solid #333; /* Darker border for a cinema feel */
                            border-radius: 1em;
                            overflow: hidden;
                            background-color: #1a1a1a; /* Dark background */
                            color: #f5f5f5; /* Light text color */
                            font-family: 'Roboto Condensed', sans-serif;
                            font-size:1.4rem;
                            transition: all 0.3s ease;
      box-shadow: 0 0 15px rgb(228, 155, 15), 0 0 40px rgba(255, 255, 255, 0.1),
        0 8px 16px rgba(255, 255, 255, 0.08);
                        }
                        .upcoming-movie-container:hover{
      transform: translateY(-10px);
      box-shadow: 0 0 30px rgb(228, 155, 15), 0 0 40px rgba(255, 255, 255, 0.1),
        0 8px 16px rgba(255, 255, 255, 0.08);
    
                        }
                        .upcoming-movie-container img {
                            height:100%
                            min-width: 180px;
                            width: auto;
                            object-fit: cover;
                            border-radius:1em;
                            box-shadow: 0 0 10px rgba(255, 255, 255, 0.4),
                            0 0 80px rgba(255, 255, 255, 0.2), 0 12px 24px rgba(255, 255, 255, 0.1);
                        }
                        .information {
                            padding: 20px;
                            flex-grow: 1;
                        }
                        .information h1 {
                            margin-top: 0;
                            font-size: 1.8em;
                            color: #f0ad4e; /* Accent color for title */
                        }
                        .information p {
                            font-size: 0.95em;
                            line-height: 1.6;
                        }
                        .detail-container {
                            margin-top: 15px;
                            margin-bottom: 15px;
                        }
                        .detail-row {
                            display: flex;
                            margin-bottom: 8px;
                            font-size: 0.9em;
                        }
                        .detail-white {
                            font-weight: bold;
                            min-width: 200px;
                            color: #ccc; /* Lighter gray for labels */
                        }
                        .detail-gray {
                            min-width: 180px;
                            color: #aaa; /* Slightly darker gray for values */
                        }
                        button {
                            margin-top:10px;
                            padding: 12px 18px;
                            background-color: #f0ad4e; /* Urgoo's orange */
                            color: #1a1a1a; /* Dark text on button */
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: bold;
                            text-transform: uppercase;
                            font-size: 0.9em;
                            transition: background-color 0.2s ease-in-out, box-shadow 0.3s ease-in-out;
                        }
                        button:hover {
                            background-color: #ec971f;
                        }
                        button img{
                          height: 100%;
                          width: auto;
                          vertical-align: middle;
                          margin-right: 5px;
                          filter: brightness(0) invert(0.1);
                        }
                        button.glow-active{
                          box-shadow:   0 0 1px #f0ad4e, 
                                        0 0 5px #f0ad4e, 
                                        0 0 10px #ffc107;
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
                    </style>
                    <div class="upcoming-movie-container">
                        <img src="${movieData.imageSrc}" alt="${movieData.altText}" />
                        <div class="information">
                            <h1>${movieData.name}</h1>
                            <p>${movieData.description}</p>
                            <div class="detail-container">
                                <div class="detail-row">
                                    <div class="detail-gray">Гол дүрүүдэд</div>
                                    <div class="detail-white">${movieData.cast}</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-gray">Үргэлжлэх хугацаа</div>
                                    <div class="detail-white">${movieData.runTime}</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-gray">Гарах огноо</div>
                                    <div class="detail-white">${movieData.releaseDate}</div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-gray">Насны ангилал</div>
                                    <div class="${getAgeRatingClass(movieData.ageRating)}">${movieData.ageRating}</div>
                                </div>
                            </div>
                            <button id = "remindButton" class="${this._isReminderSet ? 'glow-active' : ''}">
                                <img src="${this._isReminderSet ? '../pics/icons/bell-active.svg' : '../pics/icons/bell.svg'}" alt="Remind me icon">
                                <span id="remindButtonText">${this._isReminderSet ? 'Сануулга идэвхжсэн' : 'Надад сануул'}</span>
                            </button>
                        </div>
                    </div>
                `;
      } else {
        this.shadowRoot.innerHTML = `<p>Movie with ID ${movieId} not found in the data.</p>`;
      }
      const remindButton = this.shadowRoot.getElementById('remindButton');
      if(remindButton){
        remindButton.addEventListener('click', ()=>{
          this._isReminderSet = !this._isReminderSet;
          const icon = remindButton.querySelector('img');
          const textSpan = remindButton.querySelector('#remindButtonText');

          icon.src = this._isReminderSet ? '../pics/icons/bell-active.svg' : '../pics/icons/bell.svg';
          icon.alt = this._isReminderSet ? 'Reminder active icon' : 'Remind me icon';
          textSpan.textContent = this._isReminderSet ? 'Сануулга идэвхжсэн' : 'Надад сануул';
        
          if (this._isReminderSet){
            remindButton.classList.add('glow-active');
          }else{
            remindButton.classList.remove('glow-active');
          }
        });
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
customElements.define("upcoming-movie", UpcomingMovie);