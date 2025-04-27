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

//  Get Cars 
/* 
end Points
http://localhost:3000/users
http://localhost:3000/cars
*/

const carsContainer = document.getElementById("carsContainer");
const carsUrl = "http://localhost:3000/cars";
const cars = [];
let filteredCars = [];

const getCars = async () => {
  try {
    const response = await fetch(carsUrl);
    const data = await response.json();
    console.log('data:', data);
    cars.push(...data);
    filteredCars = [...cars];
    renderCars(filteredCars);
  } catch (error) {
    console.error("Error fetching cars:", error);
  }
};



//  Card Animation on Scroll just add "animateCard" class
const cards = document.querySelectorAll(".animateCard");
      
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animateshow");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });


function renderCars(carsData) {
  carsContainer.innerHTML = "";
  let output = "";
  carsData.forEach((car) => {
    output += `
       <div class="col-lg-3 col-md-4 py-md-3 p-lg-4 mb-4 text-center">
          <div class="carCard animateCard position-relative z-2 p-3 ">
                <div class="fav">
                    <i class="fas fa-heart"></i>
                </div>
                <img  src="assets/${car.image}" class="w-100 animateCard"  alt="Car 1" style="margin-left: 20%; " >
        
            <div class="carHeader text-start d-flex justify-content-between align-items-center mb-3 px-2">
                <div class="carTitle">
                  <h5 class="carName   fw-bold ">${car.brand}</h5>
                  <span class="">${car.model}</span>
                </div>
                <div class="price">
                  <h5 class="card-price   fw-bold ">${car.pricePerDay}</h5>
                  <span class="">per day</span>
                </div>
            </div>
        
            <div class="row gap-3 justify-content-center align-items-center flex-md-nowrap gap-3">
                <div class="feature col-3 text-center">
                  <i class="fas fa-star"></i>
                  <p class="small mb-0 ">${car.rating}</p>
                </div>
                <div class="feature col-3 text-center">
                  <i class="fas fa-car"></i>
                  <p class="small mb-0">${car.type}</p>
                </div>
                <div class="feature col-3 text-center">
                  <i class="fas fa-calendar-alt"></i>
                  <p class="small mb-0">${car.year}</p>
                </div>
            </div>
            ${car.availability === false ? ` <button class=" notAvilable"><a href="#" class=" fw-bold "> Not Avilable </a> </button>` : `<button class=" " onclick=goCarDetails(${car.id})><a href="#" class=" fw-bold"> Rent Now </a></button>`}
            
          </div>
      </div>
    `;
  });
  carsContainer.innerHTML = output;
  const cards = document.querySelectorAll(".animateCard");
  cards.forEach(card => observer.observe(card));

  addToFavourites()

}

getCars();

//  ================= Add to Favourites ===========================
function addToFavourites() {
  $(document).ready(function() {
    $('.fav').on('click', function() {
      $(this).toggleClass('text-danger');
      $(this).addClass('heartbeat');
      setTimeout(() => {
        $(this).removeClass('heartbeat');
      }, 300);
    });
  });
}


//  ================== Car Details Page =========================
function goCarDetails(id) {
  window.location.href = `car-details.html?id=${id}`;
}



// ================== Car Filter =========================
const searchInput = document.querySelector('.filters .searchBox');
const carTypeSelect = document.getElementById("carType");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const availableCheckbox = document.getElementById("available");
const applyFiltersButton = document.querySelector(".filters button");




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

// Add Click event listeners for Button
applyFiltersButton.addEventListener("click", applyFilters);
