import { getUpcoming } from "/src/components/api/apiService.js";
class UpcomingMovieList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.renderAllMovies();
    }
    async renderAllMovies() {
        try {
            const response = await getUpcoming();


            const allMoviesData = response;
            const movieCount = allMoviesData.length;

            console.log("number of upcoming movies: ", movieCount);
            var htmlString = `
                <style>
                    div {
                        display: flex;
                        flex-direction: column;
                        gap: 2.5rem;
                        padding-left: 10rem;
                        padding-right: 10rem;
                        margin-top: 2rem;
                    }
                    
                </style>
                <div>
            `;
            for (let i = 0; i < movieCount; i++) {
                htmlString += `<upcoming-movie movie-id = "${i + 1}"></upcoming-movie>`;
            }
            htmlString += `</div>`;
            this.shadowRoot.innerHTML = htmlString;
        } catch (error) {
            console.error("Error in Upcoming-movie-list component", error);
        }
    }
}
customElements.define("upcoming-movies-list", UpcomingMovieList);
