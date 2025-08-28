import './src/components/homepage/movieCard.js';
import './src/components/homepage/movieList.js';
import './src/components/homepage/countdownLive.js';
import './src/components/homepage/Filter.js';
import './src/components/main slider/slider-element.js';
import './src/components/main slider/Slider.js';
import './src/components/moviepage/seatSelector.js';
import './src/components/general/Header.js';
import './src/components/general/Footer.js';
import { getMovies } from './src/components/api/apiService.js';

export const renderHomePage = async () => {
    const movies = await getMovies();
    const container = document.getElementById('movie-content-container');
    container.innerHTML = '';
    const filterSection = container.appendChild(document.createElement('film-filter'));

    if (movies) {
        movies.forEach(movie => {
            const movieCard = container.appendChild(document.createElement('movie-card'));
        });
    } else {
        container.innerHTML = '<p>Failed to load movies. Please try again later.</p>';
    }
}