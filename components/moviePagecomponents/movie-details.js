class MovieDetails extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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
    const movieId = this.getAttribute("movie-id") || this._movieId;

    if (!movieId) {
      this.shadowRoot.innerHTML = `<p>Please provide a movie ID.</p>`;
      return;
    }

    this.shadowRoot.innerHTML = `<p>Loading...</p>`;

    try {
      const response = await fetch("../data/movies-list.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allMoviesData = await response.json();

      const movieData = allMoviesData.movies.find(
        (movie) => movie.id.toString() === movieId
      );
      if (!movieData) {
        this.shadowRoot.innerHTML = `<p>Movie with ID ${movieId} not found. </p>`;
        return;
      }
      const posterSrc = movieData.poster_url || "";
      const movieTitle = movieData.title || "Movie-title";
      const ratingText = movieData.age_rating || "";
      const imdbRating = movieData.imdb_rating || "";
      const description = movieData.description || "No description available.";
      const cast = movieData.cast ? movieData.cast.join(", ") : "N/A"; // Join cast array
      const duration = movieData.duration || "N/A"; // Assuming JSON has duration
      const language =
        movieData.cc === "mongolian"
          ? "Монгол хэл"
          : movieData.cc
            ? "Англи хэл"
            : "N/A"; // Assuming JSON has cc field
    

      this.shadowRoot.innerHTML = `
      <style>
      .movie-info {
  display: flex;
  gap: 5rem;

  & img {
    height: 50vh;
    width: auto;
    box-shadow: 0 0 20px rgb(228, 155, 15), 0 0 40px rgba(255, 255, 255, 0.1),
      0 8px 16px rgba(255, 255, 255, 0.08);
    border-radius: 1em;
  }
  & p{
    // line-height: 1.5rem;
  }

  &>div {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    & h1 {
      font-size: 3rem;
    }
    & .gray{
      color: var(--gray-text);
    }
    & .white{
      color: var(--white-text);
    }
  }
}
  </style>
  <div class="movie-info">
                <img src=".${posterSrc}" alt="${movieTitle} poster}" />
      <div>
        <h1>${movieTitle}<span class="rating age-pg">${ratingText}</span></h1>
        <p>
          ${description}
        </p>
        <p>
          ${description}
        </p>
        <div>
          <p class="cast">
            <span class="gray">Гол дүр:</span>
            <span class="white">
          ${cast}
            </span>
          </p>
          <p class="duration">
            <span class="gray">Үргэлжлэх хугацаа: </span>
            <span class="white">${duration}</span>
          </p>
          <p class="lang">
            <span class="gray">Хэл:</span>
            <span class="white">${language}</span>
          </p>
          <p class="imdb">
            <span class="gray">IMDB: </span>
            <span class="white">${imdbRating}</span>
          </p>
        </div>
      </div>
      </div>
            `;
    } catch (error) {
      console.error("Error fetching movie data:", error);
      this.shadowRoot.innerHTML = `<p>Error fetching movie data. Please try again later. ${error.message}</p> `;
    }
  }
}
customElements.define("movie-details", MovieDetails);
