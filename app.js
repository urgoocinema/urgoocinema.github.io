

import { renderHomePage } from './main.js';

// A simple routing function to manage different views
const router = () => {
    const path = window.location.pathname;

    // Use a switch statement to call the correct rendering function
    switch (path) {
        case '/':
            // Call the function imported from HomePage.js
            renderHomePage();
            break;
        case '/movie':
            const movieId = new URLSearchParams(window.location.search).get('id');
            renderMoviePage(movieId);
            break;
        default:
            document.body.innerHTML = '<h1>404 - Page Not Found</h1>';
            break;
    }
};

// Listen for page load and navigation events to trigger the router
window.addEventListener('load', router);
window.addEventListener('popstate', router);
