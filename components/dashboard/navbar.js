import { theme } from "/assets/JS/modules/theme.js";
import { dropdown } from "/assets/JS/modules/dropdown.js";
import { logout } from "/assets/JS/modules/userManager.js";

(async function () {
  const navbarContainer = document.getElementById("navbar");

  try {
    const response = await fetch("/components/dashboard/navbar.html");
    const html = await response.text();
    navbarContainer.innerHTML = html;

    const dashboardContainer = document.querySelector(".dashboard-container");
    const dashboardToggleBtn = document.querySelector(".dashboard-toggle-btn");

    if (dashboardToggleBtn && dashboardContainer) {
      dashboardToggleBtn.addEventListener("click", () => {
        dashboardContainer.classList.toggle("toggle");
      });
    }

    notifications();
    dropdown();
    logout();
    theme();
  } catch (err) {
    console.error("Error loading navbar:", err);
  }
})();