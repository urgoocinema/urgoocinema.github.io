const template = document.createElement("template");
template.innerHTML = `
  <style>
  </style>
`;

export class MovieApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.container = document.createElement("div");
    this.container.classList.add("container");
    
    this.shadowRoot.appendChild(this.container);
    this.container.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
  }

  connectedCallback() {  

  }

  disconnectedCallback() {}
}

customElements.define("movie-app", movieApp);
