class Quickbook extends HTMLElement {
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
          :root {
  --primary-color: #ffa500;
  --secondary-color: #ffb733;
  --text-color: white;
  --bg-color: rgb(22, 22, 22);
  --text-primary: white;

  --quickbook: #ffa500;
  --quickbook-element: black;

  --footer-color: #ffa500;
  --footer-background: rgba(53, 53, 53, 0.24);
  --footer-text: white;
  --box-shadow: rgba(255, 255, 255, 0.1);

  --black-text: black;
  --gray-text: gray;
  --white-text: white;
}
          .quickbook {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background-color: var(--primary-color);
  border-radius: 10px;
  margin-top: 1rem;
  min-height: 50px;
  max-height: 2.5vh;
  width: 100vw;
  position: fixed;
  left: 0;
  bottom: 0;
  color: var(--quickbook-element);}

  .quickbook select,
  .quickbook input[type="date"],
  .quickbook input[type="time"] {
    height:100%;
    padding: 10px;
    padding-top:0;
    border: 1px solid var(--gray-text);
    border-radius: 4px;
    background-color: var(--bg-color);
    color: var(--white-text);
    font-size: 1rem;
    cursor: pointer;}

  .quickbook select option {
    color: var(--black-text);
    background-color: white;
  }

  .quickbook select option:hover,
  .quickbook select option:checked {
    background-color: #f0f0f0;
    color: #333;
  }

  .quickbook button[type="submit"] {
    padding: 10px 15px;
    background-color: var(--black-text);
    color: var(--primary-color);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
  }

  .quickbook button[type="submit"]:hover {
    background-color: var(--lighter-black);
  }

  .quickbook button[type="submit"] svg {
    fill: var(--primary-color);
  }
          </style>
           <section class="quickbook">
      <h1>Quickbook</h1>
      <select name="theather" id="theather">
      <option value="default"></option>
        <option value="theater1">Urguu 1</option>
        <option value="theater2">Urguu 2</option>
        <option value="theater3">Urguu 3</option>
        <option value="theater4">Urguu 4</option>
      </select>
      <select name="movie" id="movie">
        <option value="default"></option>
        <option value="movie1">The snow white</option>
        <option value="movie2">The minecraft movie</option>
        <option value="movie3">The onclave</option>
        <option value="movie4">The woman in the yard</option>
      </select>
      <input type="date" name="enter date" id="date" />
      <input type="time" name="enter time" id="time" />
      <button type="submit">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search"
          viewBox="0 0 16 16">
          <path
            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </button>
    </section>
                  `;
        }
  }
customElements.define("quick-book", Quickbook);