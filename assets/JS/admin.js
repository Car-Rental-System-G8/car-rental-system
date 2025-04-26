const dashboardToggleBtn = document.querySelector(".dashboard-toggle-btn");
const dashboardContainer = document.querySelector(".dashboard-container");
const dashboardSidebarOvlary = document.querySelector(".dashboard-sidebar-overlay");

dashboardToggleBtn.addEventListener("click", () => dashboardContainer.classList.toggle("toggle"));
dashboardSidebarOvlary.addEventListener("click", () => dashboardContainer.classList.remove("toggle"));


const dropdowns = document.querySelectorAll('[data-dropdown]');

if (dropdowns.length) {
  window.addEventListener('click', (e) => {
    dropdowns.forEach((dropdown) => {
      const dropdownMenu = dropdown.querySelector('.drop-down-menu');

      if (!dropdownMenu) return;

      if (dropdown.contains(e.target)) {
        dropdown.classList.toggle('active');
        setTimeout(() => {
          dropdown.classList.toggle('animated');
        }, 0);

        dropdownMenu.style.top = "45px";
      } else {
        dropdown.classList.remove('active');
        dropdown.classList.remove('animated');
      }
    });
  });
}