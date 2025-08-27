// src/components/profile/profile-container.js

class ProfileContainer extends HTMLElement {
    constructor() {
        super();
        this.userId = this.getAttribute('user-id');
        if (!this.userId) {
            console.error('ProfileContainer requires a user-id attribute.');
        }

        this.attachShadow({ mode: 'open' });
        this.render();
        this.addEventListeners();
        this.showComponent('AccountOverview'); // Show the default component
    }

    render() {
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
                    width: 100%;
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
                    color: #0056b3;
                    transform: translateX(5px);
                }
                .menuButton.active {
                    background-color: #007bff;
                    color: white;
                    font-weight: 700;
                    box-shadow: 0 2px 10px rgba(0, 123, 255, 0.2);
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
                    min-height: 400px; /* Ensures the container maintains a size */
                    display: flex;
                    flex-direction: column;
                }
            </style>
            <div class="profile-wrapper">
                <section class="menu">
                    <h1>Good afternoon User!!</h1>
                    <button class="menuButton active" data-component="AccountOverview">Account Overview</button>
                    <button class="menuButton" data-component="PersonalDetails">Personal Details</button>
                    <button class="menuButton" data-component="Reminders">Reminders</button>
                    <button class="menuButton" data-component="Tickets">My Tickets</button>
                </section>
                <section class="container">
                    <div class="componentWrapper"></div>
                </section>
            </div>
        `;
    }

    // The rest of your class methods (addEventListeners, showComponent, etc.) remain the same.
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