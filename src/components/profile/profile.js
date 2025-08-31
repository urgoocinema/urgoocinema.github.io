class ProfileContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.userId = this.getAttribute('user-id');
    }
    static get observedAttributes() {
        return ['user-id'];
    }
    connectedCallback() {
        if (!this.userId || this.userId === 'null') {
            console.error('ProfileContainer requires a valid user-id attribute.');
            this.shadowRoot.innerHTML = `<p>User ID is missing.</p>`;
            window.location.hash = '/login'; // Redirect to login route
            return;
        }
        this.render();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'user-id' && oldValue !== newValue) {
            this.userId = newValue;
            if (this.isConnected && this.userId && this.userId !== 'null') {
                this.render();
            } else {
                window.location.hash = '/login'; // Redirect to login if user-id becomes invalid
            }
        }
    }

    async render() {
        try {
            const response = await fetch("/src/data/user/user-info.json");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allUsersData = await response.json();
            const userData = allUsersData.find((user) => user.id == this.userId);

            if (!userData) {
                console.error(`User with ID ${this.userId} not found.`);
                this.shadowRoot.innerHTML = `<p>User not found.</p>`;
                window.location.hash = '/login';
                return;
            }

            const firstName = userData.firstName || 'User';

            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        font-family: 'Roboto Condensed', sans-serif;
                        color: #333;
                    }
                    .profile-wrapper {
                        display: flex;
                        gap: 2rem;
                        padding: 2rem;
                        width: 90%;
                        margin: 0 auto;
                    }
                    .menu {
                        flex-basis: 250px;
                        flex-shrink: 0;
                        background-color: #f8f9fa;
                        padding: 1.5rem 1rem;
                        border-radius: 12px;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                        height: fit-content;
                    }
                    .menu h1 {
                        font-size: 1.75rem;
                        font-weight: 500;
                        margin-bottom: 2rem;
                        color: #212529;
                        border-bottom: 2px solid #e9ecef;
                        padding-bottom: 1rem;
                    }
                    .menuButton {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        padding: 1rem;
                        margin-bottom: 0.5rem;
                        border: none;
                        background-color: transparent;
                        text-align: left;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: all 0.2s ease-in-out;
                        border-radius: 8px;
                        font-weight: 400;
                        color: #495057;
                    }
                    .menuButton:hover {
                        background-color: #e9ecef;
                        color: #f56403;
                        transform: translateX(5px);
                    }
                    .menuButton.active {
                        background-color: rgba(228, 155, 15, 0.5);
                        color: white;
                        font-weight: 700;
                        box-shadow:
                            0 2px 10px rgba(228, 155, 15, 0.5),
                            0 2px 10px rgba(0, 123, 255, 0.2);
                        transform: none;
                    }
                    .container {
                        flex-grow: 1;
                        width: 100%;
                        background-color: #fff;
                        padding: 2rem;
                        border-radius: 12px;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    }
                    .componentWrapper {
                        min-height: 400px;
                        display: flex;
                        flex-direction: column;
                    }
                    .signout {
                        margin-top: 1rem;
                        font-size: 1.75rem;
                        font-weight: 500;
                        margin-bottom: 2rem;
                        color: #fff;
                        padding-bottom: 1rem;
                        border-radius: 12px;
                        width: 100%;
                        background-color: rgba(221, 184, 116, 0.99);
                        cursor: pointer;
                        transition: all 0.2s ease-in-out;
                    }
                    .signout:hover {
                        transform: translateX(5px);
                    }
                </style>
                <div class="profile-wrapper">
                    <div class="buttonSection">
                    <section class="menu">
                        <h1>Good afternoon ${firstName}!!</h1>
                        <button class="menuButton active" data-component="AccountOverview">Account Overview</button>
                        <button class="menuButton" data-component="Reminders">Reminders</button>
                        <button class="menuButton" data-component="Tickets">My Tickets</button>
                    </section>
                    <button class="signout">Sign out</button>
                    </div>
                    <section class="container">
                        <div class="componentWrapper"></div>
                    </section>
                </div>
            `;
            this.addEventListeners();
            this.showComponent('AccountOverview');

        } catch (error) {
            console.error('Error rendering profile container:', error);
            this.shadowRoot.innerHTML = `<p>Error loading user data.</p>`;
            window.location.hash = '/login';
        }
    }

    addEventListeners() {
        const menuButtons = this.shadowRoot.querySelectorAll(".menuButton");
        menuButtons.forEach(button => {
            button.addEventListener("click", () => {
                const componentName = button.dataset.component;
                this.showComponent(componentName);

                menuButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
            });
        });

        const signoutButton = this.shadowRoot.querySelector(".signout");
        signoutButton.addEventListener("click", () => {
            window.localStorage.removeItem('user_id');
            window.location.hash = '/';
        });
    }

    showComponent(componentName) {
        const componentWrapper = this.shadowRoot.querySelector(".componentWrapper");
        if (!componentWrapper) return;

        componentWrapper.innerHTML = "";
        let newComponentElement;

        switch (componentName) {
            case "AccountOverview":
                newComponentElement = document.createElement("account-overview");
                newComponentElement.setAttribute("user-id", this.userId);
                break;
            case "PersonalDetails":
                newComponentElement = document.createElement("personal-details");
                newComponentElement.setAttribute("user-id", this.userId);
                break;
            case "Reminders":
                newComponentElement = document.createElement("reminders-component");
                newComponentElement.setAttribute("user-id", this.userId);
                break;
            case "Tickets":
                newComponentElement = document.createElement("tickets-component");
                newComponentElement.setAttribute("user-id", this.userId);
                break;
            default:
                console.error("Unknown component:", componentName);
                return;
        }

        if (newComponentElement) {
            componentWrapper.appendChild(newComponentElement);
        }
    }
}

customElements.define('profile-container', ProfileContainer);