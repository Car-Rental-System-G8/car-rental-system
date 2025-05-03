import { loadListingPage } from './listing-page.js';
import { loadDetailsPage } from './details-page.js';
import { loadTrendingSection } from './trending-section.js';
import { initCars } from './get-data.js';
import { renderCars } from "./render-cars-cards.js";

$(document).ready(function () {
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


  // Animate elements on page load
  setTimeout(function () {
    $(".hero-title").css("opacity", "1");
    $(".hero-text").css("opacity", "1");
    $(".btn-explore").css("opacity", "1");
  }, 300);
});



//   ================ Car Listing Page   ===========================

let cars = [];
async function getCars() {
  const data = await initCars();
  cars = data;
  return cars;
}
getCars()
// ================= Filter Cars : name - type - price range - avilabilty =========================

const applyFiltersButton = document.querySelector(".filters button");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const searchInput = document.querySelector('.filters .searchBox');
const carTypeSelect = document.getElementById("carType");

async function applyFilters() {

let filtered = [...cars];

const availableCheckbox = document.querySelector('input[name="Availability"]:checked');


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
  if (availableCheckbox.value === "available") {
    filtered = filtered.filter(car => car.availability === true);
  } else if (availableCheckbox.value === "notAvailable") {
    // If the checkbox is checked, filter for not available cars
    filtered = filtered.filter(car => car.availability === false);
  }else if (availableCheckbox.value === "all") {
    // If the checkbox is checked, filter for all cars
    filtered = filtered.filter(car => car.availability === true || car.availability === false);
  }

  
  // Render the filtered cars
  renderCars(filtered);
}


// Update the price range value on change
function updatePriceValue(value) {
  priceValue.innerText = `$${value}`;
}


if(priceRange) {
  priceRange.addEventListener("input", (e) => updatePriceValue(e.target.value));
}

if(applyFiltersButton) {
// put filter function to work
applyFiltersButton.addEventListener("click", applyFilters);
}


document.addEventListener("DOMContentLoaded", () => {
  if (window.location.href.includes('Index.html') || window.location.href.includes('index.html')) {
    loadTrendingSection();
  }
  if (window.location.href.includes('car-listing.html')) {
    loadListingPage();
  } else if (window.location.href.includes('car-details.html')) {
    loadDetailsPage();
  } 
});