class theaterSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._movieId = null;
        this._branchNo = null;
    }
    static get observedAttributes() {
        return ["movie-id"];
    }
    connectedCallback() {
        this.render();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "movie-id" && oldValue !== newValue) {
            this._movieId = newValue;
            this.render();
        }
    }
    async render() {
        const movieId = this.getAttribute("movie-id") || this._movieId;
        if (!movieId) {
            this.shadowRoot.innerHTML = `<p>Please provide a movie ID.</p>`;
            return;
        }
        this.shadowRoot.innerHTML = `<p>Loading...</p>`;
        try {
            const response = await fetch("../data/movies-list.json");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const allMoviesData = await response.json();
            const movieData = allMoviesData.movies.find(
                (movie) => movie.id.toString() === movieId
            );
            if (!movieData) {
                this.shadowRoot.innerHTML = `<p>Movie with ID ${movieId} not found. </p>`;
                return;
            }
            const branchNames = Object.keys(movieData.showtimes);
            console.log("Available branches:", branchNames);

            let selectString = "";
            branchNames.forEach((branchName) => {
                selectString += `<option value="${branchName}">${branchName}</option>`;
            });
            console.log(selectString);
            this.shadowRoot.innerHTML = `
                <style>
                    :root {
                    --primary-color: #ffa500;
  --secondary-color: #ffb733;
  --text-color: white;
  --bg-color: rgb(22, 22, 22);
  --screen-color: rgb(154, 153, 153);
  --screen-hover: rgb(42, 42, 42);
  --border-color: white;

  --black-text: black;
  --lighter-black: rgb(32, 32, 32);
  --gray-text: gray;
  --gray-lighter-text: rgb(174, 173, 173);
  --white-text: white;
}
  select{
  appearance: none;
                    background-color: transparent;
                    border: none;
                    padding: 0 1em 0 0;
                    margin: 0;
                    width: 100%;
                    font-family: inherit;
                    font-size: inherit;
                    cursor: inherit;
                    line-height: inherit;
                    color: var(--white-text);

                    outline: none;
  }
    select option{
            background-color: var(--black-text);
    color: var(--white-text);
    padding-left: 3em;
    border: 2.3px solid var(--gray-text);
    border-radius: 8px;
    cursor: pointer;
    }
    .select{
    width: 100%;
    border: 2.3px solid var(--gray-text);
    border-radius: 8px;
    padding: 0.25em 0.5em;
    font-size: 1.25rem;
    cursor: pointer;
    background-color: var(--black-text);

    display: grid;
    grid-template-areas: "select";
    align-items: center;
    }
                    
                </style>
                <div class = "select">
                <select name="theather" id="theather">
                <option value="DefaultSelection"></option>
                ${selectString}
                </select>
                </div>
            `;

            const selectElement = this.shadowRoot.querySelector("#theather");
            selectElement.addEventListener("change",(event)=>{
                const selectedTheater = event.target.value;
                this.dispatchEvent(new CustomEvent('theater-selected', {
                    detail: {theater: selectedTheater},
                    bubbles: true, //understand those code!!!
                    composed: true
                }));
            });
        } catch (error) {
            console.error("Error fetching movie data:", error);
            this.shadowRoot.innerHTML = `<p>Error fetching movie data. Please try again later.</p>`;
        }
    }
}
customElements.define("theater-selector", theaterSelector);
