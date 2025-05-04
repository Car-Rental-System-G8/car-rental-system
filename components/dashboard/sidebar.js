const sidebarContainer = document.getElementById("sidebar");

(async function () {
  fetch("/components/dashboard/sidebar.html")
  .then(response => response.text())
  .then(html => {
    sidebarContainer.innerHTML = html;

    const activeSelector = sidebarContainer.getAttribute("data-active");
    if (activeSelector) {
      const activeLink = document.querySelector(activeSelector);
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }

    const dashboardContainer = document.querySelector(".dashboard-container");
    const dashboardSidebarOvlary = document.querySelector(".dashboard-sidebar-overlay");
    dashboardSidebarOvlary.addEventListener("click", () => dashboardContainer.classList.remove("toggle"));
  })
  .catch(err => {
    console.error("Error loading sidebar:", err);
  });
})();