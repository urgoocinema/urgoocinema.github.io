

import { renderHomePage, renderUpcomingPage, renderServicePage, renderProfilePage } from './main.js';

// A simple routing function to manage different views
const router = () => {
    const hash = window.location.hash.slice(1) || '/'; // Remove '#' and default to '/'

    switch (hash) {
        case '/':
            renderHomePage();
            break;
        case '/movie':
            const movieId = new URLSearchParams(window.location.search).get('id');
            renderHomePage(movieId);
            break;
        case '/upcoming':
            renderUpcomingPage();
            break;
        case '/services':
            renderServicePage();
            break;
        case '/profile':
            renderProfilePage();
            break;
        default:
            document.body.innerHTML = '<h1>404 - Page Not Found</h1>';
            break;
    }
};

// Listen for hash changes and page load
window.addEventListener('load', router);
window.addEventListener('hashchange', router);

