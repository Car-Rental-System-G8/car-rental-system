//  ================= Render Cars===========================
export function renderCars(carsData) {
    const carsContainer = document.getElementById("carsContainer");
    if (!carsContainer) return;
    carsContainer.innerHTML = "";
    let output = "";
    carsData.forEach((car) => {
      output += `
         <div class="col-lg-3 col-md-4 py-md-3 p-lg-4 mb-4 text-center">
            <div class="carCard animateCard position-relative z-2 p-3 "  data-id="${car.id}" >
                  <div class="fav fav${car.id}" data-id="${car.id}" >
                      <i class="fas fa-heart"></i>
                  </div>
                  <img  src="${car.images[0]}" class="w-100 animateCard"  alt="Car 1" style="margin-left: 20%; " >
          
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
              ${car.availability === false ? ` <button class=" notAvilable"><a href="#" class=" fw-bold " > Not Avilable </a> </button>` : `<button class="rentCar " data-id="${car.id}"><a href="#" class=" fw-bold"> Rent Now </a></button>`}
              
            </div>
        </div>
      `;
    });
    carsContainer.innerHTML = output;
    const cards = document.querySelectorAll(".animateCard");
    cards.forEach(card => observer.observe(card));
    
    // Initialize events for the cards
    attachEventListeners(carsData);

    // Check if there are any favourites in sessionStorage and add the class to the favourite icon
    checkFavourite()
}

//  ================= Add Event Listeners to Favourites, Rent Button and Card =========================
  function attachEventListeners(carsData) {

    // Favourites Button
    document.querySelectorAll('.fav').forEach(fav => {
      fav.addEventListener('click', function(event) {
        event.stopPropagation();
        const id = this.dataset.id;
        addToFavourites(fav, carsData, id);
      });
    });
  
    // Car Card Click Event
    document.querySelectorAll('.carCard').forEach(card => {
      card.addEventListener('click', function() {
        const id = this.dataset.id;
        window.location.href=`car-details.html?id=${id}`
      });
    });

    // Rent Now Button
    document.querySelectorAll('.rentCar').forEach(rentBtn => {
        rentBtn.addEventListener('click', function() {
          event.stopPropagation();
          const id = this.dataset.id;
          AddToCart(id)
        });
      });
  }


//  ================== Add to Cart Function =========================
function AddToCart(id) {
  sessionStorage.setItem("cart", JSON.stringify(id));
  window.location.href=`checkout.html?id=${id}`
}

function checkFavourite() {
  if(sessionStorage.getItem("favourites")) {
    const favourites = JSON.parse(sessionStorage.getItem("favourites"));
    console.log('favourites:', favourites);
    favourites.forEach(car => {
        const favIcon = document.querySelectorAll(`.fav${car.id}`);
        if (favIcon) {
          favIcon.forEach(fav => {
            fav.classList.add('text-danger');
          })
        }
    });
}
}


//  ================== Add to Favourites Function =========================



function addToFavourites(ele, carsData,  id) {
  
  // Check if the car is already in favourites if not initaite favourites array
  let favourites =  JSON.parse(sessionStorage.getItem("favourites")) || []; 
  // check if the car is already in favourites
  const existingCar = favourites.find(car => car.id === id);
  if (existingCar) {
    // If click and car is already in favourites, remove it
    favourites = favourites.filter(car => car.id !== id);
    sessionStorage.setItem("favourites", JSON.stringify(favourites));
    $(ele).removeClass('text-danger');
    return;
  }
  
  // If the car is not in favourites, add it
  const AddedCar = carsData.find(car => car.id === id);
  favourites.push(AddedCar);
  sessionStorage.setItem("favourites", JSON.stringify(favourites));
  
    // Add the class to the favourite icon
    $(ele).addClass('text-danger');
    $(ele).addClass('heartbeat');
    setTimeout(() => {
        $(ele).removeClass('heartbeat');
    }, 300);
}



//  Card Animation on Scroll just add "animateCard" class

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animateshow");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });




// ================== Render Cars Function =========================

// check if date picked is valid 
let isValid = false;

export function renderCar(carDetails, carsData, bookings) {
  const carContainer = document.getElementById("car-Data");
  if (!carContainer) return;

  // slider images 
  let images = ""
  carDetails.images.forEach(image => {
    images += `<div class="swiper-slide"><img src="${image}" class="img-fluid rounded" /></div>`
   });

  carContainer.innerHTML = `
    <div id="carWrapper" class="container pt-5 mt-3">

    <div class="header box-styles px-5 py-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div class="title">
        <h6 class="text-uppercase text-secondary mb-1 fw-semibold">${carDetails.model}</h6>
        <h3 class="fs-2 fw-bold text-dark">${carDetails.brand}</h3>
        <p class="text-secondary mb-0 fs-6">G3 (${carDetails.year})</p>
      </div>

      <div class="data fs-6 text-muted">
        <div class="row text-center text-md-end">
          <div class="col-md-4 mb-2 text-center">
            <h6 class=" fw-bold mb-1">Year</h6>
            <p class="text-muted mb-0">${carDetails.year}</p>
          </div>
          <div class="col-md-4 mb-2 text-center">
            <h6 class=" fw-bold mb-1">Type</h6>
            <p class="text-muted mb-0">${carDetails.type}</p>
          </div>
          <div class="col-md-4 mb-2 text-center">
            <h6 class=" fw-bold mb-1">Brand</h6>
            <p class="text-muted mb-0">${carDetails.brand}</p>
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
          <div class="fav fav${carDetails.id}" data-id="${carDetails.id}">
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
                <button style="transform: unset;" class="px-5 w-100 rentCar ${!carDetails.availability ? 'notAvilable' : ""}">${carDetails.availability ? 'Book Now' : 'Unavailable'}</button>
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
            <li class="d-flex justify-content-between py-2 px-3 bg-light"><span class="fw-semibold">Brand</span><span>${carDetails.brand}</span></li>
            <li class="d-flex justify-content-between py-2 px-3"><span class="fw-semibold">Model</span><span>${carDetails.model}</span></li>
            <li class="d-flex justify-content-between py-2 px-3 bg-light"><span class="fw-semibold">Year</span><span>${carDetails.year}</span></li>
            <li class="d-flex justify-content-between py-2 px-3"><span class="fw-semibold">Gearbox</span><span>${carDetails.gearbox}</span></li>
            <li class="d-flex justify-content-between py-2 px-3 bg-light"><span class="fw-semibold">Type</span><span>${carDetails.type}</span></li>
            <li class="d-flex justify-content-between py-2 px-3"><span class="fw-semibold">Fuel Type</span><span>${carDetails.fuelType}</span></li>
            <li class="d-flex justify-content-between py-2 px-3 bg-light"><span class="fw-semibold">Color</span><span>${carDetails.color}</span></li>
            <li class="d-flex justify-content-between py-2 px-3"><span class="fw-semibold">Seats</span><span>${carDetails.seats}</span></li>
            <li class="d-flex justify-content-between py-2 px-3 bg-light"><span class="fw-semibold">Price/Day</span><span>$${carDetails.pricePerDay}</span></li>
            <li class="d-flex justify-content-between py-2 px-3"><span class="fw-semibold">Rating</span><span>⭐ ${carDetails.rating}</span></li>
            <li class="d-flex justify-content-between py-2 px-3 bg-light">
              <span class="fw-semibold">Availability</span>
              <span style="font-size: 14px;" class="p-1 px-2 ${carDetails.availability ? 'bg-success' : 'bg-danger '} text-white">
                ${carDetails.availability ? 'Available' : 'Unavailable'}
              </span>
            </li>
            <li class="text-muted py-2 px-3"><span>${carDetails.description}</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  `

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



// ======== date picker 
const pickupInput = document.getElementById("pickupDate");
const returnInput = document.getElementById("returnDate");
const errWraper = document.getElementById("ErrWraper");
const bookBtn = document.querySelector('.rentCar');

[pickupInput, returnInput].forEach(input => {
  input.addEventListener("change", () => {
    const pickupDate = pickupInput.value;
    const returnDate = returnInput.value;
    

    if (pickupDate && returnDate) {

      const start = new Date(pickupDate);
      const end = new Date(returnDate);

      if (end < start) {
          errWraper.classList.remove("invisible")
          errWraper.innerHTML = "Return date cannot be earlier than pickup date  "
          pickupInput.value = ""
          returnInput.value = ""
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      if (start < today || end < today) {
        errWraper.classList.remove("invisible");
        errWraper.innerHTML = "Dates must start from today or later ";
        pickupInput.value = "";
        returnInput.value = "";
        return;
      }

      checkBookingConflict(carDetails, pickupDate, returnDate, bookings, errWraper, bookBtn); 
      }
    });
  });




  // =========== check if car in favourtes  ===========
  checkFavourite()

  // add To Favourites init
  const fav = document.querySelector(`.fav${carDetails.id}`);
  fav.addEventListener('click', function(event) {
    addToFavourites(fav, carsData, carDetails.id);
  });

  addEventToCartBtn(carDetails, bookBtn)

}


function addEventToCartBtn(carDetails, bookBtn ) {
  if(carDetails.availability) {
    if(!isValid) {
      bookBtn.innerHTML = " Choose Date "
    } else {
      bookBtn.innerHTML = "Book Now"
      bookBtn.addEventListener('click', function() {
        AddToCart(carDetails.id)
      });
    }
  }
}




function checkBookingConflict(carDetails, userPickup, userReturn, bookings, errWraper, bookBtn) {
  const userStart = new Date(userPickup);
  const userEnd = new Date(userReturn);
  const carId = carDetails.id
  const conflicts = bookings.filter(booking => {
    return (
      booking.carId === carId &&
      booking.status !== "cancelled" &&
      (
        (new Date(booking.pickupDate) <= userEnd && new Date(booking.returnDate) >= userStart)
      )
    );
  });

  if (conflicts.length > 0) {
      errWraper.classList.remove("invisible")
      errWraper.innerHTML = "There is a booking conflict with the following dates  "
    conflicts.forEach(conflict => {
      console.log(`من ${conflict.pickupDate} إلى ${conflict.returnDate}`);
    });
  } else {
      errWraper.classList.add("invisible")
      isValid = true;
      addEventToCartBtn(carDetails, bookBtn)
  }
}