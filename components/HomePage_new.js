import './FeaturedSlideshow.js';

export class HomePage extends HTMLElement {
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
        }
        
        .section-title {
          margin: clamp(3.2rem, 5vw, 4rem) 0.5rem;
          text-align: center;
        }

        .section-title span {
          padding: clamp(1rem, 2vw, 1.5rem) clamp(2rem, 5vw, 5rem);
          border-left: 7px orange dashed;
          border-top: 5px orange solid;
          border-right: orange solid;
          border-bottom: orange solid;
          border-radius: 0.5em;
          backdrop-filter: blur(10px);
          font-size: clamp(1.2rem, 4vw, 1.6rem);
        }

        @media (max-width: 260px) {
          .section-title {
            display: none;
          }
        }
      </style>
      
      <main>
        <featured-slideshow></featured-slideshow>
        <section class="ongoing">
          <h1 class="section-title"><span>Манай дэлгэцнээ</span></h1>
          <movie-list></movie-list>
          <div class="flex-container"></div>
        </section>
      </main>
    `;
    
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // Listen for booking requests from the slideshow
    this.shadowRoot.addEventListener('movie-booking-requested', (e) => {
      this.handleMovieBookingRequest(e.detail);
    });
  }

  async handleMovieBookingRequest(movieData) {
    const { movieId, movieTitle, moviePoster } = movieData;
    
    // Option 1: Navigate to the movie's detail page (if you have one)
    // Option 2: Scroll to the movie in the movie list below
    // Option 3: Show a modal with booking options
    
    // For now, let's scroll to the movie in the list below
    console.log('Booking requested for movie:', movieData);
    
    // Try to find and highlight the movie in the movie list
    setTimeout(() => {
      const movieList = this.shadowRoot.querySelector('movie-list');
      if (movieList) {
        const movieCard = movieList.shadowRoot?.querySelector(`movie-card[id="${movieId}"]`);
        if (movieCard) {
          movieCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add a temporary highlight effect
          movieCard.style.border = '3px solid orange';
          movieCard.style.boxShadow = '0 0 20px orange';
          setTimeout(() => {
            movieCard.style.border = '';
            movieCard.style.boxShadow = '';
          }, 3000);
        }
      }
    }, 500);
  }
}

customElements.define('home-page', HomePage);
