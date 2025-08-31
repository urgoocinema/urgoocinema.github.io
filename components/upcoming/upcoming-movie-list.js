class UpcomingMovieList extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"});
    }
    connectedCallback(){
        this.renderAllMovies();
    }
    async renderAllMovies(){
        try{
            const response = await fetch("../data/upcoming/upcoming.json");
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allMoviesData = await response.json();
            const movieCount = allMoviesData.length;
            console.log("number of upcoming movies: ",movieCount);
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
            for(let i = 0 ; i < movieCount; i++){ // Start from 0 to include all movies
                htmlString+=`<upcoming-movie movie-id = "${i+1}"></upcoming-movie>`;
            }
            htmlString+=`</div>`;
            this.shadowRoot.innerHTML = htmlString;
        }catch(error){
            console.error("Error in Upcoming-movie-list component",error);
        }
    }
}
customElements.define("upcoming-movies-list", UpcomingMovieList);
