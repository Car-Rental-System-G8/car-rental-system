async function getUserIdByEmail(email) {
    try {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status}`);
        }
        const users = await response.json();
        const user = users.find(u => u.email === email);
        return user ? user.id : null;
    } catch (error) {
        console.error('Error fetching user ID:', error);
        return null;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    console.log('load-navbar.js loaded');
    fetch("../components/user/user-nav.html")
        .then(response => response.text())
        .then(async data => {
            const navbar = document.getElementById("navbar");
            navbar.innerHTML = data;

            const isLoggedIn = localStorage.getItem('currentUser');
            const profileDropdown = document.querySelector('.profile-dropdown');

            if (profileDropdown) {
                if (isLoggedIn) {
                    function logoutUser() {
                        localStorage.removeItem('currentUser');
                        window.location.href = '../login.html';
                    }

                    const logoutBtn = document.getElementById('logoutBtn');
                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', logoutUser);
                    } else {
                        console.error('Element with ID "logoutBtn" not found');
                    }
                } else {
                    profileDropdown.innerHTML = `
                        <a href="../login.html" class="login-link">
                            <i title="LogIn" class="fas fa-sign-in-alt"></i>
                        </a>
                    `;
                }
            } else {
                console.error('Profile dropdown not found');
            }

            // Highlight active link
            const sidebarContainer = navbar; // Assuming data-active is on the navbar element
            const activeSelector = sidebarContainer.getAttribute("data-active");
            if (activeSelector) {
                const activeLink = document.querySelector(activeSelector);
                if (activeLink) {
                    activeLink.classList.add("active");
                } else {
                    console.warn(`Active link not found for selector: ${activeSelector}`);
                }
            } else {
                console.warn('data-active attribute not found on navbar');
            }

            updateFavouriteCount();
        })
        .catch(error => console.error("Error loading navbar:", error));
});
// Updating the counter in the navbar
function updateFavouriteCount() {
    const favourites = JSON.parse(sessionStorage.getItem('favourites')) || [];
    console.log('Favourites:', favourites);
    const favouriteCount = document.getElementById('favourite-count');
    if (favouriteCount) {
        favouriteCount.textContent = favourites.length;
    } else {
        console.warn('Element with ID "favourite-count" not found');
    }
}