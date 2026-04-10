const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener
('click',() =>
    {
      container.classList.add('active');
    });

loginBtn.addEventListener
('click',() =>
    {
      container.classList.remove('active');
    });    

// Get references
const loginForm = document.querySelector('.form-box.login form');
const popupToggle = document.getElementById('popup-toggle');

// Change this to your desired redirect page
const redirectUrl = "index.html"; // replace with your page

loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form from submitting

    const username = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    // Check credentials
    if (username === "admin" && password === "123") {
        // Show popup
        popupToggle.checked = true;

        // Optionally reset form
        loginForm.reset();

        // Auto-close popup and redirect after 3 seconds
        setTimeout(() => {
            popupToggle.checked = false;  // hide popup
            window.location.href = redirectUrl; // redirect to dashboard
        }, 5000);
    } else {
        alert("❌ Incorrect username or password!");
    }
});