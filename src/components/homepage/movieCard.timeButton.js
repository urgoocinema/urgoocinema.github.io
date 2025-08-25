class TimeButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }




    async render() {
        try {

        } catch (error) {

        }
    }
}
customElements.define("time-button", TimeButton);
