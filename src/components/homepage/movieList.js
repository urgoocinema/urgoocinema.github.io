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

  }

  static get observedAttributes() { }

  attributeChangedCallback(attr, oldVal, newVal) { }

  connectedCallback() {
    this.render();
    this.addEventListener("time-selected", (e) => this.onTimeSelected(e));
  }


  async render() {
    this.container.innerHTML = "";
    this.container.appendChild(template.content.cloneNode(true));
    const movieData = await fetchMovies();
    const branchData = await fetchBranches();

    for (let i = 0; i < movieData.movies.length; i++) {
      const movie = movieData.movies[i];
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

      movieCard.cast = movie.cast;
      movieCard.genres = movie.genres;
      movieCard.showtimes = movie.showtimes;
      movieCard.allowedPreorderDays = movie.allowed_preorder_days;
      movieCard.startDate = new Date(movie.start_date);
      movieCard.endDate = new Date(movie.end_date);

      for (let i = 0; i < branchData.branches.length; i++) {
        const branch = branchData.branches[i];
        movieCard.branches.push(branch);
      }
      this.container.appendChild(movieCard);
    }
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

    window.location.href = `seat-page.html?${queryParams.toString()}`;
  }

  disconnectedCallback() {
    document.removeEventListener("time-selected");
  }
}

customElements.define("movie-list", MovieList);
