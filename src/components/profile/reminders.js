import { getNotification, getUpcomingById } from "/src/components/api/apiService.js";

class Reminders extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return [];
  }

  async connectedCallback() {
    await this.render();
  }

  async render() {
    try {

      const userId = localStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User ID not found in localStorage');
      }


      const notifications = await getNotification(userId);
      const upcoming_data = await getUpcomingById(notifications[0].movie_id);
      console.log(upcoming_data);
      console.log(notifications);
      if (!notifications || notifications.length === 0) {
        this.shadowRoot.innerHTML = `
          <style>
            .reminderWrapper {
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
          </style>
          <div class="reminderWrapper">
            <h1>Your Reminders:</h1>
            <p>No upcoming movie reminders found.</p>
          </div>
        `;
        return;
      }

      const movies = upcoming_data;
      console.log(movies.length);
      console.log(movies);

      this.shadowRoot.innerHTML = `
        <style>
          .reminderWrapper {
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
          }
          .upcomingMovieContainer {
            overflow-y: auto;
            max-height: 400px;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .movieCard {
            display: flex;
            gap: 20px;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: #f9f9f9;
          }
          .movieCard img {
            width: 100px;
            height: auto;
            border-radius: 4px;
          }
          .movieDetails {
            flex: 1;
          }
          .movieDetails h2 {
            margin: 0 0 10px;
            font-size: 18px;
          }
          .movieDetails p {
            margin: 5px 0;
            font-size: 14px;
          }
        </style>
        <div class="reminderWrapper">
          <h1>Your Reminders:</h1>
          <div class="upcomingMovieContainer">
      `;
      movies.forEach((movie) => {
        this.shadowRoot.innerHTML += `

<div class="movieCard">
  <img src="${movie.poster_url}" alt="${movie.title} poster" />
  <div class="movieDetails">
    <h2>${movie.title}</h2>
    <p><strong>Description:</strong> ${movie.description}</p>
    <p><strong>Cast:</strong> ${movie.cast_names.join(', ')}</p>
    <p><strong>Duration:</strong> ${movie.duration} minutes</p>
    <p><strong>Genres:</strong> ${movie.genres.join(', ')}</p>
    <p><strong>Release Date:</strong> ${new Date(movie.releasedate).toLocaleDateString()}</p>
    <p><strong>Age Rating:</strong> ${movie.age_rating}</p>
  </div>
</div>
`
        this.shadowRoot.innerHTML += `</div></div>`;
      })
    } catch (error) {
      console.error("Error in render method of reminders component:", error);
      this.shadowRoot.innerHTML = `
        <style>
          .reminderWrapper {
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
          }
          p {
            color: red;
          }
        </style>
        <div class="reminderWrapper">
          <h1>Your Reminders:</h1>
          <p>Error loading reminders: ${error.message}</p>
        </div>
      `;
    }
  }
}

customElements.define("reminders-component", Reminders);

