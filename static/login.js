const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// =======================
// REGISTER LOGIC
// =======================
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // check if user already exists
    const exists = users.find(user => user.username === username);

    if (exists) {
        alert("⚠ Username already exists!");
        return;
    }

    // save user
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("✅ Registration successful! Please login.");

    registerForm.reset();
    container.classList.remove('active'); // go to login
});

// =======================
// LOGIN LOGIC
// =======================
const loginForm = document.getElementById("loginForm");
const popupToggle = document.getElementById('popup-toggle');

const redirectUrl = "/"; // home page

loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(user => 
        user.username === username && user.password === password
    );

    if (validUser) {
        popupToggle.checked = true;
        loginForm.reset();

        setTimeout(() => {
            popupToggle.checked = false;
            window.location.href = redirectUrl;
        }, 2000);

    } else {
        alert("❌ Invalid username or password!");
    }
});
