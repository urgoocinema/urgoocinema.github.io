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
      const upcoming_data = [];
      for (let i = 0; i < notifications.length; i++) {
        console.log(i + "th movie " + notifications[i].movie_id);
        let upcoming_element = await getUpcomingById(notifications[i].movie_id);
        console.log(upcoming_element);
        upcoming_data.push(upcoming_element);
      }
      console.log("upcoming data " + upcoming_data);
      console.log("movie ids " + notifications);
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
      if (movies.length === 0) {
        this.shadowRoot.innerHTML += `no reminders yet.`
        this.shadowRoot.innerHTML += `</div></div>`;
        return;

      }
      movies.forEach((movie) => {
        console.log("movie " + movie[0]);
        this.shadowRoot.innerHTML += `

<div class="movieCard">
  <img src="${movie[0].poster_url}" alt="${movie[0].title} poster" />
  <div class="movieDetails">
    <h2>${movie[0].title}</h2>
    <p><strong>Description:</strong> ${movie[0].description}</p>
    <p><strong>Cast:</strong> ${movie[0].cast_names.join(', ')}</p>
    <p><strong>Duration:</strong> ${movie[0].duration} minutes</p>
    <p><strong>Genres:</strong> ${movie[0].genres.join(', ')}</p>
    <p><strong>Release Date:</strong> ${new Date(movie[0].releasedate).toLocaleDateString()}</p>
    <p><strong>Age Rating:</strong> ${movie[0].age_rating}</p>
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

      `;
    }
  }
}

customElements.define("reminders-component", Reminders);

