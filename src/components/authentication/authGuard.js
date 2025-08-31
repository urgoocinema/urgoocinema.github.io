import { renderLoginPage } from '/main.js'
class AuthGuard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.checkAuthentication();
    }

    getLoggedInUserId() {
        const userId = window.localStorage.getItem('user_id');
        console.log("Checking for user ID:", userId);
        return userId;
    }

    checkAuthentication() {
        const userId = this.getLoggedInUserId();

        if (!userId) {
            console.warn("No user found. Redirecting to login page...");
            renderLoginPage();
        } else {
            console.log("User is authenticated. Page content will be displayed.");
        }
    }

    disconnectedCallback() {

    }
}


customElements.define('auth-guard', AuthGuard);