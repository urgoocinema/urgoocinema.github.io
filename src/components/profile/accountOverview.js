import { getUserById, updateUser } from "../api/apiService.js";

class AccountOverview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._userId = null;
    this._userData = null;
  }

  static get observedAttributes() {
    return ["user-id"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "user-id" && oldValue !== newValue) {
      this._userId = newValue;
      this.render();
    }
  }

  async render() {
    const userIdAtt = this.getAttribute("user-id") || this._userId;

    if (!userIdAtt) {
      this.shadowRoot.innerHTML = `<p>Cannot load user profile.</p>`;
      return;
    }

    const userID = parseInt(userIdAtt, 10);
    if (isNaN(userID)) {
      this.shadowRoot.innerHTML = `<p>Invalid User ID format: "${userIdAtt}". ID must be an integer.</p>`;
      return;
    }

    this.shadowRoot.innerHTML = `<p>Loading user details for ID: ${userID}...</p>`;
    try {
      const response = await getUserById(this._userId);
      this._userData = response.find((user) => user.id == this._userId);

      // if (this._userData) {
      this.shadowRoot.innerHTML = `
          <style>
            .accountOverview {
              display: flex;
              flex-direction: column;
              gap: 10px;

              & .details {
                display: flex;
                flex-direction: column;
                gap: 15px;
              }
              & .detail-wrapper {
                display: flex;
                flex-wrap: wrap;
              }
              & button {
                min-height: 50px;
                max-height: 100px;
                min-width: 100px;
                max-width: 200px;
              }
              & h1 {
                font-size: 2rem;
              }
              & h2 {
                font-size: 1.6rem;
                color: orange;
              }
              & div.gray, div.black {
                font-size: 1.1rem;
              }
              .gray {
                color: var(--gray-text);
              }
              .black {
                color: var(--black-text);
                font-weight: bold;
              }
            }
          </style>
          <div class="accountOverview">
            <h1>Account overview</h1>
            <div class="details">
              <h2>Personal details</h2>
              <div class="detail-wrapper">
                <div class="detailElement">
                  <div class="gray">First Name</div>
                  <div class="first_name black">${this._userData.first_name}</div>
                </div>
                <div class="detailElement">
                  <div class="gray">Last Name</div>
                  <div class="last_name black">${this._userData.last_name}</div>
                </div>
                <div class="detailElement">
                  <div class="gray">Mobile</div>
                  <div class="mobile_number black">${this._userData.mobile}</div>
                </div>
                <div class="detailElement">
                  <div class="gray">E-mail</div>
                  <div class="e_mail black">${this._userData.email}</div>
                </div>
              </div>
              <button class="edit">Edit</button>
            </div>
          </div>
        `;
      this.attachEditListener();
      // } else {
      //   this.shadowRoot.innerHTML = `<p>User with ID ${userID} not found in the data.</p>`;
      // }
    } catch (error) {
      console.error("Error in render method of account overview component:", error);
      this.shadowRoot.innerHTML = `<p>Error loading user data. ${error.message}</p>`;
    }
  }

  attachEditListener() {
    const editButton = this.shadowRoot.querySelector(".edit");
    if (editButton) {
      editButton.addEventListener("click", () => {
        const firstNameDiv = this.shadowRoot.querySelector(".first_name");
        const lastNameDiv = this.shadowRoot.querySelector(".last_name");
        const mobileDiv = this.shadowRoot.querySelector(".mobile_number");
        const emailDiv = this.shadowRoot.querySelector(".e_mail");

        firstNameDiv.innerHTML = `<input class="first_name_input" type="text" value="${firstNameDiv.textContent}" />`;
        lastNameDiv.innerHTML = `<input class="last_name_input" type="text" value="${lastNameDiv.textContent}" />`;
        mobileDiv.innerHTML = `<input class="mobile_input" type="text" value="${mobileDiv.textContent}" />`;
        emailDiv.innerHTML = `<input class="email_input" type="text" value="${emailDiv.textContent}" />`;

        editButton.textContent = "Save";
        editButton.classList.remove("edit");
        editButton.classList.add("save");
        this.attachSaveListener();
      });
    }
  }

  attachSaveListener() {
    const saveButton = this.shadowRoot.querySelector(".save");
    if (saveButton) {
      saveButton.addEventListener("click", async () => {
        const firstNameInput = this.shadowRoot.querySelector(".first_name_input");
        const lastNameInput = this.shadowRoot.querySelector(".last_name_input");
        const mobileInput = this.shadowRoot.querySelector(".mobile_input");
        const emailInput = this.shadowRoot.querySelector(".email_input");

        this._userData.first_name = firstNameInput.value;
        this._userData.last_name = lastNameInput.value;
        this._userData.mobile = mobileInput.value;
        this._userData.email = emailInput.value;


        console.log(this._userData);

        try {
          await updateUser(this._userData);
          await this.render();
        } catch (error) {
          console.error("Failed to update user:", error);
          this.shadowRoot.innerHTML += `<p style="color:red;">Update failed: ${error.message}</p>`;
        }
      });
    }
  }
}

customElements.define("account-overview", AccountOverview);