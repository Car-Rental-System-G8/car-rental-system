document.addEventListener("DOMContentLoaded", () => {
    fetch("Layout/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar").innerHTML = data;

            const isLoggedIn = localStorage.getItem('currentUser');
            const profileDropdown = document.querySelector('.profile-dropdown');

            if (profileDropdown) {
                if (isLoggedIn) {
                    function logoutUser() {
                        localStorage.removeItem('currentUser');
                        window.location.href = '../login-page.html';
                    }

                    const logoutBtn = document.getElementById('logoutBtn');
                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', logoutUser);
                    } else {
                        console.error('Element with ID "logoutBtn" not found');
                    }
                } else {
                    profileDropdown.innerHTML = `
                      <a href="../login-page.html" class="login-link">
                          <i title="LogIn" class="fas fa-sign-in-alt"></i>
                      </a>
                  `;
                }
            } else {
                console.error('Profile dropdown not found');
            }
            // calling favourite counter
            updateFavouriteCount()
        })
        .catch(error => console.error("Error loading navbar:", error));
});

// Updating the counter in the navbar
function updateFavouriteCount() {
    const favourites = JSON.parse(sessionStorage.getItem('favourites')) || []; //works
    console.log(favourites);
    console.log(document.getElementById('favourite-count'));
    document.getElementById('favourite-count').textContent = favourites.length;
}