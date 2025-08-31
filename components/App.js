import './Router.js';
import './HomePage.js';
import './FeaturedSlideshow.js';
import './SeatSelectionPage.js';

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
    
    .app-container {
      width: 100%;
      min-height: 100vh;
    }
    
    custom-header {
      display: block;
      width: 100%;
    }
    
    app-router {
      display: block;
      width: 100%;
      flex: 1;
    }
    
    custom-footer {
      display: block;
      width: 100%;
    }
  </style>
  
  <div class="app-container">
    <custom-header page-name="index"></custom-header>
    <app-router></app-router>
    <custom-footer></custom-footer>
  </div>
`;

export class MovieApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
  }

  connectedCallback() {  
    // The router will handle all the routing logic
  }

  disconnectedCallback() {}
}

customElements.define("movie-app", MovieApp);
