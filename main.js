import './src/components/homepage/movieCard.js';
import './src/components/homepage/movieList.js';
import './src/components/homepage/countdownLive.js';
import './src/components/homepage/Filter.js';

import './src/components/main slider/slider-element.js';
import './src/components/main slider/Slider.js';

import './src/components/moviepage/seatSelector.js';

import './src/components/general/Header.js';
import './src/components/general/Footer.js';

import './src/components/upcoming/upcoming-movie.js';
import './src/components/upcoming/upcoming-movie-list.js';
import './src/components/upcoming/upcoming-slider.js';
import './src/components/upcoming/upcoming-slider-element.js';

import './src/components/services/service-element.js';

import './src/components/profile/accountOverview.js';
import './src/components/profile/personalDetails.js';
import './src/components/profile/reminders.js';
import './src/components/profile/tickets.js';
import './src/components/profile/profile.js';

import './src/components/authentication/authGuard.js';
import './src/components/login/userAuth.js';


export const renderHomePage = async () => {
    const body = document.querySelector('body');
    body.innerHTML = '';
    body.appendChild(document.createElement('custom-header')).setAttribute('page-name', 'index');
    const main = body.appendChild(document.createElement('main'));
    main.innerHTML = '';
    const featuredSlider = main.appendChild(document.createElement('section'));
    featuredSlider.classList.add('featured');
    featuredSlider.appendChild(document.createElement('movie-slider'));

    const ongoingSection = main.appendChild(document.createElement('section'));
    ongoingSection.classList.add('ongoing');
    ongoingSection.appendChild(document.createElement('film-filter'));
    ongoingSection.appendChild(document.createElement('movie-list'));

}

export const renderUpcomingPage = async () => {
    const body = document.querySelector('body');
    body.innerHTML = '';
    body.appendChild(document.createElement('custom-header')).setAttribute('page-name', 'upcoming');
    const main = body.appendChild(document.createElement('main'));
    main.innerHTML = '';
    const featured = main.appendChild(document.createElement('section'));
    featured.classList.add('featured');
    featured.appendChild(document.createElement('upcoming-movie-slider'));

    const upcomingSection = main.appendChild(document.createElement('section'));
    upcomingSection.classList.add('upcoming');
    upcomingSection.appendChild(document.createElement('upcoming-movies-list'));

}

export const renderServicePage = async () => {
    const body = document.querySelector('body');
    body.innerHTML = '';
    body.appendChild(document.createElement('custom-header')).setAttribute('page-name', 'services');
    const main = body.appendChild(document.createElement('main'));
    main.innerHTML = '';
    const service1 = main.appendChild(document.createElement('service-element')).setAttribute('service-id', '1');
    const service2 = main.appendChild(document.createElement('service-element')).setAttribute('service-id', '2');
    const service3 = main.appendChild(document.createElement('service-element')).setAttribute('service-id', '3');
}

export const renderProfilePage = async () => {
    const userId = window.localStorage.getItem("user_id");
    if (!userId || userId === 'null' || userId.trim() === '') {
        window.location.hash = '/login';
        return;
    }
    const body = document.querySelector('body');
    body.innerHTML = '';
    body.appendChild(document.createElement('custom-header')).setAttribute('page-name', 'profile');
    const main = body.appendChild(document.createElement('main'));
    main.innerHTML = '';
    const profileContainer = document.createElement('profile-container');
    profileContainer.setAttribute('user-id', userId);
    main.appendChild(profileContainer);
}
export const renderLoginPage = async () => {
    const body = document.querySelector('body');
    body.innerHTML = '';
    body.appendChild(document.createElement('user-auth'));
}
