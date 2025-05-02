import { loadListingPage } from './listingPage.js';
import { loadDetailsPage } from './detailsPage.js';
import { initCars } from './getCarsData.js';
import { renderCars } from "./renderCarCards.js";
import { loadTrendingSection } from './trending-section.js';





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
// $(".nav-link").click(function (e) {
//   e.preventDefault();
//   $(".nav-link").removeClass("active");
//   $(this).addClass("active");
// });


//   ================ Car Listing Page   ===========================
// ================= Filter Cars : name - type - price range - avilabilty =========================

const applyFiltersButton = document.querySelector(".filters button");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const searchInput = document.querySelector('.filters .searchBox');
const carTypeSelect = document.getElementById("carType");

async function applyFilters() {

const cars = await initCars();
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
  loadTrendingSection();   
if (window.location.href.includes('car-listing.html')) {
  loadListingPage();
} else if (window.location.href.includes('car-details.html')) {
  loadDetailsPage();
  } 
})


