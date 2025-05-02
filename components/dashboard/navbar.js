
const navbarContainer = document.getElementById("navbar");

fetch("/components/dashboard/navbar.html")
  .then(response => response.text())
  .then(html => {
    navbarContainer.innerHTML = html;
  })
  .catch(err => {
    console.error("Error loading navbar:", err);
  });
