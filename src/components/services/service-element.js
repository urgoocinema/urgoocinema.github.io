class Service_element extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._pageName = '';
  }
  static get observedAttributes() {
    return ['service-id'];
  }
  connectedCallback() {
    this.render();
    this._onScroll = this._handleScroll.bind(this);
    window.addEventListener('scroll', this._onScroll);
  }
  disconnectedCallback() {
    window.removeEventListener('scroll', this._onScroll);
  }
  _handleScroll() {
    const container = this.shadowRoot.querySelector('.service-container');
    if (!container) return;
    const rect = this.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;


    let opacity = 1;
    if (rect.bottom < 0 || rect.top > windowHeight) {
      opacity = 0.3;
    } else if (rect.top < 0) {
      opacity = Math.max(0.3, 1 + rect.top / rect.height);
    } else if (rect.bottom > windowHeight) {
      opacity = Math.max(0.3, (windowHeight - rect.top) / rect.height);
    }
    container.style.opacity = opacity;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "service-id" && oldValue !== newValue) {
      this._serviceName = newValue;
      this.render();
    }
  }
  async render() {
    const serviceIdAtt = this.getAttribute('service-id') || this._serviceName;
    if (!serviceIdAtt) {
      this.shadowRoot.innerHTML = `<p>Page id attribute is missing.</p>`;
      return;
    }

    try {
      const response = await fetch("/src/data/services/services.json");
      if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
      const services = await response.json();
      const service = services.find(s => s.id === parseInt(serviceIdAtt, 10));
      if (!service) {
        this.shadowRoot.innerHTML = `<p>Service with ID ${serviceIdAtt} not found.</p>`;
        return;
      }
      this.shadowRoot.innerHTML = `
  <style>
    .service-container {
      position: relative;
      display: flex;
      align-items: stretch;
      min-height: 350px;
      max-width: 1100px;
      width: 90vw;
      height: 60vh;
      border-radius: 1.2em;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      overflow: hidden;
      font-family: 'Roboto Condensed', Arial, sans-serif;
      margin: 2em auto;
      color: #fff;
      background: #232526;
    }

    .service-bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
      // opacity: 0.4;
      transition: transform 0.3s;
      transition: opacity 0.2s ease;
    }
    .service-container:hover .service-bg-img {
        opacity: 1;
    }
    .service-gradient {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, rgba(35,37,38,0.95) 0%, rgba(35,37,38,0.85) 40%, rgba(35,37,38,0.0) 80%);
      z-index: 2;
      pointer-events: none;
    }
    .servicedetails {
      position: relative;
      z-index: 3;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 3em 2.5em 3em 3em;
      width: 60%;
      min-width: 260px;
      max-width: 600px;
    }
    .servicedetails h1 {
      font-size: 2.2rem;
      margin: 0 0 0.7em 0;
      color: #ffd700;
      letter-spacing: 0.03em;
      text-align: left;
      text-shadow: 0 2px 12px #232526;
    }
    .servicedetails p {
      font-size: 1.15rem;
      line-height: 1.7;
      color: #fffbe7;
      text-align: left;
      margin: 0;
      text-shadow: 0 2px 12px #232526;
    }
    @media (max-width: 900px) {
      .service-container {
        flex-direction: column;
        height: auto;
        min-height: 320px;
      }
      .servicedetails {
        width: 100%;
        max-width: 100vw;
        padding: 2em 1em;
        align-items: center;
        text-align: center;
      }
      .servicedetails h1, .servicedetails p {
        text-align: center;
      }
    }
  </style>
  <div class="service-container">
    <img src="${service.images[0]}" alt="${service.name}" class="service-bg-img" />
    <div class="service-gradient"></div>
    <div class="servicedetails">
      <h1>${service.name}</h1>
      <p>${service.description}</p>
    </div>
  </div>
`;
    }
    catch (error) {
      console.error('Error fetching services:', error);
      this.shadowRoot.innerHTML = `<p>Error loading service details.</p>`;
    }
  }
}

customElements.define("service-element", Service_element);
