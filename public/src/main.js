import showSlides, {plusSlides, currentSlide} from './utils/slideshow.js';
import './components/movieCard.js';
import './components/movieList.js';
import './components/countdownLive.js';
import './components/seatSelector.js';
import './components/orderSteps.js';

document.querySelector(".prev").addEventListener("click", () => {
    plusSlides(-1);
});
document.querySelector(".next").addEventListener("click", () => {
    plusSlides(1);
});


showSlides(1);
