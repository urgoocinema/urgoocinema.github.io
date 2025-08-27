class AccountOverview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._userId = null;
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
      this.shadowRoot.innerHTML = `<p>cant load user profile.</p>`;
      return;
    }

    const userID = parseInt(userIdAtt, 10);
    if (isNaN(userID)) {
      this.shadowRoot.innerHTML = `<p>Invalid Movie ID format: "${userIdAtt}". ID must be an integer.</p>`;
      return;
    }

    this.shadowRoot.innerHTML = `<p>Loading user details for ID: ${userID}...</p>`;
    try {
      const response = await fetch("/src/data/user/user-info.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allUsersData = await response.json();
      const userData = allUsersData.find((user) => user.id === userID);

      if (userData) {
        this.shadowRoot.innerHTML = `
        <style>
        .accountOverview {
            display: flex;
            flex-direction:column;
            gap:10px;

            & .details{
              display: flex;
              flex-direction:column;
              gap: 15px;
            }
            & .detail-wrapper{
              display:flex;
              flex-wrap:wrap;
            }

            & button {
              min-height:50px;
              max-height: 100px;
              min-width: 100px;
              max-width:200px;
            }
            & h1 {
              font-size: 2rem;
            }
            & h2 {
              font-size: 1.6rem;
              color:orange;
            }
            & div.gray, div.black{
              font-size: 1.1rem;
            }

            .gray{
              color: var(--gray-text);
            }
            .black{
              color: var(--black-text);
              font-weight: bold;
            }
        }
        </style>
            <div class="accountOverview">
            <h1>Account overview</h1>
                <div class="details">
                        <h2>Personal details</h2>
                        <div class="detail-wrapper>
                          <div class="detailElement">
                            <div class="gray">First Name</div>
                            <div class="first_name black">${userData.firstName}</div>
                          </div>
                          <div class="detailElement">
                            <div class="gray">Last Name</div>
                            <div class="last_name black">${userData.lastName}</div>
                          </div>
                          <div class="detailElement">
                            <div class="gray">Mobile</div>
                            <div class="mobile_number black">${userData.mobile}</div>
                          </div>
                          <div class="detailElement">
                            <div class="gray">E-mail</div>
                            <div class="e_mail black">${userData.email}</div>
                          </div>
                        </div>
                    <button onClick="toggleEdit()">Edit</button>
                </div> 
            </div>
                `;
      } else {
        this.shadowRoot.innerHTML = `<p>User with ID ${userID} not found in the data.</p>`;
      }
      const editButton = this.shadowRoot.querySelector('button');
      if (editButton) {
        editButton.addEventListener('click', () => {
          const firstNameDiv = this.shadowRoot.querySelector('.first_name');
          const lastNameDiv = this.shadowRoot.querySelector('.last_name');
          const mobileDiv = this.shadowRoot.querySelector('.mobile_number');
          const emailDiv = this.shadowRoot.querySelector('.e_mail');

          firstNameDiv.innerHTML = `<input type="text" value="${firstNameDiv.textContent}" />`;
          lastNameDiv.innerHTML = `<input type="text" value="${lastNameDiv.textContent}" />`;
          mobileDiv.innerHTML = `<input type="text" value="${mobileDiv.textContent}" />`;
          emailDiv.innerHTML = `<input type="text" value="${emailDiv.textContent}" />`;

          editButton.textContent = 'Save';

        })
      }
    } catch (error) {
      console.error(
        "Error in render method of account overview component:",
        error
      );
      this.shadowRoot.innerHTML = `<p>Error loading user data. ${error.message}</p>`;
    }
  }
  toggleEdit() {
    alert('edit button clicked');
  }
}
customElements.define("account-overview", AccountOverview);

