

//  ================= Render Cars===========================
export function renderCars(carsData) {
    const carsContainer = document.getElementById("carsContainer");
    carsContainer.innerHTML = "";
    let output = "";
    carsData.forEach((car) => {
      output += `
         <div class="col-lg-3 col-md-4 py-md-3 p-lg-4 mb-4 text-center">
            <div class="carCard animateCard position-relative z-2 p-3 "  data-id="${car.id}" >
                  <div class="fav" data-id="${car.id}" >
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
              ${car.availability === false ? ` <button class=" notAvilable"><a href="#" class=" fw-bold " > Not Avilable </a> </button>` : `<button class="rentCar " data-id="${car.id}"><a href="#" class=" fw-bold"> Rent Now </a></button>`}
              
            </div>
        </div>
      `;
    });
    carsContainer.innerHTML = output;
    const cards = document.querySelectorAll(".animateCard");
    cards.forEach(card => observer.observe(card));

    attachEventListeners(carsData);

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
          AddToCart(carsData, id)
        });
      });
  }


//  ================== Add to Cart Function =========================
function AddToCart(carsData, id) {
  const AddedCar = carsData.find(car => car.id === id);
  console.log('Added To Cart:', AddedCar);
}


//  ================== Add to Favourites Function =========================
function addToFavourites(ele, carsData,  id) {
    const AddedCar = carsData.find(car => car.id === id);
    console.log("Adding to favorites:", AddedCar);
    $(ele).toggleClass('text-danger');
    $(ele).addClass('heartbeat');
    setTimeout(() => {
        $(ele).removeClass('heartbeat');
    }, 300);
}



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