import { renderHomePage, renderUpcomingPage, renderServicePage, renderProfilePage, renderLoginPage } from './main.js';

const router = () => {
    const hash = window.location.hash.slice(1) || '/';

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
        case '/login':
            renderLoginPage();
            break;
        default:
            document.body.innerHTML = '<h1>404 - Page Not Found</h1>';
            break;
    }
};

window.addEventListener('load', router);
window.addEventListener('hashchange', router);

