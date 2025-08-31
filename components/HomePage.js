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
    
    console.log('Booking requested for movie:', movieData);
    
    // Try to find and scroll to the movie in the movie list
    const movieList = this.shadowRoot.querySelector('movie-list');
    if (movieList && movieList.container) {
      // Look for the movie card in the movieList container
      const movieCard = movieList.container.querySelector(`movie-card[id="${movieId}"]`);
      
      if (movieCard) {
        movieCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        console.log('Successfully scrolled to movie card:', movieId);
      } else {
        console.log('Movie card not found for ID:', movieId);
        console.log('Available movie cards:', movieList.container.querySelectorAll('movie-card'));
      }
    } else {
      console.log('Movie list or container not found');
    }
  }
}

customElements.define('home-page', HomePage);
