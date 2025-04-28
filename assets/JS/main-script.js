import { getCars } from "./getCarsData.js";
import { renderCars } from "./handleCarsData.js";

$(document).ready(function () {
  // Auto-cycle the carousel
  $(".carousel").carousel({
    interval: 3000,
  });

  // Add animations when carousel slides
  $("#carCarousel").on("slide.bs.carousel", function () {
    $(".car-info-badge").css("opacity", "0");
    setTimeout(function () {
      $(".car-info-badge").css("opacity", "1");
    }, 600);
  });

  // Smooth navbar background change on scroll
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $(".navbar").css("background-color", "rgba(255, 255, 255, 0.98)");
      $(".navbar").css("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.1)");
    } else {
      $(".navbar").css("background-color", "rgba(255, 255, 255, 0.95)");
      $(".navbar").css("box-shadow", "0 2px 8px rgba(0, 0, 0, 0.05)");
    }
  });

  // Animate elements on page load
  setTimeout(function () {
    $(".hero-title").css("opacity", "1");
    $(".hero-text").css("opacity", "1");
    $(".btn-explore").css("opacity", "1");
  }, 300);
});

// Handle nav link clicks to update active state
$(".nav-link").click(function (e) {
  e.preventDefault();
  $(".nav-link").removeClass("active");
  $(this).addClass("active");
});


//   ================ Car Listing Page   ===========================


let cars = [];
let filteredCars = [];


// initiate Cars Function to get data from the API and render it
async function initCars() {
  const data = await getCars();
  cars.push(...data);
  filteredCars = [...cars];
  renderCars(filteredCars);
}

initCars();


// ================== Car Filter =========================
const searchInput = document.querySelector('.filters .searchBox');
const carTypeSelect = document.getElementById("carType");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const availableCheckbox = document.getElementById("available");
const applyFiltersButton = document.querySelector(".filters button");



// ================= Filter Cars : name - type - price range - avilabilty =========================
function applyFilters() {
  let filtered = [...cars];

  // Search with Name 
  const searchText = searchInput.value.trim().toLowerCase();
  if (searchText !== "") {
    filtered = filtered.filter(car =>
      car.brand.toLowerCase().includes(searchText) ||
      car.model.toLowerCase().includes(searchText)
    );
  }

  // Type Filter
  const selectedType = carTypeSelect.value;
  if (selectedType !== "") {
    filtered = filtered.filter(car => car.type.toLowerCase() === selectedType.toLowerCase());
  }

  // Price Range Filter
  const selectedPrice = parseFloat(priceRange.value);
  filtered = filtered.filter(car => parseFloat(car.pricePerDay) <= selectedPrice);

  
  // Availability Filter
  if (availableCheckbox.checked) {
    filtered = filtered.filter(car => car.availability === true);
  } else {
    filtered = filtered.filter(car => car.availability === false);
  }

  // Render the filtered cars
  renderCars(filtered);
}


// Update the price range value on change
function updatePriceValue(value) {
  priceValue.innerText = `$${value}`;
}
priceRange.addEventListener("input", (e) => updatePriceValue(e.target.value));

// put filter function to work
applyFiltersButton.addEventListener("click", applyFilters);


