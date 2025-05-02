import { getAvaliableCarsLength, getCarsLength } from "./modules/carManager.js";
import { fetchData } from "./modules/fetchData.js";
import { getCurrentUser } from "./modules/userManager.js";

// Acess to Dashboard & Admin Details
document.addEventListener("DOMContentLoaded", async () => {
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
    // window.location = "/";
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

if (window.toastr) {
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
}

const dashboardContainer = document.querySelector(".dashboard-container");
const dashboardToggleBtn = document.querySelector(".dashboard-toggle-btn");
dashboardToggleBtn.addEventListener("click", () => dashboardContainer.classList.toggle("toggle"));

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


const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return "";
};

const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // تحديد مدة الكوكي
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
};

const theme = document.querySelector(".theme-switcher"),
  themeToggle = document.querySelector(".theme-switcher-toggle"),
  themeButtons = document.querySelectorAll(".theme-switcher-button"),
  themeElement = document.querySelector("[data-bs-theme]");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    theme.classList.toggle("show");
  });
}

const setTheme = (themeName) => {
  themeElement.setAttribute("data-bs-theme", themeName);
  themeButtons.forEach((button) => {
    button.classList.remove("active");
    if (button.hasAttribute(`data-bs-theme-${themeName}`)) {
      button.classList.add("active");
    }
  });
};

const initializeTheme = () => {
  const storedTheme = getCookie("theme");
  if (!storedTheme) {
    // لو الكوكيز فاضي، بنحدد الـ theme حسب تفضيلات النظام
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  } else {
    setTheme(storedTheme);
  }
};

initializeTheme();

themeButtons.forEach((el) => {
  el.addEventListener("click", () => {
    const themeType = el.hasAttribute("data-bs-theme-light") ? "light" : "dark";
    setCookie("theme", themeType, 300); // تخزين القيمة في الكوكيز لمدة 300 يوم
    setTheme(themeType); // تطبيق الـ theme
  });
});
