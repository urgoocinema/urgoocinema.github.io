export class Router extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentRoute = null;
    
    // Create main container
    this.container = document.createElement("div");
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.shadowRoot.appendChild(this.container);

    // Bind methods
    this.handlePopState = this.handlePopState.bind(this);
    this.navigate = this.navigate.bind(this);
    
    // Set up routes
    this.routes = {
      '/': 'home-page',
      '/home': 'home-page', 
      '/seat-selection': 'seat-selection-page'
    };
  }

  connectedCallback() {
    // Listen for browser navigation (back/forward buttons)
    window.addEventListener('popstate', this.handlePopState);
    
    // Handle initial route
    this.handleRoute();
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.handlePopState);
  }

  handlePopState(event) {
    this.handleRoute();
  }

  getCurrentPath() {
    return window.location.pathname || '/';
  }

  navigate(path, data = {}) {
    // Update browser URL without triggering a page reload
    window.history.pushState(data, '', path);
    this.handleRoute();
  }

  handleRoute() {
    const path = this.getCurrentPath();
    const componentName = this.routes[path] || this.routes['/'];
    
    // Clear current content
    this.container.innerHTML = '';
    
    // Create and append the appropriate component
    const component = document.createElement(componentName);
    
    // Pass any state data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams.entries()) {
      component.setAttribute(key, value);
    }
    
    this.container.appendChild(component);
    this.currentRoute = path;
  }

  // Method to be called by other components to navigate
  static navigate(path, params = {}) {
    // Try to find router in shadow DOM first
    const movieApp = document.querySelector('movie-app');
    let router = null;
    
    if (movieApp && movieApp.shadowRoot) {
      router = movieApp.shadowRoot.querySelector('app-router');
    }
    
    // Fallback to document query
    if (!router) {
      router = document.querySelector('app-router');
    }
    
    if (router) {
      // Build URL with parameters
      const url = new URL(path, window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
      
      router.navigate(url.pathname + url.search);
    } else {
      console.error('Router not found. Available elements:', {
        movieApp: !!movieApp,
        shadowRoot: !!(movieApp && movieApp.shadowRoot),
        appRouter: !!document.querySelector('app-router')
      });
    }
  }
}

customElements.define('app-router', Router);
