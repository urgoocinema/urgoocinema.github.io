import { getMovies, getBranches, getShowtimesForMovie } from '../api/apiService.js';
import { normalizeShowtimes } from '/src/components/utils/normalizeShowtimes.js';

const template = document.createElement("template");
template.innerHTML = `
  <style>
    .container {
      margin: clamp(4rem, 6vw, 5rem) 1rem;
      display: flex;
      flex-wrap: wrap;
      gap: clamp(3rem, 4vw, 5rem) 5rem;
      justify-content: center;
    }
  </style>
`;

export class MovieList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.container = document.createElement("div");
    this.container.classList.add("container");
    this.container.appendChild(template.content.cloneNode(true));
    this.shadowRoot.appendChild(this.container);


    // Filter state
    this.filters = {
      dayOfWeek: "all-times",
      branch: ""
    };
    this.allMovies = [];
    this.allBranches = [];

    // Bind the filter change handler to maintain 'this' context
    this.handleFilterChange = this.onFilterChanged.bind(this);
  }

  static get observedAttributes() { }

  attributeChangedCallback(attr, oldVal, newVal) { }

  connectedCallback() {
    this.render();
    this.addEventListener("time-selected", (e) => this.onTimeSelected(e));
    document.addEventListener("filter-changed", this.handleFilterChange);
  }


  async render() {
    this.container.innerHTML = "";
    if (this.allMovies.length === 0) {
      const movieData = await getMovies();
      const branchData = await getBranches();
      this.allMovies = movieData || [];
      this.allBranches = branchData || [];
    }
    this.container.appendChild(template.content.cloneNode(true));
    this.renderMovies(this.allMovies);
  }

  async renderMovies(movies) {
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const showtimes = await getShowtimesForMovie(movie.id);
      // console.log('Showtimes for movie:', movie.id, ':', showtimes);
      const normalizedShowtimes = normalizeShowtimes(showtimes || []);
      console.log('Normalized showtimes for movie:', movie.id, ':', normalizedShowtimes);
      const movieCard = document.createElement("movie-card");
      movieCard.setAttribute("id", movie.id);
      movieCard.setAttribute("title", movie.title);
      movieCard.setAttribute("description", movie.description);
      movieCard.setAttribute("duration", movie.duration);
      movieCard.setAttribute("poster_url", movie.poster_url);
      movieCard.setAttribute("startDate", this._selectedDayofWeek);
      movieCard.setAttribute("age_rating", movie.age_rating);
      movieCard.setAttribute("cc", movie.cc);
      movieCard.setAttribute("imdb_rating", movie.imdb_rating);
      movieCard.setAttribute("cast", JSON.stringify(movie.castnames || []));

      // Apply filters as attributes
      if (this.filters.dayOfWeek && this.filters.dayOfWeek !== "all-times") {
        movieCard.setAttribute("filter-day", this.filters.dayOfWeek);
      }
      if (this.filters.branch && this.filters.branch !== "") {
        movieCard.setAttribute("filter-branch", this.filters.branch);
      }

      movieCard.cast = movie.cast_names || [];
      movieCard.genres = movie.genres || [];
      movieCard.allowedPreorderDays = movie.allowed_preorder_days || 0;
      movieCard.startDate = movie.start_date || "";
      movieCard.endDate = movie.end_date || "";
      movieCard.showtimes = normalizedShowtimes;
      for (let i = 0; i < this.allBranches.length; i++) {
        const branch = this.allBranches[i];
        movieCard.branches.push(branch);
      }
      this.container.appendChild(movieCard);

    }
  }

  onFilterChanged(e) {
    console.log('Filter changed:', e.detail); // Debug log
    this.filters = { ...this.filters, ...e.detail };

    // Update all existing movie cards with new filter attributes
    const movieCards = this.container.querySelectorAll("movie-card");
    movieCards.forEach(card => {
      // Remove existing filter attributes
      card.removeAttribute("filter-day");
      card.removeAttribute("filter-branch");

      // Apply new filters as attributes
      if (this.filters.dayOfWeek && this.filters.dayOfWeek !== "all-times") {
        card.setAttribute("filter-day", this.filters.dayOfWeek);
      }
      if (this.filters.branch && this.filters.branch !== "") {
        card.setAttribute("filter-branch", this.filters.branch);
      }
    });
  }

  onTimeSelected(e) {
    const { movieTitle, movieId, moviePoster, branch, hall, day, hour } =
      e.detail;

    const queryParams = new URLSearchParams({
      movie_title: movieTitle,
      movie_id: movieId,
      movie_poster: moviePoster,
      branch_id: branch,
      hall_id: hall,
      day: day,
      hour: hour,
    });

    window.location.href = `src/components/moviepageseat-page.html?${queryParams.toString()}`;
  }

  disconnectedCallback() {
    document.removeEventListener("time-selected", this.onTimeSelected);
    document.removeEventListener("filter-changed", this.handleFilterChange);
  }
}

customElements.define("movie-list", MovieList);
