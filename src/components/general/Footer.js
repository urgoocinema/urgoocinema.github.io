class Footer extends HTMLElement {
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

    this.shadowRoot.innerHTML = `
          <style>
            footer {
              background-color: var(--footer-background);
              padding: 0.5vw;
              text-align: center;
              min-height: 1vh;
              display: flex;
              justify-content: space-around;
            }

            footer section {
              display: flex;
              flex-direction: column;
              gap: 1vh;
              font-size: 1em; 
            }     

            footer section h2 {
              border-bottom: 1px solid white;
              padding-bottom: 0.5vh; 
              margin-top: 0; 
              margin-bottom: 0; 
            }

            footer section ul {
              list-style: none;
              padding-left: 0; 
              margin-top: 0; 
              margin-bottom: 0;
              line-height: 1.5rem;
            }

            ul li a { 
              text-decoration: none;
              color: white;
            }
          </style>
                      <footer>
      <section>
        <h2>Main</h2>
        <ul>
          <li><a href="/index.html">Home</a></li>
          <li><a href="/src/pages/upcoming/upcoming.html">Upcoming</a></li>
          <li><a href="#">Theaters</a></li>
          <li><a href="/src/pages/services/services.html">Services</a></li>
        </ul>
      </section>
      <section>
        <h2>Contacts</h2>
        <ul>
          <li><a href="https://www.facebook.com/urgoocinema">Facebook</a></li>
          <li><a href="https://www.youtube.com/@UrgooCinemaUlaanbaatar">Youtube</a></li>
          <li><a href="https://www.instagram.com/urgoocinemas/">Instagram</a></li>
        </ul>
      </section>
      <section>
        <h2>Help</h2>
        <ul>
          <li><a href="#">Contact us</a></li>
          <li><a href="#">Terms of services</a></li>
        </ul>
      </section>
    </footer>
                  `;
  }
}
customElements.define("custom-footer", Footer);