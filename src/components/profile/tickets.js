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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.shadowRoot.innerHTML = `
          <style>
          .upcomingMovieContainer{
            overflow-y: scroll;
          }
          </style>
          <div class="reminderWrapper">
            <h1>Your tickets:</h1>
            <div class="upcomingMovieContainer">
              
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
