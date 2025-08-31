class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._pageName = '';
  }
  static get observedAttributes() {
    return ['page-name'];
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if(name === "page-name" && oldValue !== newValue){
        this._pageName = newValue;
        this.render();
    }
  }
  async render() {
    const pageNameAtt = this.getAttribute('page-name') || this._pageName;
    if(!pageNameAtt){
        this.shadowRoot.innerHTML = `<p>Page name attribute is missing.</p>`;
        return;
    }
    this.shadowRoot.innerHTML = `
          <style>
            .logo {
                aspect-ratio: 10 / 11;
            }

            .active {
                color: orange;
            }
            nav ul {
                display: flex;
                justify-content: center;
                align-items: center;
                list-style: none;
                padding: 1rem;
                background-color: var(--bg-color);

                transition: border-bottom 1s ease;

                & a {
                    text-decoration: none;
                    font-size: clamp(0.8rem, 1.5vw, 1rem);
                    color: var(--text-primary);
                    padding: 1rem;
                    cursor: pointer;
                }

                & a:hover {
                    color: orange;
                }
            }
                .phone-nav {
  background-color: hsl(210, 100%, 10%);

  & .phone-collapse {
    position: absolute;
    top: 5px;
    right: 0;
    font-size: 2.1rem;
  }
}
  @media (min-width: 681px) {
  .phone-nav {
    display: none;
  }

  .desktop-nav {
    display: block;
  }
}

@media (max-width: 680px) and (orientation: portrait) {
  .desktop-nav {
    display: none;
  }

  .phone-nav {
    display: block;
  }
}
          </style>
          <header>
      <nav class="phone-nav">
        <ul>
          <li>
            <a href="#" data-route="/"
              ><img
                src="pics/logo-urgoo.webp"
                alt="Urgoo logo"
                class="logo"
                width="50"
                height="55"
            /></a>
          </li>
          <li><a class="phone-collapse" href="#">☰</a></li>
        </ul>
      </nav>
      <nav class="desktop-nav">
        <ul>
          <li>
            <a href="#" data-route="/"
              ><img
                src="../pics/logo-urgoo.webp"
                alt="Urgoo logo"
                class="logo"
                width="50"
                height="55"
            /></a>
          </li>
          <li><a href="#" data-route="/" class = "${pageNameAtt === 'index' ? 'active' : ''}">НҮҮР</a></li>
          <li><a href="../upcoming/upcoming.html" class = "${pageNameAtt === 'upcoming' ? 'active' : ''}">УДАХГҮЙ ДЭЛГЭЦНЭЭ</a></li>
          <li><a href="../services/services.html" class = "${pageNameAtt === 'services' ? 'active' : ''}">ҮЙЛЧИЛГЭЭНҮҮД</a></li>
          <li><a href="#" class = "${pageNameAtt === 'giftCard' ? 'active' : ''}">БЭЛГИЙН КАРТ</a></li>
          <li><a href="../login/profile.html" class = "${pageNameAtt === 'profile' ? 'active' : ''}">ПРОФАЙЛ</a></li>
        </ul>
      </nav>
    </header>
            `;
    
    // Add event listeners for navigation
    this.shadowRoot.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-route]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        this.navigateToRoute(route);
      }
    });
  }

  async navigateToRoute(route) {
    try {
      const { Router } = await import('./Router.js');
      Router.navigate(route);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }
}
customElements.define("custom-header", Header);
