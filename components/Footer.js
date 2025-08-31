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
              padding: 1.5vw;
              text-align: center;
              min-height: 20vh;
              display: flex;
              justify-content: space-around;
              padding-bottom: 85px;
            }

            footer section {
              display: flex;
              flex-direction: column;
              gap: 1vh;
              font-size: 2vh; 
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
              line-height: 2rem;
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
          <li><a href="#">Home</a></li>
          <li><a href="#">Imax</a></li>
          <li><a href="#">Theaters</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Bonus Card</a></li>
        </ul>
      </section>
      <section>
        <h2>Contacts</h2>
        <ul>
          <li><a href="#">Facebook</a></li>
          <li><a href="#">Youtube</a></li>
          <li><a href="#">Instagram</a></li>
        </ul>
      </section>
      <section>
        <h2>Help</h2>
        <ul>
          <li><a href="#">Theaters</a></li>
          <li><a href="#">Sales</a></li>
          <li><a href="#">Terms of services</a></li>
        </ul>
      </section>
    </footer>
                  `;
        }
  }
customElements.define("custom-footer", Footer);