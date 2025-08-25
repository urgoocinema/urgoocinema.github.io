import { fetchMovies, fetchBranches } from "/src/components/api/fetch.js";

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

    this.shadowRoot.appendChild(this.container);
    this.container.appendChild(template.content.cloneNode(true));

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
    
    // Listen for filter changes from the filter component
    document.addEventListener("filter-changed", this.handleFilterChange);
  }


  async render() {
    this.container.innerHTML = "";
    this.container.appendChild(template.content.cloneNode(true));
    
    if (this.allMovies.length === 0) {
      const movieData = await fetchMovies();
      const branchData = await fetchBranches();
      this.allMovies = movieData.movies;
      this.allBranches = branchData.branches;
    }

    this.renderMovies(this.allMovies);
  }

  renderMovies(movies) {
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
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

      // Apply filters as attributes
      if (this.filters.dayOfWeek && this.filters.dayOfWeek !== "all-times") {
        movieCard.setAttribute("filter-day", this.filters.dayOfWeek);
      }
      if (this.filters.branch && this.filters.branch !== "") {
        movieCard.setAttribute("filter-branch", this.filters.branch);
      }

      movieCard.cast = movie.cast;
      movieCard.genres = movie.genres;
      movieCard.showtimes = movie.showtimes;
      movieCard.allowedPreorderDays = movie.allowed_preorder_days;
      movieCard.startDate = new Date(movie.start_date);
      movieCard.endDate = new Date(movie.end_date);

      for (let j = 0; j < this.allBranches.length; j++) {
        const branch = this.allBranches[j];
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

    window.location.href = `src/pages/movie-page/seat-page.html?${queryParams.toString()}`;
  }

  disconnectedCallback() {
    document.removeEventListener("time-selected");
    document.removeEventListener("filter-changed", this.handleFilterChange);
  }
}

customElements.define("movie-list", MovieList);
