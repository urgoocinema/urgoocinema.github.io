// Toggle between login and register forms
function toggleForm(formType) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    loginForm.classList.toggle('hidden', formType !== 'login');
    registerForm.classList.toggle('hidden', formType !== 'register');
}

// Validate email format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate mobile format (Mongolian mobile numbers, e.g., 99123456)
function isValidMobile(mobile) {
    return /^(80|83|85|86|88|89|90|91|93|94|95|96|97|98|99)\d{6}$/.test(mobile);
}

// Show/hide error messages
function showError(elementId, show) {
    document.getElementById(elementId).style.display = show ? 'block' : 'none';
}

// Login form submission
document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    let isValid = true;

    // Validate email
    if (!isValidEmail(email)) {
        showError('login-email-error', true);
        isValid = false;
    } else {
        showError('login-email-error', false);
    }

    // Validate password
    if (password.length < 6) {
        showError('login-password-error', true);
        isValid = false;
    } else {
        showError('login-password-error', false);
    }

    if (!isValid) return;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (response.ok) {
            alert('Login successful! Welcome, ' + result.user.firstName);
            // Redirect or update UI as needed
        } else {
            alert('Login failed: ' + result.message);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
});

// Register form submission
document.getElementById('register').addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('register-firstname').value.trim();
    const lastName = document.getElementById('register-lastname').value.trim();
    const mobile = document.getElementById('register-mobile').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    let isValid = true;

    // Validate first name
    if (!firstName) {
        showError('register-firstname-error', true);
        isValid = false;
    } else {
        showError('register-firstname-error', false);
    }

    // Validate last name
    if (!lastName) {
        showError('register-lastname-error', true);
        isValid = false;
    } else {
        showError('register-lastname-error', false);
    }

    // Validate mobile
    if (!isValidMobile(mobile)) {
        showError('register-mobile-error', true);
        isValid = false;
    } else {
        showError('register-mobile-error', false);
    }

    // Validate email
    if (!isValidEmail(email)) {
        showError('register-email-error', true);
        isValid = false;
    } else {
        showError('register-email-error', false);
    }

    // Validate password
    if (password.length < 6) {
        showError('register-password-error', true);
        isValid = false;
    } else {
        showError('register-password-error', false);
    }

    if (!isValid) return;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, mobile, email, password })
        });
        const result = await response.json();
        if (response.ok) {
            alert('Registration successful! Please log in.');
            toggleForm('login');
        } else {
            alert('Registration failed: ' + result.message);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
});