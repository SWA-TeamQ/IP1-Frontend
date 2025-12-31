/* ===============================
   STORAGE UTILITIES
================================ */
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem("users")) || [];
    } catch (error) {
        console.error("Error parsing users:", error);
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function hashPassword(password) {
    return btoa(password) + '_' + password.length;
}

function showMessage(box, message, type) {
    box.textContent = message;
    box.className = `message ${type}`;
    box.style.display = "block";
}

function clearErrors(inputs) {
    inputs.forEach(i => i.classList.remove("error"));
}

/* ===============================
   VALIDATION
================================ */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

/* ===============================
   REGISTER
================================ */
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    const fullNameInput = document.getElementById("fullNameInput");
    const emailInput = document.getElementById("emailInput");
    const phoneInput = document.getElementById("phoneInput");
    const passwordInput = document.getElementById("passwordInput");
    const confirmPasswordInput = document.getElementById("confirmPasswordInput");
    const messageBox = document.getElementById("registerMessage");

    const validateEmail = () => {
        if (emailInput.value && !isValidEmail(emailInput.value)) {
            emailInput.classList.add("error");
            showMessage(messageBox, "Invalid email address.", "error");
        } else {
            emailInput.classList.remove("error");
        }
    };

    const validatePasswordStrength = () => {
        if (passwordInput.value && !isStrongPassword(passwordInput.value)) {
            passwordInput.classList.add("error");
        } else {
            passwordInput.classList.remove("error");
        }
    };

    emailInput.addEventListener("blur", validateEmail);
    passwordInput.addEventListener("blur", validatePasswordStrength);

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = "Creating Account...";
        submitButton.disabled = true;

        clearErrors([fullNameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput]);

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!isValidEmail(email)) {
            emailInput.classList.add("error");
            showMessage(messageBox, "Invalid email address.", "error");
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            return;
        }

        if (!isStrongPassword(password)) {
            passwordInput.classList.add("error");
            showMessage(messageBox, "Password is too weak.", "error");
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            return;
        }

        if (password !== confirmPassword) {
            confirmPasswordInput.classList.add("error");
            showMessage(messageBox, "Passwords do not match.", "error");
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            return;
        }

        const users = getUsers();
        if (users.some(u => u.email === email)) {
            showMessage(messageBox, "Email already registered.", "error");
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            return;
        }

        users.push({ fullName, email, phone, password: hashPassword(password) });
        saveUsers(users);

        showMessage(messageBox, "Account created successfully. Redirecting to login...", "success");

        setTimeout(() => window.location.href = "login.html", 1500);
    });
}

/* ===============================
   LOGIN
================================ */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const messageBox = document.getElementById("loginMessage");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = loginEmail.value.trim();
        const password = loginPassword.value;

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === hashPassword(password));

        if (!user) {
            showMessage(messageBox, "Invalid email or password.", "error");
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(user));
        showMessage(messageBox, "Login successful. Redirecting...", "success");

        setTimeout(() => window.location.href = "../index.html", 1500);
    });
}

/* ===============================
   FORGOT PASSWORD
================================ */
const forgotForm = document.getElementById("forgotForm");
if (forgotForm) {
    const resetEmail = document.getElementById("resetEmail");
    const newPassword = document.getElementById("newPassword");
    const confirmNewPassword = document.getElementById("confirmNewPassword");
    const messageBox = document.getElementById("forgotMessage");

    forgotForm.addEventListener("submit", function (e) {
        e.preventDefault();

        console.log("Forgot password form submitted");

        if (!isStrongPassword(newPassword.value)) {
            showMessage(messageBox, "Password does not meet requirements.", "error");
            return;
        }

        if (newPassword.value !== confirmNewPassword.value) {
            showMessage(messageBox, "Passwords do not match.", "error");
            return;
        }

        const users = getUsers();
        console.log("Users found:", users);
        console.log("Looking for email:", resetEmail.value.trim());
        
        const index = users.findIndex(u => u.email === resetEmail.value.trim());
        console.log("User index found:", index);

        if (index === -1) {
            showMessage(messageBox, "No account found with this email.", "error");
            return;
        }

        users[index].password = hashPassword(newPassword.value);
        saveUsers(users);

        showMessage(messageBox, "Password updated successfully.", "success");

        setTimeout(() => window.location.href = "login.html", 1500);
    });
}

/* ===============================
   GOOGLE LOGIN SIMULATION
================================ */
function simulateGoogleLogin() {
    const box = document.getElementById("loginMessage");

    const googleUser = {
        fullName: "Google User",
        email: "google.user@gmail.com",
        phone: "",
        password: "google-oauth"
    };

    localStorage.setItem("loggedInUser", JSON.stringify(googleUser));
    showMessage(box, "Signed in with Google. Redirecting...", "success");

    setTimeout(() => window.location.href = "index.html", 1500);
}
