class Screenselector extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this._movieId = null;
        this._selectedTheater = null; // Store the selected theater
        this._movieData = null; // Store fetched movie data

        // Bind the event handler method to the instance
        this._handleTheaterSelected = this._handleTheaterSelected.bind(this);
        this._handleScreenClick = this._handleScreenClick.bind(this);
    }
    static get observedAttributes(){
        return ['movie-id'];
    }
    connectedCallback(){
        this.shadowRoot.addEventListener('click', this._handleScreenClick);
        document.addEventListener('theater-selected', this._handleTheaterSelected);
        this.fetchMovieData(); // Fetch data initially
    }

    disconnectedCallback() {
        // Clean up the event listener when the component is removed from the DOM
        document.removeEventListener('theater-selected', this._handleTheaterSelected);
        this.shadowRoot.removeEventListener('click', this._handleScreenClick);
    }
    attributeChangedCallback(name,oldValue,newValue){
        if(name === "movie-id" && oldValue !== newValue){
            this._movieId = newValue;
            this.fetchMovieData(); // Re-fetch data if movie ID changes
        }
    }
    async render(){
        const movieId = this.getAttribute("movie-id")||this._movieId;
        if(!movieId){
            this.shadowRoot.innerHTML = `<p>Please provide a movie ID.</p>`;
            return;
        }

        if (!this._movieData) {
            this.shadowRoot.innerHTML = `<p>Loading movie data...</p>`;
            return; // Wait for data to be fetched
        }

        if (!this._selectedTheater || this._selectedTheater === "DefaultSelection") {
             this.shadowRoot.innerHTML = `<p>Please select a theater first.</p>`;
             return;
        }

        const theaterShowtimes = this._movieData.showtimes[this._selectedTheater];

        if (!theaterShowtimes) {
            this.shadowRoot.innerHTML = `<p>No showtimes available for ${this._selectedTheater}.</p>`;
            return;
        }

        // --- Render logic using theaterShowtimes ---
        let showtimesHTML = `<style>
            /* Add your styles here */
            .day{
                margin-top:1em;
                margin-bottom:1em;
                display:flex;
                flex-direction: column;
                gap: 2rem;
            }
            .screen-container{
                display:flex;
                flex-direction:row;
                flex-wrap:wrap;
                gap:1rem;
            }
            .screen{
                min-width:10rem;
                padding: 10px;
                background-color: var(--black-text);
                border-radius: 8px;
                border: 2.3px solid var(--gray-text);

                transition: transform 0.5s ease, border-color 0.5s ease,
                background-color 0.5s ease;

                & p {
                    color: var(--gray-lighter-text);
                    line-height: 2em;
                }

                & span {
                    color: var(--white-text);
                    font-weight: 800;
                }

                & p:nth-child(2) {
                    color: var(--screen-color);
                }
            }
            .screen:hover {
                transform: translateY(-10px);
                cursor: pointer;
                border-color: azure;
                background-color: var(--screen-hover);
            }
        </style>`;
        let screenString = "";

        for (const day in theaterShowtimes) {
            const screensForDay = theaterShowtimes[day].map(time =>`
                <div class = "screen" data-day="${day}" data-time="${time}" data-screen="Screen X">
                    <p><span>${time}</span> - HH:MM</p>
                    <p>Screen X</p>
                    <p>From 10,000 MNT</p>
                </div>
                `
            ).join(' ');
            showtimesHTML += `
                <div class="day">
                    <h3>${day}</h3>
                    <div class="screen-container">
                        ${screensForDay}
                    </div>
                </div>
            `;
        }

        this.shadowRoot.innerHTML = showtimesHTML;
        // --- End Render Logic ---
    }

    // Separate function to fetch data
    async fetchMovieData() {
        const movieId = this.getAttribute("movie-id") || this._movieId;
        if (!movieId) return;

        try{
            const response = await fetch("../data/movies-list.json");
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allMoviesData = await response.json();
            this._movieData = allMoviesData.movies.find(
                (movie)=>movie.id.toString() === movieId
            );
            this.render(); // Render after fetching data
        } catch (error){
            console.error("Error fetching movie data: ",error);
            this.shadowRoot.innerHTML = `<p>Error fetching movie data: ${error.message}</p>`;
            this._movieData = null; // Reset movie data on error
        }
    }
    
    _handleTheaterSelected(event){
        const selectedTheater = event.detail.theater;
        this._selectedTheater = selectedTheater;
        this.render();
    }
    _handleScreenClick(event){
        const screenElement = event.target.closest('.screen');
        if(screenElement && this._movieData){
            const day = screenElement.dataset.day;
            const time = screenElement.dataset.time;
            const screenNumber = screenElement.dataset.screen;
            
            this.dispatchEvent(new CustomEvent('screen-selected',{
                detail:{
                    movieId: this._movieId,
                    theater: this._selectedTheater,
                    movieName: this._movieData.title,
                    day: day,
                    time: time,
                    screen: screenNumber
                },
                bubbles: true,
                composed: true
            }))
        }
    }
}
customElements.define("screen-selector", Screenselector);