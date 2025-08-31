import { login, register } from "/src/components/api/apiService.js";

class UserAuth extends HTMLElement {
    constructor() {
        super();
        // Attach a shadow DOM to encapsulate the component's styles and markup.
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }


    _toggleForm(formType) {
        const loginForm = this.shadowRoot.getElementById('login-form');
        const registerForm = this.shadowRoot.getElementById('register-form');
        loginForm.classList.toggle('hidden', formType !== 'login');
        registerForm.classList.toggle('hidden', formType !== 'register');
    }


    _showMessage(type, text) {
        const messageContainer = this.shadowRoot.getElementById('message-container');
        messageContainer.textContent = text;
        messageContainer.className = `message ${type}`;
        messageContainer.style.display = 'block';
    }

    _showError(elementId, show) {
        const element = this.shadowRoot.getElementById(elementId);
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    }

    _isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    _isValidMobile(mobile) {
        return /^(80|83|85|86|88|89|90|91|93|94|95|96|97|98|99)\d{6}$/.test(mobile);
    }


    async _handleLogin(e) {
        e.preventDefault();
        this._showMessage('info', 'Logging in...');
        const email = this.shadowRoot.getElementById('login-email').value.trim();
        const password = this.shadowRoot.getElementById('login-password').value;

        let isValid = true;
        if (!this._isValidEmail(email)) {
            this._showError('login-email-error', true);
            isValid = false;
        } else {
            this._showError('login-email-error', false);
        }

        if (password.length < 6) {
            this._showError('login-password-error', true);
            isValid = false;
        } else {
            this._showError('login-password-error', false);
        }

        if (!isValid) return;

        try {
            const result = await login(email, password);
            if (result) {
                this._showMessage('success', `Login successful! Welcome, ${result.user.firstName}`);
                // Store user info and redirect
                localStorage.setItem('user_id', result.user.id);
                window.location.href = '/src/pages/profile-page.html';
            } else {
                this._showMessage('error', 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            this._showMessage('error', 'An unexpected error occurred. Please try again.');
        }
    }


    async _handleRegister(e) {
        e.preventDefault();
        this._showMessage('info', 'Registering...');
        const firstName = this.shadowRoot.getElementById('register-firstname').value.trim();
        const lastName = this.shadowRoot.getElementById('register-lastname').value.trim();
        const mobile = this.shadowRoot.getElementById('register-mobile').value.trim();
        const email = this.shadowRoot.getElementById('register-email').value.trim();
        const password = this.shadowRoot.getElementById('register-password').value;

        let isValid = true;
        if (!firstName) { this._showError('register-firstname-error', true); isValid = false; } else { this._showError('register-firstname-error', false); }
        if (!lastName) { this._showError('register-lastname-error', true); isValid = false; } else { this._showError('register-lastname-error', false); }
        if (!this._isValidMobile(mobile)) { this._showError('register-mobile-error', true); isValid = false; } else { this._showError('register-mobile-error', false); }
        if (!this._isValidEmail(email)) { this._showError('register-email-error', true); isValid = false; } else { this._showError('register-email-error', false); }
        if (password.length < 6) { this._showError('register-password-error', true); isValid = false; } else { this._showError('register-password-error', false); }
        if (!isValid) return;

        try {
            const userDetails = { firstName, lastName, mobile, email, password };
            const result = await register(userDetails);
            if (result) {
                this._showMessage('success', 'Registration successful! You can now log in.');
                this._toggleForm('login');
            } else {
                this._showMessage('error', 'Registration failed. Please try again.');
            }
        } catch (err) {
            this._showMessage('error', 'An unexpected error occurred. Please try again.');
        }
    }


    render() {
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .form-container {
          width: 90%;
          max-width: 400px;
          padding: 2rem;
          background-color: #36393f;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          margin: 2rem auto;
          font-family: Arial, sans-serif;
          color: #fff;
        }
        .form-content {
          display: flex;
          flex-direction: column;
        }
        .form-content.hidden {
          display: none;
        }
        h2 {
          text-align: center;
          color: #7289da;
          margin-bottom: 1.5rem;
        }
        .message {
          padding: 10px;
          margin-bottom: 1rem;
          border-radius: 4px;
          text-align: center;
          display: none; /* Initially hidden */
        }
        .message.success {
          background-color: #43b581;
          color: #fff;
        }
        .message.error {
          background-color: #f04747;
          color: #fff;
        }
        .message.info {
          background-color: #7289da;
          color: #fff;
        }
        form div {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #4f545c;
          border-radius: 4px;
          background-color: #40444b;
          color: #fff;
          font-size: 1rem;
          box-sizing: border-box;
        }
        input:focus {
          outline: none;
          border-color: #7289da;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          background-color: #7289da;
          color: #fff;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        button:hover {
          background-color: #677bc4;
        }
        .error {
          color: #f04747;
          font-size: 0.8rem;
          margin-top: 0.25rem;
          display: none;
        }
        .toggle-link {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.9rem;
        }
        .toggle-link a {
          color: #7289da;
          text-decoration: none;
          cursor: pointer;
        }
        .toggle-link a:hover {
          text-decoration: underline;
        }
      </style>
      <div class="form-container">
        <div id="message-container" class="message"></div>
        <!-- Login Form -->
        <div id="login-form" class="form-content">
          <h2>Login</h2>
          <form id="login">
            <div>
              <label for="login-email">Email</label>
              <input type="email" id="login-email" required>
              <p id="login-email-error" class="error">Please enter a valid email.</p>
            </div>
            <div>
              <label for="login-password">Password</label>
              <input type="password" id="login-password" required>
              <p id="login-password-error" class="error">Password must be at least 6 characters.</p>
            </div>
            <button type="submit">Login</button>
          </form>
          <p class="toggle-link">
            Don't have an account? <a id="register-toggle-link">Register</a>
          </p>
        </div>
        <!-- Register Form -->
        <div id="register-form" class="form-content hidden">
          <h2>Register</h2>
          <form id="register">
            <div>
              <label for="register-firstname">First Name</label>
              <input type="text" id="register-firstname" required>
              <p id="register-firstname-error" class="error">First name is required.</p>
            </div>
            <div>
              <label for="register-lastname">Last Name</label>
              <input type="text" id="register-lastname" required>
              <p id="register-lastname-error" class="error">Last name is required.</p>
            </div>
            <div>
              <label for="register-mobile">Mobile</label>
              <input type="text" id="register-mobile" required>
              <p id="register-mobile-error" class="error">Please enter a valid mobile number (e.g., 99123456).</p>
            </div>
            <div>
              <label for="register-email">Email</label>
              <input type="email" id="register-email" required>
              <p id="register-email-error" class="error">Please enter a valid email.</p>
            </div>
            <div>
              <label for="register-password">Password</label>
              <input type="password" id="register-password" required>
              <p id="register-password-error" class="error">Password must be at least 6 characters.</p>
            </div>
            <button type="submit">Register</button>
          </form>
          <p class="toggle-link">
            Already have an account? <a id="login-toggle-link">Login</a>
          </p>
        </div>
      </div>
    `;

        // Attach event listeners after the DOM has been rendered
        this.shadowRoot.getElementById('login').addEventListener('submit', this._handleLogin.bind(this));
        this.shadowRoot.getElementById('register').addEventListener('submit', this._handleRegister.bind(this));
        this.shadowRoot.getElementById('login-toggle-link').addEventListener('click', () => this._toggleForm('login'));
        this.shadowRoot.getElementById('register-toggle-link').addEventListener('click', () => this._toggleForm('register'));
    }
}
