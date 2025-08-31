const template = document.createElement("template");
template.innerHTML = `
  <style>
    .container {
      
    }
  </style>
`;

export class SeatSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.container = document.createElement("div");
    this.container.classList.add("container");
    
    this.shadowRoot.appendChild(this.container);
    this.container.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["movie_id", "branch", "day", "hour"]
  }

  attributeChangedCallback(attr, oldVal, newVal) {
  }

  connectedCallback() {  
    this.render();
    // this.addEventListener('time-selected', this.onTimeSelected(e));
  }

  async render() {
    
  }

  disconnectedCallback() {}
}

customElements.define("seat-selector", SeatSelector);
