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
      const response = await fetch("../data/user/user-info.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        this.shadowRoot.innerHTML = `this is tickets.js`;

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
