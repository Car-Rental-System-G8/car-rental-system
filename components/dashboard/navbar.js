import { theme } from "/assets/JS/modules/theme.js";
import { dropdown } from "/assets/JS/modules/dropdown.js";
import { logout } from "/assets/JS/modules/userManager.js";
import { getCurrentUser } from "/assets/JS/modules/userManager.js";

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

    (async function () {
      document.body.classList.add("overflow-hidden");
      try {
        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "admin") {
          window.location = "/";
          return;
        }
        
        document.querySelectorAll(".current-user-title").forEach(title => title.textContent = currentUser.name);
        document.querySelectorAll(".current-user-email").forEach(email => email.textContent = currentUser.email);
        document.querySelectorAll(".current-user-img").forEach(img => img.src = currentUser.image);

        document.getElementById("loader").style.display = "none";
        document.body.classList.remove("overflow-hidden");
      } catch (err) {
        console.log(err);
      }
    })();

    notifications();
    dropdown();
    logout();
    theme();
  } catch (err) {
    console.error("Error loading navbar:", err);
  }
})();