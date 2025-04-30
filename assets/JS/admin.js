import { getAvaliableCarsLength, getCarsLength } from "./modules/carManager.js";
import { fetchData } from "./modules/fetchData.js";

// Acess to Dashboard & Admin Details
document.addEventListener("DOMContentLoaded", async () => {
  document.body.classList.add("overflow-hidden");
  try {
    const users = await fetchData("http://localhost:3000/users");

    const storedEmail = JSON.parse(localStorage.getItem("currentUser"));
    const currentUser = users.find((user) => {
      return user.email === storedEmail;
    });

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
    window.location = "/";
  }
});

// Logout Functionality
document.querySelectorAll(".logout-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    window.location = "/";
  });
});

toastr.options = {
  "closeButton": true,
  "debug": false,
  "progressBar": true,
  "newestOnTop": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "showDuration": "1000",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

const dashboardToggleBtn = document.querySelector(".dashboard-toggle-btn");
const dashboardContainer = document.querySelector(".dashboard-container");
const dashboardSidebarOvlary = document.querySelector(".dashboard-sidebar-overlay");

dashboardToggleBtn.addEventListener("click", () => dashboardContainer.classList.toggle("toggle"));
dashboardSidebarOvlary.addEventListener("click", () => dashboardContainer.classList.remove("toggle"));


// Dropdown
document.querySelectorAll('[data-dropdown]').forEach((el) => {
  const dropdownClose = el.querySelectorAll('[data-dropdown-close]');

  const closeDropdown = () => {
    el.classList.remove('active', 'animated');
  };

  window.addEventListener('click', (e) => {
    const isInside = el.contains(e.target);
    const isPropagationAllowed = el.hasAttribute('data-dropdown-propagation');
    const clickedMenu = e.target.closest('.drop-down-menu');

    if (isInside) {
      if (!clickedMenu && isPropagationAllowed) {
        el.classList.toggle('active');
        setTimeout(() => el.classList.toggle('animated'), 0);
      } else if (!isPropagationAllowed) {
        el.classList.toggle('active');
        setTimeout(() => el.classList.toggle('animated'), 0);
      }
    } else {
      closeDropdown();
    }
  });

  dropdownClose.forEach((btn) => {
    btn.addEventListener('click', closeDropdown);
  });
});


// Dashboard Stats
window.addEventListener("load", async () => {
  const allCarsStat = document.getElementById("allCars");
  const avaliableCars = document.getElementById("avaliableCars");
  const bookingCars = document.getElementById("bookingCars");
  const totalProfit = document.getElementById("totalProfit");

  if (allCarsStat) {
    const carsLength = await getCarsLength();
    allCarsStat.textContent = carsLength;
  }

  if (avaliableCars) {
    const carsLength = await getAvaliableCarsLength();
    avaliableCars.textContent = carsLength;
  }

  if (totalProfit) {
    const getCarsBookings = await fetchData("http://localhost:3000/bookings");
    const confirmedBookings = getCarsBookings.filter(booking => booking.status === "confirmed");
    const totalConfirmedCost = confirmedBookings.reduce((total, booking) => total + booking.totalCost, 0);
    
    totalProfit.textContent = `${totalConfirmedCost}$`;
    bookingCars.textContent = getCarsBookings.length;
  }

});