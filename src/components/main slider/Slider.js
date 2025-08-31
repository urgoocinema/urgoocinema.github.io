class MovieSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.slideIndex = 1;
  }

  connectedCallback() {
    this.render().then(() => {
      this.initSlider();
    });
  }

  initSlider() {
    this.slides = this.shadowRoot.querySelectorAll("slider-element");
    if (this.slides.length > 0) {
      this.showSlides(this.slideIndex);

      const prevButton = this.shadowRoot.querySelector(".prev");
      const nextButton = this.shadowRoot.querySelector(".next");

      if (prevButton) {
        prevButton.addEventListener("click", () => this.plusSlides(-1));
      }
      if (nextButton) {
        nextButton.addEventListener("click", () => this.plusSlides(1));
      }
    }
  }

  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n) {
    if (!this.slides || this.slides.length === 0) return;
    let i;
    if (n > this.slides.length) { this.slideIndex = 1 }
    if (n < 1) { this.slideIndex = this.slides.length }
    for (i = 0; i < this.slides.length; i++) {
      this.slides[i].style.display = "none";
    }
    this.slides[this.slideIndex - 1].style.display = "block";
  }

  async render() {
    try {
      const response = await fetch("/src/data/ongoing/movies-list.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let sliderHTML = `
          <style>
            .background {
              background: linear-gradient(180deg, #d17f148a 10%, #1b1d1cb0 99%);
              padding: 20px;
              
            }
            .slideshow-container {
            
              width: 85%;
              position: relative; 
              margin: auto;
              overflow: hidden;
              
            }

            /* Styles for prev/next buttons */
            .prev,
            .next {
              cursor: pointer;
              position: absolute;
              top: 50%;
              width: auto;
              margin-top: -22px;
              padding: 16px;
              color: white;
              font-weight: bold;
              font-size: 2.5em; /* Adjust as needed */
              transition: 0.3s ease-out;
              border-radius: 0 3px 3px 0;
              user-select: none; 
              z-index: 10; 
            }

            .next {
              right: 0;
              border-radius: 3px 0 0 3px;
            }

            .prev:hover,
            .next:hover {
              background-color: rgba(0, 0, 0, 0.8);
              color: orange;
            }
          </style>
          <div class="background">
          <div class="slideshow-container">
        `;

      for (let i = 0; i < 4; i++) {
        sliderHTML += `<slider-element movie-id = "${i + 1}"></slider-element>`;
      }

      sliderHTML += `
            <a class="prev">&#10094;</a>
            <a class="next">&#10095;</a>
          </div>
          </div>
        `;
      this.shadowRoot.innerHTML = sliderHTML;
    } catch (error) {
      console.error(
        "Error in render method of Slider-element component:",
        error
      );
      this.shadowRoot.innerHTML = `<p>Error loading movie data. ${error.message}</p>`;
    }
  }
}
customElements.define("movie-slider", MovieSlider);