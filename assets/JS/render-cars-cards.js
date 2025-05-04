import { addToFavourites, checkFavourite } from './favourites.js';


export function renderCars(carsData) {
    const carsContainer = document.getElementById("carsContainer");
    if (!carsContainer) return;
  
    carsContainer.innerHTML = carsData.map(car => getCarHTML(car)).join('');
  
    initCardAnimations();
    initCardEvents(carsData);
    checkFavourite();

  }

  
  function initCardEvents(carsData) {

    // Favourites
    document.querySelectorAll('.fav').forEach(fav => {
      fav.addEventListener('click', function (event) {
        event.stopPropagation();
        const id = this.dataset.id;
        addToFavourites(this, carsData, id);
      });
    });
  
    // Card Click
    document.querySelectorAll('.car-cards').forEach(card => {
      card.addEventListener('click', function () {
        const id = this.dataset.id;
        window.location.href = `car-details.html?id=${id}`;
      });
    });
  }

  function initCardAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animateshow");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
    const cards = document.querySelectorAll(".animateCard");
    cards.forEach(card => observer.observe(card));
  }
  

  
  function getCarHTML(car) {
    let averageRating = (car.reviews.reduce((sum, review) => sum + parseInt(review.rating), 0) / car.reviews.length).toFixed(1);
    return `
      <div class="col-lg-3 col-md-4 py-md-3 p-lg-4 mb-4 text-center">
        <div class="carCard car-cards animateCard position-relative z-2 p-3" data-id="${car.id}">
          <div class="fav fav${car.id}" data-id="${car.id}">
            <i class="fas fa-heart"></i>
          </div>
          <img src="${car.images[0]}" class="w-100 animateCard" alt="Car Image" style="margin-left: 20%;">
          <div class="carHeader text-start d-flex justify-content-between align-items-center mb-3 px-2">
            <div class="carTitle">
              <h5 class="carName fw-bold">${car.brand}</h5>
              <span>${car.model}</span>
            </div>
            <div class="price">
              <h5 class="card-price fw-bold">${car.pricePerDay}</h5>
              <span>per day</span>
            </div>
          </div>
          <div class="row gap-3 justify-content-center align-items-center flex-md-nowrap gap-3">
            <div class="feature col-3 text-center">
              <i class="fas fa-star"></i>
              <p class="small mb-0">${averageRating}</p>
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
          ${car.availability 
            ? `<button class="rentCar" data-id="${car.id}"><a href="#" class="fw-bold">Rent Now</a></button>` 
            : `<button class="notAvilable"><a href="#" class="fw-bold">Not Available</a></button>`}
        </div>
      </div>
    `;
  }