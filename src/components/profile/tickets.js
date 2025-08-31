import { getBookingsByUserId, getMovieById } from '/src/components/api/apiService.js'
class Tickets extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
  }
  connectedCallback() {
    this.render();

  }
  attributeChangedCallback(name, oldValue, newValue) {
  }
  async render() {
    try {
      const response = await fetch("/src/data/user/user-info.json");
      const tickets = await getBookingsByUserId(window.localStorage.getItem('user_id'));


      console.log(tickets);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const movieCache = new Map();

      const ticketItems = tickets.length > 0
        ? await Promise.all(tickets.map(async (ticket) => {
          const movieId = ticket.showtime_id.split('_')[2];
          let movie;
          if (movieCache.has(movieId)) {
            movie = movieCache.get(movieId);
          } else {
            movie = await getMovieById(movieId);
            movie = Array.isArray(movie) ? movie[0] : movie;
            console.log(movie);
            movieCache.set(movieId, movie);
          }

          const movieTitle = movie.title || 'Unknown Movie';

          return `
              <div class="ticket">
                <h3>${movieTitle}</h3>
                <p>Seat: Row ${ticket.seat_row}, Column ${ticket.seat_column}</p>
                <p>Booked: ${new Date(ticket.booking_time).toLocaleString()}</p>
              </div>
            `;
        })).then(items => items.join(''))
        : '<p>No tickets found.</p>';
      this.shadowRoot.innerHTML = `
          <style>
          .reminderWrapper {
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .upcomingMovieContainer {
            overflow-y: auto;
            max-height: 400px;
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 5px;
          }
          .ticket {
            border-bottom: 1px solid #eee;
            padding: 10px 0;
            margin-bottom: 10px;
          }
          .ticket:last-child {
            border-bottom: none;
          }
          .ticket h3 {
            margin: 0;
            font-size: 1.2em;
            color: #333;
          }
          .ticket p {
            margin: 5px 0;
            color: #666;
          }
          </style>
          <div class="reminderWrapper">
            <h1>Your tickets:</h1>
            <div class="upcomingMovieContainer">
              ${ticketItems}
            </div>
          </div>
        `;


    } catch (error) {
      console.error(
        "Error in render method of reminders component:",
        error
      );
      this.shadowRoot.innerHTML = `<p>Error loading user data. ${error.message}</p>`;
    }
  }
}
customElements.define("tickets-component", Tickets);
