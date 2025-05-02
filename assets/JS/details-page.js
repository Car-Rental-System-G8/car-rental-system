import { initCars, initBookings, initUsers } from './get-data.js';
import { renderCar, renderCars } from './render-car-data.js';

async function loadDetailsPage() {
  const cars = await initCars();
  const bookings = await initBookings();
  const users = await initUsers();
  const urlParams = new URLSearchParams(window.location.search);
  const carId = parseInt(urlParams.get("id"));
  if (carId) {
    const car = cars.find(car => parseInt(car.id) === carId);
    if (car) {
      renderCar(car, cars, bookings)
      renderReviews(car.reviews, users)
      const topRatedCars = getTopRatedCars(cars);
      renderCars(topRatedCars);
    } else {
      console.error('Car not found');
    }
  } else {
    console.error('No car ID provided in the URL');
  }
}

export { loadDetailsPage };



function renderReviews(reviews, users) {
  const reviewsContainer = document.getElementById("reviews");

  if (!reviews.length) {
    reviewsContainer.innerHTML = `
      <div class="p-4 bg-light text-center text-muted rounded">
        No reviews yet.
      </div>
    `;
    return;
  }

  const reviewHTML = reviews.map((review) => {
    const user = users.find((u) => parseInt(u.id) === parseInt(review.userId)) ;
    const userName = user?.name || "Unknown User";
    const userImg = user?.images || "/assets/images/others/profile.png";
    let stars = ""
    for(let i=0 ; i<review.rating; i++) {
       stars += "⭐";
    }

    return `
      <div class="box-styles p-3 mb-3 shadow-sm bg-light rounded">
        <div class="d-flex align-items-center mb-2">
          <img src="${userImg}" alt="${userName}" class=" rounded me-3" style="width: 70px; height: 70px; object-fit: cover;">
          <div>
            <h6 class="mb-0 fw-bold">${userName}</h6>
            <div class="text-warning fs-5">${stars}</div>
            <p class="mb-0 text-secondary">${review.comment}</p>
          </div>
        </div>
      </div>
    `;
  }).join(" ");

  reviewsContainer.innerHTML = reviewHTML
}



function getTopRatedCars(cars, ) {
  let avilable = cars.filter(car => car.availability === true) || [];
  return avilable
    .sort((a, b) => b.rating - a.rating) 
    .slice(0, 8); 
}





