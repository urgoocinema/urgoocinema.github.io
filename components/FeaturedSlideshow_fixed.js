import { fetchMovies } from './fetch.js';

export class FeaturedSlideshow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.slideIndex = 1;
    this.featuredMovies = [];
    
    const template = document.createElement("template");
    template.innerHTML = `
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=play_circle"
      />
      <style>
        :host {
          display: block;
          width: 100%;
        }
        
        .featured {
          box-shadow: 0 0 20px rgb(228, 155, 15);
          height: 70vh;
          max-height: 37.5em;
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

        .featured-name {
          font-size: clamp(1rem, 4vw, 1.5rem);
          letter-spacing: 0.3rem;
          color: white;
        }

        .featured-details p {
          font-size: clamp(0.8rem, 2.5vw, 1rem);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          color: white;
        }

        .button-featured {
          height: 4em;
          background: transparent;
          backdrop-filter: brightness(0.5) blur(2px);
          color: white;
          padding: 0.3em 1em;
          cursor: pointer;
          font-size: clamp(0.9rem, 2.5vw, 1rem);
          border-radius: 0.4em;
          border-color: orange;
          transition: 0.3s ease-in-out;
          border: 2px solid orange;
        }

        .button-featured:hover {
          box-shadow: 0 0 100px orange, 0 0 500px yellow;
          text-shadow: 0 0 10px orange;
          backdrop-filter: brightness(0.8) blur(2px);
        }

        .age-rating {
          display: inline-block;
          font-size: 0.8rem;
          padding: 0 10px;
          border-radius: 0.5em;
          backdrop-filter: blur(10px);
        }

        .age-pg13, .PG-13 {
          background-color: rgba(233, 0, 78, 0.5);
        }

        .age-pg, .PG {
          background-color: rgba(27, 233, 0, 0.5);
        }

        .age-g, .G {
          background-color: rgba(27, 233, 0, 0.5);
        }

        .age-r, .R {
          background-color: rgba(255, 5, 5, 0.5);
        }

        .slideshow-container {
          width: 100%;
          position: relative;
          margin: auto;
        }

        .mySlides {
          display: none;
        }
        
        .mySlides:first-child {
          display: block;
        }

        .slideshow-container img {
          width: 100%;
          height: 70vh;
          max-height: 37.5em;
          object-fit: cover;
          object-position: center;
        }

        .prev,
        .next {
          cursor: pointer;
          position: absolute;
          top: 50%;
          width: auto;
          margin-top: -22px;
          padding: 16px;
          color: white;
          font-weight: bold;
          font-size: 3em;
          transition: 0.3s ease-out;
          border-radius: 0 3px 3px 0;
          user-select: none;
        }

        .next {
          right: 0;
          border-radius: 3px 0 0 3px;
        }

        .prev:hover,
        .next:hover {
          background-color: rgba(0, 0, 0, 0.8);
          color: orange;
        }

        .fade {
          animation-name: fade;
          animation-duration: 1.5s;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 70vh;
          max-height: 37.5em;
          background-color: #333;
          color: white;
          font-size: 1.2rem;
        }

        @keyframes pulsing {
          0% {
            color: white;
          }
          75% {
            color: orange;
          }
        }

        @keyframes fade {
          from {
            opacity: 0.4;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 400px) {
          .button-featured {
            font-size: clamp(0.6rem, 2vw, 0.8rem);
          }
        }

        @media (max-width: 310px) {
          .play-icon {
            display: none !important;
          }
        }
      </style>
      
      <section class="featured">
        <div class="slideshow-container" id="slideshow-container">
          <div class="loading">Ачааллаж байна...</div>
        </div>
      </section>
    `;
    
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    await this.loadFeaturedMovies();
    this.setupSlideshow();
  }

  async loadFeaturedMovies() {
    try {
      const movieData = await fetchMovies();
      // Get featured movies (you can modify this logic as needed)
      // For now, let's take the first 4 movies as featured
      this.featuredMovies = movieData.movies.slice(0, 4);
      this.renderSlides();
    } catch (error) {
      console.error('Error loading featured movies:', error);
      this.renderError();
    }
  }

  renderSlides() {
    const container = this.shadowRoot.getElementById('slideshow-container');
    
    if (this.featuredMovies.length === 0) {
      container.innerHTML = '<div class="loading">Кино олдсонгүй</div>';
      return;
    }

    const slidesHTML = this.featuredMovies.map((movie, index) => `
      <article class="mySlides fade" data-movie-id="${movie.id}">
        <div class="featured-info">
          <span class="material-symbols-outlined play-icon">
            play_circle
          </span>
          <div class="featured-details">
            <h2 class="featured-name">${movie.title}</h2>
            <p>
              ${this.formatDuration(movie.duration)} • ${movie.genres?.join(' • ') || 'Кино'}
              <span class="age-rating age-${movie.age_rating?.toLowerCase() || 'g'}">${movie.age_rating || 'G'}</span>
            </p>
          </div>
          <button class="button-featured" data-movie-id="${movie.id}">ЗАХИАЛАХ</button>
        </div>
        <img 
          src="${movie.poster_url}" 
          alt="${movie.title}"
          loading="${index === 0 ? 'eager' : 'lazy'}"
        />
      </article>
    `).join('');

    container.innerHTML = `
      ${slidesHTML}
      <span class="prev">&#10094;</span>
      <span class="next">&#10095;</span>
    `;
  }

  renderError() {
    const container = this.shadowRoot.getElementById('slideshow-container');
    container.innerHTML = `
      <div class="loading">
        Кино ачаалахад алдаа гарлаа. Дахин оролдоно уу.
      </div>
    `;
  }

  formatDuration(minutes) {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} цаг ${mins} мин`;
    }
    return `${mins} мин`;
  }

  setupSlideshow() {
    setTimeout(() => {
      const prevBtn = this.shadowRoot.querySelector('.prev');
      const nextBtn = this.shadowRoot.querySelector('.next');
      const container = this.shadowRoot.getElementById('slideshow-container');
      
      if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => this.plusSlides(-1));
        nextBtn.addEventListener('click', () => this.plusSlides(1));
      }

      // Add event listeners for booking buttons
      container.addEventListener('click', (e) => {
        if (e.target.classList.contains('button-featured')) {
          const movieId = e.target.getAttribute('data-movie-id');
          this.handleBookingClick(movieId);
        }
      });

      this.showSlides(this.slideIndex);
    }, 100);
  }

  handleBookingClick(movieId) {
    // Find the movie data
    const movie = this.featuredMovies.find(m => m.id === movieId);
    if (!movie) return;

    // Dispatch a custom event that the parent can listen to
    this.dispatchEvent(new CustomEvent('movie-booking-requested', {
      detail: {
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.poster_url
      },
      bubbles: true,
      composed: true
    }));
  }

  // Next/previous controls
  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  // Thumbnail image controls
  currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n) {
    const slides = this.shadowRoot.querySelectorAll(".mySlides");
    
    if (slides.length === 0) return;
    
    if (n > slides.length) { this.slideIndex = 1; }
    if (n < 1) { this.slideIndex = slides.length; }
    
    // Hide all slides
    slides.forEach(slide => {
      slide.style.display = "none";
    });
    
    // Show the current slide
    if (slides[this.slideIndex - 1]) {
      slides[this.slideIndex - 1].style.display = "block";
    }
  }
}

customElements.define('featured-slideshow', FeaturedSlideshow);
