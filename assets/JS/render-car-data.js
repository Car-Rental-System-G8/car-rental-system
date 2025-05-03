import { addToFavourites, checkFavourite } from './favourites.js';


// ================== Render Cars Function =========================

// check if date picked is valid 
let isValid = false;

export function renderCar(carDetails, carsData, bookings) {
  // Get Car Dat and put it in car container 
  const carsContainer = document.getElementById("car-Data");
  
  if (!carsContainer) return;
  carsContainer.innerHTML =  getCarHTML(carDetails);
  
  const bookBtn = document.getElementById('rent-Car');

  // initiate Swiper slider
  initiateSlider()
  // =========== check if car in favourtes  ===========
  checkFavourite()
  // update book button status 
  updateBookBtn(bookBtn, carDetails)
  // ======== Booking Checker 
  bookingsHandler(carDetails, bookings, bookBtn,)

  // add To Favourites initiation
  const fav = document.querySelector(`.fav${carDetails.id}`);
  if (fav) {
      fav.addEventListener('click', () => {
        addToFavourites(fav, carsData, carDetails.id);
      });
  }
}



//  ================== Add to Cart Function =========================
function AddToCart(id) {
  const pickupInput = document.getElementById("pickupDate");
  const returnInput = document.getElementById("returnDate");
  const pickupDate = pickupInput.value;
  const returnDate = returnInput.value;
  let cart = {
    carId: id,
    pickupDate: pickupDate,
    returnDate : returnDate
  }
  sessionStorage.setItem("cart", JSON.stringify(cart));
  setTimeout(() => {
    window.location.href=`checkout.html`
  }, 100);
}



// handle bookings with pick up and ruturn  date
function bookingsHandler(carDetails, bookings, bookBtn) {

  const pickupInput = document.getElementById("pickupDate");
  const returnInput = document.getElementById("returnDate");

  [pickupInput, returnInput].forEach(input => {
    input.addEventListener("change", () => {
    const errWraper = document.getElementById("ErrWraper");
  

    if (pickupDate.value && returnDate.value) {

      const pickupDate = pickupInput.value;
      const returnDate = returnInput.value;
  
        const start = new Date(pickupDate);
        const end = new Date(returnDate);
  
        if (end < start) {
          showError("Return date cannot be earlier than pickup date ", errWraper, bookBtn)
            pickupInput.value = ""
            returnInput.value = ""
          return;
        }
  
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        if (start < today || end < today) {
          showError("Dates must start from today or later ", errWraper, bookBtn)
          pickupInput.value = "";
          returnInput.value = "";
          return;
        }
        
        // Cheeck booking conflicts with dates booked 
        checkBookingConflict(carDetails, pickupDate, returnDate, bookings, errWraper, bookBtn); 
    }
  })})
}


// update booking button status if there is no conflicts 
function updateBookBtn(btn, car) {
  btn.innerHTML = !car.availability ? "Not Available": isValid ? "Book Now" : "Choose Date";
  btn.onclick = null;
  if (car.availability && isValid) {
    btn.onclick = () => AddToCart(car.id);
  }
}


//  show and hide errors if there is date issues 
function showError(msg, box, btn) {
  box.classList.remove("invisible");
  box.innerHTML = msg;
  updateBookBtn(btn, { availability: true });
}

function hideError(box) {
  box.classList.add("invisible");
  box.innerHTML = "";
}


// Cheeck booking conflicts with dates booked for this car 
function checkBookingConflict(carDetails, userPickup, userReturn, bookings, errWraper, bookBtn) {
  const conflicts = bookings.filter(booking => {
    return (
      parseInt(booking.carId) === parseInt(carDetails.id) &&
      booking.status !== "cancelled" &&
      (new Date(booking.pickupDate) <= new Date(userReturn) && new Date(booking.returnDate) >= new Date(userPickup))
    );
  });

  
  if (conflicts.length > 0) {
    showError(`This car is booked from ${conflicts[0].pickupDate} to ${conflicts[0].returnDate}  `, errWraper, bookBtn)
  } else {
      isValid = true;
      hideError(errWraper)
      updateBookBtn(bookBtn, carDetails)
  }
}




//  slider initiation with swiper 
function  initiateSlider() {
    // =========== slider initiate ===========
    const thumbSwiper = new Swiper(".thumbSwiper", {
      direction: 'vertical',
      slidesPerView: 3,
      spaceBetween: 10,
      watchSlidesProgress: true,
    });
    
    const mainSwiper = new Swiper(".mainSwiper", {
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: thumbSwiper,
      },
    });
}





//  car details HTML 

function getCarHTML(car) {
  
  // slider images 
  let images = ""
  car.images.forEach(image => {
    images += `<div class="swiper-slide"><img src="${image}" class="img-fluid rounded" /></div>`
   });

  return `
    <div id="carWrapper" class="container pt-5 mt-3">

    <div class="header box-styles px-5 py-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div class="title">
        <h6 class="text-uppercase text-secondary mb-1 fw-semibold">${car.model}</h6>
        <h3 class="fs-2 fw-bold ">${car.brand}</h3>
        <p class="text-secondary mb-0 fs-6">G3 (${car.year})</p>
      </div>

      <div class="data fs-6 text-muted">
        <div class="row text-center text-md-end">
          <div class="col-md-4 mb-2 text-center">
            <h6 class=" fw-bold mb-1">Year</h6>
            <p class=" mb-0">${car.year}</p>
          </div>
          <div class="col-md-4 mb-2 text-center">
            <h6 class=" fw-bold mb-1">Type</h6>
            <p class=" mb-0">${car.type}</p>
          </div>
          <div class="col-md-4 mb-2 text-center">
            <h6 class=" fw-bold mb-1">Brand</h6>
            <p class=" mb-0">${car.brand}</p>
          </div>
        </div>
      </div>

      <div class="button carCard">
        <a href="car-listing.html"><button style="transform: unset;" class="px-5">All Cars</button></a>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-md-7 d-flex flex-column justify-content-between gap-3">
        <div class="car-slider-container box-styles d-lg-flex align-items-start gap-3">
          <div class="fav fav${car.id}" data-id="${car.id}">
            <i class="fas fa-heart"></i>
          </div>

          <div class="swiper mainSwiper flex-fill col-lg-9">
            <div class="swiper-wrapper">
              ${images}
            </div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </div>

          <div class="swiper thumbSwiper me-3 col-lg-3">
            <div class="swiper-wrapper flex-lg-column">
              ${images}
            </div>
          </div>
        </div>

        <div class="box-styles d-flex align-items-centers justify-content-center">
          <div class="row py-2">
            <div class="col-6 mb-3 mb-md-0">
              <h5>Pick-Up Date</h5>
              <div class="input-group">
                <span class="input-group-text border-end-0 bg-transparent">
                  <i class="far fa-calendar-alt text-muted"></i>
                </span>
                <input type="date" id="pickupDate" class="form-control border-start-0" placeholder="Add Date">
              </div>
            </div>
            <div class="col-6 mb-3 mb-md-0">
              <h5>Return Date</h5>
              <div class="input-group">
                <span class="input-group-text border-end-0 bg-transparent">
                  <i class="far fa-calendar-alt text-muted"></i>
                </span>
                <input type="date" id="returnDate" class="form-control border-start-0" placeholder="Add Date">
              </div>
            </div>
            <div class="col-12 pt-1 ">
              <span id="ErrWraper" class="text-danger fw-bold invisible">
                  .....
              </span>
            </div>
            <div class="col-md-12 mt-3 ">
              <div class="button carCard">
                <button id="rent-Car" style="transform: unset;" class="px-5 w-100 rent-Car ${!car.availability ? 'notAvilable' : ""}">${car.availability ? 'Book Now' : 'Unavailable'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-5">
        <div class="box-styles h-100  ">
          <div class="p-3 border-bottom">
            <h5 class="mb-0 fw-bold">Car Specifications</h5>
            <p class="text-secondary mb-0">Full details about this vehicle</p>
          </div>
          <ul class="list-unstyled mb-0">
            <li class="d-flex justify-content-between py-2 px-3 "><span class="fw-semibold">Brand</span><span>${car.brand}</span></li>
            <li class="d-flex justify-content-between py-2 px-3"><span class="fw-semibold">Model</span><span>${car.model}</span></li>
            <li class="d-flex justify-content-between py-2 px-3 "><span class="fw-semibold">Year</span><span>${car.year}</span></li>
            <li class="d-flex justify-content-between py-2 px-3"><span class="fw-semibold">Gearbox</span><span>${car.gearbox}</span></li>
            <li class="d-flex justify-content-between py-2 px-3 "><span class="fw-semibold">Type</span><span>${car.type}</span></li>
            <li class="d-flex justify-content-between py-2 px-3"><span class="fw-semibold">Fuel Type</span><span>${car.fuelType}</span></li>
            <li class="d-flex justify-content-between py-2 px-3 "><span class="fw-semibold">Color</span><span>${car.color}</span></li>
            <li class="d-flex justify-content-between py-2 px-3"><span class="fw-semibold">Seats</span><span>${car.seats}</span></li>
            <li class="d-flex justify-content-between py-2 px-3 "><span class="fw-semibold">Price/Day</span><span>$${car.pricePerDay}</span></li>
            <li class="d-flex justify-content-between py-2 px-3"><span class="fw-semibold">Rating</span><span>⭐ ${car.rating}</span></li>
            <li class="d-flex justify-content-between py-2 px-3 ">
              <span class="fw-semibold">Availability</span>
              <span style="font-size: 14px;" class="p-1 px-2 ${car.availability ? 'bg-success' : 'bg-danger '} text-white">
                ${car.availability ? 'Available' : 'Unavailable'}
              </span>
            </li>
            <li class=" py-2 px-3"><span>${car.description}</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  
  `;
}